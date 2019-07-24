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

    idColuna:number;

    comentarios: IComentario[] = [];
    comentario = {} as IComentario;

    userInfo:any = {};
    classificar = {} as IClassificar;

    loading = true;
    errored = false;
    finish = false;
    spinner = false;

    body:string

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

            this.comentarios = [...this.classificar.classificacao.comentarios]

            this.userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))

            this.carregarColunas();
        });
    }

    ngOnInit() {
        const iframe = this.hostElement.nativeElement.querySelector('iframe');
        iframe.src = this.classificar.classificacao.iframe;
    }

    ngAfterViewInit() {
        //$( "input[aria-label='email']" ).prop("disabled", true);
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

    printDataCriacao(comentario:any){
        return typeof comentario.dataCriacao == "object" ? "" + 
        comentario.dataCriacao.toLocaleDateString() + " " + comentario.dataCriacao.toLocaleTimeString(
            [], {hour: '2-digit', minute:'2-digit'}
        ) : 
        "";
    }

    teste(event:any){
        $( "#" + event.srcElement.children[0].id ).css("display","none");
    }

    printComentarios(idColuna:number){

        this.idColuna = idColuna

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

        this.comentarios = []

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

        this.comentario = {} as IComentario;

        var objDiv = $( ".content-comment" )[0];
        objDiv.scrollTop = objDiv.scrollHeight;

        setTimeout(() => {
            
        }, 1);
    }

    salvarComentario(){
        if(this.comentario.descricao != undefined && this.comentario.descricao.length > 0){
            let nmUsuario = this.userInfo.firstName + ' ' + this.userInfo.lastName;
            this.comentario.idSheet = this.classificar.classificacao.idSheet;
            this.comentario.idColuna = this.idColuna;
            this.comentario.sheetVersao = this.classificar.version;
            this.comentario.idComentario = null;
            this.comentario.idResposta = this.userInfo.email;
            this.comentario.idProduto = this.classificar.produto._id;
            this.comentario.idUsuario = this.userInfo.email;
            this.comentario.nmUsuario = nmUsuario;
            this.comentario.status = 'Pendente';
            this.comentario.dataCriacao = new Date();
            this.comentario.dataAtualizacao = new Date();
            this.comentario.side = undefined;

            //this.comentario.idComentario = getIdComentario(classificacao);

            if(this.classificar.classificacao.comentarios.length > 0){
                let comentarios = [...this.classificar.classificacao.comentarios];
                comentarios.sort((a, b) => a.idComentario > b.idComentario ? 1 : -1 );
                this.comentario.idComentario = (comentarios.pop().idComentario + 1);
            }else{
                this.comentario.idComentario = 0;
            }

            this.comentarios.push(this.comentario);
            this.classificar.classificacao.comentarios.push(this.comentario)

            this.produtoService.setClassificarUpdate(this.classificar).subscribe(ret => {
                this.printComentarios(this.comentario.idColuna);
            });
        }
    }

    setSortClassificacoes = async (classificacoes:IClassificacao[]) => {
        classificacoes.sort((a, b) => a.version > b.version ? 1 : -1 );
    };

    onSubmit(event: Event){
        this.produtoService.setClassificarSpreed(this.classificar).subscribe(ret => {})
    }
}