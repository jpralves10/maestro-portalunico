import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';

import { IImporter } from '../../models/importer.model';
import { SelectionModel } from '@angular/cdk/collections';

import { ImportersListDataSource } from './importers-list-datasource';
import { IFilter, IFilterItem } from '../filter.model';
import { FilterSourceService } from '../../service/filter.source.service';

@Component({
    selector: 'app-importers-list',
    templateUrl: './importers-list.component.html',
    styleUrls: ['./importers-list.component.scss']
})
export class ImportersListComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    @Input() data: IImporter[];

    selection = new SelectionModel<IImporter>(true, []);
    dataSource: ImportersListDataSource;
    displayedColumns = ['select', 'name', 'cpf_cnpj'];

    public filtroValue: IFilterItem;
    public currentFilter: IFilter;

    constructor(
        private filterSourceService: FilterSourceService
    ) {
        filterSourceService.filter.subscribe(f => (this.filtroValue = f));

        filterSourceService.filterResult.subscribe(fr => (this.currentFilter = fr));

        this.selection.changed.subscribe(() => {
            filterSourceService.changeFilterResult({
                ...this.currentFilter,
                importers: this.selection.selected
            });
        });
    }

    ngOnInit() {
        this.dataSource = new ImportersListDataSource(
            this.paginator,
            this.sort,
            this.filterSourceService,
            this.data
        );
    }

    ngAfterViewInit() {
        this.filterSourceService.whenUpdatedSource.next([
            ...this.filterSourceService.whenUpdated,
            this.paginator
        ]);
    }

    masterToggle() {
        const visibleData = this.getVisibleData();
        const allSelected = this.isAllSelected();

        if (allSelected) {
            this.selection.deselect(...visibleData);
        } else {
            this.selection.select(...visibleData);
        }
        return;
    }

    getVisibleData() {
        return this.dataSource.getUpdatedData();
    }

    isAllSelected() {
        const visibleData = this.dataSource.getUpdatedData();
        return !visibleData.some(
            ds => !this.selection.selected.some(s => s.cpf_cnpj === ds.cpf_cnpj)
        );
    }

    deselectAll() {
        this.selection.clear();
        this.paginator.firstPage();
    }

    clearCheckbox(row: any){
        this.selection.clear();
    }

    getQtdImportersListSelecionados(){
        return this.selection.selected.length > 1 ? '' + this.selection.selected.length + ' ' + 'importadores selecionados' :
               this.selection.selected.length > 0 ? '' + this.selection.selected.length + ' ' + 'importador selecionado' :  ''
    }
}