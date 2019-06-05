import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { Input } from '@angular/core';
import { map, filter } from 'rxjs/operators';
import { Observable, of as observableOf, merge, from } from 'rxjs';
import { IFormulario } from '../../../shared/models/formulario.model';
import { IResultItem } from '../../../shared/models/formulario.result.model';
import { ResultService } from '../../../shared/services/formularios.result.service';

export class ModelosListDataSource extends DataSource<IFormulario> {

    @Input()
    public data: IFormulario[];
    public fullData: IFormulario[];
    public filteredData: IFormulario[];

    public filtro: IResultItem;
    public dataObservable: Observable<any>;

    constructor(
        private paginator: MatPaginator,
        private sort: MatSort,
        private resultService: ResultService,
        data: IFormulario[]
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
    connect(): Observable<IFormulario[]> {
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
        var sortedFormularios = this.getPagedData(this.getSortedData(this.filteredData));

        //this.formulariosList.setChartList(sortedFormularios);

        return sortedFormularios;
    }

    /**
     *  Called when the table is being destroyed. Use this function, to clean up
     * any open connections or free any held resources that were set up during connect.
     */
    disconnect() {}

    public getFilteredData(data: IFormulario[]): IFormulario[] {

        const { formulario } = this.filtro;

        let newData = data;

        if (formulario.spreadsheetId !== '') {
            newData = newData.filter(d =>
                d.spreadsheetId.toUpperCase().includes(formulario.spreadsheetId.toUpperCase())
            );
        }
        if (formulario.idSheet !== null) {
            newData = newData.filter(d =>
                d.idSheet == formulario.idSheet
            );
        }
        if (formulario.titulo !== '') {
            newData = newData.filter(d =>
                d.titulo.toUpperCase().includes(formulario.titulo.toUpperCase())
            );
        }
        if (formulario.status !== '') {
            newData = newData.filter(d =>
                d.status.toUpperCase().includes(formulario.status.toUpperCase())
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
    public getPagedData(data: IFormulario[]) {
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        return data.splice(startIndex, this.paginator.pageSize);
    }

    /**
     * Sort the data (client-side). If you're using server-side sorting,
     * this would be replaced by requesting the appropriate data from the server.
     */
    public getSortedData(data: IFormulario[]) {

        if (!this.sort.active || this.sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            const isAsc = this.sort.direction === 'asc';
            switch (this.sort.active) {
                /*case 'spreadsheetId':
                    return compare(a.spreadsheetId, b.spreadsheetId, isAsc);*/
                case 'titulo':
                    return compare(a.titulo, b.titulo, isAsc);
                case 'status':
                    return compare(a.status, b.status, isAsc);
                /*case 'status':
                    return compare(a.status, b.status, isAsc);*/
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