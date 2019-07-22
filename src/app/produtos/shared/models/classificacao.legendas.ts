export interface IColuna {
    idColuna: number,
    nmColuna: string,
    comentarios: boolean,
    selecionada: boolean,
    pendentes: number
}

export interface IResposta {
    idResposta: string,
    idProduto: string,
    carimbo: string,
    campos: {
        idColuna: number,
        deCampo: string
    }[]
}

export interface IComentario {
    spreadsheetId: string,
    idSheet: number,
    sheetVersao: number,
    idComentario: number,
    idResposta: string,
    idProduto: string,
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

export interface ICategoriasForm {
    _id?:any,
    codigo?:number,
    descricao:string,
    disabled?:boolean
}