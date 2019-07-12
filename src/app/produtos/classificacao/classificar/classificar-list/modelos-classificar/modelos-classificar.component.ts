import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ProdutoService } from 'src/app/produtos/shared/services/produtos.service';
import { IResultItem, IResult } from 'src/app/produtos/shared/models/formulario.result.model';
import { ModelosClassificarListComponent } from './modelos-classificar-list/modelos-classificar-list.component';
import { IClassificacao } from 'src/app/produtos/shared/models/classificacao.model';
import { ResultService } from 'src/app/produtos/shared/services/formularios.result.service';

@Component({
    selector: 'app-modelos-classificar',
    templateUrl: './modelos-classificar.component.html',
    styleUrls: ['./modelos-classificar.component.scss']
})
export class ModelosClassificarComponent implements OnInit {

    @ViewChild(ModelosClassificarListComponent)
    childModelosClassificarList:ModelosClassificarListComponent;

    @Input() modelosClassificar: IClassificacao[] = [];

    data: IClassificacao[] = [];
    loading = true;
    errored = false;

    closeResult: boolean = false;

    filtroValue: IResultItem;
    currentFilter: IResult;

    formulario:IClassificacao = {} as IClassificacao;

    constructor(
        public activeModal: NgbActiveModal,
        private resultService: ResultService,
        private produtoService: ProdutoService
    ) { }

    ngOnInit() {
        this.resultService.resetFilter();

        this.produtoService.getClassificacaoAll().subscribe(classificacoes => {
            this.data = [...classificacoes]
            this.data.forEach(formulario => { formulario.disabled = true })

            this.loading = false;
        })
        
        this.resultService.clearFilter();
    }

    addFormulario(){
        if(this.childModelosClassificarList != undefined){
            this.childModelosClassificarList.filtroValue.formulario = {} as IClassificacao
            this.childModelosClassificarList.filtroValue.formulario.disabled = true;
            this.childModelosClassificarList.updateFiltro();
        }
    }

    findFormulario(){
        if(this.childModelosClassificarList != undefined){
            this.childModelosClassificarList.filtroValue.formulario = {} as IClassificacao
            this.childModelosClassificarList.updateFiltro();
        }
    }

    findFormularioList(){
        if(this.childModelosClassificarList != undefined){
            this.childModelosClassificarList.filtroValue.formulario = this.formulario
            this.childModelosClassificarList.updateFiltro();
        }
    }

    selecionarFormulario(){
        let modelosClassificar = []
        if(this.childModelosClassificarList != undefined){
            const visibleData = this.childModelosClassificarList.getVisibleData();
            visibleData.forEach(row => {
                if(this.childModelosClassificarList.selection.isSelected(row)){
                    modelosClassificar.push(row)
                }
            })
            this.activeModal.close(modelosClassificar)
        }
    }
}