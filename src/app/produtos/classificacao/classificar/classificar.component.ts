import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProdutoService } from '../../shared/services/produtos.service';
import { ClassificarListComponent } from './classificar-list/classificar-list.component';
import { ResultService } from '../../shared/services/formularios.result.service';
import { IResultItem } from '../../shared/models/formulario.result.model';
import { MatSnackBar } from '@angular/material';
import { IClassificar } from '../../shared/models/classificar.model';

@Component({
    selector: 'app-classificar',
    templateUrl: './classificar.component.html',
    styleUrls: ['./classificar.component.scss']
})
export class ClassificarComponent implements OnInit {

    @ViewChild(ClassificarListComponent) 
    childClassificarList:ClassificarListComponent;

    loading = true;
    errored = false;

    formulario = {} as IClassificar;
    data: IClassificar[] = [];

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
        /*this.route.queryParamMap.subscribe(paramMap => {
            if(this.childClassificarList != undefined){
                this.data.push(JSON.parse(paramMap.get('paramsFormulario')));
                this.childClassificarList.updateDataSource(this.data);
            }            
        });*/

        this.produtoService.getClassificarAll().subscribe(classificar => {
            this.data = [...classificar]

            this.data.forEach(item => {
                item.dataAtualizacao = new Date(item.dataAtualizacao)
                item.dataCriacao = new Date(item.dataCriacao)
            })
            
            if(this.childClassificarList != undefined){
                this.childClassificarList.updateDataSource(this.data);
            }
            this.loading = false;
        })
    }

    ngOnInit() {}

    updateFiltro() {
        this.resultService.changeFilter(this.current_filtro);
    }
}
