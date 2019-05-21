import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { IImporter } from '../../models/importer.model';
import { Input } from '@angular/core';
import { FilterItem } from '../filter.model';
import { FilterSourceService } from '../../service/filter.source.service';

export class ImportersListDataSource extends DataSource<IImporter> {
    
    @Input()
    public data: IImporter[];
    public fullData: IImporter[];
    public filteredData: IImporter[];

    public filtro: FilterItem;

    constructor(
        private paginator: MatPaginator,
        private sort: MatSort,
        private filterService: FilterSourceService,
        data: IImporter[]
    ) {
        super();
        this.data = [...data];
        this.fullData = [...data];
        this.filterService.filterSource.subscribe(filtro => (this.filtro = filtro));
    }

    /**
     * Connect this data source to the table. The table will only update when
     * the returned stream emits new items.
     * @returns A stream of the items to be rendered.
     */
    connect(): Observable<IImporter[]> {
        // Combine everything that affects the rendered data into one update
        // stream for the data-table to consume.
        const dataMutations = [
            observableOf(this.data),
            this.filterService.filterSource,
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

    public getFilteredData(data: IImporter[]): IImporter[] {
        const reReplace = /[/\/\-\.]/g;

        const { importer } = this.filtro;

        let newData = data;
        if (importer.cpf_cnpj !== '') {
            newData = newData.filter(d =>
            d.cpf_cnpj
                .replace(reReplace, '')
                .includes(importer.cpf_cnpj.replace(reReplace, ''))
            );
        }
        if (importer.name !== '') {
            newData = newData.filter(d =>
            d.name.toUpperCase().includes(importer.name.toUpperCase())
            );
        }
        return [...newData];
    }

    /**
     * Paginate the data (client-side). If you're using server-side pagination,
     * this would be replaced by requesting the appropriate data from the server.
     */
    public getPagedData(data: IImporter[]) {
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        return data.splice(startIndex, this.paginator.pageSize);
    }

    /**
     * Sort the data (client-side). If you're using server-side sorting,
     * this would be replaced by requesting the appropriate data from the server.
     */
    public getSortedData(data: IImporter[]) {

        if (!this.sort.active || this.sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            const isAsc = this.sort.direction === 'asc';
            switch (this.sort.active) {
            case 'name':
                return compare(a.name, b.name, isAsc);
            case 'cpf_cnpj':
                return compare(+a.cpf_cnpj, +b.cpf_cnpj, isAsc);
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