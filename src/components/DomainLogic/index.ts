import { EscalationPolicyService, EscalationPolicy } from "../../services/EscalationPolicyService";
import { MailService } from "../../services/MailService";
import { PersistenceService, Pager } from "../../services/PersistenceService";
import { SmsService } from '../../services/SmsService';
import { TimerService } from '../../services/TimerService';

class DomainLogic {
    private static TIMER_TIME = 900 // 15 minutes

    constructor(
        private escalationPolicy: EscalationPolicyService,
        private mailService: MailService,
        private persistenceService: PersistenceService,
        private smsService: SmsService,
        private timerService: TimerService,
    ) {}

    public processAlert(monitoredServiceId: String, alertMessage: String) {
        const pager: Pager = this.persistenceService.getLastPager(monitoredServiceId);
        
        if (pager.isHealthy) {
            this.persistenceService.createPager(monitoredServiceId, alertMessage);
            const escalationPolicy: EscalationPolicy = this.escalationPolicy.getEscalationPolicy(monitoredServiceId, 1);
            this.mailService.sendMail(escalationPolicy.mailTargets, monitoredServiceId);
            this.smsService.sendSms(escalationPolicy.smsTargets, monitoredServiceId);
            this.timerService.createTimer(monitoredServiceId, DomainLogic.TIMER_TIME);
        }
    };
    public processTimer(monitoredServiceId: String) {
        const pager: Pager = this.persistenceService.getLastPager(monitoredServiceId);

        if (!pager.isHealthy && !pager.isAcknowledged) {
            const escalationPolicy: EscalationPolicy = this.escalationPolicy.getEscalationPolicy(monitoredServiceId, pager.currentLevel + 1);
            if (escalationPolicy) {
                this.persistenceService.escalatePager(monitoredServiceId);
                this.mailService.sendMail(escalationPolicy.mailTargets, monitoredServiceId);
                this.smsService.sendSms(escalationPolicy.smsTargets, monitoredServiceId);
                this.timerService.createTimer(monitoredServiceId, DomainLogic.TIMER_TIME);
            }
        }
    };
    public processAcknowledgement(monitoredServiceId: String) {
        this.persistenceService.setPagerAcknowledgement(monitoredServiceId, true);
    };
    public processHealthyEvent(monitoredServiceId: String){
        this.persistenceService.setPagerStatus(monitoredServiceId, true);
    };
}

export default DomainLogic;