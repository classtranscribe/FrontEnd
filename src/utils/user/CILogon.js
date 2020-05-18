import { env } from '../env';
import { links } from '../links';
import { redirect } from './redirect';

export class CILogon {
    constructor() {
        this.callback = window.location.origin + links.ciLogonCallback();
    }

    authorize() {
        redirect.saveRedirectURI();

        let query = links.createSearch({
            response_type: 'code',
            client_id: env.ciLogonClientID,
            redirect_uri: this.callback,
            scope: 'openid profile email org.cilogon.userinfo edu.uiuc.ncsa.myproxy.getcert'
        });

        window.location = 'https://cilogon.org/authorize' + query;
    }

    parseCallback() {
        let redirect_uri = redirect.getRedirectURI();
        redirect.clear();

        let { code } = links.useSearch();

        return {
            token: code,
            redirect_uri,
        };
    }
}