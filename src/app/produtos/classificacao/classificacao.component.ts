import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProdutoService } from '../shared/services/produtos.service';
import $ from "jquery";
import { IClassificacao, Classificacao } from '../shared/models/classificacao.model';
import { IColuna, IResposta, IComentario } from '../shared/models/classificacao.legendas';

@Component({
  selector: 'app-classificacao',
  templateUrl: './classificacao.component.html',
  styleUrls: ['./classificacao.component.scss']
})
export class ClassificacaoComponent implements OnInit {

    //classificacoes: IClassificacao[] = [];
    classificacao: IClassificacao = new Classificacao();
    colunas: IColuna[] = [];

    comentarios: IComentario[] = [];
    comentario = {} as IComentario;

    userInfo:any = {};

    constructor(
        private produtoService: ProdutoService
    ) {
        this.classificacao.idSheet = 1997890537;
        this.userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.obterClassificacao();
    }

    ngOnInit() { }

    ngAfterViewInit() {
        //this.validaFormGoogle();

        /*var frame = document.querySelector('#frameForms') as any;
        frame.onload = () => {
            const doc = (frame as any).contentDocument;
            var x = doc.querySelectorAll(".freebirdFormviewerViewItemsItemItemTitle");
            x[0].innerHTML = "Hello World!";
            alert(x);
        }*/
    }

    obterClassificacao(){
        this.produtoService.getClassificacao(this.classificacao).subscribe(classificacao => {
            console.log(classificacao);
            if(classificacao != undefined && classificacao != null){
                this.classificacao = classificacao;
                this.carregarColunas();
            }
        });
    }

    carregarColunas(){
        if(this.classificacao.colunas != undefined && this.classificacao.colunas.length > 0){
            this.classificacao.colunas.forEach(coluna => {
                if(coluna.idColuna > 1){
                    coluna.comentarios = 'disabled'
                    coluna.selecionada = false
                    this.colunas.push(coluna)
                }
            });

            this.classificacao.comentarios.forEach(comentario => {
                this.colunas.forEach(coluna => {
                    if(comentario.idColuna == coluna.idColuna){
                        coluna.comentarios = 'enabled'
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

    printComentarios(idColuna:number){

        this.comentario.idColuna = idColuna;

        this.colunas.forEach(coluna => {
            if(coluna.idColuna != idColuna){
                coluna.selecionada = false
            }else{
                coluna.selecionada = true
            }

            //$( "#msg-" + coluna.idColuna ).css("display","table");

            if(coluna.idColuna == idColuna && coluna.comentarios == 'enabled'){
                var msg = document.querySelector('#msg-' + coluna.idColuna) as any;
                msg.style.display = 'none';

                //$( "#msg-" + coluna.idColuna ).css("display","none");
            }else if(coluna.idColuna == idColuna && coluna.comentarios == 'disabled'){

                var msg = document.querySelector('#msg-' + coluna.idColuna) as any;
                msg.style.display = 'table';

                //$( "#msg-" + coluna.idColuna ).css("display","table");
            }
        })

        //$( "#"+idColuna ).css({"background":"#EAECEE", "color": "#808B96"});
        $( ".content-campos" ).css("max-height","200px");
        $( ".comment-fields" ).css("display","grid");

        this.comentarios = [];

        if(this.classificacao.comentarios.length > 0){
            this.classificacao.comentarios.forEach(comentario => {
                if(comentario.idColuna == idColuna){
                    comentario.idUsuario == this.userInfo.email ? 
                    comentario.side = 'right' : comentario.side = 'left';

                    comentario.dataCriacao = new Date(comentario.dataCriacao); 
                    this.comentarios.push(comentario);
                }
            })
        }
    }

    salvarComentario(){
        if(this.comentario.descricao != undefined && this.comentario.descricao.length > 0){
            let nmUsuario = this.userInfo.firstName + ' ' + this.userInfo.lastName;
            this.comentario.idSheet = this.classificacao.idSheet;
            this.comentario.idComentario = null;
            this.comentario.idResposta = this.userInfo.email;
            this.comentario.idUsuario = this.userInfo.email;
            this.comentario.nmUsuario = nmUsuario;
            this.comentario.status = 'Pendente';
            this.comentario.dataCriacao = new Date();
            this.comentario.dataAtualizacao = new Date();
            this.comentario.side = undefined;

            this.produtoService.setComentario(this.comentario).subscribe(classificacao => {
                console.log(classificacao);

                this.classificacao = classificacao;
                this.comentario.descricao = '';
                this.carregarColunas();
                this.printComentarios(this.comentario.idColuna);
            });
        }
    }
}