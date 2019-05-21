export interface IColuna {
    idColuna: number,
    nmColuna: string 
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
    idComentario: number,
    idResposta: string,
    idColuna: number,
    idUsuario: string,
    status: string,
    descricao: string,
    dataCriacao: Date,
    dataAtualizacao: Date
}