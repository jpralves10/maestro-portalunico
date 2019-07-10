import { IProduto } from './produto.model';

export interface IClassificar {

    _id?: any
    codigo:number,
    titulo?: string,
    version?: number,
    status?: string;
    dataCriacao?: Date,
    dataAtualizacao?: Date,
    produto?: IProduto
}