import { IResult } from './formulario.result.model';
import { ICategoriasForm } from './classificacao.legendas';

export interface IFormulario {

    /** Controle Interno **/
    _id: string;
    spreadsheetId: string;
    idSheet: number;
    titulo: string;
    status: string;

    categorias: ICategoriasForm[];

    categoria: {
        codigo: number,
        descricao: string
    }[];

    dataCriacao: Date;
    dataAtualizacao: Date;
}