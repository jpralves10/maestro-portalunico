import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Produto } from '../../../shared/models/produto.model';
import { Atributos } from '../../../shared/models/legendas.model';

import { FilterResult } from '../../../../shared/filter/filter.model';
import { ProdutoService } from '../../../shared/services/produtos.service';

import paises from '../../../../utilitarios/pais-origem.model';
import listaNcm from '../../../../utilitarios/ncm.model';
import { msg_produtos_three } from '../../../../utilitarios/mensagens.module';

@Component({
    selector: 'app-produtos-three',
    templateUrl: './produtos-three.component.html',
    styleUrls: ['./produtos-three.component.scss']
})
export class ProdutosThreeComponent implements OnInit {

    @Input() produto: Produto;
    @Output() produtoAlterado = new EventEmitter();

    loading = true;
    errored = false;
    finish = false;
    spinner = false;

    paises: Array<{ value: string; viewValue: string; }> = [];
    listaNcm: any = {};
    attrSelect: any = undefined;
    listaAtributos: any = [];
    attrList: any = [];

    mensagem: any = {id: 0, tipo: '', class: '', lista: []};

    listaAtributosDataSource = new MatTableDataSource<{
        codigo: string, dominio: string, descricao: string
    }>();
    codigoInternoDataSource = new MatTableDataSource<string>();

    situacoes = [
        {value: 'ATIVADO', viewValue: 'Ativado'},
        {value: 'DESATIVADO', viewValue: 'Desativado'},
        {value: 'RASCUNHO', viewValue: 'Rascunho'}
    ];

    modalidades = [
        {value: 'AMBOS', viewValue: 'Ambos'},
        {value: 'EXPORTACAO', viewValue: 'Exportação'},
        {value: 'IMPORTACAO', viewValue: 'Importação'}
    ];

    fabricantes = [
        {value: false, viewValue: 'Não'},
        {value: true, viewValue: 'Sim'}
    ];

    atributosColumns: string[] = ['codigo', 'dominio', 'descricao', 'operacao'];
    atributo_form: Atributos = {atributo: '', valor: ''};

    codigoInternoColumns: string[] = ['valor', 'operacao'];
    codigointerno_form = '';

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private produtoService: ProdutoService
    ) { 
        this.paises = paises;
        this.listaNcm = listaNcm;
    }

    ngOnInit() {
        this.loading = false;
        this.initDataSources();
    }

    private initDataSources(){
        this.listaAtributos = [];
        this.carregarAtributos();
        this.carregarCodigoInterno();
    }

    carregarAtributosChange(){
        this.attrList = [];
        this.listaAtributos = [];
        this.produto.atributos = [];
        this.listaAtributosDataSource.data = [...[]];
        this.carregarAtributos();
    }

    carregarAtributos(){
        if(this.produto.atributos == null || this.produto.atributos == undefined){
            this.produto.atributos = [];
            this.listaAtributosDataSource.data = [];
        }else{
            this.listaNcm.listaNcm.forEach(ncm => {
                if(this.produto.ncm == ncm.codigoNcm.replace(/[/\/\-\.]/g, '')){
                //if("29333929" == ncm.codigoNcm.replace(/[/\/\-\.]/g, '')){

                    if(ncm.listaAtributos.length > 0){

                        ncm.listaAtributos.forEach(attr => {
                            attr.dominio.forEach(dom => {
                                
                                this.listaAtributos.push({
                                    codigo: attr.codigo,
                                    dominio: dom.codigo,
                                    descricao: dom.descricao
                                })
                            })
                        })
                    }
                }
            });
            if(this.produto.atributos.length > 0){

                let listaData = [];
                let listaAttr = [...this.listaAtributos];

                listaAttr.forEach(attr =>{
                    this.produto.atributos.forEach(proAttr => {
                        if(attr.codigo == proAttr.atributo && attr.dominio == proAttr.valor){
                            listaData.push(attr);
                            this.listaAtributos.splice(this.listaAtributos.indexOf(attr), 1);
                        }
                    })
                })
                this.attrList = [...listaData];
                this.listaAtributosDataSource.data = [...listaData];
            }            
        }
    }

    adicionarAtributo(){
        if(this.attrSelect != undefined){
            this.produto.atributos.push({
                atributo: this.attrSelect.codigo,
                valor: this.attrSelect.dominio
            })
            this.attrList.push(this.attrSelect);
            this.listaAtributos.splice(this.listaAtributos.indexOf(this.attrSelect), 1);
            this.updateListaAtributos();
            this.attrSelect = undefined;
        }
    }

    removeRowAtributo(attr: any){
        let attrProd: Atributos = {atributo: attr.codigo, valor: attr.dominio};

        this.attrList.splice(this.attrList.indexOf(attr), 1);
        this.produto.atributos.splice(this.produto.atributos.indexOf(attrProd), 1);
        this.listaAtributos.push(attr);
        this.listaAtributos.sort((a, b) => a.codigo > b.codigo ? -1 : 1);
        this.updateListaAtributos();
    }

    updateListaAtributos(){
        this.listaAtributosDataSource.data = [...this.attrList];
    }

    carregarCodigoInterno(){
        if(this.produto.codigosInterno == null || this.produto.codigosInterno == undefined){
            this.produto.codigosInterno = [];
            this.codigoInternoDataSource.data = [];
        }else{
            this.codigoInternoDataSource.data = [...this.produto.codigosInterno];
        }
    }

    adicionarCodigoInterno(){
        if(this.codigointerno_form.length > 0){
            this.produto.codigosInterno.push(this.codigointerno_form);
            this.codigointerno_form = '';
            this.updateCodigoInterno();
        }
    }

    removeRowCodigoInterno(row: string){
        this.produto.codigosInterno.splice(this.produto.codigosInterno.indexOf(row), 1);
        this.updateCodigoInterno();
    }

    updateCodigoInterno(){
        this.codigoInternoDataSource.data = [...this.produto.codigosInterno];
    }

    setStatusProduto(event: any){
        this.produto.status = event.checked === true ? 'Aprovado' : 'Pendente'
    }

    finalizarPreenchimento(){

        this.spinner = true;

        setTimeout(() => {
            this.validarCampos();
            this.spinner = false;

            if(this.mensagem.lista.length == 0){

                this.mensagem = null;
                this.setMensagem('message-alert-success');

                if(this.mensagem != null){

                    this.mensagem.lista = [];
                    this.mensagem.lista.push({chave: 0, valor: 'Produto cadastrado com sucesso!'});

                    this.finish = true;
                
                    setTimeout(() => {
                        this.finish = false;
                        this.mensagem = null;

                        if(this.produto.status == 'Pendente'){
                            this.produto.status = 'Completo';
                        }                        
                        
                        this.produto.dataAtualizacao = new Date();
                        this.produto.versoesProduto = undefined;
                        this.produto.etapaUnificacao = undefined;
                        this.produto.compatibilidade = undefined;
                        this.produto.declaracaoNode = undefined;
                        this.produto.declaracoes = undefined;
                        this.produto.chartCanais = undefined;
                        this.produto.canalDominante = undefined;
                        this.produto.quantidade = undefined;

                        if(this.produto.atributos.length <= 0){
                            this.produto.atributos = undefined;
                        }

                        this.produtoAlterado.emit(this.produto);

                        this.produtoService
                            .setAlterarProdutos(this.produto)
                            .subscribe(versoes => {}, error => { this.errored = true;});

                        this.router.navigate([`/unificacao`], {
                            relativeTo: this.route,
                            replaceUrl: true,
                            queryParams: {
                                filter: this.getFilterAsString()
                            }
                        });

                    }, 2000);
                }
            }
        }, 500);
    }

    validarCampos(){

        this.setMensagem('message-alert-warning');

        if(this.mensagem != null){

            this.mensagem.lista = [];

            if(this.isNullUndefined(this.produto.seq)){
                this.mensagem.lista.push({chave: 0, valor: 'Verificar preenchimento do campo \'Sequência\'.'});
            }else if(this.produto.seq.length <= 0 || this.produto.seq.length > 3){
                this.mensagem.lista.push({chave: 0, valor: 'Tamanho do campo \'Sequência\': de 1 a 3 caracteres.'});
            }
            
            if(this.isNullUndefined(this.produto.descricao)){
                this.mensagem.lista.push({chave: 0, valor: 'Verificar preenchimento do campo \'Descrição do Produto\'.'});
            }else if(this.produto.descricao.length <= 0 || this.produto.descricao.length > 3700){
                this.mensagem.lista.push({chave: 0, valor: 'Tamanho do campo \'Descrição do Produto\': de 1 até 3700 caracteres.'});
            }

            if(this.isNullUndefined(this.produto.situacao) || !this.inListObject(this.situacoes, this.produto.situacao)){
                this.mensagem.lista.push({chave: 0, valor: 'Verificar preenchimento do campo \'Situação do Produto\'.'});
            }

            if(this.isNullUndefined(this.produto.modalidade) || !this.inListObject(this.modalidades, this.produto.modalidade)){
                this.mensagem.lista.push({chave: 0, valor: 'Verificar preenchimento do campo \'Modalidade do Produto\'.'})
            }

            if(this.isNullUndefined(this.produto.ncm)){
                this.mensagem.lista.push({chave: 0, valor: 'Verificar preenchimento do campo \'NCM do Produto\'.'})
            }else if(this.produto.ncm.length <= 0 || this.produto.ncm.length > 8){
                this.mensagem.lista.push({chave: 0, valor: 'Tamanho do campo \'NCM do Produto\': de 1 a 8 caracteres.'})
            }

            if((this.produto.codigoNaladi > 0 && this.produto.codigoNaladi < 8) || this.produto.codigoNaladi > 8){
                this.mensagem.lista.push({chave: 0, valor: 'Tamanho do campo \'Código Naladi\': de 1 a 8 caracteres.'})
            }

            if((this.produto.codigoGPC > 0 && this.produto.codigoGPC < 10) || this.produto.codigoGPC > 10){
                this.mensagem.lista.push({chave: 0, valor: 'Tamanho do campo \'Código GPC\': de 1 a 10 caracteres.'})
            }

            if((this.produto.codigoGPCBrick > 0 && this.produto.codigoGPCBrick < 10) || this.produto.codigoGPCBrick > 10){
                this.mensagem.lista.push({chave: 0, valor: 'Tamanho do campo \'Código GPC - Brick\': de 1 a 10 caracteres.'})
            }

            if((this.produto.codigoUNSPSC > 0 && this.produto.codigoUNSPSC < 10) || this.produto.codigoUNSPSC > 10){
                this.mensagem.lista.push({chave: 0, valor: 'Tamanho do campo \'Código UNSPSC\': de 1 a 10 caracteres.'})
            }

            if(this.isNullUndefined(this.produto.fabricanteConhecido) || !this.inListObject(this.fabricantes, this.produto.fabricanteConhecido)){
                this.mensagem.lista.push({chave: 0, valor: 'Verificar preenchimento do campo \'Fabricante Conhecido\'.'})
            }

            if(this.isNullUndefined(this.produto.paisOrigem) || !this.inListObject(this.paises, this.produto.paisOrigem)){
                this.mensagem.lista.push({chave: 0, valor: 'Verificar preenchimento do campo \'País de Origem\'.'})
            }

            if((!this.isNullUndefined(this.produto.fabricanteConhecido) && this.produto.fabricanteConhecido) &&
                (!this.isNullUndefined(this.produto.paisOrigem) && this.produto.paisOrigem == 'BR')){
                if(this.isNullUndefined(this.produto.cpfCnpjFabricante)){
                    this.mensagem.lista.push({chave: 0, valor: 'Verificar preenchimento do campo \'CPF/CNPJ do Fabricante\'.'})
                }else if(this.produto.cpfCnpjFabricante.length <= 0 || this.produto.cpfCnpjFabricante.length > 14){
                    this.mensagem.lista.push({chave: 0, valor: 'Tamanho do campo \'CPF/CNPJ do Fabricante\': de 1 a 14 caracteres.'})
                }
            }

            if((!this.isNullUndefined(this.produto.fabricanteConhecido) && this.produto.fabricanteConhecido) &&
                (!this.isNullUndefined(this.produto.paisOrigem) && this.produto.paisOrigem != 'BR')){
                if(this.isNullUndefined(this.produto.codigoOperadorEstrangeiro)){
                    this.mensagem.lista.push({chave: 0, valor: 'Verificar preenchimento do campo \'Código Operador Estrangeiro\'.'})
                }else if(this.produto.codigoOperadorEstrangeiro.length <= 0 || this.produto.codigoOperadorEstrangeiro.length > 35){
                    this.mensagem.lista.push({chave: 0, valor: 'Tamanho do campo \'Código Operador Estrangeiro\': de 1 a 35 caracteres.'})
                }
            }

            if(this.produto.codigosInterno.length > 0){
                let index = 1;
                for(let codigo of this.produto.codigosInterno){
                    if(codigo.length > 60){
                        this.mensagem.lista.push({chave: 0, valor: 'Tamanho do campo \'Códigos Internos\' na posição ' + index +': de 1 a 60 caracteres.'})
                    }
                    index++;
                }
            }
        }
    }

    setMensagem(tpMensagem: string) {
        this.mensagem = null;
        for(let msg of msg_produtos_three) {
            if(msg.tipo == tpMensagem){
                this.mensagem = msg;
            }
        }
    }

    isNullUndefined(objeto: any): boolean {
        return objeto == null || objeto == undefined ? true : false;
    }

    inListObject(list: {value: any, viewValue: any}[], stringValue: any): boolean {
        for(let item of list){
            if(item.value == stringValue){
                return true;
            }
        }
        return false;
    }

    getFilterAsString(): string {
        
        var date = new Date();
        var start_date = new Date(date.setMonth(date.getMonth() - 12));

        return JSON.stringify({
            importers: [this.produto.cnpjRaiz],
            start_date: start_date,
            end_date: new Date()
        } as FilterResult);
    }

    voltarEtapa() {
        this.produto.etapaUnificacao--;
        this.produtoAlterado.emit(this.produto);
    }
}