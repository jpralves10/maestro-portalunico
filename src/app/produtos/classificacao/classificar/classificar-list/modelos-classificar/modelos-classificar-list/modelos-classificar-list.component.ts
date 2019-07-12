import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { IResult, IResultItem } from 'src/app/produtos/shared/models/formulario.result.model';
import { ModelosClassificarListDataSource } from './modelos-classificar-list-datasource';
import { ProdutoService } from 'src/app/produtos/shared/services/produtos.service';
import { IClassificacao } from 'src/app/produtos/shared/models/classificacao.model';
import { ResultService } from 'src/app/produtos/shared/services/formularios.result.service';

@Component({
    selector: 'app-modelos-classificar-list',
    templateUrl: './modelos-classificar-list.component.html',
    styleUrls: ['./modelos-classificar-list.component.scss']
})
export class ModelosClassificarListComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    @Input() data: IClassificacao[];
    @Input() modelosClassificar: IClassificacao[];

    dataSource: ModelosClassificarListDataSource;
    selection = new SelectionModel<IClassificacao>(true, []);
    modelosClassificarColumns: string[] = ['select', 'titulo'];

    filtroValue: IResultItem;
    currentFilter: IResult;

    constructor(
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
        this.dataSource = new ModelosClassificarListDataSource(
            this.paginator,
            this.sort,
            this.resultService,
            this.data
        );

        this.data.forEach(formulario => {
            this.modelosClassificar.forEach(mdFormulario => {
                if(formulario._id == mdFormulario._id){
                    this.selection.select(formulario);
                    formulario.disabled = false;
                }
            })
        })

        this.updateDataSource(this.data)
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

    updateDataSource(data: IClassificacao[]){
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
            ds => !this.selection.selected.some(s => s.titulo === ds.titulo)
        );
    }

    deselectAll() {
        this.selection.clear();
        this.paginator.firstPage();
    }

    clearCheckbox(){
        this.selection.clear();
    }

    getQtdModelosClassificarSelecionados(){
        return this.selection.selected.length > 1 ? '' + this.selection.selected.length + ' ' + 'formulários selecionados' :
               this.selection.selected.length > 0 ? '' + this.selection.selected.length + ' ' + 'formulário selecionado' :  ''
    }
}