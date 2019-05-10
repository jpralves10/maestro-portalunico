import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import $ from "jquery";

import { Chart } from 'chart.js';
import { PageEvent } from '@angular/material';

import { msg_produtos_two } from '../../../../../utilitarios/mensagens.module';

import { Produto } from '../../../../shared/models/produto.model';
import { Compatibilidade } from '../../../../shared/models/legendas.model';
import { ProdutosTwoDataSource } from './produtos-two-datasource';
import { ResultItem } from '../../../../shared/models/unificacao.result.model';
import { Result } from '../../../../shared/models/unificacao.result.model';

import { ProdutoService } from '../../../../shared/services/produtos.service';
import { ResultService } from '../../../../shared/services/unificacao.result.service';

@Component({
  selector: 'app-produtos-two',
  templateUrl: './produtos-two.component.html',
  styleUrls: ['./produtos-two.component.scss']
})
export class ProdutosTwoComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    @Input() produto: Produto;
    @Output() produtoAlterado = new EventEmitter();

    pageEvent:any = PageEvent;

    inativos: Produto[] = [];

    data: Produto[];
    loading = true;
    errored = false;

    eventTable: number = 0;
 
    mensagem: any = {id: 0, tipo: '', class: '', lista: []};

    selection = new SelectionModel<Produto>(true, []);

    dataSource: ProdutosTwoDataSource;

    current_filtro: ResultItem = {
        produto: {numeroDI: '', descricaoBruta: '', ncm: '', status: '', cnpj: ''}
    };

    displayedColumns = ['select', 'descricaoBruta', 'similaridade', 'canal', 'operacoes'];

    public filtroValue: ResultItem;
    public currentFilter: Result;

    constructor(
        private produtoService: ProdutoService,
        private resultService: ResultService
    ) {
        resultService.filter.subscribe(f => (this.filtroValue = f));

        resultService.filterResult.subscribe(fr => (this.currentFilter = fr));

        this.selection.changed.subscribe(() => {
            resultService.changeFilterResult({
                ...this.currentFilter,
                produtos: this.selection.selected
            });
        });   
    }

    ngOnInit() {
        if(this.produto !== null && this.produto !== undefined){

            if(this.produto.descricao.length <= 0){
                this.produto.descricao = this.produto.descricaoBruta;
            }

            if(this.produto.codigosInterno == null || this.produto.codigosInterno == undefined){
                this.produto.codigosInterno = []
            }

            this.produtoService.getProdutosGenerico(
                {
                    cnpjRaiz: this.produto.cnpjRaiz.substring(0, 8),
                    status: ['Pendente', 'Completo', 'Aprovado', 'Integrado'],
                    codigoInterno: this.produto.codigosInterno[0],
                    descricaoBruta: this.produto.descricaoBruta,
                    ncm: this.produto.ncm
                }
            ).subscribe(versoes => {
                var produtos: Produto[] = (versoes as any).produtos;

                produtos.forEach(produto => {
                    if(this.produto._id !== produto._id){

                        produto.dataRegistro = new Date(produto.dataRegistro);
                        produto.dataCriacao = new Date(produto.dataCriacao);

                        produto.declaracoes.forEach(declaracao => {
                            declaracao.dataRegistro = new Date(declaracao.dataRegistro);
                        })

                        produto.compatibilidade.canalDominante = 0;
                        //let similaridade = Math.round(produto.compatibilidade.similaridade * 100) / 100;
                        let similaridade = Math.round(produto.compatibilidade.similaridade);
                        produto.compatibilidade.similaridade = similaridade;

                        this.produto.versoesProduto.push(produto);
                    }
                });

                window.sessionStorage.setItem('produtos', JSON.stringify(this.data));
                this.setDataSource();
                this.eventTable = 1;
            },
            error => { this.errored = true;})

            this.produto.versoesProduto = [];
            this.loading = false;
            this.setDataSource();

            /*if(this.produto.versoesProduto != null || this.produto.versoesProduto != undefined){
                this.produto.versoesProduto = this.getMockDados();
                this.setDataSource();
            }*/
        }
    }

    setDataSource(){
        this.dataSource = new ProdutosTwoDataSource(
            this.paginator,
            this.sort,
            this.resultService,
            this.produto.versoesProduto
        );
    }

    updateFiltro() {
        this.resultService.changeFilter(this.current_filtro);
    }

    ngAfterViewInit() {
        this.resultService.whenUpdatedSource.next([
            ...this.resultService.whenUpdated,
            this.paginator
        ]);

        this.setChartList(this.getVisibleData());
    }

    masterToggle() {
        const visibleData = this.getVisibleData();
        const allSelected = this.isAllSelected();

        if (allSelected) {
            this.selection.deselect(...visibleData);
        } else {
            this.selection.select(...visibleData);
        }
        return;
    }

    getVisibleData() {
        return this.dataSource.getUpdatedData();
    }

    isAllSelected() {
        const visibleData = this.dataSource.getUpdatedData();
        return !visibleData.some(
            ds => !this.selection.selected.some(
                s => s._id === ds._id
            )
        );
    }

    deselectAll() {
        this.selection.clear();
        this.paginator.firstPage();
    }

    inativarProduto(row: Produto) {
        this.produto.versoesProduto.splice(this.produto.versoesProduto.indexOf(row), 1);
        this.dataSource.data = [...this.produto.versoesProduto];
        this.dataSource.fullData = [...this.produto.versoesProduto];

        row.status = 'Inativo';
        this.inativos.push(row);

        setTimeout(() => {
            this.selection.toggle(row);
            this.dataSource.getUpdatedData();
            this.updateFiltro();
            this.eventTable = 1;
        }, 500);
    }

    inativarTodos(){
        const visibleData = this.getVisibleData();
        visibleData.forEach(row =>{
            this.inativarProduto(row);
        });
    }

    proximaEtapa(){
        /*this.produtoService.setProdutosInativos(this.inativos).subscribe(inativos =>{
            return
        },
        error => { this.errored = true;})*/

        this.produto.etapaUnificacao++;
        this.produtoAlterado.emit(this.produto);
    }

    public validaDescricao(event: any){
        if(this.produto.descricao.length <= 0){
            
            this.setMensagem('message-alert-warning');

            $( "#next-two" ).prop("disabled", true);
            $( "#next-two" ).attr("style", "background-color:#673AB7; color:#fff;");
        }else{
            this.mensagem = null;
            $( "#next-two" ).prop("disabled", false);
        }
    }

    public setMensagem(tpMensagem: string){
        for(let msg of msg_produtos_two) {
            msg.tipo == tpMensagem ? this.mensagem = msg : this.mensagem = null;
        }
    }

    public voltarEtapa(){
        this.produto.etapaUnificacao--;
        this.produtoAlterado.emit(this.produto);
    }

    /** Chart Doughnut **/

    openDialogDeclaracoes(produto: Produto){

    }

    setChartList(produtos: Produto[]){
        produtos.forEach(produto =>{
            let ctx = document.getElementById("two-" + produto._id);
            new Chart(ctx, this.getChartDoughnut(produto));
            this.getCanalDominante(produto);
        });
    }

    projectContentChanged(event: any){
        if(this.eventTable == 1 ){
            this.setChartList(this.getVisibleData());
            this.eventTable = 0;
        }
    }

    projectSortData(event: any){
        if(event != undefined){
            this.eventTable = 1;
        }
    }

    projectPageEvent(event: any){
        if(event != undefined){
            this.eventTable = 1;
        }
    }

    getCanalDominante(produto: Produto){

        var canais = [
            produto.compatibilidade.verde,
            produto.compatibilidade.amarelo,
            produto.compatibilidade.vermelho,
            produto.compatibilidade.cinza,
        ]

        canais.forEach((canal1, index) => {
            canais.forEach(canal2 => {
                if(canal1 > canal2){
                    produto.compatibilidade.canalDominante = index;
                }
            })
        })
    }

    getChartDoughnut(produto: Produto){

        Chart.defaults.global.legend.display = false;
        Chart.defaults.global.tooltips.enabled = false;

        let data = {
            labels: [
                'Canal Verde',
                'Canal Amarelo',
                'Canal Vermelho',
                'Canal Cinza'
            ],
            //labels: [],
            datasets: [
                {
                    data: [
                        produto.compatibilidade.verde,
                        produto.compatibilidade.amarelo,
                        produto.compatibilidade.vermelho,
                        produto.compatibilidade.cinza,
                    ], //[10, 20, 30, 40],
                    backgroundColor: [
                        "#6BD19E",
                        "#F9E79F",
                        "#F5B7B1",
                        "#CCD1D1"
                    ]
                }
            ]
        };

        let options: {
            showTooltips: false,
            fullWidth: true,
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }

        return {
            type: 'doughnut',
            data: data,
            options: options
        }
    }



    /* Mocks */

    public getMockDados(): Produto[]{

        var compatibilidade: Compatibilidade = {
            similaridade: 7,
            identicos: 4,
            canalDominante: 0,
            verde: 5,
            amarelo: 3,
            vermelho: 2,
            cinza: 1
        }

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
            descricaoOperadorEstrangeiro: null,
            atributos: null,
            codigosInterno: null,
            dataCriacao: null,
            dataAtualizacao: null,
            usuarioAtualizacao: null,
            declaracoes: [],
            versoesProduto: [],
            compatibilidade: compatibilidade,
            declaracaoNode: [],
            chartCanais: []  ,
            canalDominante: 0,
            importadorNome: '',
            importadorNumero: ''      
        }
        

        var produto2 = {...produto};
        produto2.numeroDI = "09999967891";
        produto2.descricaoBruta = "410004800R PINCA DO FREIO DIANTEIRO PARA VEICULO AUTOMOVEL";
        produto2.ncm = "87083090";
        produto2.status = "Pendente";
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