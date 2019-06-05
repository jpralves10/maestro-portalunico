import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { BehaviorSubject, Observable } from 'rxjs';
import { IFilter, IFilterItem } from '../filter/filter.model';

@Injectable({
  providedIn: 'root'
})
export class FilterSourceService {

    date = new Date();
    start_date = new Date(this.date.setMonth(this.date.getMonth() - 12));

    constructor() {
        this.whenUpdatedSource.subscribe(p => (this.whenUpdated = p));
    }

    /** Default Filter **/

    private defaultFilter: IFilterItem = {
        importer: {cpf_cnpj: '', name: ''}
    };

    public filterSource: 
        BehaviorSubject<IFilterItem> = new BehaviorSubject<IFilterItem>(this.defaultFilter);

    public filter = this.filterSource.asObservable();

    public whenUpdatedSource: 
        BehaviorSubject<Array<MatPaginator>> = new BehaviorSubject<Array<MatPaginator>>([]);

    public whenUpdated: Array<MatPaginator> = [];

    public changeFilter(filter: IFilterItem): void {
        this.filterSource.next(filter);
        //console.log(this.whenUpdated);
        this.whenUpdated.forEach(f2 => f2.firstPage());
    }

    public clearFilter() {
        this.changeFilter(this.defaultFilter);
    }

    /** Default Filter Result **/

    private readonly defaultFilterResult: IFilter = {
        importers: [],
        data_inicio: this.start_date,
        data_fim: new Date()
    };

    public filterResultSource: 
        BehaviorSubject<IFilter> = new BehaviorSubject<IFilter>(this.defaultFilterResult);

    public filterResult: 
        Observable<IFilter> = this.filterResultSource.asObservable();

    public changeFilterResult(filter: IFilter) {
        this.filterResultSource.next(filter);
    }

    public resetFilter() {
        this.filterResultSource.next(this.defaultFilterResult);
    }
}