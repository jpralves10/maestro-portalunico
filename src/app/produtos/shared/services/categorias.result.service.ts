import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatPaginator } from '@angular/material';
import { IResultCategorias, IResultItemCategorias } from '../models/formulario.result.model';

@Injectable({
    providedIn: 'root'
})
export class ResultServiceCategorias {

    date = new Date();
    start_date = new Date(this.date.setMonth(this.date.getMonth() - 12));

    constructor() {
        this.whenUpdatedSource.subscribe(p => (this.whenUpdated = p));
    }

    /** Default Filter **/

    private defaultFilter: IResultItemCategorias = {
        categoria: {codigo: null, descricao: ''}
    };

    public filterSource:
        BehaviorSubject<IResultItemCategorias> = new BehaviorSubject<IResultItemCategorias>(this.defaultFilter);

    public filter = this.filterSource.asObservable();

    public whenUpdatedSource: 
        BehaviorSubject<Array<MatPaginator>> = new BehaviorSubject<Array<MatPaginator>>([]);

    public whenUpdated: Array<MatPaginator> = [];

    public changeFilter(filter: IResultItemCategorias): void {
        this.filterSource.next(filter);
        //console.log(this.whenUpdated);
        this.whenUpdated.forEach(f2 => f2.firstPage());
    }

    public clearFilter() {
        this.changeFilter(this.defaultFilter);
    }

    /** Default Filter Result **/

    private readonly defaultFilterResult: IResultCategorias = {
        categorias: []
    };

    public filterResultSource: 
        BehaviorSubject<IResultCategorias> = new BehaviorSubject<IResultCategorias>(this.defaultFilterResult);

    public filterResult: 
        Observable<IResultCategorias> = this.filterResultSource.asObservable();

    public changeFilterResult(filter: IResultCategorias) {
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