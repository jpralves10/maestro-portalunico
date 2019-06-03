import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PageEvent } from '@angular/material';

import { Produto } from '../../shared/models/produto.model';
import { ProdutosListDataSource } from './produtos-list-datasource';
import { ResultItem } from '../../shared/models/unificacao.result.model';
import { Result } from '../../shared/models/unificacao.result.model';
import { ResultService } from '../../shared/services/unificacao.result.service';
import { FilterResult } from '../../../shared/filter/filter.model';
import { ProdutosInfoDialog } from '../produtos-info/produtos-info.dialog'

import { Chart } from 'chart.js';

@Component({
    selector: 'app-produtos-list',
    templateUrl: './produtos-list.component.html',
    styleUrls: ['./produtos-list.component.scss']
})
export class ProdutosListComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    
    @Input() data: Produto[];
    @Input() status: string[];
    @Input() filter: FilterResult;

    pageEvent:any = PageEvent;

    statusOld: string[];
    eventTable: number = 0;

    dataSource: ProdutosListDataSource;
    selection = new SelectionModel<Produto>(true, []);
    displayedColumns = ['descricaoBruta', 'ncm', 'quantidade', 'canal'];

    public filtroValue: ResultItem;
    public currentFilter: Result;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private resultService: ResultService,
        private modalService: NgbModal
    ) {
        resultService.filter.subscribe(f => (this.filtroValue = f));
        resultService.filterResult.subscribe(fr => (this.currentFilter = fr));

        this.selection.changed.subscribe(() => {
            resultService.changeFilterResult({
                ...this.currentFilter,
                produtos: this.selection.selected
            });
        });
    }

    ngOnInit() {
        this.statusOld = [...this.status]

        this.dataSource = new ProdutosListDataSource(
            this.filter,
            this.paginator,
            this.sort,
            this.resultService,
            this.data
        );
    }

    ngAfterViewInit() {
        this.resultService.whenUpdatedSource.next([
            ...this.resultService.whenUpdated,
            this.paginator
        ]);

        this.setChartList(this.getVisibleData());
    }
    
    /** Filtro Mat Table **/

    updateFiltro() {
        this.resultService.changeFilter(this.filtroValue);
    }

    updateDataSource(data: Produto[]){
        this.dataSource.data = [...data];
        this.dataSource.fullData = [...data];
        this.updateFiltro();
    }

    getVisibleData() {
        return this.dataSource.getUpdatedData();
    }

    isAllSelected() {
        const visibleData = this.dataSource.getUpdatedData();
        return !visibleData.some(
            ds => !this.selection.selected.some(s => s.descricao === ds.descricao)
        );
    }

    deselectAll() {
        this.selection.clear();
        this.paginator.firstPage();
    }

    editRowProduto(row: Produto){
        this.router.navigate([`/unificacao/unificacao-edit`], {
            relativeTo: this.route,
            replaceUrl: false,
            queryParams: {
                filterUnificacao: JSON.stringify({...row})
            }
        });
    }

    openDialogDeclaracoes(row: Produto): void {
        var modalRef = this.modalService.open(ProdutosInfoDialog);
        modalRef.componentInstance.produto = row;
    }

    /** Chart Doughnut **/

    setChartList(produtos: Produto[]){
        produtos.forEach(produto =>{
            let ctx = document.getElementById("list-" + produto._id);
            new Chart(ctx, this.getChartDoughnut(produto));
        });
    }

    projectContentChanged(event: any){
        if(
            this.eventTable == 1 || 
            this.statusOld.length != this.status.length
        ){
            this.setChartList(this.getVisibleData());

            this.eventTable = 0;
            this.statusOld = [...this.status]
        }
    }

    projectSortData(event: any){
        if(event != undefined){
            this.eventTable = 1;
        }
    }

    projectPageEvent(event: any){
        if(event != undefined){
            this.eventTable = 1;
        }
    }

    getChartDoughnut(produto: Produto){

        Chart.defaults.global.legend.display = false;
        Chart.defaults.global.tooltips.enabled = false;

        let data = {
            labels: [
                'Canal Verde',
                'Canal Amarelo',
                'Canal Vermelho',
                'Canal Cinza'
            ],
            //labels: [],
            datasets: [
                {
                    data: produto.chartCanais, //[10, 20, 30, 40],
                    backgroundColor: [
                        "#6BD19E",
                        "#F9E79F",
                        "#F5B7B1",
                        "#CCD1D1",
                        "#E8DAEF"
                    ]
                }
            ]
        };

        let options: {
            showTooltips: false,
            fullWidth: true,
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }

        return {
            type: 'doughnut',
            data: data,
            options: options
        }
    }
}