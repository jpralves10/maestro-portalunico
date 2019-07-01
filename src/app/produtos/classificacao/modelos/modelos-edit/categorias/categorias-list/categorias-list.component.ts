import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ICategoriasForm } from 'src/app/produtos/shared/models/classificacao.legendas';
import { IResultItemCategorias, IResultCategorias } from 'src/app/produtos/shared/models/formulario.result.model';
import { ResultServiceCategorias } from 'src/app/produtos/shared/services/categorias.result.service';
import { CategoriasListDataSource } from './categorias-list-datasource';
import { ProdutoService } from 'src/app/produtos/shared/services/produtos.service';

@Component({
    selector: 'app-categorias-list',
    templateUrl: './categorias-list.component.html',
    styleUrls: ['./categorias-list.component.scss']
})
export class CategoriasListComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    @Input() data: ICategoriasForm[];
    @Input() categoriasModelos: ICategoriasForm[];

    dataSource: CategoriasListDataSource;
    selection = new SelectionModel<ICategoriasForm>(true, []);
    categoriasColumns: string[] = ['select', 'descricao', 'operacao'];

    filtroValue: IResultItemCategorias;
    currentFilter: IResultCategorias;

    constructor(
        private resultService: ResultServiceCategorias,
        private produtoService: ProdutoService
    ) {
        resultService.filter.subscribe(f => (this.filtroValue = f));
        resultService.filterResult.subscribe(fr => (this.currentFilter = fr));

        this.selection.changed.subscribe(() => {
            resultService.changeFilterResult({
                ...this.currentFilter,
                categorias: this.selection.selected
            });
        });
    }

    ngOnInit() {
        this.dataSource = new CategoriasListDataSource(
            this.paginator,
            this.sort,
            this.resultService,
            this.data
        );

        this.data.forEach(categoria => {
            this.categoriasModelos.forEach(mdCategoria => {
                if(categoria.codigo == mdCategoria.codigo){
                    this.selection.select(categoria);
                    categoria.disabled = false;
                }
            })
        })

        this.dataSource.data = [...this.data]
        this.dataSource.fullData = [...this.data]
        this.updateFiltro();
    }

    ngAfterViewInit() {
        this.resultService.whenUpdatedSource.next([
            ...this.resultService.whenUpdated,
            this.paginator
        ]);
    }

    masterToggle() {
        const visibleData = this.getVisibleData();
        const allSelected = this.isAllSelected();

        this.habilitarOperacao(visibleData, allSelected);

        if (allSelected) {
            this.selection.deselect(...visibleData);
        } else {
            this.selection.select(...visibleData);
        }
        return;
    }

    habilitarOperacao(visibleData: any, allSelected: boolean){
        if(Array.isArray(visibleData)){
            allSelected ? 
            visibleData.forEach(data => { data.disabled = true }) : 
            visibleData.forEach(data => { data.disabled = false })            
        }else{
            visibleData.disabled = !visibleData.disabled
        }
    }

    updateDataSource(data: ICategoriasForm[]){
        this.dataSource.data = [...data];
        this.dataSource.fullData = [...data];
        this.updateFiltro();
    }

    updateFiltro() {
        this.resultService.changeFilter(this.filtroValue);
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

    removerTodos(){
        const visibleData = this.getVisibleData();
        visibleData.forEach(row =>{
            this.removeRowCategoria(row);
        });
    }
    
    removeRowCategoria(row: ICategoriasForm) {
        if(this.selection.isSelected(row)){
            this.data.splice(this.data.indexOf(row), 1);
            this.dataSource.data = [...this.data];
            this.dataSource.fullData = [...this.data];

            this.produtoService.delCategoriasForm(row).subscribe(status => {})

            setTimeout(() => {
                this.selection.toggle(row);
                this.dataSource.getUpdatedData();
                this.updateFiltro();
            }, 500);
        }
    }

    clearCheckbox(){
        this.selection.clear();
    }

    getQtdCategoriasSelecionados(){
        return this.selection.selected.length > 1 ? '' + this.selection.selected.length + ' ' + 'categorias selecionadas' :
               this.selection.selected.length > 0 ? '' + this.selection.selected.length + ' ' + 'categoria selecionada' :  ''
    }
}