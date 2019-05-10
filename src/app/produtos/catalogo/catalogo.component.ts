import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterResult } from '../shared/models/unificacao.filter.model';
import { ResultItem, Result, ResultClass } from '../shared/models/unificacao.result.model';
import { Produto } from '../shared/models/produto.model';
import { ProdutoService } from '../shared/services/produtos.service';
import { ResultService } from '../shared/services/unificacao.result.service';
import { ProdutosListComponent } from './produtos-list/produtos-list.component';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent implements OnInit {

    @ViewChild(ProdutosListComponent) 
    childProdutosList:ProdutosListComponent;

    filter: FilterResult;
    loading = true;
    errored = false;

    importers: [{}] = [{}];

    produtos: Produto[];
    data: Result = null;
    status: string[] = ['Pendente', 'Completo', 'Aprovado', 'Integrado'];
    //importers: any = [];

    @Input() current_filtro: ResultItem = {
        produto: {
            numeroDI: '',
            descricaoBruta: '',
            ncm: '',
            status: '',
            cnpj: ''
        }
    };

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private resultService: ResultService,
        private produtoService: ProdutoService
    ) {
        this.loading = false;
        this.setDadosResult();
    }

    setDadosResult(){
        this.data = new ResultClass();
        this.data.produtos = [];

        /* Mock */
        
        /*this.produtos.forEach(produto => {
            if(this.status.includes(produto.status)){
                produto.declaracoes = this.getMockDeclaracoes();
                this.data.produtos.push(produto);
            }
        })
        
        this.agruparDeclaracoes(this.data.produtos);
        this.produtos = this.data.produtos;
        this.setResumoCards();

        this.childUpdateDataSource();

        this.loading = false;*/

        /* End Mock */

        let date = new Date();

        this.produtoService.getProdutosGenerico(
            {
                cnpjRaiz: "08532602", //this.filter.importers[0],
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

    ngOnInit() { }

    childUpdateDataSource(){
        if(this.childProdutosList != undefined){
            this.childProdutosList.updateDataSource(this.data.produtos);
            //this.childProdutosList.eventTable = 1;
        }
    }

    updateFiltro() {
        this.resultService.changeFilter(this.current_filtro);
        //this.childProdutosList.eventTable = 1;
    }

    /*agruparDeclaracoes(produtos: Produto[]){

        produtos.forEach(produto =>{

            this.canalVerde = 0
            this.canalAmarelo = 0
            this.canalVermelho = 0
            this.canalCinza = 0

            produto.declaracaoNode = [];
            produto.chartCanais = [];

            if(produto.declaracoes != null && produto.declaracoes != undefined){

                produto.declaracoes.forEach(declaracao_one =>{

                    let itemExistente = false;
                    for (let item of produto.declaracaoNode){
                        if(item.cnpj == declaracao_one.importadorNumero){
                            itemExistente = true;
                        }
                    }
                    if(!itemExistente){
        
                        let declaracaoNode = {
                            name: declaracao_one.importadorNome,
                            cnpj: declaracao_one.importadorNumero,
                            toggle: true,
                            declaracoes: []
                        }

                        produto.declaracoes.forEach(declaracao_two => {
                            if(declaracao_one.importadorNumero == declaracao_two.importadorNumero){
                                declaracaoNode.declaracoes.push({
                                    numeroDI: declaracao_two.numeroDI,
                                    dataRegistro: new Date(declaracao_two.dataRegistro),
                                    numeroAdicao: declaracao_two.numeroAdicao,
                                    canal: Number(declaracao_two.canal)
                                });
                                this.calcularQtdCanais(Number(declaracao_two.canal))
                            }
                        })

                        produto.declaracaoNode.push(declaracaoNode);
                    }
                })

                produto.chartCanais = [
                    this.canalVerde,
                    this.canalAmarelo,
                    this.canalVermelho,
                    this.canalCinza
                ]

                this.getCanalDominante(produto);
            }
        });
    }*/

}