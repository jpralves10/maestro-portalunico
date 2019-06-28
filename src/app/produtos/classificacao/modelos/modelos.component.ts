import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProdutoService } from '../../shared/services/produtos.service';
import { ResultService } from '../../shared/services/unificacao.result.service';
import { IResult } from '../../shared/models/formulario.result.model';
import { IClassificacao } from '../../shared/models/classificacao.model';
import { ModelosListComponent } from './modelos-list/modelos-list.component';

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

    current_filtro: {} = {
        formulario: {
            spreadsheetId: '',
            idSheet: '',
            titulo: '',
            status: ''
        }
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private resultService: ResultService,
        private produtoService: ProdutoService,
        private modalService: NgbModal
    ) {
        this.loading = false

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
        let formulario = {} as IClassificacao;
        formulario._id = null;
        formulario.spreadsheetId = null;
        formulario.idSheet = null;
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
    }
}
