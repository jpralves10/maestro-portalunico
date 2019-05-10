import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Produto } from '../../shared/models/produto.model';
import { Atributos } from '../../shared/models/legendas.model';
import { ProdutoService } from '../../shared/services/produtos.service';

//import { FilterResult } from '../../../../shared/models/unificacao.filter.model';
import paises from '../../../utilitarios/pais-origem.model';
import listaNcm from '../../../utilitarios/ncm.model';
import { msg_produtos_three } from '../../../utilitarios/mensagens.module';

@Component({
    selector: 'app-produtos-edit',
    templateUrl: './produtos-edit.component.html',
    styleUrls: ['./produtos-edit.component.scss']
})
export class ProdutosEditComponent implements OnInit {

    produto: Produto = null;

    loading = true;
    errored = false;
    finish = false;
    spinner = false;

    paises: Array<{ value: string; viewValue: string; }> = [];
    listaNcm: any = {};
    attrSelect: any = {};
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
        this.route.queryParamMap.subscribe(paramMap => {
            this.produto = JSON.parse(paramMap.get('filterCatalogo'));

            if(this.produto.codigosInterno == null && this.produto.codigosInterno == undefined){
                this.produto.codigosInterno = [];
            }

            this.loading = false;
        });
    }

    ngOnInit() { }

}