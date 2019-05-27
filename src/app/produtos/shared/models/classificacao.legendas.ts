export interface IColuna {
    idColuna: number,
    nmColuna: string,
    comentarios: boolean,
    selecionada: boolean,
    pendentes: number
}

export interface IResposta {
    idResposta: string,
    carimbo: string,
    campos: {
        idColuna: number,
        deCampo: string
    }[]
}

export interface IComentario {
    idSheet: number,
    sheetVersao: number,
    idComentario: number,
    idResposta: string,
    idColuna: number,
    idUsuario: string,
    nmUsuario: string,
    status: string,
    descricao: string,
    dataCriacao: Date,
    dataAtualizacao: Date,
    //Interno
    side: string
}