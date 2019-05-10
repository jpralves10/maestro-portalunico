import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { BehaviorSubject, Observable } from 'rxjs';
import { Filter, FilterItem } from '../models/unificacao.filter.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

    date = new Date();
    start_date = new Date(this.date.setMonth(this.date.getMonth() - 12));

    constructor() {
        this.whenUpdatedSource.subscribe(p => (this.whenUpdated = p));
    }

    /** Default Filter **/

    private defaultFilter: FilterItem = {
        importer: {cpf_cnpj: '', name: ''}
    };

    public filterSource: 
        BehaviorSubject<FilterItem> = new BehaviorSubject<FilterItem>(this.defaultFilter);

    public filter = this.filterSource.asObservable();

    public whenUpdatedSource: 
        BehaviorSubject<Array<MatPaginator>> = new BehaviorSubject<Array<MatPaginator>>([]);

    public whenUpdated: Array<MatPaginator> = [];

    public changeFilter(filter: FilterItem): void {
        this.filterSource.next(filter);
        //console.log(this.whenUpdated);
        this.whenUpdated.forEach(f2 => f2.firstPage());
    }

    public clearFilter() {
        this.changeFilter(this.defaultFilter);
    }

    /** Default Filter Result **/

    private readonly defaultFilterResult: Filter = {
        importers: [],
        data_inicio: this.start_date,
        data_fim: new Date()
    };

    public filterResultSource: 
        BehaviorSubject<Filter> = new BehaviorSubject<Filter>(this.defaultFilterResult);

    public filterResult: 
        Observable<Filter> = this.filterResultSource.asObservable();

    public changeFilterResult(filter: Filter) {
        this.filterResultSource.next(filter);
    }

    public resetFilter() {
        this.filterResultSource.next(this.defaultFilterResult);
    }
}