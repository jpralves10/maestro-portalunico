import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { Produto } from '../../shared/models/produto.model';
import { ProdutosListDataSource } from './produtos-list-datasource';
import { ResultItem } from '../../shared/models/unificacao.result.model';
import { Result } from '../../shared/models/unificacao.result.model';
import { ResultService } from '../../shared/services/unificacao.result.service';
import { FilterResult } from '../../shared/models/unificacao.filter.model';

@Component({
    selector: 'app-produtos-list',
    templateUrl: './produtos-list.component.html',
    styleUrls: ['./produtos-list.component.scss']
})
export class ProdutosListComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    @Input() data: Produto[];
    @Input() status: string[];
    @Input() filter: FilterResult;

    statusOld: string[];

    dataSource: ProdutosListDataSource;
    selection = new SelectionModel<Produto>(true, []);
    displayedColumns = ['descricaoBruta', 'ncm'];

    public filtroValue: ResultItem;
    public currentFilter: Result;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private resultService: ResultService
    ) { 
        resultService.filter.subscribe(f => (this.filtroValue = f));

        resultService.filterResult.subscribe(fr => (this.currentFilter = fr));

        this.selection.changed.subscribe(() => {
            resultService.changeFilterResult({
                ...this.currentFilter,
                produtos: this.selection.selected
            });
        });
    }

    ngOnInit() {
        this.statusOld = [...this.status]

        this.dataSource = new ProdutosListDataSource(
            this.filter,
            this.paginator,
            this.sort,
            this.resultService,
            this.data
        );
    }

    ngAfterViewInit() {
        this.resultService.whenUpdatedSource.next([
            ...this.resultService.whenUpdated,
            this.paginator
        ]);
    }

    /** Filtro Mat Table **/

    updateFiltro() {
        this.resultService.changeFilter(this.filtroValue);
    }

    updateDataSource(data: Produto[]){
        this.dataSource.data = [...data];
        this.dataSource.fullData = [...data];
        this.updateFiltro();
    }

    getVisibleData() {
        return this.dataSource.getUpdatedData();
    }

    isAllSelected() {
        const visibleData = this.dataSource.getUpdatedData();
        return !visibleData.some(
            ds => !this.selection.selected.some(s => s.descricao === ds.descricao)
        );
    }

    deselectAll() {
        this.selection.clear();
        this.paginator.firstPage();
    }

    editRowProduto(row: Produto){
        this.router.navigate([`/catalogo/catalogo-edit`], {
            relativeTo: this.route,
            replaceUrl: false,
            queryParams: {
                filterCatalogo: JSON.stringify({...row})
            }
        });
    }
}