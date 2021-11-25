import { EscalationPolicyService } from "../../services/EscalationPolicyService";
import { MailService } from "../../services/MailService";
import { PersistenceService } from "../../services/PersistenceService";
import { SmsService } from '../../services/SmsService';
import { TimerService } from '../../services/TimerService';

class DomainLogic {

    constructor(
        escalationPolicy: EscalationPolicyService,
        mailService: MailService,
        persistenceService: PersistenceService,
        smsService: SmsService,
        timerService: TimerService,
    ) {

    }

    public processAlert(monitoredServiceId: String, alertMessage: String) {
        return;
    };
    public processTimer(monitoredServiceId: String) {
        return;
    };
    public processAcknowledgement(monitoredServiceId: String) {
        return;
    };
    public processHealthyEvent(monitoredServiceId: String){
        return;
    };
}

export default DomainLogic;