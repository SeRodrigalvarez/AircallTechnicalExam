export interface SmsService {
    sendSms(phoneNumbers: Number[], monitoredServiceId: string);
}