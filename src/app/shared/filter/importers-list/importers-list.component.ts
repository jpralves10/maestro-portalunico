import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';

import { Importer } from '../../../produtos/shared/models/importer.model';
import { SelectionModel } from '@angular/cdk/collections';

import { ImportersListDataSource } from './importers-list-datasource';
import { FilterItem } from '../filter.model';
import { Filter } from '../filter.model';
import { FilterService } from '../../../produtos/shared/services/unificacao.filter.service';

@Component({
    selector: 'app-importers-list',
    templateUrl: './importers-list.component.html',
    styleUrls: ['./importers-list.component.scss']
})
export class ImportersListComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    
    @Input() data: Importer[];

    selection = new SelectionModel<Importer>(true, []);

    dataSource: ImportersListDataSource;

    displayedColumns = ['select', 'name', 'cpf_cnpj'];

    public filtroValue: FilterItem;
    public currentFilter: Filter;

    constructor(
        private filterService: FilterService
    ) {
        filterService.filter.subscribe(f => (this.filtroValue = f));

        filterService.filterResult.subscribe(fr => (this.currentFilter = fr));

        this.selection.changed.subscribe(() => {
            filterService.changeFilterResult({
                ...this.currentFilter,
                importers: this.selection.selected
            });
        });
    }

    ngOnInit() {
        this.dataSource = new ImportersListDataSource(
            this.paginator,
            this.sort,
            this.filterService,
            this.data
        );
    }

    ngAfterViewInit() {
        this.filterService.whenUpdatedSource.next([
            ...this.filterService.whenUpdated,
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
}