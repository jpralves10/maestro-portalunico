import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { IResult, IResultItem } from 'src/app/produtos/shared/models/formulario.result.model';
import { PreencherListDataSource } from './preencher-list-datasource';
import { SelectionModel } from '@angular/cdk/collections';
import { ResultService } from 'src/app/produtos/shared/services/formularios.result.service';
import { ProdutoService } from 'src/app/produtos/shared/services/produtos.service';
import { IClassificacao } from 'src/app/produtos/shared/models/classificacao.model';

@Component({
    selector: 'app-preencher-list',
    templateUrl: './preencher-list.component.html',
    styleUrls: ['./preencher-list.component.scss']
})
export class PreencherListComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    @Input() data: IClassificacao[];

    dataSource: PreencherListDataSource;
    selection = new SelectionModel<IClassificacao>(true, []);
    displayedColumns = ['titulo', 'spreadsheetId', 'idSheet', 'status', 'dataAtualizacao'];

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
                formularios: this.selection.selected
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

    updateDataSource(data: IClassificacao[]){
        this.dataSource.data = [...data];
        this.dataSource.fullData = [...data];
        this.updateFiltro();
    }

    editModelo(row: IClassificacao){
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
