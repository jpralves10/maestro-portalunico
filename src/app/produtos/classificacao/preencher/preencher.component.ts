import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProdutoService } from '../../shared/services/produtos.service';
import { IClassificacao } from '../../shared/models/classificacao.model';
import { PreencherListComponent } from './preencher-list/preencher-list.component';
import { SpreadsheetsLinkComponent } from './preencher-edit/spreadsheets-link/spreadsheets-link.component';
import { ResultService } from '../../shared/services/formularios.result.service';
import { IResultItem } from '../../shared/models/formulario.result.model';
import { MatSnackBar } from '@angular/material';

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

    formulario = {} as IClassificacao;
    data: IClassificacao[] = [];

    current_filtro: IResultItem = {
        formulario: {
            spreadsheetId: '',
            idSheet: null,
            titulo: '',
            status: '',
            dataAtualizacao: null
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
        this.route.queryParamMap.subscribe(paramMap => {
            if(this.childPreencherList != undefined){
                this.data.push(JSON.parse(paramMap.get('paramsFormulario')));
                this.childPreencherList.updateDataSource(this.data);
            }            
        });

        this.produtoService.getClassificacaoAll().subscribe(classificacoes => {
            this.data = [...classificacoes]

            this.data.forEach(item => {
                item.dataAtualizacao = new Date(item.dataAtualizacao)
                item.dataCriacao = new Date(item.dataCriacao)
            })
            
            if(this.childPreencherList != undefined){
                this.childPreencherList.updateDataSource(this.data);
            }
            this.loading = false;
        })
    }

    ngOnInit() {}

    adicionarProduto(){
        const modalLink = this.modalService.open(SpreadsheetsLinkComponent, {size: '900', centered: true});
        modalLink.componentInstance.linkSpreadsheets = '';
        modalLink.result.then((links:string[]) => {

            let linkIframe = links[0];
            let linkSpread = links[1];

            if(linkIframe == '' || linkSpread == '' || !linkIframe.startsWith('<iframe') || !linkSpread.startsWith('https://docs.google.com/')){

                this._snackBar.open('Verificar preenchimento!', 'Sem sucesso', {
                    duration: 5000,
                });
                
            }else{

                let formulario = {} as IClassificacao

                /* IFrame */

                //<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSft8XkeMuh0vuhQl77FaGCkRLCMn4KEyG5OCURe0Jnw8q-7sA/viewform?embedded=true" width="640" height="2437" frameborder="0" marginheight="0" marginwidth="0">Carregando…</iframe>
                //"https://docs.google.com/forms/d/e/1FAIpQLSft8XkeMuh0vuhQl77FaGCkRLCMn4KEyG5OCURe0Jnw8q-7sA/viewform?embedded=true"

                let str = linkIframe;
                let patt = /src=".+embedded=true/i;
                let result = str.match(patt);

                formulario.iframe = result.toString().split('"')[1]
    
                /* SpreadSheet */
    
                let itensLink:string[] = linkSpread.split('/');
                
    
                if(linkSpread != ''){
                    formulario.spreadsheetId = itensLink[5];
                    formulario.idSheet = parseInt(itensLink[6].split('edit#gid=')[1], 10);
                    formulario.spreadsheetIdDisabled = true
                    formulario.idSheetDisabled = true
                }else{
                    formulario.spreadsheetId = null;
                    formulario.idSheet = null;
                    formulario.spreadsheetIdDisabled = false
                    formulario.idSheetDisabled = false
                }
                
                formulario._id = null;
                formulario.titulo = '';
                formulario.status = 'Novo';
        
                formulario.dataCriacao = new Date();
                formulario.dataAtualizacao = new Date();
        
                this.router.navigate([`/classificacao-preencher/preencher-edit`], {
                    relativeTo: this.route,
                    replaceUrl: false,
                    queryParams: {
                        filterFormulario: JSON.stringify({...formulario})
                    }
                });
            }


        }, (reason) => {});
    }

    updateFiltro() {
        this.resultService.changeFilter(this.current_filtro);
    }
}
