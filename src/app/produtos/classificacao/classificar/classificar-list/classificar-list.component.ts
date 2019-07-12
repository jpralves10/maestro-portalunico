import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { IResult, IResultItem } from 'src/app/produtos/shared/models/classificar.result.model';
import { ClassificarListDataSource } from './classificar-list-datasource';
import { SelectionModel } from '@angular/cdk/collections';
import { ResultService } from 'src/app/produtos/shared/services/classificar.result.service';
import { ProdutoService } from 'src/app/produtos/shared/services/produtos.service';
import { ModelosClassificarComponent } from './modelos-classificar/modelos-classificar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IClassificar } from 'src/app/produtos/shared/models/classificar.model';

@Component({
    selector: 'app-classificar-list',
    templateUrl: './classificar-list.component.html',
    styleUrls: ['./classificar-list.component.scss']
})
export class ClassificarListComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    @Input() data: IClassificar[];

    formulario = {} as IClassificar;

    dataSource: ClassificarListDataSource;
    selection = new SelectionModel<IClassificar>(true, []);
    displayedColumns = ['titulo', 'status', 'dataAtualizacao', 'operacoes'];

    public filtroValue: IResultItem;
    public currentFilter: IResult;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private resultService: ResultService,
        private produtoService: ProdutoService
    ) {
        resultService.filter.subscribe(f => (this.filtroValue = f));
        resultService.filterResult.subscribe(fr => (this.currentFilter = fr));

        this.selection.changed.subscribe(() => {
            resultService.changeFilterResult({
                ...this.currentFilter,
                classificar: this.selection.selected
            });
        });
    }

    ngOnInit() {
        this.dataSource = new ClassificarListDataSource(
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
    }

    /** Filtro Mat Table **/

    updateFiltro() {
        this.resultService.changeFilter(this.filtroValue);
    }

    updateDataSource(data: IClassificar[]){
        this.dataSource.data = [...data];
        this.dataSource.fullData = [...data];
        this.updateFiltro();
    }

    openModelo(row: IClassificar){
        const modalFormulario = this.modalService.open(ModelosClassificarComponent, {size: '900', centered: true});
        //modalFormulario.componentInstance.formulariosClassificar = this.formulario;

        modalFormulario.result.then((formularios) => {
            let flFormulario = false
            
            /*formularios.forEach(mdFormulario => {
                this.formulario.formularios.forEach(categoria => {
                    if(categoria.codigo == mdFormulario.codigo){
                        flFormulario = true
                    }
                })

                if(!flFormulario){
                    this.formulario.formularios.push(mdFormulario)
                }
            })
            this.formulario.formularios = formularios;*/

        }, (reason) => {});
    }

    editModelo(row: IClassificar){
        this.router.navigate([`/classificacao-classificar/classificar-edit`], {
            relativeTo: this.route,
            replaceUrl: false,
            queryParams: {
                filterFormulario: JSON.stringify({...row})
            }
        });
    }

    getQtdClassificarSelecionados(){
        return this.selection.selected.length > 1 ? '' + this.selection.selected.length + ' ' + 'classificar selecionados' :
               this.selection.selected.length > 0 ? '' + this.selection.selected.length + ' ' + 'classificar selecionado' :  ''
    }
}
