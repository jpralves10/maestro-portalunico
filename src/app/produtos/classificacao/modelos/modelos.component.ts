import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFormulario } from '../../shared/models/formulario.model';
import { ProdutoService } from '../../shared/services/produtos.service';
import { ResultService } from '../../shared/services/unificacao.result.service';

@Component({
    selector: 'app-modelos',
    templateUrl: './modelos.component.html',
    styleUrls: ['./modelos.component.scss']
})
export class ModelosComponent implements OnInit {

    loading = true;
    errored = false;

    current_filtro: {} = {
        formulario: {
            spreadsheetId: '',
            idSheet: '',
            descricao: '',
            status: ''
        }
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private resultService: ResultService,
        private produtoService: ProdutoService,
        private modalService: NgbModal
    ) {
        
    }

    ngOnInit() {}

    adicionarProduto(){
        let formulario = {} as IFormulario;
        formulario._id = null;
        formulario.spreadsheetId = null;
        formulario.idSheet = null;
        formulario.descricao = '';
        formulario.status = 'Novo';
        formulario.categoria = null;

        formulario.dataCriacao = new Date();
        formulario.dataAtualizacao = new Date();

        this.router.navigate([`/modelos/modelos-edit`], {
            relativeTo: this.route,
            replaceUrl: false,
            queryParams: {
                filterCatalogo: JSON.stringify({...formulario})
            }
        });
    }

}
