import { Produto } from './produto.model';
import { IFormulario } from './formulario.model';
import { ICategoriasForm } from './classificacao.legendas';

export interface IResult {
    formularios: IFormulario[];
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