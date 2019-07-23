import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ProdutoService } from 'src/app/produtos/shared/services/produtos.service';
import { ResultServiceCategorias } from 'src/app/produtos/shared/services/categorias.result.service';
import { ICategoriasForm, IEmpresa } from 'src/app/produtos/shared/models/classificacao.legendas';
import { IResultCategorias, IResultItemCategorias } from 'src/app/produtos/shared/models/formulario.result.model';
import { EmpresaListComponent } from './categorias-list/empresa-list.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-empresa',
    templateUrl: './empresa.component.html',
    styleUrls: ['./empresa.component.scss']
})
export class EmpresaComponent implements OnInit {

    @ViewChild(EmpresaListComponent)
    childCategoriasList:EmpresaListComponent;

    empresa = {} as IEmpresa;

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
        private produtoService: ProdutoService,
        private _snackBar: MatSnackBar
    ) {
        this.empresa.importador = false
        this.empresa.exportador = false
        this.empresa.trading = false
        this.empresa.categorias = []

        this.produtoService.getEmpresaFind().subscribe(ret => {
            if(ret.length > 0){
                this.empresa = ret[0]

                if(this.empresa.categorias == undefined){
                    this.empresa.categorias = []
                }
                if(this.childCategoriasList != undefined){
                    this.childCategoriasList.updateCategorias()
                }                
            }
        },
        error => { this.errored = true; });
    }

    ngOnInit() {
        this.resultService.resetFilter();

        this.produtoService.getCategoriasForm({codigo: undefined, descricao: ''}).subscribe(categorias => {
            this.data = [...categorias]
            this.data.forEach(categoria => { categoria.disabled = true })

            this.loading = false;
        })
        this.resultService.clearFilter();
    }

    finalizarPreenchimento(){
        if(this.empresa.codigo == undefined){
            this.empresa.codigo = 0;
        }

        this.produtoService.setEmpresaUpdate(this.empresa).subscribe(ret => {

            this._snackBar.open('Dados da Empresa foram salvos!', 'Sucesso', {
                duration: 5000,
            });
        },
        error => { this.errored = true; });
    }

    setStatusEmpresa(event:any, atividade:string){
        if(atividade == 'Importador'){
            this.empresa.importador = !this.empresa.importador
        }
        if(atividade == 'Exportador'){
            this.empresa.exportador = !this.empresa.exportador
        }
        if(atividade == 'Trading'){
            this.empresa.trading = !this.empresa.trading
        }
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