import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ICategoriasForm, IEmpresa } from 'src/app/produtos/shared/models/classificacao.legendas';
import { IResultItemCategorias, IResultCategorias } from 'src/app/produtos/shared/models/formulario.result.model';
import { ResultServiceCategorias } from 'src/app/produtos/shared/services/categorias.result.service';
import { EmpresaListDataSource } from './empresa-list-datasource';
import { ProdutoService } from 'src/app/produtos/shared/services/produtos.service';

@Component({
    selector: 'app-empresa-list',
    templateUrl: './empresa-list.component.html',
    styleUrls: ['./empresa-list.component.scss']
})
export class EmpresaListComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    @Input() data: ICategoriasForm[];
    @Input() empresa: IEmpresa;

    dataSource: EmpresaListDataSource;
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
        this.dataSource = new EmpresaListDataSource(
            this.paginator,
            this.sort,
            this.resultService,
            this.data
        );

        this.updateCategorias()

        this.dataSource.data = [...this.data]
        this.dataSource.fullData = [...this.data]
        this.updateFiltro();
    }

    updateCategorias(){
        if(this.empresa.categorias != undefined){
            this.data.forEach(categoria => {
                this.empresa.categorias.forEach(mdCategoria => {
                    if(categoria._id == mdCategoria._id){
                        this.selection.select(categoria);
                        categoria.disabled = false;
                    }
                })
            })
        }
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

            if(allSelected){
                visibleData.forEach(data => { data.disabled = true })
                this.empresa.categorias = []
            }else{
                visibleData.forEach(data => { data.disabled = false })
                this.empresa.categorias = [...visibleData]
            }
        }else{
            visibleData.disabled = !visibleData.disabled
            if(visibleData.disabled){
                this.empresa.categorias.splice(this.empresa.categorias.indexOf(visibleData), 1);
            }else{
                this.empresa.categorias.push(visibleData)
            }
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