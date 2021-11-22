export type Pager = {
    currentLevel: Number;
    isHealthy: Boolean;
}

export interface PersistenceService {
    getLastPager(monitoredServiceId: String): Pager;
    createPager(monitoredServiceId: String, isHealthy: Boolean);
    setPagerStatus(monitoredServiceId: String, isHealthy: Boolean);
    escalatePager(monitoredServiceId: String);
}