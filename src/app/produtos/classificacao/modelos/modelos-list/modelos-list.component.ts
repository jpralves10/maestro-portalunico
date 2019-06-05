import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { IFormulario } from 'src/app/produtos/shared/models/formulario.model';
import { IResult, IResultItem } from 'src/app/produtos/shared/models/formulario.result.model';
import { ModelosListDataSource } from './modelos-list-datasource';
import { SelectionModel } from '@angular/cdk/collections';
import { ResultService } from 'src/app/produtos/shared/services/formularios.result.service';
import { ProdutoService } from 'src/app/produtos/shared/services/produtos.service';

@Component({
    selector: 'app-modelos-list',
    templateUrl: './modelos-list.component.html',
    styleUrls: ['./modelos-list.component.scss']
})
export class ModelosListComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    @Input() data: IFormulario[];

    dataSource: ModelosListDataSource;
    selection = new SelectionModel<IFormulario>(true, []);
    displayedColumns = ['select', 'descricaoBruta', 'ncm'];

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
        this.dataSource = new ModelosListDataSource(
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

    updateDataSource(data: IFormulario[]){
        this.dataSource.data = [...data];
        this.dataSource.fullData = [...data];
        this.updateFiltro();
    }

}
