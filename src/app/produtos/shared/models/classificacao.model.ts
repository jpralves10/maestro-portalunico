import * as c from './classificacao.legendas';

export interface IClassificacao {

    _id?: any,
    spreadsheetId: string,
    idSheet: number,
    nmSheet?: string,
    version?: number,
    colunas?: c.IColuna[],
    respostas?: c.IResposta[],
    comentarios?: c.IComentario[]
}

/*
export interface IClassificacao {

    _id?: any
    idSheet: number,
    nmSheet: string,
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