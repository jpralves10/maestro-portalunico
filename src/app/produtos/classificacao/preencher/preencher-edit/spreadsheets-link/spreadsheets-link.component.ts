import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ProdutoService } from 'src/app/produtos/shared/services/produtos.service';

@Component({
    selector: 'app-spreadsheets-link',
    templateUrl: './spreadsheets-link.component.html',
    styleUrls: ['./spreadsheets-link.component.scss']
})
export class SpreadsheetsLinkComponent implements OnInit {

    loading = true;
    errored = false;
    spinner = false;

    @Input() linkSpreadsheets: string = '';
    @Input() linkIframe: string = '';

    constructor(
        public activeModal: NgbActiveModal,
        private produtoService: ProdutoService
    ) { }

    ngOnInit() {
        this.loading = false;
    }

    /*addLinkSpreadsheets(){
        this.spinner = true;
        setTimeout(() => { this.activeModal.close(this.linkSpreadsheets), this.spinner = false; }, 2000);
    }*/

    selecionarLinkSpreadsheets(){
        this.spinner = true;
        setTimeout(() => { this.activeModal.close([this.linkIframe, this.linkSpreadsheets]), this.spinner = false; }, 2000);
    }
}