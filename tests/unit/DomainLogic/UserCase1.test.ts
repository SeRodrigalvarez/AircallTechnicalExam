import DomainLogic from '../../../src/components/DomainLogic';
import { EscalationPolicyService } from "../../../src/services/EscalationPolicyService";
import { MailService } from "../../../src/services/MailService";
import { PersistenceService } from "../../../src/services/PersistenceService";
import { SmsService } from '../../../src/services/SmsService';
import { TimerService } from '../../../src/services/TimerService';

describe(
    `Given a Healthy Monitored Service and Pager, 
    when the Pager receives an Alert related to this Monitored Service`, () => {
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
                smsTargets: ['123456789'],
                mailTargets: ['person@mail.com'],
            })
        }

        mailServiceMock = {
            sendMail: jest.fn()
        }
        
        persistenceServiceMock = {
            getLastPager: jest.fn()
            .mockReturnValue({
                currentLevel: 1,
                isHealthy: true,
                isAcknowledged: true,
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
        `then the Monitored Service becomes Unhealthy, 
        the Pager notifies all targets of the first level of the escalation policy, 
        and sets a 15-minutes acknowledgement delay`, () => {
        domainLogic.processAlert('myservice', 'it stopped working');

        expect(escalationPolicyServiceMock.getEscalationPolicy).toHaveBeenNthCalledWith(1, 'myservice', 1);
        expect(mailServiceMock.sendMail).toHaveBeenNthCalledWith(1, ['person@mail.com'], 'myservice');
        expect(persistenceServiceMock.getLastPager).toHaveBeenNthCalledWith(1, 'myservice');
        expect(persistenceServiceMock.createPager).toHaveBeenNthCalledWith(1, 'myservice', 'it stopped working');
        expect(persistenceServiceMock.setPagerStatus).not.toHaveBeenCalled();
        expect(persistenceServiceMock.setPagerAcknowledgement).not.toHaveBeenCalled();
        expect(persistenceServiceMock.escalatePager).not.toHaveBeenCalled();
        expect(smsServiceMock.sendSms).toHaveBeenNthCalledWith(1, ['123456789'], 'myservice');
        expect(timerServiceMock.createTimer).toHaveBeenNthCalledWith(1, 'myservice', 900);
    })
})