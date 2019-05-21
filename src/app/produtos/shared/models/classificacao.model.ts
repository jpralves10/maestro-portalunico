import * as c from './classificacao.legendas';

export interface IClassificacao {

    _id?: any
    idSheet: number,
    nmSheet: string,
    colunas: c.IColuna[],
    respostas: c.IResposta[],
    comentarios: c.IComentario[]
}

export class Classificacao implements IClassificacao {

    _id?: any
    idSheet = 0;
    nmSheet = '';
    colunas: c.IColuna[] = [];
    respostas: c.IResposta[] = [];
    comentarios: c.IComentario[] = [];
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