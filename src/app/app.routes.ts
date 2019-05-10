import { Routes } from '@angular/router'

import { IndicadoresComponent } from './dashboard/indicadores/indicadores.component';
import { ImportacaoComponent } from './produtos/importacao/importacao.component';

export const ROUTES: Routes = [
    { path: '', component: IndicadoresComponent },
    { path: 'importacao', component: ImportacaoComponent },
    { path: 'catalogo', loadChildren: './produtos/catalogo/catalogo.module#CatalogoModule' },
    { path: 'unificacao', loadChildren: './produtos/unificacao/unificacao.module#UnificacaoModule' },
    { path: 'classificacao', loadChildren: './produtos/classificacao/classificacao.module#ClassificacaoModule' },
    { path: '**', redirectTo: '' }
]