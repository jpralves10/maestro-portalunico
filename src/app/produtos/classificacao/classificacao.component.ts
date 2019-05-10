import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProdutoService } from '../shared/services/produtos.service';
import $ from "jquery";

@Component({
  selector: 'app-classificacao',
  templateUrl: './classificacao.component.html',
  styleUrls: ['./classificacao.component.scss']
})
export class ClassificacaoComponent implements OnInit {

    constructor(
        private produtoService: ProdutoService
    ) { }

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

    frameGoogle(event: any){
        console.log(event)

        var frame = event.target; //document.querySelector("#frameForms");
        const doc = (frame as any).contentWindow.document;

        var x = doc.querySelectorAll(".freebirdFormviewerViewItemsItemItemTitle");
        x[0].innerHTML = "Hello World!";
        alert(x);
    }

    public validaFormGoogle(){

        this.produtoService.serverGoogle().subscribe(teste => {
            console.log(teste)
        });

        //$( "#next-two" ).prop("disabled", true);
        //$( "#next-two" ).attr("style", "background-color:#673AB7; color:#fff;");

        //$( "div.freebirdFormviewerViewItemsItemItemTitle" ).attr("style", "background-color:#673AB7; color:#fff;");

        /*var htmlString = $( ".freebirdFormviewerViewItemsItemItemTitle" ).html();
        console.log(htmlString)*/

        //$( this ).text( htmlString );

        $( "#next-two" ).prop("disabled", false);
    }

    openForm(){
        document.getElementById("chatComment").style.display = "block";
    }

    closeForm(){
        document.getElementById("chatComment").style.display = "none";
    }
}