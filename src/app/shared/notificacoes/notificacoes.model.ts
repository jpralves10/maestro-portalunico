export interface INotificacoes {

    _id?: any,
    idEmail:string,
    codigo:number,
    tela?:string,
    titulo?: string,
    produto?: string,
    descricaoProduto?: string,
    version?: number,
    status?: string;
    dataCriacao?: Date,
    dataAtualizacao?: Date
}