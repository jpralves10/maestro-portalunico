import { Produto } from './produto.model';
import { IFormulario } from './formulario.model';

export interface IResult {
    formularios: IFormulario[];
    data_inicio?: Date;
    data_fim?: Date;
}

export interface IResultItem {
    formulario: {
        spreadsheetId: '',
        idSheet: '',
        descricao: '',
        status: ''
    }
}