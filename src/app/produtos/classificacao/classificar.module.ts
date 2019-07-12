import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ObserversModule } from '@angular/cdk/observers';
//import { CdkTableModule } from '@angular/cdk/table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../../utilitarios/material.module';
import { NgxMaskModule } from 'ngx-mask';

import { ClassificarComponent } from './classificar/classificar.component';
import { ClassificarListComponent } from './classificar/classificar-list/classificar-list.component';
import { ClassificarEditComponent } from './classificar/classificar-edit/classificar-edit.component';

export const CLASSIFICAR_ROUTES = [
    { path: '', component: ClassificarComponent },
    { path: 'classificar-edit', component: ClassificarEditComponent },
    { path: '**', redirectTo: '' }
];

@NgModule({
    declarations: [
        ClassificarComponent,
        ClassificarListComponent,
        ClassificarEditComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        ObserversModule,
        NgbModule.forRoot(),
        RouterModule.forChild(CLASSIFICAR_ROUTES),
        NgxMaskModule.forRoot()
    ],
    entryComponents: []
})
export class ClassificarModule { }