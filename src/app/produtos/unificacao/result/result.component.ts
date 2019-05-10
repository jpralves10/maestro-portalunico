import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterResult } from '../../shared/models/unificacao.filter.model';
import { Produto } from '../../shared/models/produto.model';
import { Declaracao } from '../../shared/models/legendas.model';
import { Result, ResultItem, ResultClass } from '../../shared/models/unificacao.result.model';
import { Resumo } from '../../shared/models/legendas.model';

import { ProdutoService } from '../../shared/services/produtos.service';
import { ResultService } from '../../shared/services/unificacao.result.service';

import { ProdutosListComponent } from './produtos-list/produtos-list.component';

@Component({
    selector: 'app-result',
    templateUrl: './result.component.html',
    styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

    @ViewChild(ProdutosListComponent) 
    childProdutosList:ProdutosListComponent;

    filter: FilterResult;
    loading = true;
    errored = false;

    produtos: Produto[];
    data: Result = null;
    status: string[] = [];
    importers: any = [];

    canalVerde: number = 0;
    canalAmarelo: number = 0;
    canalVermelho: number = 0;
    canalCinza: number = 0;

    date = new Date();
    start_date = new Date(this.date.setMonth(this.date.getMonth() - 12));
    
    resumo: Resumo = {
        periodoInicial: this.start_date, 
        periodoFinal: new Date(), 
        importadores: [{}], 
        qtdDeclaracoes: 0, 
        qtdItens: 0, 
        qtdItensCadastrados: 0
    };

    @Input() current_filtro: ResultItem = {
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
        private produtoService: ProdutoService,
        private resultService: ResultService
    ) {
        this.route.queryParamMap.subscribe(paramMap => {
            this.filter = JSON.parse(paramMap.get('filter'));
            this.status = this.filter.status;
            
            this.importers = [...this.filter.importadores];

            //this.produtos = this.getMockDados();
            this.loading = false;
            this.setDadosResult();
        });

        this.resultService.clearFilter();
    }

    ngOnInit() { }

    ngAfterViewInit() { }

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
                    produto.fabricanteNome = ''
                }
                if(produto.fornecedorNome == undefined || produto.fornecedorNome == null){
                    produto.fornecedorNome = ''
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
        this.canalCinza++
    }

    //https://jtblin.github.io/angular-chart.js/
    //https://www.jqwidgets.com/angular/angular-chart/#https://www.jqwidgets.com/angular/angular-chart/angular-chart-donutlabels.htm

    /** Mock Dados **/

    getMockDeclaracoes(): Declaracao[]{
        return [
            {
                importadorNome: 'RENAULT DO BRASIL S.A',
                importadorNumero: '00913443000173',
                numeroDI: '12345678',
                dataRegistro: new Date("2019-04-03T00:00:00.000Z"),
                numeroAdicao: '001',
                canal: '002'
            },
            {
                importadorNome: 'RENAULT DO BRASIL S.A',
                importadorNumero: '00913443000173',
                numeroDI: '32145678',
                dataRegistro: new Date("2019-04-03T00:00:00.000Z"),
                numeroAdicao: '001',
                canal: '002'
            },
            {
                importadorNome: 'RENAULT DO BRASIL S.A',
                importadorNumero: '00913443000173',
                numeroDI: '87945678',
                dataRegistro: new Date("2019-04-03T00:00:00.000Z"),
                numeroAdicao: '001',
                canal: '001'
            },
            {
                importadorNome: 'RENAULT DO BRASIL S.A',
                importadorNumero: '00913443000173',
                numeroDI: '56445678',
                dataRegistro: new Date("2019-04-03T00:00:00.000Z"),
                numeroAdicao: '001',
                canal: '004'
            },
            {
                importadorNome: 'CHEVROLET DO BRASIL S.A',
                importadorNumero: '33313443000173',
                numeroDI: '87945678',
                dataRegistro: new Date("2019-04-03T00:00:00.000Z"),
                numeroAdicao: '001',
                canal: '003'
            },
            {
                importadorNome: 'CHEVROLET DO BRASIL S.A',
                importadorNumero: '33313443000173',
                numeroDI: '56445678',
                dataRegistro: new Date("2019-04-03T00:00:00.000Z"),
                numeroAdicao: '001',
                canal: '004'
            },
            {
                importadorNome: 'WOLKSWAGEN DA ALEMANHA S.A',
                importadorNumero: '44413443000173',
                numeroDI: '87945678',
                dataRegistro: new Date("2019-04-03T00:00:00.000Z"),
                numeroAdicao: '001',
                canal: '001'
            },
            {
                importadorNome: 'WOLKSWAGEN DA ALEMANHA S.A',
                importadorNumero: '44413443000173',
                numeroDI: '56445678',
                dataRegistro: new Date("2019-04-03T00:00:00.000Z"),
                numeroAdicao: '001',
                canal: '003'
            },
            {
                importadorNome: 'WOLKSWAGEN DA ALEMANHA S.A',
                importadorNumero: '44413443000173',
                numeroDI: '87945678',
                dataRegistro: new Date("2019-04-03T00:00:00.000Z"),
                numeroAdicao: '001',
                canal: '001'
            },
            {
                importadorNome: 'WOLKSWAGEN DA ALEMANHA S.A',
                importadorNumero: '44413443000173',
                numeroDI: '56445678',
                dataRegistro: new Date("2019-04-03T00:00:00.000Z"),
                numeroAdicao: '001',
                canal: '003'
            }
        ]
    }

    getMockDados(): Produto[]{

        /*
        Pendente
        Completo
        Inativo
        Aprovado
        Integrado
        */

        var produto: Produto = {
            _id: null,
            seq: "001",
            codigo: null,
            numeroDI: "01234567891",
            dataRegistro: new Date("2019-04-03T00:00:00.000Z"),
            status: "Pendente",
            etapaUnificacao: 0,
            descricaoBruta: "410102469R PINCA DO FREIO DIANTEIRO PARA VEICULO AUTOMOVEL",
            descricao: "",
            cnpjRaiz: "00913443000173",
            situacao: null, //"ATIVADO",
            modalidade: undefined, //"IMPORTACAO",
            ncm: "77083999",
            codigoNaladi: null,
            codigoGPC: null,
            codigoGPCBrick: null,
            codigoUNSPSC: null,
            paisOrigem: "FR",
            fabricanteConhecido: false,
            cpfCnpjFabricante: null,
            codigoOperadorEstrangeiro: null,
            atributos: null,
            codigosInterno: null,
            dataCriacao: null,
            dataAtualizacao: null,
            usuarioAtualizacao: null,
            declaracoes: [],
            versoesProduto: [],
            compatibilidade: null,
            declaracaoNode: [],
            chartCanais: []  ,
            canalDominante: 0,
            importadorNome: '',
            importadorNumero: '08532602000100',
            fornecedorNome: '',
            fabricanteNome: ''
        }

        var produto2 = {...produto};
        produto2.numeroDI = "09999967891";
        produto2.descricaoBruta = "410004800R PINCA DO FREIO DIANTEIRO PARA VEICULO AUTOMOVEL";
        produto2.ncm = "87083090";
        produto2.status = "Pendente";
        produto2.importadorNumero = '321'
        var produto3 = {...produto};
        var produto4 = {...produto};
        var produto5 = {...produto};
        var produto6 = {...produto};
        var produto7 = {...produto};
        var produto8 = {...produto};
        var produto9 = {...produto};
        var produto10 = {...produto};
        var produto11 = {...produto};

        var produtosList: Produto[] = [];
        produtosList.push(
            produto,
            produto2,
            produto3,
            produto4,
            produto5,
            produto6,
            produto7,
            produto8,
            produto9,
            produto10,
            produto11
        );

        let codigo = 0;

        produtosList.forEach(produto =>{
            produto._id = ++codigo + '';
        })

        return produtosList;
    }
}