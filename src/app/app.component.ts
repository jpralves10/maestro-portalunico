import { Component } from '@angular/core';
//import { KeycloakService } from 'keycloak-angular';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    title = 'maestro-portalunico';
    loading = true;

    constructor(
        //private keycloakAngular: KeycloakService
    ) { }

    ngOnInit(){ }

    
}
