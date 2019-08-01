import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ProdutoService } from 'src/app/produtos/shared/services/produtos.service';

@Component({
    selector: 'app-rating-comment',
    templateUrl: './rating-comment.component.html',
    styleUrls: ['./rating-comment.component.scss']
})
export class RatingCommentComponent implements OnInit {

    loading = true;
    errored = false;
    spinner = false;

    @Input() comment: string = '';

    constructor(
        public activeModal: NgbActiveModal,
        private produtoService: ProdutoService
    ) { }

    ngOnInit() {
        this.loading = false;
    }

    confirmarComment(){
        this.spinner = true;
        setTimeout(() => { 
            this.activeModal.close(this.comment), 
            this.spinner = false; 
        }, 2000);
    }
}