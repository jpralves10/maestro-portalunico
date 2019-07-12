import { IProduto } from './produto.model';
import { IClassificacao } from './classificacao.model';

export interface IClassificar {

    _id?: any
    codigo:number,
    titulo?: string,
    version?: number,
    status?: string;
    dataCriacao?: Date,
    dataAtualizacao?: Date,
    usuario?: {
        nome:string, 
        email:string
    };
    produto?: IProduto
    classificacao?: IClassificacao
}