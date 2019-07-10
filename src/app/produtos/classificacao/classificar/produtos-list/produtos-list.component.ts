import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { Produto, IProduto } from '../../../shared/models/produto.model';
import { ProdutoService } from '../../../shared/services/produtos.service';
import { ProdutosListDataSource } from './produtos-list-datasource';
import { IClassificar } from 'src/app/produtos/shared/models/classificar.model';
import { ResultService } from 'src/app/produtos/shared/services/classificar.result.service';

@Component({
    selector: 'app-produtos-list',
    templateUrl: './produtos-list.component.html',
    styleUrls: ['./produtos-list.component.scss']
})
export class ProdutosListComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    @Input() data: IClassificar[];

    errored = false;

    dataSource: ProdutosListDataSource;
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
        this.dataSource = new ProdutosListDataSource(
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

    updateDataSource(data: IClassificar[]){
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
            ds => !this.selection.selected.some(s => s.titulo === ds.titulo)
        );
    }

    deselectAll() {
        this.selection.clear();
        this.paginator.firstPage();
    }

    masterToggle() {
        const visibleData = this.getVisibleData();
        const allSelected = this.isAllSelected();

        if (allSelected) {
            this.selection.deselect(...visibleData);
        } else {
            this.selection.select(...visibleData);
        }
        return;
    }

    editRowProduto(row: IClassificar){
        this.router.navigate([`/catalogo/catalogo-edit`], {
            relativeTo: this.route,
            replaceUrl: false,
            queryParams: {
                filterCatalogo: JSON.stringify({...row})
            }
        });
    }

    aprovarTodos(){
        /*const visibleData = this.getVisibleData();
        visibleData.forEach(row =>{
            if(row.status != 'Aprovado'){
                this.aprovarProduto(row);
            }
        });
        this.salvarAprovados();*/
    }

    aprovarProduto(row: IClassificar) {
        if(this.selection.isSelected(row)){
            row.status = 'Aprovado';

            //this.produtosAprovados.push(row);

            setTimeout(() => {
                this.dataSource.getUpdatedData();
                this.updateFiltro();
            }, 500);
        }        
    }

    salvarAprovados(){
        /*this.produtosAprovados.forEach(produto => {
            produto.dataAtualizacao = new Date();
            produto.versoesProduto = undefined;
            produto.etapaUnificacao = undefined;
            produto.compatibilidade = undefined;
            produto.declaracaoNode = undefined;
            produto.declaracoes = undefined;
            produto.chartCanais = undefined;
            produto.canalDominante = undefined;
            produto.quantidade = undefined;

            if(produto.atributos.length <= 0){
                produto.atributos = undefined;
            }
    
            this.produtoService
                .setAlterarProdutos(produto)
                .subscribe(versoes => {}, error => { this.errored = true;});
        })
        this.produtosAprovados = [];*/
    }

    getQtdClassificarListSelecionados(){
        return this.selection.selected.length > 1 ? '' + this.selection.selected.length + ' ' + 'categorias selecionadas' :
               this.selection.selected.length > 0 ? '' + this.selection.selected.length + ' ' + 'categoria selecionada' :  ''
    }
}

export interface IResult {
    classificar: IClassificar[];
    data_inicio?: Date;
    data_fim?: Date;
}

export interface IResultItem {
    classificar: {
        titulo: string;
        status: string;
        dataAtualizacao: string;
        produto: IProduto;
    }
}