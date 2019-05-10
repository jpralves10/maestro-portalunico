import { Component, OnInit } from '@angular/core';
import { Filter, FilterResult } from '../shared/models/unificacao.filter.model';

@Component({
  selector: 'app-importacao',
  templateUrl: './importacao.component.html',
  styleUrls: ['./importacao.component.scss']
})
export class ImportacaoComponent implements OnInit {

    filter: FilterResult;
    loading = true;
    errored = false;

    spinner = false;
    message = false;

    importerSelected = true;

    filtro: Filter = { importers: [] };

    constructor() {

        /*if(!this.importerSelected && this.filtro.importers.length > 0){
            this.importerSelected = true;
        }*/

        setTimeout(() => {
            this.loading = false;
        }, 2000);
    }

    ngOnInit() { }

    fileChange(event: any){

        this.spinner = true;

        setTimeout(() => {
            this.spinner = false;
            this.message = true;
        }, 2000);        
    }
}
