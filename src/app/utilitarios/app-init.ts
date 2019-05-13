import { KeycloakService } from 'keycloak-angular';

//jb3yso0422

export function initializer(keycloak: KeycloakService): () => Promise<any> {
    return (): Promise<any> =>
    keycloak.init({
        config: {
            url: 'https://auth.eficilog.com/auth',
            realm: 'eficilog.com',
            clientId: 'front-local'
        },
        enableBearerInterceptor: true,
        bearerPrefix: 'Bearer',
        initOptions: {
            onLoad: 'login-required',
            flow: 'standard'
        }
    });
}