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

    comentario = {} as IComentario;

    flComentar:boolean = false;
    flVisualizar:boolean = false;
    idColuna: number = -1;

    userInfo:any = {};

    constructor(
        private produtoService: ProdutoService
    ) {
        this.classificacao.idSheet = 1997890537;

        this.userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));

        this.produtoService.getClassificacao(this.classificacao).subscribe(classificacoes => {
            console.log(classificacoes);

            if(classificacoes.length == 1){
                this.classificacao = classificacoes[0];
                this.carregarColunas();
            }
        });
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

    carregarColunas(){
        if(this.classificacao.colunas.length > 0){
            this.classificacao.colunas.forEach(coluna => {
                if(coluna.idColuna > 1){
                    this.colunas.push(coluna)
                }
            })
        }
    }

    frameGoogle(event: any){
        console.log(event)

        var frame = event.target; //document.querySelector("#frameForms");
        const doc = (frame as any).contentWindow.document;

        var x = doc.querySelectorAll(".freebirdFormviewerViewItemsItemItemTitle");
        x[0].innerHTML = "Hello World!";
        alert(x);
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

    inserirComentario(){
        this.flComentar = true;
    }

    visualizarComentario(){
        this.flVisualizar = true;
    }

    salvarComentario(){

        /*export interface IComentario {
            idSheet: number,
            idComentario: number,
            idResposta: string,
            idColuna: number,
            idUsuario: string,
            status: string,
            descricao: string,
            dataCriacao: Date,
            dataAtualizacao: Date
        }*/

        this.comentario.idSheet = this.classificacao.idSheet;
        this.comentario.idComentario = null;
        this.comentario.idResposta = this.userInfo.email;
        this.comentario.idUsuario = this.userInfo.email;
        this.comentario.status = 'Pendente';
        this.comentario.dataCriacao = new Date();
        this.comentario.dataAtualizacao = new Date();

        

    }

    /* Mock Classificacao */


}