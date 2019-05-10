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

import { CATALOGO_ROUTES } from './catalogo.routes';

import { CatalogoComponent } from './catalogo.component';
import { ProdutosListComponent } from './produtos-list/produtos-list.component';
import { ProdutosEditComponent } from './produtos-edit/produtos-edit.component';

@NgModule({
    declarations: [
        CatalogoComponent,
        ProdutosListComponent,
        ProdutosEditComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        FontAwesomeModule,
        ObserversModule,
        NgbModule.forRoot(),
        RouterModule.forChild(CATALOGO_ROUTES),
        NgxMaskModule.forRoot()
    ],
    entryComponents: [
        
    ]
})
export class CatalogoModule { }