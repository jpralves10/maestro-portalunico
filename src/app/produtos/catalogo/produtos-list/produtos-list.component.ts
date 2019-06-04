import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { Produto } from '../../shared/models/produto.model';
import { ProdutoService } from '../../shared/services/produtos.service';
import { ProdutosListDataSource } from './produtos-list-datasource';
import { IResultItem } from '../../shared/models/unificacao.result.model';
import { IResult } from '../../shared/models/unificacao.result.model';
import { ResultService } from '../../shared/services/unificacao.result.service';
import { FilterResult } from '../../../shared/filter/filter.model';

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

    produtosAprovados: Produto[] = [];
    statusOld: string[];
    errored = false;

    dataSource: ProdutosListDataSource;
    selection = new SelectionModel<Produto>(true, []);
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

    editRowProduto(row: Produto){
        this.router.navigate([`/catalogo/catalogo-edit`], {
            relativeTo: this.route,
            replaceUrl: false,
            queryParams: {
                filterCatalogo: JSON.stringify({...row})
            }
        });
    }

    aprovarTodos(){
        const visibleData = this.getVisibleData();
        visibleData.forEach(row =>{
            if(row.status != 'Aprovado'){
                this.aprovarProduto(row);
            }
        });
        this.salvarAprovados();
    }

    aprovarProduto(row: Produto) {
        if(this.selection.isSelected(row)){
            row.status = 'Aprovado';

            this.produtosAprovados.push(row);

            setTimeout(() => {
                this.dataSource.getUpdatedData();
                this.updateFiltro();
            }, 500);
        }        
    }

    salvarAprovados(){
        this.produtosAprovados.forEach(produto => {
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
        this.produtosAprovados = [];
    }
}