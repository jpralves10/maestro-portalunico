import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-categorias',
    templateUrl: './categorias.component.html',
    styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit {

    loading = true;
    errored = false;

    closeResult: boolean = false;

    categoria = {codigo: null, descricao: ''};

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public activeModal: NgbActiveModal
    ) {
        this.loading = false;
    }

    salvarCategoria(){
        this.activeModal.close(this.categoria);
    }

    ngOnInit() {}

    ngAfterViewInit() {}
}