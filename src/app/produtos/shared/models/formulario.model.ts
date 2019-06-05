export interface IFormulario {

    /** Controle Interno **/
    _id: string;
    spreadsheetId: string;
    idSheet: number;
    titulo: string;
    status: string;

    categoria: {
        idCategoria: number,
        descricao: string
    }[];

    dataCriacao: Date;
    dataAtualizacao: Date;
}