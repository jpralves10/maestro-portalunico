import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IFilterResult } from 'src/app/shared/filter/filter.model';
import { Produto, IProduto } from '../../shared/models/produto.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ProdutoService } from '../../shared/services/produtos.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IClassificar } from '../../shared/models/classificar.model';
import { ResultService } from '../../shared/services/classificar.result.service';
import { ProdutosListComponent } from './produtos-list/produtos-list.component';

@Component({
  selector: 'app-classificar',
  templateUrl: './classificar.component.html',
  styleUrls: ['./classificar.component.scss']
})
export class ClassificarComponent implements OnInit {

    @ViewChild(ProdutosListComponent) 
    childProdutosList:ProdutosListComponent;

    filter: IFilterResult;
    loading = true;
    errored = false;

    produtos: Produto[];
    data: IClassificar[] = null;

    @Input() current_filtro: IResultItem = {} as IResultItem

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private resultService: ResultService,
        private produtoService: ProdutoService,
        private modalService: NgbModal
    ) {
        this.produtoService.getClassificarProdutoAll().subscribe(classificar => {
            this.data = [...classificar]

            this.data.forEach(item => {
                item.dataAtualizacao = new Date(item.dataAtualizacao)
                item.dataCriacao = new Date(item.dataCriacao)
            })

            /*if(this.childNotificacoesList != undefined){
                this.childNotificacoesList.updateDataSource(this.data);
            }*/

            this.loading = false;
        })
    }

    ngOnInit() {}

    childUpdateDataSource(){
        if(this.childProdutosList != undefined){
            this.childProdutosList.updateDataSource(this.data);
            //this.childProdutosList.eventTable = 1;
        }
    }

    updateFiltro() {
        this.resultService.changeFilter(this.current_filtro);
    }
}

export interface IResult {
    classificar: IClassificar[];
    data_inicio?: Date;
    data_fim?: Date;
}

export interface IResultItem {
    classificar: {
        titulo: string;
        status: string;
        dataAtualizacao: string;
        produto: IProduto;
    }
}