import { ModelosComponent } from './modelos.component';

export const MODELOS_ROUTES = [
    { path: '', component: ModelosComponent },
    { path: '**', redirectTo: '' }
];