import { Component, OnInit } from '@angular/core';
import { IFilter, IFilterResult } from '../../shared/filter/filter.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterComponent } from '../../shared/filter/filter.component';
import { ProdutoService } from '../shared/services/produtos.service';

/*import { writeFileSync, readFileSync, existsSync } from 'fs';
import * as fs from "file-system";
import * as fs from 'fs';*/

import * as XLSX from 'ts-xlsx';
import { Produto } from '../shared/models/produto.model';

@Component({
  selector: 'app-importacao',
  templateUrl: './importacao.component.html',
  styleUrls: ['./importacao.component.scss']
})
export class ImportacaoComponent implements OnInit {

    filter: IFilterResult;
    loading = true;
    errored = false;

    spinner = false;
    message = false;

    importerSelected = true;

    userInfo: any;

    filtro: IFilter = { importers: [] };

    constructor(
        private produtoService: ProdutoService,
        private modalService: NgbModal
    ) {
        /*if(!this.importerSelected && this.filtro.importers.length > 0){
            this.importerSelected = true;
        }*/

        this.userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))

        this.getFilterResult();
        this.loading = false;

        if(this.filter != null && this.filter.importers.length > 0){
            setTimeout(() => {
                this.loading = false;
            }, 2000);
        } else {
            this.openDialogFilter();
        }
    }

    ngOnInit() { }

    openDialogFilter(): void {
        this.modalService.open(FilterComponent, {size: '900', centered: true}).result.then((result) => {}, (reason) => {
            this.getFilterResult();
            setTimeout(() => {
                this.loading = false;
            }, 2000);
        });
    }

    getFilterResult(){
        this.filter = JSON.parse(window.sessionStorage.getItem('result'));
    }

    fileChange(event: any){

        this.spinner = true;

        let arrayBuffer:any;
        let file:File;

        if (event.target.files.length > 0) {
            file = event.target.files[0];

            let fileReader = new FileReader();
            fileReader.onload = (e) => {
                arrayBuffer = fileReader.result;
                
                var data = new Uint8Array(arrayBuffer);
                var arr = new Array();

                for(var i = 0; i != data.length; ++i){
                    arr[i] = String.fromCharCode(data[i]);
                }
                
                var bstr = arr.join("");
                var workbook = XLSX.read(bstr, {type:"binary"});
                var first_sheet_name = workbook.SheetNames[0];
                var worksheet = workbook.Sheets[first_sheet_name];
                
                console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}) as IPlanilha[]);

                this.importPlanilha(XLSX.utils.sheet_to_json(worksheet,{raw:true}) as IPlanilha[]);
            }
            fileReader.readAsArrayBuffer(file);

            /*this.produtoService.setProdutosImportacao(
                { importer:this.filter.importers[0], file:btoa(file) }
            ).subscribe(status => { });*/
        }

        setTimeout(() => {
            this.spinner = false;
            this.message = true;
        }, 2000);
    }

    importPlanilha(rows: IPlanilha[]){

        rows.forEach(row => {
            let produto = new Produto();
            produto._id = null;
            produto.seq = "001";
            produto.codigo = null;
            produto.status = 'Novo';

            produto.dataRegistro = new Date();
            produto.dataCriacao = new Date();
            produto.dataAtualizacao = new Date();
            produto.usuarioAtualizacao = this.userInfo.email;

            produto.versoesProduto = undefined;
            produto.etapaUnificacao = undefined;
            produto.compatibilidade = undefined;
            produto.declaracaoNode = undefined;
            produto.declaracoes = undefined;
            produto.chartCanais = undefined;
            produto.canalDominante = undefined;
            produto.quantidade = undefined;

            produto.atributos = undefined;
            produto.codigosInterno = undefined;

            /* Planilha */
            produto.numeroDI = row.numeroDI;
            produto.descricao = row.descricao;
            produto.descricaoBruta = row.descricao;
            produto.cnpjRaiz = row.cnpjRaiz;
            produto.situacao = row.situacao.toUpperCase();
            produto.modalidade = row.modalidade.toUpperCase();
            produto.ncm = row.ncm;
            produto.codigoNaladi = row.codigoNaladi;
            produto.codigoGPC = row.codigoGPC;
            produto.codigoGPCBrick = row.codigoGPCBrick;
            produto.codigoUNSPSC = row.codigoUNSPSC;
            produto.paisOrigem = row.paisOrigem;
            produto.cpfCnpjFabricante = row.cpfCnpjFabricante;
            produto.codigoOperadorEstrangeiro = row.codigoOperadorEstrangeiro;
            produto.importadorNome = row.importadorNome;
            produto.importadorNumero = row.importadorNumero;
            produto.fornecedorNome = row.fornecedorNome;
            produto.fabricanteNome = row.fabricanteNome;

            this.produtoService
                .setAlterarProdutos(produto)
                .subscribe(versoes => {}, error => { this.errored = true;});
        })        
    }
}

export interface IPlanilha {
    numeroDI: string,
    descricao: string,
    descricaoBruta: string,
    cnpjRaiz: string,
    situacao: string,
    modalidade: string,
    ncm: string,
    codigoNaladi: number,
    codigoGPC: number,
    codigoGPCBrick: number,
    codigoUNSPSC: number,
    paisOrigem: string,
    cpfCnpjFabricante: string,
    codigoOperadorEstrangeiro: string,
    importadorNome: string,
    importadorNumero: string,
    fornecedorNome: string,
    fabricanteNome: string
}