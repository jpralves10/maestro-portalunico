import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProdutoService } from '../../shared/services/produtos.service';
import { PreencherListComponent } from './preencher-list/preencher-list.component';
import { ResultService } from '../../shared/services/classificar.result.service';
import { IResultItem } from '../../shared/models/classificar.result.model';
import { MatSnackBar } from '@angular/material';
import { IClassificar } from '../../shared/models/classificar.model';
import { EmpresaComponent } from 'src/app/shared/empresas/empresa.component';

@Component({
    selector: 'app-preencher',
    templateUrl: './preencher.component.html',
    styleUrls: ['./preencher.component.scss']
})
export class PreencherComponent implements OnInit {

    @ViewChild(PreencherListComponent) 
    childPreencherList:PreencherListComponent;

    loading = true;
    errored = false;
    empresa = false;

    formulario = {} as IClassificar;
    data: IClassificar[] = [];

    current_filtro: IResultItem = {
        classificar: {
            titulo: '',
            status: ''
        }
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private resultService: ResultService,
        private produtoService: ProdutoService,
        private modalService: NgbModal,
        private _snackBar: MatSnackBar
    ) {
        /*this.route.queryParamMap.subscribe(paramMap => {
            if(this.childPreencherList != undefined){
                this.data.push(JSON.parse(paramMap.get('paramsFormulario')));
                this.childPreencherList.updateDataSource(this.data);
            }            
        });*/

        this.produtoService.getEmpresaFind().subscribe(ret => {
            if(ret.length == 0){
                this.empresa = true
            }

            this.produtoService.getClassificarAll().subscribe(classificar => {

                let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))

                classificar.forEach(item => {
                    if(item.status == 'Classificado' && item.usuario.email == userInfo.email){
                        this.data.push(item)
                    }
                })

                this.data.forEach(item => {
                    item.dataAtualizacao = new Date(item.dataAtualizacao)
                    item.dataCriacao = new Date(item.dataCriacao)
                })
                
                if(this.childPreencherList != undefined){
                    this.childPreencherList.updateDataSource(this.data);
                }
                this.loading = false;
            })
        })
    }

    ngOnInit() {}

    /*adicionarProduto(){
        const modalLink = this.modalService.open(SpreadsheetsLinkComponent, {size: '900', centered: true});
        modalLink.componentInstance.linkSpreadsheets = '';
        modalLink.result.then((links:string[]) => {


        }, (reason) => {});
    }*/

    updateFiltro() {
        this.resultService.changeFilter(this.current_filtro);
    }

    adicionarEmpresa(){
        this.modalService.open(EmpresaComponent, {size: '900', centered: true}).result.then((result) => {}, (reason) => {
            window.sessionStorage.setItem('empresa', reason)
            this.empresa = false
        });
    }
}
