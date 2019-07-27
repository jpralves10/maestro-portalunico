import { Component, OnInit, ViewChild } from '@angular/core';
import { INotificacoes } from './notificacoes.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ResultService } from '../service/notificacoes.result.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material';
import { NotificacoesListComponent } from './notificacoes-list/notificacoes-list.component';
import { FilterService } from '../service/filter.service';

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

    userInfo: any;

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
        private modalService: NgbModal,
        private _snackBar: MatSnackBar,
        private filterService: FilterService
    ) {
        this.route.queryParamMap.subscribe(filterNotificacoes => {
            this.data = JSON.parse(filterNotificacoes.get('filterNotificacoes'));

            if(this.data != undefined){
                this.carregarDados()
            }else{
                this.filterService.getNotificacoesFormAll().subscribe(notificacoes => {
                    //this.data = [...notificacoes]

                    this.userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))

                    notificacoes.forEach(item => {
                        if(item.idEmail == this.userInfo.email){
                            this.data.push(item);
                        }
                    })

                    this.carregarDados()
                })
            }
        });
    }

    carregarDados(){
        this.data.forEach(item => {
            item.dataAtualizacao = new Date(item.dataAtualizacao)
            item.dataCriacao = new Date(item.dataCriacao)
        })

        if(this.childNotificacoesList != undefined){
            this.childNotificacoesList.updateDataSource(this.data);
        }

        this.loading = false;
    }

    ngOnInit() {}

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