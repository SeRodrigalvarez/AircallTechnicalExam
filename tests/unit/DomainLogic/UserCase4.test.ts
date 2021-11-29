import DomainLogic from '../../../src/components/DomainLogic';
import { EscalationPolicyService } from "../../../src/services/EscalationPolicyService";
import { MailService } from "../../../src/services/MailService";
import { PersistenceService } from "../../../src/services/PersistenceService";
import { SmsService } from '../../../src/services/SmsService';
import { TimerService } from '../../../src/services/TimerService';

describe(
    `Given a Monitored Service in an Unhealthy State, 
    when the Pager receives an Alert related to this Monitored Service,`, () => {
    let escalationPolicyServiceMock: EscalationPolicyService;
    let mailServiceMock: MailService;
    let persistenceServiceMock: PersistenceService;
    let smsServiceMock: SmsService;
    let timerServiceMock: TimerService;
    let domainLogic: DomainLogic;

    beforeAll(() => {
        escalationPolicyServiceMock = {
            getEscalationPolicy: jest.fn()
        }

        mailServiceMock = {
            sendMail: jest.fn()
        }
        
        persistenceServiceMock = {
            getLastPager: jest.fn(),
            getOrCreateLastPager: jest.fn()
            .mockReturnValue({
                currentLevel: 1,
                isHealthy: false,
                isAcknowledged: false,
                isNew: false,
            }),
            setPagerStatus: jest.fn(),
            setPagerAcknowledgement: jest.fn(),
            escalatePager: jest.fn(),
        }

        smsServiceMock = {
            sendSms: jest.fn()
        }

        timerServiceMock = {
            createTimer: jest.fn()
        }

        domainLogic = new DomainLogic(escalationPolicyServiceMock, mailServiceMock, persistenceServiceMock, smsServiceMock, timerServiceMock);
    })

    test(
        `then the Pager doesn't notify any Target, 
        and doesn't set an acknowledgement delay`, () => {
        domainLogic.processAlert('myservice', 'this alert will be ignored');

        expect(escalationPolicyServiceMock.getEscalationPolicy).not.toHaveBeenCalled();
        expect(mailServiceMock.sendMail).not.toHaveBeenCalled();
        expect(persistenceServiceMock.getLastPager).not.toHaveBeenCalled();
        expect(persistenceServiceMock.getOrCreateLastPager).toHaveBeenNthCalledWith(1, 'myservice', 'this alert will be ignored');
        expect(persistenceServiceMock.setPagerStatus).not.toHaveBeenCalled();
        expect(persistenceServiceMock.setPagerAcknowledgement).not.toHaveBeenCalled();
        expect(persistenceServiceMock.escalatePager).not.toHaveBeenCalled();
        expect(smsServiceMock.sendSms).not.toHaveBeenCalled();
        expect(timerServiceMock.createTimer).not.toHaveBeenCalled();
    })
})