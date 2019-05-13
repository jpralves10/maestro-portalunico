import { Component, OnInit } from '@angular/core';
//import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navegacao',
  templateUrl: './navegacao.component.html',
  styleUrls: ['./navegacao.component.scss']
})
export class NavegacaoComponent implements OnInit {

    //https://app.trackado.com/Dashboard/

    /*isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));*/

    listaMenus = this.getListaMenus();

    constructor(
        //private breakpointObserver: BreakpointObserver
    ) { }

    ngOnInit() { }

    /*checkClose() {
        return this.breakpointObserver.isMatched('(max-width: 600px)');
    }*/

    toggleMenu(menu: any){
        menu.toggle = !menu.toggle;
    }

    getListaMenus(){
        return [
            {
                id: 1, 
                name: 'Dashboard',
                enable: false,
                toggle: false,
                submenus: [
                    {id: 1.1, name: 'Indicadores', enable: true, routerLink: '/indicadores', routerLinkActive: 'active', toggle: false, submenus: []},
                    {id: 1.2, name: 'Eventos Agendados', enable: false, routerLink: '/home', routerLinkActive: 'active', toggle: false, submenus: []},
                    {id: 1.3, name: 'Pendências Existentes', enable: false, routerLink: '/home', routerLinkActive: 'active', toggle: false, submenus: []}
                ]
            },
            {
                id: 2, 
                name: 'Produtos',
                enable: true,
                toggle: true,
                submenus: [
                    {id: 2.1, name: 'Unificar Produtos', enable: true, routerLink: '/unificacao', routerLinkActive: 'active', toggle: false, submenus: []},
                    {id: 2.2, name: 'Importar Arquivo', enable: true, routerLink: '/importacao', routerLinkActive: 'active', toggle: false, submenus: []},
                    {id: 2.3, name: 'Catálogo de Produtos', enable: true, routerLink: '/catalogo', routerLinkActive: 'active', toggle: false, submenus: []},
                    {id: 2.4, name: 'Classificação Fiscal', enable: true, routerLink: '/classificacao', routerLinkActive: 'active', toggle: false, submenus: []}
                ]
            }
        ]
    }
}