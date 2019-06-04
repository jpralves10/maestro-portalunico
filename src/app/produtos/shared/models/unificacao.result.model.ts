import { Produto } from './produto.model';

export interface IResult {
    produtos: Produto[];
    data_inicio?: Date;
    data_fim?: Date;
}

export class ResultClass implements IResult{
    produtos: Produto[];
}

export interface IResultItem {
    produto: {
        numeroDI: string;
        descricaoBruta: string;
        ncm: string;
        status: string;
        cnpj: string;
        operador: string;
    }
}