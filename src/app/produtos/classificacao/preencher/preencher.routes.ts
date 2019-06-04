import { PreencherComponent } from './preencher.component';

export const PREENCHER_ROUTES = [
    { path: '', component: PreencherComponent },
    { path: '**', redirectTo: '' }
];