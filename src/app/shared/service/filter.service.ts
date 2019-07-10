import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

//import { AuthService } from '../../utilitarios/auth.service';
import { IFilter } from '../filter/filter.model';
import { EFICILOG_API, GOOGLE_FORMS_API } from '../../utilitarios/app.api';
import { INotificacoes } from '../notificacoes/notificacoes.model';

@Injectable({
    providedIn: 'root'
})
export class FilterService {

    constructor(private httpClient: HttpClient){}

    getDadosFiltro(): Observable<IFilter> {
        return this.httpClient.get<IFilter>(
            `${ EFICILOG_API }/relatorios/representacoes/filtros`
        );
    }

    getNotificacoesFormAll(): Observable<INotificacoes[]> {
        return this.httpClient.post<any>(
            `${ GOOGLE_FORMS_API }/produtos/notificacoes/findAll`, []
        );
    }

    delNotificacoesForm(notificacao: INotificacoes): Observable<string> {
        return this.httpClient.post<any>(
            `${ GOOGLE_FORMS_API }/produtos/notificacoes/remove`, notificacao
        );
    }
}