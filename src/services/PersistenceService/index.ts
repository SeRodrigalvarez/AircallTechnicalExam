export type Pager = {
    currentLevel: number;
    isHealthy: Boolean;
    isAcknowledged: Boolean;
}

export interface PersistenceService {
    getLastPager(monitoredServiceId: String): Pager;
    createPager(monitoredServiceId: String, alertMessage: String);
    setPagerStatus(monitoredServiceId: String, isHealthy: Boolean);
    setPagerAcknowledgement(monitoredServiceId: String, isAcknowledged: Boolean);
    escalatePager(monitoredServiceId: String);
}