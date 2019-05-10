import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-comentarios',
    templateUrl: './comentarios.component.html',
    styleUrls: ['./comentarios.component.scss']
})
export class ComentariosComponent implements OnInit {

    resposta: {
        id:number, 
        dataHora:string, 
        campos:[
            {
                id:number, 
                nomeColuna:string,
                valorCampo:string
            }
        ]
    } = null;

    public loading = true;
    public errored = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.route.queryParamMap.subscribe(paramMap => {
            this.resposta = JSON.parse(paramMap.get('filterResposta'));

            this.loading = false;
        });
    }

    ngOnInit() { }
   
}