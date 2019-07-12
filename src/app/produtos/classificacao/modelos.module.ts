import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ObserversModule } from '@angular/cdk/observers';
//import { CdkTableModule } from '@angular/cdk/table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../../utilitarios/material.module';
import { NgxMaskModule } from 'ngx-mask';

import { ModelosComponent } from './modelos/modelos.component';
import { ModelosListComponent } from './modelos/modelos-list/modelos-list.component';
import { ModelosEditComponent } from './modelos/modelos-edit/modelos-edit.component';

export const MODELOS_ROUTES = [
    { path: '', component: ModelosComponent },
    { path: 'modelos-edit', component: ModelosEditComponent },
    { path: '**', redirectTo: '' }
];

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