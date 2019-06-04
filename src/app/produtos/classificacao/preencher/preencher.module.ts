import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ObserversModule } from '@angular/cdk/observers';
//import { CdkTableModule } from '@angular/cdk/table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../../../utilitarios/material.module';
import { NgxMaskModule } from 'ngx-mask';

import { PREENCHER_ROUTES } from './preencher.routes';

import { PreencherComponent } from './preencher.component';
import { PreencherListComponent } from './preencher-list/preencher-list.component';
import { PreencherEditComponent } from './preencher-edit/preencher-edit.component';

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