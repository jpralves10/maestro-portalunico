import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IProduto } from '../../../shared/models/produto.model';
import { IFilterResult } from '../../../../shared/filter/filter.model';
import { ProdutoService } from 'src/app/produtos/shared/services/produtos.service';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-produtos-one',
    templateUrl: './produtos-one.component.html',
    styleUrls: ['./produtos-one.component.scss']
})
export class ProdutosOneComponent implements OnInit {

    @Input() produto: IProduto;
    @Output() produtoAlterado = new EventEmitter();

    public loading = true;
    public errored = false;

    descricaoBruta: string = '';
    codigoSelecionado: string = '';
    
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private produtoService: ProdutoService,
        private _snackBar: MatSnackBar
    ) { }

    ngOnInit() {
        this.loading = false;

        this.descricaoBruta = this.produto.descricaoBruta;

        if(this.produto.codigosInterno !== null && this.produto.codigosInterno !== undefined){
            if(this.produto.codigosInterno.length > 0){
                this.codigoSelecionado = this.produto.codigosInterno[0];
            }
        }
    }

    public selecionarCodigoDescricao(event: any){        
        var selectionStart = event.target.selectionStart;
        var selectionEnd = event.target.selectionEnd;

        this.codigoSelecionado = this.descricaoBruta.substring(selectionStart, selectionEnd);

        if(this.produto.codigosInterno == undefined || this.produto.codigosInterno == null){
            this.produto.codigosInterno = [];
        }

        this.produto.codigosInterno[0] = this.codigoSelecionado.trim();
    }

    public voltarEtapa(){
        this.router.navigate([`/unificacao`], {
            relativeTo: this.route,
            replaceUrl: true,
            queryParams: {
                filter: this.getFilterAsString()
            }
        });
    }

    getFilterAsString(): string {
        var date = new Date();
        var start_date = new Date(date.setMonth(date.getMonth() - 12));

        return JSON.stringify({
            importers: [this.produto.cnpjRaiz],
            start_date: start_date,
            end_date: new Date()
        } as IFilterResult);
    }

    proximaEtapa(){
        this.produto.etapaUnificacao++;
        this.produtoAlterado.emit(this.produto);
    }

    classificarProduto(){
        this.produtoService.setClassificarProduto(this.produto).subscribe(ret => {

            this._snackBar.open('Produto enviado para classificação!', 'Sucesso', {
                duration: 5000,
            });
        },
        error => { this.errored = true; })

        this.produto.etapaUnificacao = this.produto.etapaUnificacao
    }
}