export class Settings {
    public security: any = null;
    public prefix: string= '/api/v1/';

    constructor (security: any, prefix: string = '/api/v1/') {
        this.security = security;
        this.prefix = prefix;
    } 
}