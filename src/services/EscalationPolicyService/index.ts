export type EscalationPolicy = {
    smsTargets: String[];
    mailTargets: String[];
}

export interface EscalationPolicyService {
    getEscalationPolicy(monitoredServiceId: String, escalationLevel: Number): EscalationPolicy;
}