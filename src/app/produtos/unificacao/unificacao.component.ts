import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFilterResult } from '../../shared/filter/filter.model';
import { Produto } from '../shared/models/produto.model';
import { IDeclaracao } from '../shared/models/produto.legendas';
import { IResult, IResultItem, ResultClass } from '../shared/models/unificacao.result.model';
import { IResumo } from '../shared/models/produto.legendas';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProdutoService } from '../shared/services/produtos.service';
import { ResultService } from '../shared/services/unificacao.result.service';
import { ProdutosListComponent } from './produtos-list/produtos-list.component';
import { FilterComponent } from '../../shared/filter/filter.component';

import $ from "jquery";

@Component({
    selector: 'app-unificacao',
    templateUrl: './unificacao.component.html',
    styleUrls: ['./unificacao.component.scss']
})
export class UnificacaoComponent implements OnInit {

    @ViewChild(ProdutosListComponent) 
    childProdutosList:ProdutosListComponent;

    filter: IFilterResult = null;
    loading = true;
    errored = false;

    produtos: Produto[];
    data: IResult = null;
    status: string[] = [];
    importers: any = [];

    canalVerde: number = 0;
    canalAmarelo: number = 0;
    canalVermelho: number = 0;
    canalCinza: number = 0;

    date = new Date();
    start_date = new Date(this.date.setMonth(this.date.getMonth() - 12));

    resumo: IResumo = {
        periodoInicial: this.start_date, 
        periodoFinal: new Date(), 
        importadores: [{}], 
        qtdDeclaracoes: 0, 
        qtdItens: 0, 
        qtdItensCadastrados: 0
    };

    @Input() current_filtro: IResultItem = {
        produto: {
            numeroDI: '',
            descricaoBruta: '',
            ncm: '',
            status: '',
            cnpj: '',
            operador: '',
            codigoGPC:'',
            codigoGPCBrick:'',
            codigoUNSPSC:''
        }
    };

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private produtoService: ProdutoService,
        private resultService: ResultService,
        private modalService: NgbModal
    ) {
        this.getFilterResult();
        //this.loading = false;

        if(this.filter != null && this.filter.importers.length > 0){
            this.setDadosInit();
        } else {
            this.openDialogFilter();
        }
        this.resultService.clearFilter();
    }

    ngOnInit() { }

    ngAfterViewInit() { }

    openDialogFilter(): void {
        this.modalService.open(FilterComponent, {size: '900', centered: true}).result.then((result) => {}, (reason) => {
            this.getFilterResult();
            this.setDadosInit();
        });
    }

    getFilterResult(){
        this.filter = JSON.parse(window.sessionStorage.getItem('result'));
    }

    setDadosInit(){
        if(this.filter != null){
            this.status = ['Pendente', 'Completo', 'Aprovado', 'Integrado']; //this.filter.status;
            this.importers = [...this.filter.importadores];
            this.setDadosResult();
        }
    }

    setDadosResult(){
        this.data = new ResultClass();
        this.data.produtos = [];

        this.produtoService.getProdutosGenerico(
            {
                cnpjRaiz: this.filter.importers[0],
                status: this.status,
                dataInicial: this.filter.start_date,
                dataFinal: this.filter.end_date
            }
        ).subscribe(adicoes => {
            this.data.produtos = (adicoes as any).produtos;

            this.data.produtos.forEach(produto => {
                produto.dataRegistro = new Date(produto.dataRegistro);
                produto.dataCriacao = new Date(produto.dataCriacao);

                if(produto.fabricanteNome == undefined || produto.fabricanteNome == null){
                    produto.fabricanteNome = '';
                }
                if(produto.fornecedorNome == undefined || produto.fornecedorNome == null){
                    produto.fornecedorNome = '';
                }
                if(produto.declaracoes == null || produto.declaracoes == undefined){
                    produto.declaracoes = [];
                }

                produto.declaracoes.forEach(declaracao => {
                    declaracao.dataRegistro = new Date(declaracao.dataRegistro);
                });

                produto.canalDominante = 0;
            });

            this.agruparDeclaracoes(this.data.produtos);
            this.produtos = this.data.produtos;
            this.setResumoCards();
            this.childUpdateDataSource();

            this.loading = false;
        },
        error => { this.errored = true; })
    }

    childUpdateDataSource(){
        if(this.childProdutosList != undefined){
            this.data.produtos = this.produtos.filter(item =>
                item.status.includes('Pendente')
            )
            this.childProdutosList.updateDataSource(this.data.produtos);
            this.childProdutosList.eventTable = 1;
        }
    }

    updateFiltro() {
        this.resultService.changeFilter(this.current_filtro);
        this.childProdutosList.eventTable = 1;
    }

    setResumoCards(){
        this.resumo.periodoInicial = new Date(this.filter.start_date);
        this.resumo.periodoFinal = new Date(this.filter.end_date);
        this.resumo.importadores = this.filter.importadores;
        this.resumo.qtdDeclaracoes = this.getQtdDeclaracoes();
        this.resumo.qtdItens = this.getQtdItens(true);
        this.resumo.qtdItensCadastrados = this.getQtdItens(false);
    }

    getQtdDeclaracoes(): number{
        let setDeclaracoes = new Set();
        this.produtos.forEach(produto => {
            setDeclaracoes.add(produto.numeroDI);
        });
        return setDeclaracoes.size
    }

    getQtdItens(total: boolean): number{
        let statusTotal = ['Pendente', 'Completo', 'Aprovado', 'Integrado'];
        let statusCadastrados = ['Completo', 'Aprovado', 'Integrado'];
        let countItens: number = 0;
        
        for(let produto of this.produtos){
            if(total && statusTotal.includes(produto.status)){
                countItens++;
            }
            if(!total && statusCadastrados.includes(produto.status)){
                countItens++;
            }
        }
        return countItens;
    }

    setStatusFiltro(event: any, status: string){
        if(event.checked){
            this.status.push(status)
            this.setDadosResult();
        }
        if(!event.checked){
            this.status.splice(this.status.indexOf(status), 1);
            this.setDadosResult();
        }
    }

    setCheckedImporter(event: any, importer: any){
        importer.checked = !importer.checked;

        if(importer.checked){
            this.filter.importadores.push(importer);
        }else{
            this.filter.importadores.splice(this.filter.importadores.indexOf(importer), 1);
        }
        
        this.childUpdateDataSource();
    }

    agruparDeclaracoes(produtos: Produto[]){

        produtos.forEach(produto =>{

            this.canalVerde = 0
            this.canalAmarelo = 0
            this.canalVermelho = 0
            this.canalCinza = 0

            produto.declaracaoNode = [];
            produto.chartCanais = [];
            produto.quantidade = 0;

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

                        produto.quantidade = declaracaoNode.declaracoes.length;
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
    }

    getCanalDominante(produto: Produto){
        produto.chartCanais.forEach((canal1, index) => {
            produto.chartCanais.forEach(canal2 => {
                if(canal1 > canal2){
                    produto.canalDominante = index;
                }
            })
        })
    }

    calcularQtdCanais(canal: number){
        canal == 1 ? this.canalVerde++ : 
        canal == 2 ? this.canalAmarelo++ :
        canal == 3 ? this.canalVermelho++ :
        canal == 4 ? this.canalCinza++ : null;
    }

    //https://jtblin.github.io/angular-chart.js/
    //https://www.jqwidgets.com/angular/angular-chart/#https://www.jqwidgets.com/angular/angular-chart/angular-chart-donutlabels.htm
}