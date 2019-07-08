import { ClassificacaoComponent } from './classificacao.component';
/*import { ComentariosEditComponent } from './comentarios/comentarios-edit/comentarios-edit.component';
import { ComentariosListComponent } from './comentarios/comentarios-list/comentarios-list.component';*/
import { ModelosListComponent } from '../modelos/modelos-list/modelos-list.component';
import { ModelosEditComponent } from '../modelos/modelos-edit/modelos-edit.component';

export const CLASSIFICACAO_ROUTES = [
    { path: '', component: ClassificacaoComponent },
    /*{ path: 'comentarios-list', component: ComentariosListComponent },
    { path: 'comentarios-edit', component: ComentariosEditComponent },*/
    { path: '**', redirectTo: '' }
];