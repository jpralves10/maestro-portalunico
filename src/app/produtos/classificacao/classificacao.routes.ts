import { ClassificacaoComponent } from './classificacao.component';
import { ComentariosEditComponent } from './comentarios/comentarios-edit/comentarios-edit.component';
import { ComentariosListComponent } from './comentarios/comentarios-list/comentarios-list.component';

export const CLASSIFICACAO_ROUTES = [
    { path: '', component: ClassificacaoComponent },
    { path: 'comentarios-list', component: ComentariosListComponent },
    { path: 'comentarios-edit', component: ComentariosEditComponent },
    { path: '**', redirectTo: '' }
];