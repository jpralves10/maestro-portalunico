import { Component, OnInit, ViewChild } from '@angular/core';
import { INotificacoes } from './notificacoes.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ResultService } from '../service/notificacoes.result.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material';
import { NotificacoesListComponent } from './notificacoes-list/notificacoes-list.component';

@Component({
    selector: 'app-notificacoes',
    templateUrl: './notificacoes.component.html',
    styleUrls: ['./notificacoes.component.scss']
})
export class NotificacoesComponent implements OnInit {

    @ViewChild(NotificacoesListComponent) 
    childNotificacoesList:NotificacoesListComponent;

    loading = true;
    errored = false;

    formulario = {} as INotificacoes;
    data: INotificacoes[] = [];

    current_filtro: IResultItem = {
        notificacoes: {
            tela: '',
            titulo: '',
            status: '',
            dataAtualizacao: ''
        }
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private resultService: ResultService,
        //private produtoService: ProdutoService,
        private modalService: NgbModal,
        private _snackBar: MatSnackBar
    ) {
        this.route.queryParamMap.subscribe(paramMap => {
            if(this.childNotificacoesList != undefined){
                this.data.push(JSON.parse(paramMap.get('paramsFormulario')));
                this.childNotificacoesList.updateDataSource(this.data);
            }            
        });

        /*this.produtoService.getClassificacaoAll().subscribe(classificacoes => {
            this.data = [...classificacoes]

            this.data.forEach(item => {
                item.dataAtualizacao = new Date(item.dataAtualizacao)
                item.dataCriacao = new Date(item.dataCriacao)
            })
            
            if(this.childModelosList != undefined){
                this.childModelosList.updateDataSource(this.data);
            }
            this.loading = false;
        })*/

        this.loading = false;
    }

    ngOnInit() {}

    adicionarProduto(){
        /*const modalLink = this.modalService.open(SpreadsheetsLinkComponent, {size: '900', centered: true});
        modalLink.componentInstance.linkSpreadsheets = '';
        modalLink.result.then((links:string[]) => {

            let linkIframe = links[0];
            let linkSpread = links[1];

            if(linkIframe == '' || linkSpread == '' || !linkIframe.startsWith('<iframe') || !linkSpread.startsWith('https://docs.google.com/')){

                this._snackBar.open('Verificar preenchimento!', 'Sem sucesso', {
                    duration: 5000,
                });
                
            }else{

                let notificacoes = {} as INotificacoes

                /* IFrame */

                //<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSft8XkeMuh0vuhQl77FaGCkRLCMn4KEyG5OCURe0Jnw8q-7sA/viewform?embedded=true" width="640" height="2437" frameborder="0" marginheight="0" marginwidth="0">Carregando…</iframe>
                //"https://docs.google.com/forms/d/e/1FAIpQLSft8XkeMuh0vuhQl77FaGCkRLCMn4KEyG5OCURe0Jnw8q-7sA/viewform?embedded=true"

                /*let str = linkIframe;
                let patt = /src=".+embedded=true/i;
                let result = str.match(patt);

                notificacoes.iframe = result.toString().split('"')[1]
    
                /* SpreadSheet */
    
                /*let itensLink:string[] = linkSpread.split('/');
    
                if(linkSpread != ''){
                    notificacoes.spreadsheetId = itensLink[5];
                    notificacoes.idSheet = parseInt(itensLink[6].split('edit#gid=')[1], 10);
                    notificacoes.spreadsheetIdDisabled = true
                    notificacoes.idSheetDisabled = true
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
        
                this.router.navigate([`/classificacao-modelos/modelos-edit`], {
                    relativeTo: this.route,
                    replaceUrl: false,
                    queryParams: {
                        filterFormulario: JSON.stringify({...formulario})
                    }
                });
            }

        }, (reason) => {});*/
    }

    updateFiltro() {
        this.resultService.changeFilter(this.current_filtro);
    }
}

export interface IResult {
    notificacoes: INotificacoes[];
    data_inicio?: Date;
    data_fim?: Date;
}

export interface IResultItem {
    notificacoes: {
        tela: string,
        titulo: string,
        status: string,
        dataAtualizacao: string
    }
}