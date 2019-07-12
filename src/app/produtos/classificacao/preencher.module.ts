import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ObserversModule } from '@angular/cdk/observers';
//import { CdkTableModule } from '@angular/cdk/table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../../utilitarios/material.module';
import { NgxMaskModule } from 'ngx-mask';

import { PreencherComponent } from './preencher/preencher.component';
import { PreencherListComponent } from './preencher/preencher-list/preencher-list.component';
import { PreencherEditComponent } from './preencher/preencher-edit/preencher-edit.component';

export const PREENCHER_ROUTES = [
    { path: '', component: PreencherComponent },
    { path: 'preencher-edit', component: PreencherEditComponent },
    { path: '**', redirectTo: '' }
];

@NgModule({
    declarations: [
        PreencherComponent,
        PreencherListComponent,
        PreencherEditComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        ObserversModule,
        NgbModule.forRoot(),
        RouterModule.forChild(PREENCHER_ROUTES),
        NgxMaskModule.forRoot()
    ],
    entryComponents: []
})
export class PreencherModule { }