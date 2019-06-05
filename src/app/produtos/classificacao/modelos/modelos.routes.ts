import { ModelosComponent } from './modelos.component';
import { ModelosEditComponent } from './modelos-edit/modelos-edit.component';

export const MODELOS_ROUTES = [
    { path: '', component: ModelosComponent },
    { path: 'modelos-edit', component: ModelosEditComponent },
    { path: '**', redirectTo: '' }
];