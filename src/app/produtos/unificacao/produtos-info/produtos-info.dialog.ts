import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IDeclaracaoNode } from '../../shared/models/produto.legendas';
import { Produto } from '../../shared/models/produto.model';

import { Chart } from 'chart.js';

@Component({
    selector: 'produtos-info.dialog',
    templateUrl: 'produtos-info.dialog.html',
    styleUrls: ['./produtos-info.dialog.scss']
})
export class ProdutosInfoDialog {

    @Input() produto: Produto;

    ctx: any;
    doughnut: Chart;    

    constructor(
        public activeModal: NgbActiveModal
    ) { }

    ngOnInit() { }

    ngAfterViewInit() {
        this.ctx = document.getElementById("dialog-" + this.produto._id);
        this.doughnut = new Chart(this.ctx, this.getChartDoughnut());
    }

    toggleImporter(node: IDeclaracaoNode){
        node.toggle = !node.toggle;
    }

    getChartDoughnut(){

        Chart.defaults.global.legend.display = true;
        Chart.defaults.global.tooltips.enabled = true;

        let data = {
            labels: [
                'Canal Verde',
                'Canal Amarelo',
                'Canal Vermelho',
                'Canal Cinza'
            ],
            datasets: [
                {
                    data: this.produto.chartCanais, //[10, 20, 30, 40],
                    backgroundColor: [
                        //"#A3E4D7",
                        //"#54C08A",
                        "#6BD19E",
                        "#F9E79F",
                        "#F5B7B1",
                        "#CCD1D1"
                    ]
                }
            ]
        };
    
        let options: {
            title: {
                display: true,
                text: 'Insidências Em Canais'
            },
            layout: {
                padding: {
                    width: 50
                    height: 50
                }
            }
        }

        return {
            type: 'doughnut',
            data: data,
            options: options
        }
    }
}