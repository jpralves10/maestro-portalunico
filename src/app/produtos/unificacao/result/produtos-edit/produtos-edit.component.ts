import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Produto, ProdutoClass } from '../../../shared/models/produto.model';
import $ from "jquery";

@Component({
  selector: 'app-produtos-edit',
  templateUrl: './produtos-edit.component.html',
  styleUrls: ['./produtos-edit.component.scss']
})
export class ProdutosEditComponent implements OnInit {

    isLinear = true;
    etapaIndex = 0;

    @Input() produto: Produto = null;
    public loading = true;
    public errored = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.route.queryParamMap.subscribe(paramMap => {
            this.produto = JSON.parse(paramMap.get('filterUnificacao'));

            this.produto.etapaUnificacao = 1;

            this.produto.descricaoBruta = this.produto.descricaoBruta.trim();

            if(this.produto.descricao == null || this.produto.descricao == undefined){
                this.produto.descricao = '';
            }

            if(this.produto.codigosInterno == null && this.produto.codigosInterno == undefined){
                this.produto.codigosInterno = [];
            }

            this.loading = false;
        });
    }

    ngOnInit() { }

    ngAfterViewInit(): void {  
        $( "mat-step-header" ).attr("style","pointer-events: none !important");
    }

    reciverProduto(produtoAlterado: Produto){
        this.produto = produtoAlterado;
    }

    stepClick(event: any){
        if(event.selectedIndex == 0){
            this.etapaIndex = 1;
        }else if(event.selectedIndex == 1){
            this.etapaIndex = 2;
        }else if(event.selectedIndex == 2){
            this.etapaIndex = 3;
        }
    }
}