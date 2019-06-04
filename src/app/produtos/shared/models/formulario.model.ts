export interface IFormulario {

    /** Controle Interno **/
    _id: string;
    spreadsheetId: string;
    idSheet: number;
    descricao: string;
    status: string;

    categoria: number;

    dataCriacao: Date;
    dataAtualizacao: Date;
}