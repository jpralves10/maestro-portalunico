import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import $ from "jquery";

import { Chart } from 'chart.js';
import { PageEvent } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { msg_default_two } from '../../../../utilitarios/mensagens.module';

import { Produto } from '../../../shared/models/produto.model';
import { ProdutosTwoDataSource } from './produtos-two-datasource';
import { IResultItem } from '../../../shared/models/unificacao.result.model';
import { IResult } from '../../../shared/models/unificacao.result.model';

import { ProdutoService } from '../../../shared/services/produtos.service';
import { ResultService } from '../../../shared/services/unificacao.result.service';
import { ProdutosInfoDialog } from '../../produtos-info/produtos-info.dialog'

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

    canalVerde: number = 0;
    canalAmarelo: number = 0;
    canalVermelho: number = 0;
    canalCinza: number = 0;

    pageEvent:any = PageEvent;
    inativos: Produto[] = [];

    data: Produto[];
    loading = true;
    errored = false;

    eventTable: number = 0;
    mensagem: any = {id: 0, tipo: '', class: '', lista: []};
    selection = new SelectionModel<Produto>(true, []);
    dataSource: ProdutosTwoDataSource;

    current_filtro: IResultItem = {
        produto: {numeroDI: '', descricaoBruta: '', ncm: '', status: '', cnpj: '', operador: ''}
    };

    displayedColumns = ['select', 'descricaoBruta', 'ncm', 'quantidade', 'similaridade', 'canal'];

    filtroValue: IResultItem;
    currentFilter: IResult;

    userInfo: any;

    constructor(
        private produtoService: ProdutoService,
        private resultService: ResultService,
        private modalService: NgbModal,
        private _snackBar: MatSnackBar
    ) {
        resultService.filter.subscribe(f => (this.filtroValue = f));
        resultService.filterResult.subscribe(fr => (this.currentFilter = fr));

        this.selection.changed.subscribe(() => {
            resultService.changeFilterResult({
                ...this.currentFilter,
                produtos: this.selection.selected
            });
        });

        this.userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
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

                //window.sessionStorage.setItem('produtos', JSON.stringify(this.data));
                this.agruparDeclaracoes(this.produto.versoesProduto);
                this.setDataSource();
                this.eventTable = 1;
            },
            error => { this.errored = true;})

            this.produto.versoesProduto = [];
            this.loading = false;
            this.setDataSource();
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

    inativarTodos(){
        const visibleData = this.getVisibleData();
        visibleData.forEach(row =>{
            this.inativarProduto(row);
        });
    }

    inativarProduto(row: Produto) {
        if(this.selection.isSelected(row)){
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
        for(let msg of msg_default_two) {
            msg.tipo == tpMensagem ? this.mensagem = msg : this.mensagem = null;
        }
    }

    public voltarEtapa(){
        this.produto.etapaUnificacao--;
        this.produtoAlterado.emit(this.produto);
    }

    getQtdProdutosTwoSelecionados(){
        return this.selection.selected.length > 1 ? '' + this.selection.selected.length + ' ' + 'produtos selecionados' :
               this.selection.selected.length > 0 ? '' + this.selection.selected.length + ' ' + 'produto selecionado' :  ''
    }

    classificarProduto(){

        let name = this.userInfo.firstName + this.userInfo.lastName

        this.produtoService.setClassificarProduto(
            [{nome:name, email:this.userInfo.email}, this.produto]
        ).subscribe(ret => {

            this._snackBar.open('Produto enviado para classificação!', 'Sucesso', {
                duration: 5000,
            });
        },
        error => { this.errored = true; })

        this.produto.etapaUnificacao = this.produto.etapaUnificacao
    }

    /** Chart Doughnut **/

    openDialogDeclaracoes(row: Produto): void {
        var modalRef = this.modalService.open(ProdutosInfoDialog, {size: '900', centered: true});
        modalRef.componentInstance.produto = row;
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

    /*getCanalDominante(produto: Produto){

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
    }*/

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
}