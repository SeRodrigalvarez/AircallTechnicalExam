export type Pager = {
    currentLevel: number;
    isHealthy: Boolean;
    isAcknowledged: Boolean;
    isNew: Boolean;
}

export interface PersistenceService {
    getLastPager(monitoredServiceId: String): Pager;
    getOrCreateLastPager(monitoredServiceId: String, alertMessage: String): Pager;
    setPagerStatus(monitoredServiceId: String, isHealthy: Boolean);
    setPagerAcknowledgement(monitoredServiceId: String, isAcknowledged: Boolean);
    escalatePager(monitoredServiceId: String);
}