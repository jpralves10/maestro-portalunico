import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { Input } from '@angular/core';
import { map, filter } from 'rxjs/operators';
import { Observable, of as observableOf, merge, from } from 'rxjs';
import { IResultItem } from '../../../shared/models/classificar.result.model';
import { ResultService } from '../../../shared/services/classificar.result.service';
import { IClassificar } from 'src/app/produtos/shared/models/classificar.model';

export class PreencherListDataSource extends DataSource<IClassificar> {

    @Input()
    public data: IClassificar[];
    public fullData: IClassificar[];
    public filteredData: IClassificar[];

    public filtro: IResultItem;
    public dataObservable: Observable<any>;

    constructor(
        private paginator: MatPaginator,
        private sort: MatSort,
        private resultService: ResultService,
        data: IClassificar[]
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
    connect(): Observable<IClassificar[]> {
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

    public getFilteredData(data: IClassificar[]): IClassificar[] {

        const { classificar } = this.filtro;

        let newData = data;

        if (classificar.codigo != null) {
            newData = newData.filter(d =>
                d.codigo == classificar.codigo
            );
        }
        if (classificar.titulo !== '') {
            newData = newData.filter(d =>
                d.titulo.toUpperCase().includes(classificar.titulo.toUpperCase())
            );
        }
        if (classificar.status !== '') {
            newData = newData.filter(d =>
                d.status.toUpperCase().includes(classificar.status.toUpperCase())
            );
        }
        if (classificar.dataAtualizacao != null) {
            newData = newData.filter(d =>
                d.dataAtualizacao.toString().toUpperCase().includes(classificar.dataAtualizacao.toString().toUpperCase())
            );
        }
        if (classificar.usuario != undefined && (classificar.usuario.nome != '' || classificar.usuario.email != '')) {
            newData = newData.filter(d =>
                d.usuario.nome.toUpperCase().includes(classificar.usuario.nome.toUpperCase()),
            );
            newData = newData.filter(d =>
                d.usuario.email.toUpperCase().includes(classificar.usuario.email.toUpperCase()),
            );
        }
        if (classificar.produto != null) {
            newData = newData.filter(d =>
                d.produto.descricaoBruta.toUpperCase().includes(classificar.produto.descricaoBruta.toUpperCase())
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
    public getPagedData(data: IClassificar[]) {
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        return data.splice(startIndex, this.paginator.pageSize);
    }

    /**
     * Sort the data (client-side). If you're using server-side sorting,
     * this would be replaced by requesting the appropriate data from the server.
     */
    public getSortedData(data: IClassificar[]) {

        if (!this.sort.active || this.sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            const isAsc = this.sort.direction === 'asc';
            switch (this.sort.active) {
                case 'codigo':
                    return compare(a.codigo, b.codigo, isAsc);
                case 'titulo':
                    return compare(a.titulo, b.titulo, isAsc);
                case 'status':
                    return compare(a.status, b.status, isAsc);
                case 'dataAtualizacao':
                    return compare(a.dataAtualizacao, b.dataAtualizacao, isAsc);
                case 'usuario':
                    return compare(a.usuario.nome, b.usuario.nome, isAsc);
                case 'produto':
                    return compare(a.produto.descricaoBruta, b.produto.descricaoBruta, isAsc);
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