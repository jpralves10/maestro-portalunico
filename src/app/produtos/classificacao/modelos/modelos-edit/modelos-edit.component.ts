import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IFormulario } from 'src/app/produtos/shared/models/formulario.model';
import { ProdutoService } from 'src/app/produtos/shared/services/produtos.service';

import * as Util from '../../../../utilitarios/utilitarios';
import { msg_default_three } from 'src/app/utilitarios/mensagens.module';
import { MatTableDataSource } from '@angular/material';
import { CategoriasComponent } from './categorias/categorias.component';
import { SelectionModel } from '@angular/cdk/collections';

import { CategoriasEditDataSource } from './categorias-edit-datasource';
import { MatPaginator, MatSort } from '@angular/material';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ICategoriasForm } from 'src/app/produtos/shared/models/classificacao.legendas';
import { ResultServiceCategorias } from 'src/app/produtos/shared/services/categorias.result.service';

import { IResultCategorias, IResultItemCategorias } from '../../../shared/models/formulario.result.model';

@Component({
    selector: 'app-modelos-edit',
    templateUrl: './modelos-edit.component.html',
    styleUrls: ['./modelos-edit.component.scss']
})
export class ModelosEditComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    data: ICategoriasForm[];
    status: string[];
    //filter: IResultCategorias;

    formulario = {} as IFormulario;

    loading = true;
    errored = false;
    finish = false;
    spinner = false;

    mensagem: any = {id: 0, tipo: '', class: '', lista: []};

    categoriasDataSource: CategoriasEditDataSource;
    selection = new SelectionModel<ICategoriasForm>(true, []);
    categoriasColumns: string[] = ['codigo', 'descricao', 'operacao'];
    categorias_form = {} as { codigo: number, descricao: string };

    public filtroValue: IResultItemCategorias;
    public currentFilter: IResultCategorias;

    categoriasForm: ICategoriasForm[] = [];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private resultService: ResultServiceCategorias,
        private produtoService: ProdutoService
    ) {
        resultService.filter.subscribe(f => (this.filtroValue = f));
        resultService.filterResult.subscribe(fr => (this.currentFilter = fr));

        this.selection.changed.subscribe(() => {
            resultService.changeFilterResult({
                ...this.currentFilter,
                categorias: this.selection.selected
            });
        });

        this.loading = false;

        this.route.queryParamMap.subscribe(paramMap => {
            this.formulario = JSON.parse(paramMap.get('filterFormulario'));
        });
    }

    ngOnInit() {
        this.categoriasDataSource = new CategoriasEditDataSource(
            this.paginator,
            this.sort,
            this.resultService,
            [...this.formulario.categorias]
        );
    }

    ngAfterViewInit() {
        this.resultService.whenUpdatedSource.next([
            ...this.resultService.whenUpdated,
            this.paginator
        ]);
    }

    getVisibleData() {
        return this.categoriasDataSource.getUpdatedData();
    }

    isAllSelected() {
        const visibleData = this.categoriasDataSource.getUpdatedData();
        return !visibleData.some(
            ds => !this.selection.selected.some(s => s.descricao === ds.descricao)
        );
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

    setStatusFormulario(event:any){
        console.log('Status: ', event)
    }

    openDialogCategorias(): void {
        this.modalService.open(CategoriasComponent, {size: 'sm', centered: true}).result.then((categoria) => {
            console.log('Result', categoria)

            this.produtoService.setCategoriasForm(categoria).subscribe(categorias => {});

            /*this.formulario.categoria.push(this.categorias_form);
            this.categorias_form = {} as { codigo: number, descricao: string };
            this.updateCategoria();*/

        }, (reason) => {});
    }

    /*adicionarCategoria(){
        console.log(this.categorias_form)

        //if(this.categorias_form.length > 0){
            this.formulario.categoria.push(this.categorias_form);
            this.categorias_form = {} as { codigo: number, descricao: string };
            this.updateCategoria();
        //}
    }*/

    removeRowCategoria(row: { codigo: number, descricao: string }){
        this.formulario.categoria.splice(this.formulario.categoria.indexOf(row), 1);
        this.updateCategoria();
    }

    updateCategoria(){
        this.categoriasDataSource.data = [...this.formulario.categoria];
    }

    finalizarPreenchimento(){

        this.spinner = true;

        setTimeout(() => {
            this.validarCampos();
            this.spinner = false;

            if(this.mensagem.lista.length == 0){

                this.mensagem = null;
                this.setMensagem('message-alert-success');

                if(this.mensagem != null){

                    this.mensagem.lista = [];
                    this.mensagem.lista.push({chave: 0, valor: 'Formulário cadastrado com sucesso!'});

                    this.finish = true;

                    setTimeout(() => {
                        this.finish = false;
                        this.mensagem = null;

                        if(this.formulario.status == 'Novo'){
                            this.formulario.status = 'Ativo';
                        }

                        this.formulario.dataAtualizacao = new Date();
                        this.formulario.dataAtualizacao = new Date();

                        if(this.formulario.categoria.length <= 0){
                            this.formulario.categoria = undefined;
                        }

                        this.produtoService
                            .setFormularios([this.formulario])
                            .subscribe(versoes => {}, error => { this.errored = true;});

                        this.router.navigate([`/classificacao-modelos`], {
                            relativeTo: this.route,
                            replaceUrl: true//,
                            /*queryParams: {
                                filterModelos: this.getFilterAsString()
                            }*/
                        });

                    }, 2000);
                }
            }
        }, 500);
    }

    validarCampos(){

        this.setMensagem('message-alert-warning');

        if(this.mensagem != null){

            this.mensagem.lista = [];

            if(Util.isNullUndefined(this.formulario.titulo)){
                this.mensagem.lista.push({chave: 0, valor: 'Verificar preenchimento do campo \'Título\'.'});
            }else if(this.formulario.titulo.length <= 0 || this.formulario.titulo.length > 500){
                this.mensagem.lista.push({chave: 0, valor: 'Tamanho do campo \'Título\': de 1 a 500 caracteres.'});
            }

            if(Util.isNullUndefined(this.formulario.spreadsheetId)){
                this.mensagem.lista.push({chave: 0, valor: 'Verificar preenchimento do campo \'Planilha\'.'});
            }

            if(Util.isNullUndefined(this.formulario.idSheet)){
                this.mensagem.lista.push({chave: 0, valor: 'Verificar preenchimento do campo \'Folha\'.'});
            }

            if(this.formulario.categoria.length == 0){
                this.mensagem.lista.push({chave: 0, valor: 'Escolher uma das \'Categorias\' listadas abaixo.'});
            }
        }
    }

    setMensagem(tpMensagem: string) {
        this.mensagem = null;
        for(let msg of msg_default_three) {
            if(msg.tipo == tpMensagem){
                this.mensagem = msg;
            }
        }
    }

    /*getFilterAsString(): string {
        var date = new Date();
        var start_date = new Date(date.setMonth(date.getMonth() - 12));

        return JSON.stringify({
            formularios: [this.formulario],
            start_date: start_date,
            end_date: new Date()
        } as IFilterResult);
    }*/

    aprovarTodos(){
        const visibleData = this.getVisibleData();



        /*visibleData.forEach(row =>{
            if(row.status != 'Aprovado'){
                this.aprovarProduto(row);
            }
        });
        this.salvarAprovados();*/
    }

    public voltarEtapa(){
        this.router.navigate([`/classificacao-modelos`], {
            relativeTo: this.route,
            replaceUrl: true,
            /*queryParams: {
                filter: this.getFilterAsString()
            }*/
        });
    }
}