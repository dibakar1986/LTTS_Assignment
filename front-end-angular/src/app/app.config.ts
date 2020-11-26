import {environment} from '../environments/environment';
export class AppConfig {
    public static readonly API_BACKEND_HOST: string = environment.host;
    public static readonly API_BACKEND_PORT: string = environment.port;
    public static readonly API_BACKEND_SECURE: boolean = environment.secure;
    public static readonly API_BACKEND_ENDPOINT: string = '/';
    public static readonly MQTT_STATUS_URL: string = 'mqtt';

    public static generateApiURI(url: string, secure: boolean = AppConfig.API_BACKEND_SECURE): string {
        const protocol: string = secure ? 'https://' : 'http://';
        const port: string = AppConfig.API_BACKEND_PORT ? `:${AppConfig.API_BACKEND_PORT}`: '';
        return `${protocol}${AppConfig.API_BACKEND_HOST}${port}${AppConfig.API_BACKEND_ENDPOINT}${url}`;
    }
}