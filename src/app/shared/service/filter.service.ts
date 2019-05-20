import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

//import { AuthService } from '../../utilitarios/auth.service';
import { Filter } from '../filter/filter.model';
import { EFICILOG_API } from '../../utilitarios/app.api';

@Injectable({
    providedIn: 'root'
})
export class FilterService {

    constructor(private httpClient: HttpClient){}

    getDadosFiltro(): Observable<Filter> {
        return this.httpClient.get<Filter>(
            `${ EFICILOG_API }/relatorios/representacoes/filtros`
        );
    }
}