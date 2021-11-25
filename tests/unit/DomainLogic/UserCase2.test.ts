import DomainLogic from '../../../src/components/DomainLogic';
import { EscalationPolicyService } from "../../../src/services/EscalationPolicyService";
import { MailService } from "../../../src/services/MailService";
import { PersistenceService } from "../../../src/services/PersistenceService";
import { SmsService } from '../../../src/services/SmsService';
import { TimerService } from '../../../src/services/TimerService';

describe(
    `Given a Monitored Service in an Unhealthy State 
    the corresponding Alert is not Acknowledged 
    and the last level has not been notified, 
    when the Pager receives the Acknowledgement Timeout`, () => {
    let escalationPolicyServiceMock: EscalationPolicyService;
    let mailServiceMock: MailService;
    let persistenceServiceMock: PersistenceService;
    let smsServiceMock: SmsService;
    let timerServiceMock: TimerService;
    let domainLogic: DomainLogic;

    beforeAll(() => {
        escalationPolicyServiceMock = {
            getEscalationPolicy: jest.fn()
            .mockReturnValue({
                smsTargets: ['234567891'],
                mailTargets: ['person2@mail.com'],
            })
        }

        mailServiceMock = {
            sendMail: jest.fn()
        }
        
        persistenceServiceMock = {
            getLastPager: jest.fn()
            .mockReturnValue({
                currentLevel: 1,
                isHealthy: false,
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
        `then the Pager notifies all targets of the next level of the escalation policy 
        and sets a 15-minutes acknowledgement delay.`, () => {
        domainLogic.processTimer('myservice');

        expect(escalationPolicyServiceMock.getEscalationPolicy).toHaveBeenNthCalledWith(1, 'myservice', 2);
        expect(mailServiceMock.sendMail).toHaveBeenNthCalledWith(1, 'person2@mail.com', 'myservice');
        expect(persistenceServiceMock.getLastPager).toHaveBeenNthCalledWith(1, 'myservice');
        expect(persistenceServiceMock.createPager).not.toHaveBeenCalled();
        expect(persistenceServiceMock.setPagerStatus).not.toHaveBeenCalled();
        expect(persistenceServiceMock.setPagerAcknowledgement).not.toHaveBeenCalled();
        expect(persistenceServiceMock.escalatePager).toHaveBeenNthCalledWith(1, 'myservice');
        expect(smsServiceMock.sendSms).toHaveBeenNthCalledWith(1, '234567891', 'myservice');
        expect(timerServiceMock.createTimer).toHaveBeenNthCalledWith(1, 'myservice', 900);
    })
})