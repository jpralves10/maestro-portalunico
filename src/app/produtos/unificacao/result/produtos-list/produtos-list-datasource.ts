import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { Input } from '@angular/core';
import { map, filter } from 'rxjs/operators';
import { Observable, of as observableOf, merge, from } from 'rxjs';
import { Produto } from '../../../shared/models/produto.model';
import { ResultItem } from '../../../shared/models/unificacao.result.model';
import { ResultService } from '../../../shared/services/unificacao.result.service';
import { FilterResult } from '../../../shared/models/unificacao.filter.model';

export class ProdutosListDataSource extends DataSource<Produto> {

    @Input()
    public data: Produto[];
    public fullData: Produto[];
    public filteredData: Produto[];

    public filtro: ResultItem;

    public dataObservable: Observable<any>;

    constructor(
        private filter: FilterResult,
        private paginator: MatPaginator,
        private sort: MatSort,
        private resultService: ResultService,
        data: Produto[]
    ) {
        super();
        this.filter = filter;
        this.data = [...data];
        this.fullData = [...data];
        this.resultService.filterSource.subscribe(filtro => (this.filtro = filtro));
    }

    /**
     * Connect this data source to the table. The table will only update when
     * the returned stream emits new items.
     * @returns A stream of the items to be rendered.
     */
    connect(): Observable<Produto[]> {
        // Combine everything that affects the rendered data into one update
        // stream for the data-table to consume.
        const dataMutations = [
            observableOf(this.data),
            this.resultService.filterSource,
            this.paginator.page,
            this.sort.sortChange
        ];

        // Set the paginator's length
        this.paginator.length = this.data.length;

        return merge(...dataMutations).pipe(map(() => this.getUpdatedData()));
    }

    public getUpdatedData() {
        this.filteredData = this.getFilteredData(this.fullData);

        this.paginator.length = this.filteredData.length;
        var sortedProdutos = this.getPagedData(this.getSortedData(this.filteredData));

        //this.produtosList.setChartList(sortedProdutos);

        return sortedProdutos;
    }

    /**
     *  Called when the table is being destroyed. Use this function, to clean up
     * any open connections or free any held resources that were set up during connect.
     */
    disconnect() {}

    public getFilteredData(data: Produto[]): Produto[] {

        const { produto } = this.filtro;

        let newData = data;

        if (produto.numeroDI !== '') {
            newData = newData.filter(d =>
                d.numeroDI.includes(produto.numeroDI)
            );
        }
        if (produto.descricaoBruta !== '') {
            newData = newData.filter(d =>
                d.descricaoBruta.toUpperCase().includes(produto.descricaoBruta.toUpperCase())
            );
        }
        if (produto.ncm !== '') {
            newData = newData.filter(d =>
                d.ncm.includes(produto.ncm)
            );
        }
        /*if (produto.status !== '') {
            newData = newData.filter(d =>
                d.status.toUpperCase().includes(produto.status.toUpperCase())
            );
        }*/
        if (produto.operador !== '') {
            newData = newData.filter(d =>
                (d.fabricanteNome.toUpperCase() + d.fornecedorNome.toUpperCase()).includes(
                    produto.operador.toUpperCase()
                )
            );
        }

        if(this.filter.importadores.length > 0){

            var newProd = [...newData];

            newProd.forEach(data => {

                let existe = false;

                this.filter.importadores.forEach(importer => {
                    if(data.importadorNumero == importer.cnpj.replace(/[/\/\-\.]/g, '')){
                        existe = true;
                    }
                })
                if(!existe){
                    newData.splice(newData.indexOf(data), 1);
                }
            })
        }else{
            newData = [];
        }

        return [...newData];
    }

    /**
     * Paginate the data (client-side). If you're using server-side pagination,
     * this would be replaced by requesting the appropriate data from the server.
     */
    public getPagedData(data: Produto[]) {
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        return data.splice(startIndex, this.paginator.pageSize);
    }

    /**
     * Sort the data (client-side). If you're using server-side sorting,
     * this would be replaced by requesting the appropriate data from the server.
     */
    public getSortedData(data: Produto[]) {

        if (!this.sort.active || this.sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            const isAsc = this.sort.direction === 'asc';
            switch (this.sort.active) {
                /*case 'numeroDI':
                    return compare(a.numeroDI, b.numeroDI, isAsc);*/
                case 'descricaoBruta':
                    return compare(a.descricaoBruta, b.descricaoBruta, isAsc);
                case 'ncm':
                    return compare(a.ncm, b.ncm, isAsc);
                case 'canal':
                    return compare(a.canalDominante, b.canalDominante, isAsc);
                default:
                    return 0;
            }
        });
    }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}