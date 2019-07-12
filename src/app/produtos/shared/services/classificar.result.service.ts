import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatPaginator } from '@angular/material';
import { IResult, IResultItem } from '../models/classificar.result.model';
import { IProduto } from '../models/produto.model';

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

    private defaultFilter: IResultItem = {
        classificar: {
            codigo: null,
            titulo: '', 
            status: '', 
            dataAtualizacao: null,
            usuario:{
                nome:'',
                email:''
            },
            produto: null
        }
    };

    public filterSource:
        BehaviorSubject<IResultItem> = new BehaviorSubject<IResultItem>(this.defaultFilter);

    public filter = this.filterSource.asObservable();

    public whenUpdatedSource: 
        BehaviorSubject<Array<MatPaginator>> = new BehaviorSubject<Array<MatPaginator>>([]);

    public whenUpdated: Array<MatPaginator> = [];

    public changeFilter(filter: IResultItem): void {
        this.filterSource.next(filter);
        //console.log(this.whenUpdated);
        this.whenUpdated.forEach(f2 => f2.firstPage());
    }

    public clearFilter() {
        this.changeFilter(this.defaultFilter);
    }

    /** Default Filter IResult **/

    private readonly defaultFilterResult: IResult = {
        classificar: [],
        data_inicio: this.start_date,
        data_fim: new Date()
    };

    public filterResultSource: 
        BehaviorSubject<IResult> = new BehaviorSubject<IResult>(this.defaultFilterResult);

    public filterResult: 
        Observable<IResult> = this.filterResultSource.asObservable();

    public changeFilterResult(filter: IResult) {
        this.filterResultSource.next(filter);
    }

    public resetFilter() {
        this.filterResultSource.next(this.defaultFilterResult);
    }
}