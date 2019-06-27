import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { IFilter, IFilterItem, IFilterResult } from './filter.model';

import { FilterService } from '../service/filter.service';
import { FilterSourceService } from '../service/filter.source.service';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

    data: IFilter = null;
    loading = true;
    errored = false;

    closeResult: boolean = false;

    @Input() current_filtro: IFilterItem = {
        importer: {cpf_cnpj: '', name: ''}
    };

    filtro: IFilter = { importers: [] };

    constructor(
        private filterService: FilterService,
        private filterSourceService: FilterSourceService,
        private router: Router,
        private route: ActivatedRoute,
        public activeModal: NgbActiveModal
    ) {
        filterSourceService.filterResult.subscribe(f => {
            this.filtro = f;
        });
    }

    ngOnInit() {
        this.filterSourceService.resetFilter();

        this.filterService.getDadosFiltro().subscribe(
            data => {
                this.data = this.getDataTransformed(data);
                this.loading = false;
            },
            error => { this.errored = true; }
        );

        this.filterSourceService.clearFilter();
    }

    getDataTransformed(data: any): IFilter {
        return {
            importers: Object.keys(data.importers)
                .map(key => {
                    const importer = data.importers[key];
                    return {
                        id: key,
                        cpf_cnpj: importer.cpf_cnpj,
                        name: importer.name
                    };
                })
                .sort(a => a.name)
        }
    }

    updateFiltro() {
        this.filterSourceService.changeFilter(this.current_filtro);
    }

    updateFiltroFinal() {
        this.filterSourceService.changeFilterResult(this.filtro);
    }

    generateReport() {
        window.sessionStorage.setItem('result', this.getFilterAsString());
        window.sessionStorage.setItem('reload', this.route.snapshot['_routerState'].url);

        /*this.router.navigate([`./result`], {
            relativeTo: this.route,
            replaceUrl: true,
            queryParams: {
                filter: this.getFilterAsString()
            }
        });*/
    }

    getFilterAsString(): string {

        var cnpjRaiz = this.filtro.importers.map(i => 
            i.cpf_cnpj.replace(/[/\/\-\.]/g, '').substring(0, 8)
        );

        return JSON.stringify({
            importers: cnpjRaiz,
            importadores: this.listaCNPJ(cnpjRaiz),
            status: ['Pendente'],
            start_date: this.filtro.data_inicio,
            end_date: this.filtro.data_fim
        } as IFilterResult);
    }

    listaCNPJ(cnpjRaiz: string[]): [{}]{

        let listaImporters: any = [];

        if(cnpjRaiz.length > 0){

            for(let importer of this.data.importers){
                let cpf_cnpj = importer.cpf_cnpj.replace(/[/\/\-\.]/g, '');
    
                if(cpf_cnpj.includes(cnpjRaiz[0])){
                    listaImporters.push({
                        name: importer.name, 
                        cnpj: importer.cpf_cnpj, 
                        checked: true
                    });
                }
            }
        }
        return listaImporters;
    }
}