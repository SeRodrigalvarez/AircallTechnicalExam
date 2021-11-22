export type EscalationPolicy = {
    smsTargets: Number[];
    mailTargets: String[];
}

export interface EscalationPolicyService {
    getEscalationPolicy(monitoredServiceId: String, escalationLevel: Number): EscalationPolicy;
}