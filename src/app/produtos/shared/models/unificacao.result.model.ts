import { Produto } from './produto.model';

export interface Result {
    produtos: Produto[];
    data_inicio?: Date;
    data_fim?: Date;
}

export class ResultClass implements Result{
    produtos: Produto[];
}

export interface ResultItem {
    produto: {
        numeroDI: string;
        descricaoBruta: string;
        ncm: string;
        status: string;
        cnpj: string;
        operador: string;
    };
}