import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Produto } from '../../../shared/models/produto.model';

@Component({
    selector: 'app-produtos-one',
    templateUrl: './produtos-one.component.html',
    styleUrls: ['./produtos-one.component.scss']
})
export class ProdutosOneComponent implements OnInit {

    @Input() produto: Produto;
    @Output() produtoAlterado = new EventEmitter();

    public loading = true;
    public errored = false;

    descricaoBruta: string = '';
    codigoSelecionado: string = '';
    
    constructor() { }

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

        if(this.produto.codigosInterno == null || this.produto.codigosInterno.length == 0){
            this.produto.codigosInterno = [];
        }
        
        this.produto.codigosInterno.push(this.codigoSelecionado.trim());
    }

    proximaEtapa(){
        this.produto.etapaUnificacao++;
        this.produtoAlterado.emit(this.produto);
    }
}