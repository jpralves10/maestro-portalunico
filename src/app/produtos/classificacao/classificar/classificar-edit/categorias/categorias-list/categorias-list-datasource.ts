import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { Input } from '@angular/core';
import { ResultServiceCategorias } from '../../../../../shared/services/categorias.result.service'
import { ICategoriasForm } from 'src/app/produtos/shared/models/classificacao.legendas';
import { IResultItemCategorias } from 'src/app/produtos/shared/models/formulario.result.model';

export class CategoriasListDataSource extends DataSource<ICategoriasForm> {
    
    @Input()
    public data: ICategoriasForm[];
    public fullData: ICategoriasForm[];
    public filteredData: ICategoriasForm[];

    public filtro: IResultItemCategorias;

    constructor(
        private paginator: MatPaginator,
        private sort: MatSort,
        private filterService: ResultServiceCategorias,
        data: ICategoriasForm[]
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
    connect(): Observable<ICategoriasForm[]> {
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

    public getFilteredData(data: ICategoriasForm[]): ICategoriasForm[] {
        
        const { categoria } = this.filtro;

        let newData = data;

        if (categoria.codigo != null) {
            newData = newData.filter(d =>
                d.codigo == categoria.codigo
            );
        }
        if (categoria.descricao != undefined && categoria.descricao != '') {
            newData = newData.filter(d =>
                d.descricao.toUpperCase().includes(categoria.descricao.toUpperCase())
            );
        }

        /*if(this.filter.importadores.length > 0){

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
        }*/
        
        return [...newData];
    }

    /**
     * Paginate the data (client-side). If you're using server-side pagination,
     * this would be replaced by requesting the appropriate data from the server.
     */
    public getPagedData(data: ICategoriasForm[]) {
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        return data.splice(startIndex, this.paginator.pageSize);
    }

    /**
     * Sort the data (client-side). If you're using server-side sorting,
     * this would be replaced by requesting the appropriate data from the server.
     */
    public getSortedData(data: ICategoriasForm[]) {

        if (!this.sort.active || this.sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            const isAsc = this.sort.direction === 'asc';
            switch (this.sort.active) {
                case 'codigo':
                    return compare(a.codigo, b.codigo, isAsc);
                case 'descricao':
                    return compare(a.descricao, b.descricao, isAsc);
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