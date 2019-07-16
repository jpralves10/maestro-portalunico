import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProdutoService } from 'src/app/produtos/shared/services/produtos.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material';

import { IColuna, IComentario } from '../../../shared/models/classificacao.legendas';
import { IClassificacao } from 'src/app/produtos/shared/models/classificacao.model';
import $ from "jquery";
import { IClassificar } from 'src/app/produtos/shared/models/classificar.model';

@Component({
    selector: 'app-preencher-edit',
    templateUrl: './preencher-edit.component.html',
    styleUrls: ['./preencher-edit.component.scss']
})
export class PreencherEditComponent implements OnInit {

    colunas: IColuna[] = [];
    coluna = {} as IColuna;

    comentarios: IComentario[] = [];
    comentario = {} as IComentario;

    userInfo:any = {};

    classificar = {} as IClassificar;

    loading = true;
    errored = false;
    finish = false;
    spinner = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private produtoService: ProdutoService,
        private hostElement: ElementRef,
        private _snackBar: MatSnackBar
    ) {
        this.route.queryParamMap.subscribe(paramMap => {
            this.classificar = JSON.parse(paramMap.get('filterFormulario'));

            if(this.classificar.classificacao.categorias == undefined){
                this.classificar.classificacao.categorias = []
            }

            this.obterClassificacao();
        });
    }

    ngOnInit() {
        const iframe = this.hostElement.nativeElement.querySelector('iframe');
        iframe.src = this.classificar.classificacao.iframe;
    }

    obterClassificacao(){
        this.produtoService.getClassificacao(this.classificar.classificacao).subscribe(classificacoes => {

            if(classificacoes.length > 0){
                this.setSortClassificacoes(classificacoes);
                let classificacao = classificacoes[0];
                this.classificar.classificacao = classificacao;
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

    validaFormGoogle(){
        this.produtoService.serverGoogle().subscribe(teste => {
            console.log(teste)
        });

        $( "#next-two" ).prop("disabled", false);
    }

    /* Chat Comment */

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
            this.comentario.sheetVersao = this.classificar.version;
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