import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

//import { AuthService } from '../../../utilitarios/auth.service';
import { IProduto } from '../models/produto.model';
import { 
    EFICILOG_API, 
    EFICILOG_API_HOMOLOCACAO, 
    PRODUTOS_API
} from '../../../utilitarios/app.api';
import { IClassificacao } from '../models/classificacao.model';
import { IComentario } from '../models/classificacao.legendas';

@Injectable({
    providedIn: 'root'
})
export class ProdutoService {

    constructor(private httpClient: HttpClient){}

    getProdutosGenerico(filtro: any): Observable<IProduto[]> {
        return this.httpClient.post<IProduto[]>(
            `${ EFICILOG_API_HOMOLOCACAO }/catalogo-produtos/filtro`, filtro
        );
    }

    setAlterarProdutos(produto: IProduto): Observable<IProduto> {
        return this.httpClient.post<IProduto>(
            `${ EFICILOG_API_HOMOLOCACAO }/catalogo-produtos/alterar`, produto
        );
    }

    setProdutosInativos(inativos: IProduto[]): Observable<IProduto[]> {
        return this.httpClient.post<IProduto[]>(
            `${ EFICILOG_API }/produtos/unificacao/inativos`, inativos
        );
    }

    setProdutosImportacao(importacao: any): Observable<IProduto[]> {
        return this.httpClient.post<IProduto[]>(
            `${ EFICILOG_API_HOMOLOCACAO }/importacao-produtos/salvar`, importacao
        );
    }

    getClassificacao(classificacao: IClassificacao): Observable<IClassificacao[]> {
        return this.httpClient.post<any>(
            `${ PRODUTOS_API }/produtos/classificacao/find`, classificacao
        );
    }

    setComentarios(comentarios: IComentario[]): Observable<string> {
        return this.httpClient.post<any>(
            `${ PRODUTOS_API }/produtos/comentario/save`, comentarios
        );
    }

    // Teste
    serverGoogle(): Observable<any> {
        var headers = new HttpHeaders();
        headers = headers.append('Access-Control-Allow-Origin', '*');
        headers = headers.append('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3');
        //headers = headers.append('accept-encoding', 'gzip, deflate, br');

        headers = headers.append('content-encoding', 'gzip');

        headers = headers.append('accept-language', 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7');
        headers = headers.append('cache-control', 'max-age=0');
        //headers = headers.append('cookie', 'S=spreadsheet_forms=F_MV9GCXevJLQxI0Y0y8C9D5UX1TymUM; ANID=AHWqTUmVraltw1A4BSbnW_DFSNDnRecN8J5W6QtFwPz6yvhXoVLWeix0CqoB33OU; S=maestro=E5OPLQXfTI4p9vSZ7na5yjkkNUiIt3i2; SID=YwehB3SLhu-jYaW2iyx7UXY-82Ado6Txck_vhbSvd5GljINnaIn_TkJ1hBW_Noj1SELAVw.; HSID=AVCLvEBflb9NQEfXA; SSID=A10r3EsKv59ae4Q8M; APISID=4bnB1u_HC91XUPQF/AljxHSiMJoec2mLgz; SAPISID=iEEj3SDo14QWQQW6/AXRYqLU_daQggrahw; NID=182=uxnvqU9QvW5XeV5A2BoZC9mLoU1ixmvBqOMEpvmUEsf_dyV0R4XjzJvAJZfDROzyi8abqWeykwiEf-vnw_W2W2UzkCZ8hVku7A41rOV8L95a9Xkhjyk5xjguYJdFGvLkz1GWLQkIyGzikDTDZ_ZtktODuLuzyFAbywQozjbIOIiWmkO5AcebbKMdori3TM6QZuYcgyYxVgf6igU8rhe8R4QVhKvwQFRWmKsLJMcbs9AO3A; 1P_JAR=2019-5-6-19; SIDCC=AN0-TYtpTMaxrijxjJBTNjIyODGMz2cDiWusyw7JJGCV2_JLdKhP_Dm8R-8DgmntFjk_JeME3lc');
        headers = headers.append('upgrade-insecure-requests', '1');
        //headers = headers.append('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36');
        headers = headers.append('x-chrome-connected', 'id=101497747826925141604,mode=0,enable_account_consistency=false');
        headers = headers.append('x-client-data', 'CIS2yQEIo7bJAQjBtskBCKmdygEIqKPKAQixp8oBCOKoygEI8anKAQi7rMoB');

        return this.httpClient.get<any>(
            //`https://docs.google.com/forms/d/e/1FAIpQLSd47R95CoXdU6IfIZ6zwB6kpvu-uG1v7PJp1MmjZZAKvsSfhw/viewform?embedded=true`
            `https://docs.google.com/forms/d/e/1FAIpQLSd47R95CoXdU6IfIZ6zwB6kpvu-uG1v7PJp1MmjZZAKvsSfhw/viewform?usp=sf_link`, {headers: headers}
        );
    }

    //Teste
    serverNode(): Observable<IProduto> {
        return this.httpClient.get<IProduto>(
            `http://localhost:3443/teste`
        );
    }
}