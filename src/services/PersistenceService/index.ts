export type Pager = {
    currentLevel: Number;
    isHealthy: Boolean;
    isAcknowledged: Boolean;
}

export interface PersistenceService {
    getLastPager(monitoredServiceId: String): Pager;
    createPager(monitoredServiceId: String, isHealthy: Boolean);
    setPagerStatus(monitoredServiceId: String, isHealthy: Boolean);
    setPagerAcknowledgement(monitoredServiceId: String, isAcknowledged: Boolean);
    escalatePager(monitoredServiceId: String);
}