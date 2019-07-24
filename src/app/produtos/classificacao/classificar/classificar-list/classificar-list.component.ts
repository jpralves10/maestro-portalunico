import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { IResult, IResultItem } from 'src/app/produtos/shared/models/classificar.result.model';
import { ClassificarListDataSource } from './classificar-list-datasource';
import { SelectionModel } from '@angular/cdk/collections';
import { ResultService } from 'src/app/produtos/shared/services/classificar.result.service';
import { ProdutoService } from 'src/app/produtos/shared/services/produtos.service';
import { ModelosClassificarComponent } from './modelos-classificar/modelos-classificar.component';
import { ProdutosEditComponent } from './produtos-edit/produtos-edit.component';
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
        private produtoService: ProdutoService,
        private _snackBar: MatSnackBar
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

    deselectAll() {
        this.selection.clear();
        this.paginator.firstPage();
    }

    openModelo(row: IClassificar){
        const modalProduto = this.modalService.open(ProdutosEditComponent, {size: '900', centered: true});
        
        if(row.produto.descricao == undefined || row.produto.descricao.length == 0){
            row.produto.descricao = row.produto.descricaoBruta
        }
        
        modalProduto.componentInstance.produto = row.produto
        modalProduto.result.then((result) => {

            row.produto = result

            const modalFormulario = this.modalService.open(ModelosClassificarComponent, {size: '900', centered: true});
            modalFormulario.componentInstance.modelosClassificar = [row.classificacao]

            modalFormulario.result.then((formularios) => {

                if(formularios.length > 0){
                    row.classificacao = formularios[0]
                    row.dataAtualizacao = new Date()
                    row.status = "Classificado"

                    this.produtoService.setClassificar(row).subscribe(res => {
                        if(res == '200'){
                            this._snackBar.open('Modelo de formulário foi vinculado!', 'Sucesso', {
                                duration: 5000,
                            });
                        }
                    })
                }
            }, (reason) => {});
            
        }, (reason) => {});
    }

    editModelo(row: IClassificar){
        this.router.navigate([`/classificacao-classificar/classificar-edit`], {
            relativeTo: this.route,
            replaceUrl: false,
            queryParams: {
                filterClassificarList: JSON.stringify({...row})
            }
        });
    }

    getQtdClassificarSelecionados(){
        return this.selection.selected.length > 1 ? '' + this.selection.selected.length + ' ' + 'classificar selecionados' :
               this.selection.selected.length > 0 ? '' + this.selection.selected.length + ' ' + 'classificar selecionado' :  ''
    }
}
