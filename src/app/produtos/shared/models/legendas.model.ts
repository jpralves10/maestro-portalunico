
export interface Compatibilidade {
    similaridade: number;
    identicos: number;
    canalDominante: number;

    verde: number;
    amarelo: number;
    vermelho: number;
    cinza: number;
}

export interface Declaracao {
    importadorNome: string;
    importadorNumero: string;
    numeroDI: string;
    dataRegistro: Date;
    numeroAdicao: string;
    canal: string; //canalSelecaoParametrizada
}

export interface DeclaracaoNode {
    name: string;
    cnpj: string;
    toggle: boolean;
    declaracoes?: any[];
}

export interface Atributos {
    atributo: string;
    valor: string;
}

export interface Resumo {
    periodoInicial: Date, 
    periodoFinal: Date, 
    importadores: [{}], 
    qtdDeclaracoes: number, 
    qtdItens: number, 
    qtdItensCadastrados: number
}