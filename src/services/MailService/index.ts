export interface MailService {
    sendMail(addresses: String[], monitoredServiceId: String);
}