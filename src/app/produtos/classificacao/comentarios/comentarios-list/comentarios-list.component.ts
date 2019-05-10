import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ProdutoService } from '../../../shared/services/produtos.service';

@Component({
  selector: 'app-comentarios-list',
  templateUrl: './comentarios-list.component.html',
  styleUrls: ['./comentarios-list.component.scss']
})
export class ComentariosListComponent implements OnInit {

    loading = true;

    respostas: any = this.getMockRespostas();

    respostasDataSource = new MatTableDataSource<{
        id: number, dataHora: string, campos: []
    }>();

    respostasColumns: string[] = ['id', 'dataHora'];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private produtoService: ProdutoService
    ) { 
        this.respostasDataSource.data = [...this.respostas];
        this.loading = false;
    }

    ngOnInit() { }

    editRowResposta(row: any){
        this.router.navigate([`/classificacao/comentarios-edit`], {
            relativeTo: this.route,
            replaceUrl: false,
            queryParams: {
                filterResposta: JSON.stringify({...row})
            }
        });
    }

    click(){
        this.produtoService.serverNode().subscribe(ret => {
            console.log(ret)
        })
    }

    getMockRespostas(): any{

        let resposta1 = {
            id: 1,
            dataHora: '01/05/2019 21:13:01',
            campos: [
                { id: 1, nomeColuna: 'Nome', valorCampo: 'Fulano da Silva' },
                { id: 2, nomeColuna: 'Phone', valorCampo: '(41) 99861-3334' },
                { id: 3, nomeColuna: 'Sexo', valorCampo: 'Masculíno' },
                { id: 4, nomeColuna: 'Avaliacao', valorCampo: 'Bom' },
            ]
        }

        let resposta2 = {
            id: 2,
            dataHora: '01/05/2019 15:04:42',
            campos: [
                { id: 1, nomeColuna: 'Nome', valorCampo: 'Maria da Conceissão' },
                { id: 2, nomeColuna: 'Phone', valorCampo: '(41) 9455-2332' },
                { id: 3, nomeColuna: 'Sexo', valorCampo: 'Feminino' },
                { id: 4, nomeColuna: 'Avaliacao', valorCampo: 'Ruim' },
            ]
        }

        let resposta3 = {
            id: 3,
            dataHora: '01/05/2019 15:09:09',
            campos: [
                { id: 1, nomeColuna: 'Nome', valorCampo: 'Mario Brother' },
                { id: 2, nomeColuna: 'Phone', valorCampo: '(44) 9875-1123' },
                { id: 3, nomeColuna: 'Sexo', valorCampo: 'Masculíno' },
                { id: 4, nomeColuna: 'Avaliacao', valorCampo: 'Bom' },
            ]
        }

        let resposta4 = {
            id: 4,
            dataHora: '02/05/2019 02:01:58',
            campos: [
                { id: 1, nomeColuna: 'Nome', valorCampo: 'Ciclano de Tal' },
                { id: 2, nomeColuna: 'Phone', valorCampo: '(43) 99855-3774' },
                { id: 3, nomeColuna: 'Sexo', valorCampo: 'Masculíno' },
                { id: 4, nomeColuna: 'Avaliacao', valorCampo: 'Bom' },
            ]
        }

        return [
            resposta1,
            resposta2,
            resposta3,
            resposta4
        ];
    }
}