import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { Produto } from '../../../shared/models/produto.model';
import { IResultItem } from '../../../shared/models/unificacao.result.model';
import { ResultService } from '../../../shared/services/unificacao.result.service';

export class ProdutosTwoDataSource extends DataSource<Produto> {

    @Input()
    public data: Produto[];
    public fullData: Produto[];
    public filteredData: Produto[];

    public filtro: IResultItem;

    constructor(
        private paginator: MatPaginator,
        private sort?: MatSort,
        private resultService?: ResultService,
        data?: Produto[]
    ) {
        super();
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
        return this.getPagedData(this.getSortedData(this.filteredData));
    }

    /**
     *  Called when the table is being destroyed. Use this function, to clean up
     * any open connections or free any held resources that were set up during connect.
     */
    disconnect() {}

    public getFilteredData(data: Produto[]): Produto[] {

        const { produto } = this.filtro;

        let newData = data;

        if (produto.descricaoBruta !== '') {
            newData = newData.filter(d =>
                d.descricaoBruta.toUpperCase().includes(produto.descricaoBruta.toUpperCase())
            );
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
                case 'descricaoBruta':
                    return compare(a.descricaoBruta, b.descricaoBruta, isAsc);
                case 'ncm':
                    return compare(a.ncm, b.ncm, isAsc);
                case 'quantidade':
                    return compare(a.quantidade, b.quantidade, isAsc);
                case 'similaridade':
                    return compare(a.compatibilidade.similaridade, b.compatibilidade.similaridade, isAsc);
                case 'canal':
                    return compare(a.compatibilidade.canalDominante, b.compatibilidade.canalDominante, isAsc);
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