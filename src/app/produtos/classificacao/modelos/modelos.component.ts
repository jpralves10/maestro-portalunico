import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProdutoService } from '../../shared/services/produtos.service';
import { IClassificacao } from '../../shared/models/classificacao.model';
import { ModelosListComponent } from './modelos-list/modelos-list.component';
import { SpreadsheetsLinkComponent } from './modelos-edit/spreadsheets-link/spreadsheets-link.component';
import { ResultService } from '../../shared/services/formularios.result.service';
import { IResultItem } from '../../shared/models/formulario.result.model';

@Component({
    selector: 'app-modelos',
    templateUrl: './modelos.component.html',
    styleUrls: ['./modelos.component.scss']
})
export class ModelosComponent implements OnInit {

    @ViewChild(ModelosListComponent) 
    childModelosList:ModelosListComponent;

    loading = true;
    errored = false;

    formulario = {} as IClassificacao;
    data: IClassificacao[] = [];

    current_filtro: IResultItem = {
        formulario: {
            spreadsheetId: '',
            idSheet: '',
            titulo: '',
            status: '',
            dataAtualizacao: ''
        }
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private resultService: ResultService,
        private produtoService: ProdutoService,
        private modalService: NgbModal
    ) {
        this.route.queryParamMap.subscribe(paramMap => {
            if(this.childModelosList != undefined){
                this.data.push(JSON.parse(paramMap.get('paramsFormulario')));
                this.childModelosList.updateDataSource(this.data);
            }            
        });

        this.produtoService.getClassificacaoAll().subscribe(classificacoes => {
            this.data = [...classificacoes]

            this.data.forEach(item => {
                item.dataAtualizacao = new Date(item.dataAtualizacao)
                item.dataCriacao = new Date(item.dataCriacao)
            })
            
            if(this.childModelosList != undefined){
                this.childModelosList.updateDataSource(this.data);
            }
            this.loading = false;
        })
    }

    ngOnInit() {}

    adicionarProduto(){
        const modalLink = this.modalService.open(SpreadsheetsLinkComponent, {size: '900', centered: true});
        modalLink.componentInstance.linkSpreadsheets = '';

        modalLink.result.then((link:string) => {

            let itensLink:string[] = link.split('/');
            let formulario = {} as IClassificacao

            if(link != ''){
                formulario.spreadsheetId = itensLink[5];
                formulario.idSheet = parseInt(itensLink[6].split('edit#gid=')[1], 10);
                formulario.spreadsheetIdDisabled = true
                formulario.idSheetDisabled = true
            }else{
                formulario.spreadsheetId = null;
                formulario.idSheet = null;
                formulario.spreadsheetIdDisabled = false
                formulario.idSheetDisabled = false
            }
            
            formulario._id = null;
            formulario.titulo = '';
            formulario.status = 'Novo';
    
            formulario.dataCriacao = new Date();
            formulario.dataAtualizacao = new Date();
    
            this.router.navigate([`/classificacao-modelos/modelos-edit`], {
                relativeTo: this.route,
                replaceUrl: false,
                queryParams: {
                    filterFormulario: JSON.stringify({...formulario})
                }
            });

        }, (reason) => {});
    }

    updateFiltro() {
        this.resultService.changeFilter(this.current_filtro);
    }
}
