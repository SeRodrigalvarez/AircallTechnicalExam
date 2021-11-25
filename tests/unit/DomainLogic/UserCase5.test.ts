import DomainLogic from '../../../src/components/DomainLogic';
import { EscalationPolicyService } from "../../../src/services/EscalationPolicyService";
import { MailService } from "../../../src/services/MailService";
import { PersistenceService } from "../../../src/services/PersistenceService";
import { SmsService } from '../../../src/services/SmsService';
import { TimerService } from '../../../src/services/TimerService';

describe(
    `Given a Monitored Service in an Unhealthy State, 
    when the Pager receives a Healthy event related to this Monitored Service
    and later receives the Acknowledgement Timeout,`, () => {
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
            getLastPager: jest.fn()
            .mockReturnValueOnce({
                currentLevel: 1,
                isHealthy: false,
                isAcknowledged: false,
            })
            .mockReturnValueOnce({
                currentLevel: 1,
                isHealthy: true,
                isAcknowledged: false,
            }),
            createPager: jest.fn(),
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
        `then the Monitored Service becomes Healthy, 
        the Pager doesn’t notify any Target
        and doesn’t set an acknowledgement delay`, () => {
        domainLogic.processHealthyEvent('myservice');
        domainLogic.processTimer('myservice');

        expect(escalationPolicyServiceMock.getEscalationPolicy).not.toHaveBeenCalled();
        expect(mailServiceMock.sendMail).not.toHaveBeenCalled();
        expect(persistenceServiceMock.getLastPager).toHaveBeenNthCalledWith(1, 'myservice');
        expect(persistenceServiceMock.getLastPager).toHaveBeenNthCalledWith(2, 'myservice');
        expect(persistenceServiceMock.createPager).not.toHaveBeenCalled();
        expect(persistenceServiceMock.setPagerStatus).toHaveBeenNthCalledWith(1, 'myservice', true);
        expect(persistenceServiceMock.setPagerAcknowledgement).not.toHaveBeenCalled();
        expect(persistenceServiceMock.escalatePager).not.toHaveBeenCalled();
        expect(smsServiceMock.sendSms).not.toHaveBeenCalled();
        expect(timerServiceMock.createTimer).not.toHaveBeenCalled();
    })
})