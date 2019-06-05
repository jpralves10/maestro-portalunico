import { Component, OnInit } from '@angular/core';
import { IFilter, IFilterResult } from '../../shared/filter/filter.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterComponent } from '../../shared/filter/filter.component';
import { ProdutoService } from '../shared/services/produtos.service';

/*import { writeFileSync, readFileSync, existsSync } from 'fs';
import * as fs from "file-system";
import * as fs from 'fs';*/

@Component({
  selector: 'app-importacao',
  templateUrl: './importacao.component.html',
  styleUrls: ['./importacao.component.scss']
})
export class ImportacaoComponent implements OnInit {

    filter: IFilterResult;
    loading = true;
    errored = false;

    spinner = false;
    message = false;

    importerSelected = true;

    filtro: IFilter = { importers: [] };

    constructor(
        private produtoService: ProdutoService,
        private modalService: NgbModal
    ) {
        /*if(!this.importerSelected && this.filtro.importers.length > 0){
            this.importerSelected = true;
        }*/

        this.getFilterResult();
        this.loading = false;

        if(this.filter != null && this.filter.importers.length > 0){
            setTimeout(() => {
                this.loading = false;
            }, 2000);
        } else {
            this.openDialogFilter();
        }
    }

    ngOnInit() { }

    openDialogFilter(): void {
        this.modalService.open(FilterComponent).result.then((result) => {}, (reason) => {
            this.getFilterResult();
            setTimeout(() => {
                this.loading = false;
            }, 2000);
        });
    }

    getFilterResult(){
        this.filter = JSON.parse(window.sessionStorage.getItem('result'));
    }

    fileChange(event: any){

        this.spinner = true;

        if (event.target.files.length > 0) {
            let file = event.target.files[0];

            this.produtoService.setProdutosImportacao(
                { importer:this.filter.importers[0], file:btoa(file) }
            ).subscribe(status => { });
        }

        setTimeout(() => {
            this.spinner = false;
            this.message = true;
        }, 2000);
    }
}