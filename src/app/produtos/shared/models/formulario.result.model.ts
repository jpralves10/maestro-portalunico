import { Produto } from './produto.model';
import { ICategoriasForm } from './classificacao.legendas';
import { IClassificacao } from './classificacao.model';

export interface IResult {
    formularios: IClassificacao[];
    data_inicio?: Date;
    data_fim?: Date;
}

export interface IResultItem {
    formulario: {
        spreadsheetId: '',
        idSheet: null,
        titulo: '',
        status: ''
    }
}

export interface IResultCategorias {
    categorias: ICategoriasForm[]
}

export interface IResultItemCategorias {
    categoria: {
        _id?:any
        codigo?: number,
        descricao: string,
        disabled?:boolean
    }
}