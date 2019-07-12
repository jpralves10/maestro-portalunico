import { Routes } from '@angular/router'

import { IndicadoresComponent } from './dashboard/indicadores/indicadores.component';
import { ImportacaoComponent } from './produtos/importacao/importacao.component';
import { NotificacoesComponent } from './shared/notificacoes/notificacoes.component';
import { SuporteComponent } from './shared/suporte/suporte.component';

export const ROUTES: Routes = [
    //{ path: '', component: IndicadoresComponent },
    { path: '', redirectTo: 'unificacao', pathMatch: 'full' },
    { path: 'importacao', component: ImportacaoComponent },
    { path: 'notificacao', component: NotificacoesComponent },
    { path: 'suporte', component: SuporteComponent },
    { path: 'catalogo', loadChildren: './produtos/catalogo/catalogo.module#CatalogoModule' },
    { path: 'unificacao', loadChildren: './produtos/unificacao/unificacao.module#UnificacaoModule' },
    { path: 'classificacao-preencher', loadChildren: './produtos/classificacao/preencher.module#PreencherModule'},
    { path: 'classificacao-modelos', loadChildren: './produtos/classificacao/modelos.module#ModelosModule'},
    { path: 'classificacao-classificar', loadChildren: './produtos/classificacao/classificar.module#ClassificarModule'},
    { path: '**', redirectTo: '' }
]