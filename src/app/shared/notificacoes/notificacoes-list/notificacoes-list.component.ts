import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificacoesListDataSource } from './notificacoes-list-datasource';
import { SelectionModel } from '@angular/cdk/collections';
import { ProdutoService } from 'src/app/produtos/shared/services/produtos.service';
import { IClassificacao } from 'src/app/produtos/shared/models/classificacao.model';
import { ResultService } from '../../service/notificacoes.result.service';
import { INotificacoes } from '../notificacoes.model';
import $ from "jquery";
import { FilterService } from '../../service/filter.service';

@Component({
    selector: 'app-notificacoes-list',
    templateUrl: './notificacoes-list.component.html',
    styleUrls: ['./notificacoes-list.component.scss']
})
export class NotificacoesListComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    @Input() data: INotificacoes[];

    dataSource: NotificacoesListDataSource;
    selection = new SelectionModel<INotificacoes>(true, []);
    displayedColumns = ['select', 'tela', 'titulo', 'status', 'dataAtualizacao'];

    public filtroValue: IResultItem;
    public currentFilter: IResult;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private resultService: ResultService,
        private filterService: FilterService
    ) {
        resultService.filter.subscribe(f => (this.filtroValue = f));
        resultService.filterResult.subscribe(fr => (this.currentFilter = fr));

        this.selection.changed.subscribe(() => {
            resultService.changeFilterResult({
                ...this.currentFilter,
                notificacoes: this.selection.selected
            });
        });
    }

    ngOnInit() {
        this.dataSource = new NotificacoesListDataSource(
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
        $( "thead" ).attr("style", "display: none !important;");
    }

    /** Filtro Mat Table **/

    updateFiltro() {
        this.resultService.changeFilter(this.filtroValue);
    }

    updateDataSource(data: INotificacoes[]){
        this.dataSource.data = [...data];
        this.dataSource.fullData = [...data];
        this.updateFiltro();
    }

    editModelo(row: IClassificacao){
        this.router.navigate([`/classificacao-modelos/modelos-edit`], {
            relativeTo: this.route,
            replaceUrl: false,
            queryParams: {
                filterFormulario: JSON.stringify({...row})
            }
        });
    }

    getQtdNotificacoesSelecionados(){
        return this.selection.selected.length > 1 ? '' + this.selection.selected.length + ' ' + 'Notificacões selecionadas' :
               this.selection.selected.length > 0 ? '' + this.selection.selected.length + ' ' + 'Notificacão selecionada' :  ''
    }

    getVisibleData() {
        return this.dataSource.getUpdatedData();
    }

    deselectAll() {
        this.selection.clear();
        this.paginator.firstPage();
    }

    removerTodos(){
        const visibleData = this.getVisibleData();
        visibleData.forEach(row =>{
            this.removeRowCategoria(row);
        });
    }

    removeRowCategoria(row: INotificacoes) {
        if(this.selection.isSelected(row)){
            this.data.splice(this.data.indexOf(row), 1);
            this.dataSource.data = [...this.data];
            this.dataSource.fullData = [...this.data];

            this.filterService.delNotificacoesForm(row).subscribe(status => {})

            setTimeout(() => {
                this.selection.toggle(row);
                this.dataSource.getUpdatedData();
                this.updateFiltro();
            }, 500);
        }
    }
}

export interface IResult {
    notificacoes: INotificacoes[];
    data_inicio?: Date;
    data_fim?: Date;
}

export interface IResultItem {
    notificacoes: {
        tela: string,
        titulo: string,
        status: string,
        dataAtualizacao: string
    }
}