import { ProdutosEditComponent } from './produtos-edit/produtos-edit.component';
import { CatalogoComponent } from './catalogo.component';

export const CATALOGO_ROUTES = [
    { path: '', component: CatalogoComponent },
    { path: 'catalogo-edit', component: ProdutosEditComponent },
    { path: '**', redirectTo: '' }
];