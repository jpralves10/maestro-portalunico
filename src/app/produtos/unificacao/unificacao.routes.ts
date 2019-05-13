import { FilterComponent } from '../../shared/filter/filter.component';
import { UnificacaoComponent } from './unificacao.component';
import { ProdutosEditComponent } from './produtos-edit/produtos-edit.component';

export const UNIFICACAO_ROUTES = [
    { path: '', component: UnificacaoComponent },
    { path: 'unificacao-edit', component: ProdutosEditComponent },
    { path: '**', redirectTo: '' }
];