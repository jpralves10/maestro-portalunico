import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IFormulario } from 'src/app/produtos/shared/models/formulario.model';
import { ProdutoService } from 'src/app/produtos/shared/services/produtos.service';

import * as Util from '../../../../utilitarios/utilitarios';
import { msg_default_three } from 'src/app/utilitarios/mensagens.module';

@Component({
    selector: 'app-modelos-edit',
    templateUrl: './modelos-edit.component.html',
    styleUrls: ['./modelos-edit.component.scss']
})
export class ModelosEditComponent implements OnInit {

    formulario = {} as IFormulario;

    loading = true;
    errored = false;
    finish = false;
    spinner = false;

    mensagem: any = {id: 0, tipo: '', class: '', lista: []};

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private produtoService: ProdutoService
    ) {
        this.route.queryParamMap.subscribe(paramMap => {
            this.formulario = JSON.parse(paramMap.get('filterFormulario'));

            if(this.formulario.categoria == undefined && this.formulario.categoria == null){
                this.formulario.categoria = [];
            }

            this.loading = false;           
        });
    }

    ngOnInit() {}

    setStatusFormulario(event:any){
        console.log('Status: ', event)
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
}