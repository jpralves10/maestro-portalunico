import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProdutoService } from '../../shared/services/produtos.service';
import $ from "jquery";
import { IClassificacao } from '../../shared/models/classificacao.model';
import { IColuna, IResposta, IComentario } from '../../shared/models/classificacao.legendas';

@Component({
    selector: 'app-classificacao',
    templateUrl: './classificacao.component.html',
    styleUrls: ['./classificacao.component.scss']
})
export class ClassificacaoComponent implements OnInit {

    //classificacoes: IClassificacao[] = [];
    classificacao = {} as IClassificacao;
    colunas: IColuna[] = [];
    coluna = {} as IColuna;

    comentarios: IComentario[] = [];
    comentario = {} as IComentario;

    userInfo:any = {};

    url = ''

    constructor(
        private produtoService: ProdutoService,
        private hostElement: ElementRef
    ) {
        this.classificacao = {
            spreadsheetId: '1PZCLAymlsaBO1GLFPGxjZSONkYGwy-tYBeXyIDibjaQ',
            idSheet: 1997890537
        };

        this.userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.url = 'https://docs.google.com/forms/d/e/1FAIpQLSft8XkeMuh0vuhQl77FaGCkRLCMn4KEyG5OCURe0Jnw8q-7sA/viewform?embedded=true';
        this.obterClassificacao();
    }

    ngOnInit() {
        const iframe = this.hostElement.nativeElement.querySelector('iframe');
        iframe.src = this.url;
    }

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
        this.produtoService.getClassificacao(this.classificacao).subscribe(classificacoes => {

            if(classificacoes.length > 0){
                this.setSortClassificacoes(classificacoes);
                let classificacao = classificacoes[0];
                this.classificacao = classificacao;
                this.carregarColunas();
            }
        });
    }

    carregarColunas(){
        if(this.classificacao.colunas != undefined && this.classificacao.colunas.length > 0){

            this.classificacao.colunas.forEach(coluna => {
                if(coluna.idColuna > 1){
                    coluna.comentarios = false
                    coluna.selecionada = false
                    coluna.pendentes = 0
                    this.colunas.push(coluna)
                }
            });

            this.classificacao.comentarios.forEach(comentario => {
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

        if(this.classificacao.comentarios.length > 0){
            this.classificacao.comentarios.forEach(comentario => {
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
            this.comentario.idSheet = this.classificacao.idSheet;
            this.comentario.sheetVersao = this.classificacao.version;
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
                    this.classificacao = classificacoes[0];

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