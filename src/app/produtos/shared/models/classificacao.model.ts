import * as c from './classificacao.legendas';

export interface IClassificacao {

    _id?: any,
    spreadsheetId: string,
    idSheet: number,
    titulo?: string,
    version?: number,
    status?: string;
    dataCriacao?: Date,
    dataAtualizacao?: Date,
    categorias?:c.ICategoriasForm[],
    colunas?: c.IColuna[],
    respostas?: c.IResposta[],
    comentarios?: c.IComentario[]

    spreadsheetIdDisabled?: boolean,
    idSheetDisabled?: boolean
}

/*
export interface IClassificacao {

    _id?: any
    idSheet: number,
    titulo: string,
    colunas: {
        idColuna: number,
        nmColuna: string 
    }[],
    respostas: {
        idResposta: string,
        carimbo: string,
        campos: {
            idColuna: number,
            deCampo: string
        }[]
    }[],
    comentarios: {
        idSheet: number,
        idComentario: number,
        idResposta: string,
        idColuna: number,
        status: string,
        descricao: string,
        dataCriacao: Date,
        dataAtualizacao: Date
    }[]
}
*/