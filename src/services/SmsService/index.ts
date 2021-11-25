export interface SmsService {
    sendSms(phoneNumbers: String[], monitoredServiceId: String);
}