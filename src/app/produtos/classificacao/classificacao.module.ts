import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ObserversModule } from '@angular/cdk/observers';
//import { CdkTableModule } from '@angular/cdk/table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../../utilitarios/material.module';
import { NgxMaskModule } from 'ngx-mask';

import { CLASSIFICACAO_ROUTES } from './classificacao.routes';

import { ClassificacaoComponent } from './classificacao.component';
import { ComentariosComponent } from './comentarios/comentarios.component';
import { ComentariosListComponent } from './comentarios/comentarios-list/comentarios-list.component';
import { ComentariosEditComponent } from './comentarios/comentarios-edit/comentarios-edit.component';

@NgModule({
    declarations: [
        ClassificacaoComponent,
        ComentariosComponent,
        ComentariosListComponent,
        ComentariosEditComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        ObserversModule,
        NgbModule.forRoot(),
        RouterModule.forChild(CLASSIFICACAO_ROUTES),
        NgxMaskModule.forRoot()
    ],
    entryComponents: []
})
export class ClassificacaoModule { }