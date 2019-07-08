import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ObserversModule } from '@angular/cdk/observers';
//import { CdkTableModule } from '@angular/cdk/table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../../../utilitarios/material.module';
import { NgxMaskModule } from 'ngx-mask';

import { CLASSIFICAR_ROUTES } from './classificar.routes';
import { ClassificarComponent } from './classificar.component';
import { ProdutosListComponent } from './produtos-list/produtos-list.component';

@NgModule({
    declarations: [
        ClassificarComponent,
        ProdutosListComponent
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