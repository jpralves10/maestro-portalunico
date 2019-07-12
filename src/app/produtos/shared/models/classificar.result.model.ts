import { Produto, IProduto } from './produto.model';
import { ICategoriasForm } from './classificacao.legendas';
import { IClassificar } from './classificar.model';

export interface IResult {
    classificar: IClassificar[];
    data_inicio?: Date;
    data_fim?: Date;
}

export interface IResultItem {
    classificar: {
        codigo?: number,
        titulo?: string,
        status?: string,
        dataAtualizacao?: Date,
        usuario?: {
            nome:string, 
            email:string
        }
        produto?: IProduto
    }
}