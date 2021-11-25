export interface TimerService {
    createTimer(monitoredServiceId: String, timeInSec: number);
}