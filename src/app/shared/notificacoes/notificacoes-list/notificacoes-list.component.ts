import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificacoesListDataSource } from './notificacoes-list-datasource';
import { SelectionModel } from '@angular/cdk/collections';
import { ProdutoService } from 'src/app/produtos/shared/services/produtos.service';
import { IClassificacao } from 'src/app/produtos/shared/models/classificacao.model';
import { ResultService } from '../../service/notificacoes.result.service';
import { INotificacoes } from '../notificacoes.model';

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