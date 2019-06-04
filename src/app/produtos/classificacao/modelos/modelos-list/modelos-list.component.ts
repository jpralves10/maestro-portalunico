import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IFormulario } from 'src/app/produtos/shared/models/formulario.model';
import { IResult } from 'src/app/produtos/shared/models/formulario.result.model';

@Component({
    selector: 'app-modelos-list',
    templateUrl: './modelos-list.component.html',
    styleUrls: ['./modelos-list.component.scss']
})
export class ModelosListComponent implements OnInit {

    @Input() data: IResult[];

    constructor() { }

    ngOnInit() {}

}
