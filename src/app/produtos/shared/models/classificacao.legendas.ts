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
    idSheet: number,
    idClassificar: number,
    idComentario: number,
    idResposta: string,
    idProduto: string,
    idColuna: number,
    idUsuario: string,
    nmUsuario: string,
    status: string,
    sheetVersao: number,
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

export interface IEmpresa {
    _id?:any,
    descricao:string,
    codigo?:number,
    cnpj?:number,
    importador?:boolean,
    exportador?:boolean,
    trading?:boolean,
    categorias?:ICategoriasForm[]
}