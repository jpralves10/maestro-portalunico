import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Filter, FilterItem, FilterResult } from '../../shared/models/unificacao.filter.model';

import { ProdutoService } from '../../shared/services/produtos.service';
import { FilterService } from '../../shared/services/unificacao.filter.service';
import { ImportersListComponent } from './importers-list/importers-list.component';
import { Importer } from '../../shared/models/importer.model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

    data: Filter = null;
    loading = true;
    errored = false;

    @Input() current_filtro: FilterItem = {
        importer: {cpf_cnpj: '', name: ''}
    };

    filtro: Filter = { importers: [] };

    constructor(
        private produtoService: ProdutoService,
        private filterService: FilterService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        filterService.filterResult.subscribe(f => {
            this.filtro = f;
        });
    }

    ngOnInit() {
        this.filterService.resetFilter();

        /* Mock */
        /*
        this.data = this.getMockDados();
        window.sessionStorage.setItem('filter', JSON.stringify(this.data));
        this.loading = false;

        /* End Mock */

        this.produtoService.getDadosFiltro().subscribe(
            data => {
                this.data = this.getDataTransformed(data);
                window.sessionStorage.setItem('filter', JSON.stringify(this.data));
                this.loading = false;
            },
            error => { this.errored = true; }
        );

        this.filterService.clearFilter();
    }

    public getDataTransformed(data: any): Filter {
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

    public updateFiltro() {
        this.filterService.changeFilter(this.current_filtro);
    }

    public updateFiltroFinal() {
        this.filterService.changeFilterResult(this.filtro);
    }

    public generateReport() {
        this.router.navigate([`./result`], {
            relativeTo: this.route,
            replaceUrl: true,
            queryParams: {
                filter: this.getFilterAsString()
            }
        });
    }

    public getFilterAsString(): string {

        var cnpjRaiz = this.filtro.importers.map(i => 
            i.cpf_cnpj.replace(/[/\/\-\.]/g, '').substring(0, 8)
        );

        return JSON.stringify({
            importers: cnpjRaiz,
            importadores: this.listaCNPJ(cnpjRaiz),
            status: ['Pendente'],
            start_date: this.filtro.data_inicio,
            end_date: this.filtro.data_fim
        } as FilterResult);
    }

    public listaCNPJ(cnpjRaiz: string[]): [{}]{

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

    /* Mock Dados */

    getMockDados(): Filter{

        var importer: Importer = {
            id: null,
            cpf_cnpj: '08532602000100',
            name: 'Importador Curitiba Ltda'
        }

        var importer2 = {...importer};
        importer2.cpf_cnpj = "34332602000111";
        importer2.name = "Importador de Automóveis Ltda";

        var importer3 = {...importer};
        var importer4 = {...importer};
        var importer5 = {...importer};
        var importer6 = {...importer};
        var importer7 = {...importer};
        var importer8 = {...importer};
        var importer9 = {...importer};
        var importer10 = {...importer};
        var importer11 = {...importer};

        var importersList: Importer[] = [];
        importersList.push(
            importer,
            importer2,
            importer3,
            importer4,
            importer5,
            importer6,
            importer7,
            importer8,
            importer9,
            importer10,
            importer11
        );

        let codigo = 0;

        importersList.forEach(importer => {
            importer.id = ++codigo + '';
        })

        let date = new Date();
        let start_date = new Date(date.setMonth(date.getMonth() - 12));

        let filter: Filter = {
            importers: importersList,
            data_inicio: start_date,
            data_fim: new Date()
        }

        return filter;
    }
}