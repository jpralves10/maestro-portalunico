import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { KeycloakService, KeycloakAngularModule } from 'keycloak-angular';
import { initializer } from './utilitarios/app-init';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule, PreloadAllModules } from '@angular/router';

import { AppComponent } from './app.component';
import { NavegacaoComponent } from './shared/navegacao/navegacao.component';
import { MaterialModule } from './utilitarios/material.module';
import { HomeComponent } from './shared/home/home.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ROUTES } from './app.routes';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IndicadoresComponent } from './dashboard/indicadores/indicadores.component';
import { ImportacaoComponent } from './produtos/importacao/importacao.component';
import { FilterComponent } from './shared/filter/filter.component';
import { ImportersListComponent } from './shared/filter/importers-list/importers-list.component';

import { CategoriasComponent } from './produtos/classificacao/modelos/modelos-edit/categorias/categorias.component';

import { AppGuard } from './app.guard';

@NgModule({
    declarations: [
        AppComponent,
        NavegacaoComponent,
        HomeComponent,
        FilterComponent,
        ImportersListComponent,
        IndicadoresComponent,
        ImportacaoComponent,
        CategoriasComponent
    ],
    imports: [
        BrowserModule,
        MaterialModule,
        BrowserAnimationsModule,
        KeycloakAngularModule,
        HttpClientModule,
        FormsModule,
        NgbModule.forRoot(),
        RouterModule.forRoot(ROUTES, {
            useHash: true
        })
    ],
    providers: [
        //AppGuard,
        {
            provide: APP_INITIALIZER,
            useFactory: initializer,
            multi: true,
            deps: [KeycloakService]
        }
    ],
    entryComponents: [
        FilterComponent,
        CategoriasComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }