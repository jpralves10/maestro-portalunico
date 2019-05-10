import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ObserversModule } from '@angular/cdk/observers';
//import { CdkTableModule } from '@angular/cdk/table';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MaterialModule } from '../../utilitarios/material.module';
import { NgxMaskModule } from 'ngx-mask';

// Add these
//import { faAdobe } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas, faChevronDown, faFileMedical, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(fas, far, faChevronDown, faFileMedical, faInfoCircle);

import { UNIFICACAO_ROUTES } from './unificacao.routes';

import { FilterComponent } from './filter/filter.component';
import { ResultComponent } from './result/result.component';
import { ImportersListComponent } from './filter/importers-list/importers-list.component'; 
import { ProdutosListComponent } from './result/produtos-list/produtos-list.component';
import { ProdutosListDialog } from './result/produtos-list/produtos-list.dialog'; 
import { ProdutosEditComponent } from './result/produtos-edit/produtos-edit.component';
import { ProdutosOneComponent } from './result/produtos-edit/produtos-one/produtos-one.component';
import { ProdutosTwoComponent } from './result/produtos-edit/produtos-two/produtos-two.component';
import { ProdutosThreeComponent } from './result/produtos-edit/produtos-three/produtos-three.component';

@NgModule({
    declarations: [
        FilterComponent,
        ResultComponent,
        ImportersListComponent,
        ProdutosListComponent,
        ProdutosListDialog,
        ProdutosEditComponent,
        ProdutosOneComponent,
        ProdutosTwoComponent,
        ProdutosThreeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        FontAwesomeModule,
        ObserversModule,
        NgbModule.forRoot(),
        RouterModule.forChild(UNIFICACAO_ROUTES),
        NgxMaskModule.forRoot()
        //GoogleChartsModule.forRoot()
    ],
    entryComponents: [
        ProdutosListDialog
    ]
})
export class UnificacaoModule { }
