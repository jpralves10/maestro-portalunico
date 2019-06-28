import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ProdutoService } from 'src/app/produtos/shared/services/produtos.service';
import { ResultServiceCategorias } from 'src/app/produtos/shared/services/categorias.result.service';
import { ICategoriasForm } from 'src/app/produtos/shared/models/classificacao.legendas';
import { IResultCategorias, IResultItemCategorias } from 'src/app/produtos/shared/models/formulario.result.model';
import { CategoriasListComponent } from './categorias-list/categorias-list.component';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'app-categorias',
    templateUrl: './categorias.component.html',
    styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit {

    @ViewChild(CategoriasListComponent)
    childCategoriasList:CategoriasListComponent;

    @Input() categoriasModelos: ICategoriasForm[];

    data: ICategoriasForm[] = [];
    loading = true;
    errored = false;

    closeResult: boolean = false;
    flAddCategoria = false;
    flFindCategoria = false;

    filtroValue: IResultItemCategorias;
    currentFilter: IResultCategorias;

    categorias: ICategoriasForm[] = [];
    categoria:ICategoriasForm = {} as ICategoriasForm;

    constructor(
        public activeModal: NgbActiveModal,
        private resultService: ResultServiceCategorias,
        private produtoService: ProdutoService
    ) { }

    ngOnInit() {
        this.resultService.resetFilter();

        this.produtoService.getCategoriasForm({codigo: undefined, descricao: ''}).subscribe(categorias => {
            this.data = [...categorias]
            this.data.forEach(categoria => { categoria.disabled = true })

            this.loading = false;
        })
        this.resultService.clearFilter();
    }

    addCategoria(){
        this.flFindCategoria = false;
        if(this.childCategoriasList != undefined){
            this.childCategoriasList.filtroValue.categoria = {} as ICategoriasForm
            this.childCategoriasList.filtroValue.categoria.disabled = true;
            this.childCategoriasList.updateFiltro();
        }
        setTimeout(() => { this.flAddCategoria = true; }, 200)
    }

    findCategoria(){
        this.flAddCategoria = false;
        if(this.childCategoriasList != undefined){
            this.childCategoriasList.filtroValue.categoria = {} as ICategoriasForm
            this.childCategoriasList.updateFiltro();
        }
        setTimeout(() => { this.flFindCategoria = true; }, 200)
    }

    addCategoriaList(){
        this.categoria.disabled = true;
        this.data.push(this.categoria)
        if(this.childCategoriasList != undefined){
            this.childCategoriasList.updateDataSource(this.data);
            
            this.produtoService.setCategoriasForm(this.categoria).subscribe(status => {});
        }
        this.categoria = {} as ICategoriasForm;
    }

    findCategoriaList(){
        if(this.childCategoriasList != undefined){
            this.childCategoriasList.filtroValue.categoria = this.categoria
            this.childCategoriasList.updateFiltro();
        }
    }

    selecionarCategoria(){
        let categorias = []
        if(this.childCategoriasList != undefined){
            const visibleData = this.childCategoriasList.getVisibleData();
            visibleData.forEach(row => {
                if(this.childCategoriasList.selection.isSelected(row)){
                    categorias.push(row)
                }
            })
            this.activeModal.close(categorias)
        }
    }
}