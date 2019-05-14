import { Atributos, Compatibilidade, Declaracao, DeclaracaoNode } from './legendas.model';

export interface Produto {

    /** Controle Interno **/
    _id: string;
    status: string;
    descricaoBruta: string;
    etapaUnificacao: number;

    /** Informações Declaracao **/
    numeroDI: string, 
    dataRegistro: Date, 
    declaracoes: Declaracao[];
    declaracaoNode: DeclaracaoNode[];
    chartCanais: number[];
    canalDominante: number;
    quantidade:number;

    /** Versões Produto **/
    versoesProduto: Produto[];
    compatibilidade: Compatibilidade;

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
    atributos: Atributos[];
    codigosInterno: string[];
}

export class ProdutoClass implements Produto{

    /** Controle Interno **/
    _id: string;
    status: string;
    descricaoBruta: string;
    etapaUnificacao: number;

    /** Informações Declaracao **/
    numeroDI: string;
    dataRegistro: Date;
    declaracoes: Declaracao[];
    declaracaoNode: DeclaracaoNode[];
    chartCanais: number[];
    canalDominante: number;
    quantidade:number;

    /** Versões Produto **/
    versoesProduto: Produto[];
    compatibilidade: Compatibilidade;

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
    atributos: [
        {
            atributo: string;
            valor: string
        }
    ];
    codigosInterno: string[];
}