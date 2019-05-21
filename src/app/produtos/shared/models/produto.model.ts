import { 
    IAtributos, 
    ICompatibilidade, 
    IDeclaracao, 
    IDeclaracaoNode 
} from './produto.legendas';

export interface IProduto {

    /** Controle Interno **/
    _id: string;
    status: string;
    descricaoBruta: string;
    etapaUnificacao: number;

    /** Informações Declaracao **/
    numeroDI: string, 
    dataRegistro: Date, 
    declaracoes: IDeclaracao[];
    declaracaoNode: IDeclaracaoNode[];
    chartCanais: number[];
    canalDominante: number;
    quantidade:number;

    /** Versões Produto **/
    versoesProduto: IProduto[];
    compatibilidade: ICompatibilidade;

    /** Dados Importador **/
    importadorNome: string;
    importadorNumero: string;

    /** Dados Operador Estrangeiro **/
    fornecedorNome: string;
    fabricanteNome: string;

    /** Histórico **/
    dataCriacao: Date;
    dataAtualizacao: Date;
    usuarioAtualizacao: string;

    /** Integração API **/
    seq: string;
    codigo: number;
    descricao: string;
    cnpjRaiz: string;
    situacao: string;
    modalidade: string;
    ncm: string;
    codigoNaladi: number;
    codigoGPC: number;
    codigoGPCBrick: number;
    codigoUNSPSC: number;
    paisOrigem: string;
    fabricanteConhecido: boolean;
    cpfCnpjFabricante: string;
    codigoOperadorEstrangeiro: string;
    atributos: {
        atributo: string;
        valor: string
    }[];
    codigosInterno: string[];
}

export class Produto implements IProduto{

    /** Controle Interno **/
    _id: string;
    status: string;
    descricaoBruta: string;
    etapaUnificacao: number;

    /** Informações Declaracao **/
    numeroDI: string;
    dataRegistro: Date;
    declaracoes: IDeclaracao[];
    declaracaoNode: IDeclaracaoNode[];
    chartCanais: number[];
    canalDominante: number;
    quantidade:number;

    /** Versões Produto **/
    versoesProduto: IProduto[];
    compatibilidade: ICompatibilidade;

    /** Dados Importador **/
    importadorNome: string;
    importadorNumero: string;
    
    /** Dados Operador Estrangeiro **/
    fornecedorNome: string;
    fabricanteNome: string;

    /** Histórico **/
    dataCriacao: Date;
    dataAtualizacao: Date;
    usuarioAtualizacao: string;

    /** Integração API **/
    seq: string;
    codigo: number;
    descricao: string;
    cnpjRaiz: string;
    situacao: string;
    modalidade: string;
    ncm: string;
    codigoNaladi: number;
    codigoGPC: number;
    codigoGPCBrick: number;
    codigoUNSPSC: number;
    paisOrigem: string;
    fabricanteConhecido: boolean;
    cpfCnpjFabricante: string;
    codigoOperadorEstrangeiro: string;
    atributos: IAtributos[] = [];
    codigosInterno: string[];
}