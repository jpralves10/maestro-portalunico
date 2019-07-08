import { ClassificarComponent } from './classificar.component';

export const CLASSIFICAR_ROUTES = [
    { path: '', component: ClassificarComponent },
    //{ path: 'modelos-edit', component: ModelosEditComponent },
    { path: '**', redirectTo: '' }
];