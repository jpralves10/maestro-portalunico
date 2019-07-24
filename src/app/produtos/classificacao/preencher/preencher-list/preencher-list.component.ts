import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { IResult, IResultItem } from 'src/app/produtos/shared/models/classificar.result.model';
import { PreencherListDataSource } from './preencher-list-datasource';
import { SelectionModel } from '@angular/cdk/collections';
import { ProdutoService } from 'src/app/produtos/shared/services/produtos.service';
import { IClassificar } from 'src/app/produtos/shared/models/classificar.model';
import { ResultService } from 'src/app/produtos/shared/services/classificar.result.service';

@Component({
    selector: 'app-preencher-list',
    templateUrl: './preencher-list.component.html',
    styleUrls: ['./preencher-list.component.scss']
})
export class PreencherListComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    @Input() data: IClassificar[];

    dataSource: PreencherListDataSource;
    selection = new SelectionModel<IClassificar>(true, []);
    displayedColumns = ['titulo', 'status', 'dataAtualizacao'];

    public filtroValue: IResultItem;
    public currentFilter: IResult;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private resultService: ResultService,
        private produtoService: ProdutoService
    ) {
        resultService.filter.subscribe(f => (this.filtroValue = f));
        resultService.filterResult.subscribe(fr => (this.currentFilter = fr));

        this.selection.changed.subscribe(() => {
            resultService.changeFilterResult({
                ...this.currentFilter,
                classificar: this.selection.selected
            });
        });
    }

    ngOnInit() {
        this.dataSource = new PreencherListDataSource(
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

    deselectAll() {
        this.selection.clear();
        this.paginator.firstPage();
    }

    updateDataSource(data: IClassificar[]){
        this.dataSource.data = [...data];
        this.dataSource.fullData = [...data];
        this.updateFiltro();
    }

    editModelo(row: IClassificar){
        this.router.navigate([`/classificacao-preencher/preencher-edit`], {
            relativeTo: this.route,
            replaceUrl: false,
            queryParams: {
                filterFormulario: JSON.stringify({...row})
            }
        });
    }

    getQtdPreencherSelecionados(){
        return this.selection.selected.length > 1 ? '' + this.selection.selected.length + ' ' + 'preencher selecionados' :
               this.selection.selected.length > 0 ? '' + this.selection.selected.length + ' ' + 'preencher selecionado' :  ''
    }
}
