import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProdutoService } from 'src/app/produtos/shared/services/produtos.service';

import * as Util from '../../../../utilitarios/utilitarios';
import { msg_default_three } from 'src/app/utilitarios/mensagens.module';
import { CategoriasComponent } from './categorias/categorias.component';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ICategoriasForm, IComentario, IColuna } from 'src/app/produtos/shared/models/classificacao.legendas';

import { MatSnackBar } from '@angular/material';
import { IResult } from 'src/app/produtos/shared/models/formulario.result.model';
import { IClassificar } from 'src/app/produtos/shared/models/classificar.model';

import $ from "jquery";
import { IClassificacao } from 'src/app/produtos/shared/models/classificacao.model';

@Component({
    selector: 'app-classificar-edit',
    templateUrl: './classificar-edit.component.html',
    styleUrls: ['./classificar-edit.component.scss']
})
export class ClassificarEditComponent implements OnInit {

    classificar = {} as IClassificar;

    comentarios: IComentario[] = [];
    comentario = {} as IComentario;

    colunas: IColuna[] = [];
    coluna = {} as IColuna;

    userInfo:any = {};

    loading = true;
    errored = false;
    finish = false;
    spinner = false;

    //mensagem: any = {id: 0, tipo: '', class: '', lista: []};

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private produtoService: ProdutoService,
        private _snackBar: MatSnackBar
    ) {
        this.route.queryParamMap.subscribe(paramMap => {
            this.classificar = JSON.parse(paramMap.get('filterClassificarList'));

            if(this.classificar.classificacao.categorias == undefined){
                this.classificar.classificacao.categorias = []
            }

            this.obterClassificacao();            
        });
    }

    ngOnInit() {}

    /*openDialogCategorias(): void {
        const modalCategoria = this.modalService.open(CategoriasComponent, {size: '900', centered: true});
        //modalCategoria.componentInstance.categoriasClassificar = this.classificar.classificacao.categorias;

        modalCategoria.result.then((categorias) => {
            
        }, (reason) => {});
    }*/

    public voltarEtapa(){
        this.router.navigate([`/classificacao-classificar`], {
            relativeTo: this.route,
            replaceUrl: true,
            /*queryParams: {
                filter: this.getFilterAsString()
            }*/
        });
    }

    /* Chat Comment */

    obterClassificacao(){
        this.produtoService.getClassificacao(this.classificar.classificacao).subscribe(classificacoes => {

            if(classificacoes.length > 0){
                this.setSortClassificacoes(classificacoes);
                let formulario = classificacoes[0];
                this.classificar.classificacao = formulario;
                this.carregarColunas();
            }
        });
    }

    carregarColunas(){
        if(this.classificar.classificacao.colunas != undefined && this.classificar.classificacao.colunas.length > 0){

            this.classificar.classificacao.colunas.forEach(coluna => {
                if(coluna.idColuna > 1){
                    coluna.comentarios = false
                    coluna.selecionada = false
                    coluna.pendentes = 0
                    this.colunas.push(coluna)
                }
            });

            this.classificar.classificacao.comentarios.forEach(comentario => {
                this.colunas.forEach(coluna => {
                    if(comentario.idColuna == coluna.idColuna){
                        coluna.comentarios = true
                        coluna.pendentes = ++coluna.pendentes
                    }
                })
            })
        }
    }

    openForm(){
        document.getElementById("chatComment").style.display = "block";
    }

    closeForm(){
        document.getElementById("chatComment").style.display = "none";
    }

    teste(event:any){
        $( "#" + event.srcElement.children[0].id ).css("display","none");
    }

    printComentarios(idColuna:number){

        this.comentario.idColuna = idColuna;

        this.colunas.forEach(coluna => {
            if(coluna.idColuna != idColuna){
                coluna.selecionada = false
            }else{
                coluna.selecionada = true
                coluna.comentarios = true
                this.coluna = coluna;
            }
        })

        $( ".content-campos" ).css("max-height","200px");
        $( ".comment-fields" ).css("display","grid");

        this.comentarios = [];

        if(this.classificar.classificacao.comentarios.length > 0){
            this.classificar.classificacao.comentarios.forEach(comentario => {
                if(comentario.idColuna == idColuna){
                    comentario.idUsuario == this.userInfo.email ? 
                    comentario.side = 'right' : comentario.side = 'left';

                    comentario.idUsuario == this.userInfo.email ? 
                    comentario.status = 'Pendente' :
                    comentario.status = 'Visualizado';

                    comentario.dataCriacao = new Date(comentario.dataCriacao);
                    this.comentarios.push(comentario);
                }
            })
        }

        setTimeout(() => {
            this.produtoService.setComentarios(this.comentarios).subscribe(status => {
                //console.log(status);
            });

            var objDiv = $( ".content-comment" )[0];
            objDiv.scrollTop = objDiv.scrollHeight;
        }, 1);
    }

    salvarComentario(){
        if(this.comentario.descricao != undefined && this.comentario.descricao.length > 0){
            let nmUsuario = this.userInfo.firstName + ' ' + this.userInfo.lastName;
            this.comentario.idSheet = this.classificar.classificacao.idSheet;
            this.comentario.sheetVersao = this.classificar.classificacao.version;
            this.comentario.idComentario = null;
            this.comentario.idResposta = this.userInfo.email;
            this.comentario.idUsuario = this.userInfo.email;
            this.comentario.nmUsuario = nmUsuario;
            this.comentario.status = 'Pendente';
            this.comentario.dataCriacao = new Date();
            this.comentario.dataAtualizacao = new Date();
            this.comentario.side = undefined;

            this.produtoService.setComentarios([this.comentario]).subscribe(classificacoes => {
                if(classificacoes.length > 0){
                    this.classificar.classificacao = classificacoes[0];

                    this.comentario.descricao = '';
                    this.printComentarios(this.comentario.idColuna);
                }
            });
        }
    }

    setSortClassificacoes = async (classificacoes:IClassificacao[]) => {
        classificacoes.sort((a, b) => a.version > b.version ? 1 : -1 );
    };
}