import { FilterComponent } from './filter/filter.component';
import { ResultComponent } from './result/result.component';
import { ProdutosEditComponent } from './result/produtos-edit/produtos-edit.component';

export const UNIFICACAO_ROUTES = [
    { path: '', component: FilterComponent },
    { path: 'result', component: ResultComponent },
    { path: 'unificacao-edit', component: ProdutosEditComponent },
    { path: '**', redirectTo: '' }
];