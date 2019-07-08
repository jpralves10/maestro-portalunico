import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ProdutosListComponent } from '../../unificacao/produtos-list/produtos-list.component';
import { IResultItem, ResultClass, IResult } from '../../shared/models/unificacao.result.model';
import { IFilterResult } from 'src/app/shared/filter/filter.model';
import { Produto } from '../../shared/models/produto.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ProdutoService } from '../../shared/services/produtos.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResultService } from '../../shared/services/unificacao.result.service';

@Component({
  selector: 'app-classificar',
  templateUrl: './classificar.component.html',
  styleUrls: ['./classificar.component.scss']
})
export class ClassificarComponent implements OnInit {

    @ViewChild(ProdutosListComponent) 
    childProdutosList:ProdutosListComponent;

    filter: IFilterResult;
    loading = true;
    errored = false;

    produtos: Produto[];
    data: IResult = null;
    status: string[] = ['Pendente', 'Completo', 'Aprovado', 'Integrado'];

    @Input() current_filtro: IResultItem = {
        produto: {
            numeroDI: '',
            descricaoBruta: '',
            ncm: '',
            status: '',
            cnpj: '',
            operador: ''
        }
    };

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private resultService: ResultService,
        private produtoService: ProdutoService,
        private modalService: NgbModal
    ) {
        this.loading = false;

        
    }

    ngOnInit() {}

    setDadosResult(){
        this.data = new ResultClass();
        this.data.produtos = [];

        let date = new Date();

        this.produtoService.getProdutosGenerico(
            {
                cnpjRaiz: this.filter.importers[0],
                status: this.status,
                dataInicial: new Date(date.setMonth(date.getMonth() - 12)),
                dataFinal: new Date()
            }
        ).subscribe(adicoes => {
            this.data.produtos = (adicoes as any).produtos;

            this.data.produtos.forEach(produto => {
                produto.dataRegistro = new Date(produto.dataRegistro);
                produto.dataCriacao = new Date(produto.dataCriacao);

                if(produto.declaracoes == null || produto.declaracoes == undefined){
                    produto.declaracoes = [];
                }

                produto.declaracoes.forEach(declaracao => {
                    declaracao.dataRegistro = new Date(declaracao.dataRegistro);
                });

                produto.canalDominante = 0;
            });

            //this.agruparDeclaracoes(this.data.produtos);
            this.produtos = this.data.produtos;
            this.childUpdateDataSource();
            this.loading = false;
        },
        error => { this.errored = true; })
    }

    childUpdateDataSource(){
        if(this.childProdutosList != undefined){
            this.childProdutosList.updateDataSource(this.data.produtos);
            //this.childProdutosList.eventTable = 1;
        }
    }

    updateFiltro() {
        this.resultService.changeFilter(this.current_filtro);
    }
}