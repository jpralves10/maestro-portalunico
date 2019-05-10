import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatPaginator } from '@angular/material';
import { Result, ResultItem } from '../models/unificacao.result.model';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

    date = new Date();
    start_date = new Date(this.date.setMonth(this.date.getMonth() - 12));

    constructor() {
        this.whenUpdatedSource.subscribe(p => (this.whenUpdated = p));
    }

    /** Default Filter **/

    private defaultFilter: ResultItem = {
        produto: {numeroDI: '', descricaoBruta: '', ncm: '', status: '', cnpj: ''}
    };

    public filterSource:
        BehaviorSubject<ResultItem> = new BehaviorSubject<ResultItem>(this.defaultFilter);

    public filter = this.filterSource.asObservable();

    public whenUpdatedSource: 
        BehaviorSubject<Array<MatPaginator>> = new BehaviorSubject<Array<MatPaginator>>([]);

    public whenUpdated: Array<MatPaginator> = [];

    public changeFilter(filter: ResultItem): void {
        this.filterSource.next(filter);
        //console.log(this.whenUpdated);
        this.whenUpdated.forEach(f2 => f2.firstPage());
    }

    public clearFilter() {
        this.changeFilter(this.defaultFilter);
    }

    /** Default Filter Result **/

    private readonly defaultFilterResult: Result = {
        produtos: [],
        data_inicio: this.start_date,
        data_fim: new Date()
    };

    public filterResultSource: 
        BehaviorSubject<Result> = new BehaviorSubject<Result>(this.defaultFilterResult);

    public filterResult: 
        Observable<Result> = this.filterResultSource.asObservable();

    public changeFilterResult(filter: Result) {
        this.filterResultSource.next(filter);
    }

    public resetFilter() {
        this.filterResultSource.next(this.defaultFilterResult);
    }
}

const actualDateDecremented = (): Date => {
    const actualDate = new Date();
    actualDate.setMonth(actualDate.getMonth() - 12);
    return actualDate;
};