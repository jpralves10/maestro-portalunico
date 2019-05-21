
export interface ICompatibilidade {
    similaridade: number;
    identicos: number;
    canalDominante: number;

    verde: number;
    amarelo: number;
    vermelho: number;
    cinza: number;
}

export interface IDeclaracao {
    importadorNome: string;
    importadorNumero: string;

    fornecedorNome: string;
    fabricanteNome: string;

    numeroDI: string;
    dataRegistro: Date;
    numeroAdicao: string;
    canal: string; //canalSelecaoParametrizada
}

export interface IDeclaracaoNode {
    name: string;
    cnpj: string;
    toggle: boolean;
    declaracoes?: any[];
}

export interface IAtributos {
    atributo: string;
    valor: string;
}

export interface IResumo {
    periodoInicial: Date, 
    periodoFinal: Date, 
    importadores: [{}], 
    qtdDeclaracoes: number, 
    qtdItens: number, 
    qtdItensCadastrados: number
}