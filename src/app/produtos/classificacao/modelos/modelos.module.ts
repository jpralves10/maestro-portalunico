import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ObserversModule } from '@angular/cdk/observers';
//import { CdkTableModule } from '@angular/cdk/table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../../../utilitarios/material.module';
import { NgxMaskModule } from 'ngx-mask';

import { MODELOS_ROUTES } from './modelos.routes';

import { ModelosComponent } from './modelos.component';
import { ModelosListComponent } from './modelos-list/modelos-list.component';
import { ModelosEditComponent } from './modelos-edit/modelos-edit.component';

@NgModule({
    declarations: [
        ModelosComponent,
        ModelosListComponent,
        ModelosEditComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        ObserversModule,
        NgbModule.forRoot(),
        RouterModule.forChild(MODELOS_ROUTES),
        NgxMaskModule.forRoot()
    ],
    entryComponents: []
})
export class ModelosModule { }