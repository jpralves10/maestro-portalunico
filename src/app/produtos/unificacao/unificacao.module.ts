import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ObserversModule } from '@angular/cdk/observers';
//import { CdkTableModule } from '@angular/cdk/table';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MaterialModule } from '../../utilitarios/material.module';
import { NgxMaskModule } from 'ngx-mask';

import { UNIFICACAO_ROUTES } from './unificacao.routes';

import { ProdutosListComponent } from './produtos-list/produtos-list.component';
import { ProdutosInfoDialog } from './produtos-info/produtos-info.dialog'; 
import { ProdutosEditComponent } from './produtos-edit/produtos-edit.component';
import { ProdutosOneComponent } from './produtos-edit/produtos-one/produtos-one.component';
import { ProdutosTwoComponent } from './produtos-edit/produtos-two/produtos-two.component';
import { ProdutosThreeComponent } from './produtos-edit/produtos-three/produtos-three.component';
import { UnificacaoComponent } from './unificacao.component';

@NgModule({
    declarations: [
        ProdutosListComponent,
        ProdutosInfoDialog,
        ProdutosEditComponent,
        ProdutosOneComponent,
        ProdutosTwoComponent,
        ProdutosThreeComponent,
        UnificacaoComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        ObserversModule,
        NgbModule.forRoot(),
        RouterModule.forChild(UNIFICACAO_ROUTES),
        NgxMaskModule.forRoot()
        //GoogleChartsModule.forRoot()
    ],
    entryComponents: [
        ProdutosInfoDialog
    ]
})
export class UnificacaoModule { }
