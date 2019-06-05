import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

//import { AuthService } from '../../utilitarios/auth.service';
import { IFilter } from '../filter/filter.model';
import { EFICILOG_API } from '../../utilitarios/app.api';

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
}