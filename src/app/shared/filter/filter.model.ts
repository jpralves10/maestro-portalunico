import { IImporter } from '../models/importer.model';

export interface IFilter {
    importers: IImporter[];
    data_inicio?: Date;
    data_fim?: Date;
}

export interface IFilterItem {
    importer: {
        cpf_cnpj: string;
        name: string;
    };
}

export interface IFilterResult {
    importers: string[];
    importadores: [{
        name: string,
        cnpj: string,
        checked: boolean
    }];
    status: string[];
    start_date: Date;
    end_date: Date;
}