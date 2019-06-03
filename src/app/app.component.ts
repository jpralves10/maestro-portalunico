import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
        private router: Router
    ) { }

    ngOnInit(){ 
        let urlRouted = window.sessionStorage.getItem('reload')

        if(urlRouted != 'undefined'){
            window.sessionStorage.setItem('reload', 'undefined');    
            this.router.navigate([urlRouted]);
        }       
    }
}
