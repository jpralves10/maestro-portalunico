import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Router, ActivatedRoute, Route, CanLoad, CanActivate } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFilterResult } from '../filter/filter.model'
import { FilterComponent } from '../../shared/filter/filter.component';
import { EmpresaComponent } from '../empresas/empresa.component';

@Component({
    selector: 'app-navegacao',
    templateUrl: './navegacao.component.html',
    styleUrls: ['./navegacao.component.scss']
})
export class NavegacaoComponent implements OnInit {

    //https://app.trackado.com/Dashboard/

    isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

    listaMenus = this.getListaMenus();
    userInfo:any = {};

    filter: IFilterResult = null;

    constructor(
        private breakpointObserver: BreakpointObserver,
        private keycloakAngular: KeycloakService,
        private modalService: NgbModal,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.keycloakAngular.loadUserProfile().then(profile => {
            window.sessionStorage.setItem('userInfo', JSON.stringify(profile));
            this.userInfo.name = profile.firstName + ' ' + profile.lastName;
            this.userInfo.email = profile.email;
        })
        .catch( reason => {console.log( reason )});

        /*this.userInfo = window.sessionStorage.getItem('userInfo');
        console.log("App: " + this.userInfo)*/

        this.getFilterResult();

        /*if(this.filter != null && this.filter.importers.length > 0){
            this.setDadosInit();
        }*/
    }

    ngOnInit() { }

    checkClose() {
        return this.breakpointObserver.isMatched('(max-width: 500px)');
    }

    toggleMenu(menu: any){
        menu.toggle = !menu.toggle;
    }

    userLogout(){
        window.sessionStorage.setItem('result', null)
        this.filter = null;
        this.keycloakAngular.logout();
    }

    getListaMenus(){
        return [
            {
                id: '1', 
                name: 'Dashboard',
                enable: false,
                toggle: false,
                submenus: [
                    {id: '1.1', name: 'Indicadores', enable: true, routerLink: '/indicadores', routerLinkActive: 'active', toggle: false, submenus: []},
                    {id: '1.2', name: 'Eventos Agendados', enable: false, routerLink: '/home', routerLinkActive: 'active', toggle: false, submenus: []},
                    {id: '1.3', name: 'Pendências Existentes', enable: false, routerLink: '/home', routerLinkActive: 'active', toggle: false, submenus: []}
                ]
            },
            {
                id: '2', 
                name: 'Produtos',
                enable: true,
                toggle: true,
                submenus: [
                    {id: '2.1', name: 'Unificar Produtos', enable: true, routerLink: '/unificacao', routerLinkActive: 'active', toggle: false, submenus: []},
                    {id: '2.2', name: 'Importar Arquivo', enable: true, routerLink: '/importacao', routerLinkActive: 'active', toggle: false, submenus: []},
                    {id: '2.3', name: 'Catálogo de Produtos', enable: true, routerLink: '/catalogo', routerLinkActive: 'active', toggle: false, submenus: []},
                    {id: '2.4', name: 'Classificação Fiscal', enable: true, routerLink: '#', routerLinkActive: '', toggle: true, submenus: [
                        {id: '2.4.1', name: 'Criar Modelos', enable: true, routerLink: '/classificacao-modelos', routerLinkActive: 'active', toggle: false, submenus: []},
                        {id: '2.4.2', name: 'Classificar Produtos', enable: true, routerLink: '/classificacao-classificar', routerLinkActive: 'active', toggle: false, submenus: []},
                        {id: '2.4.3', name: 'Preencher Formulário', enable: true, routerLink: '/classificacao-preencher', routerLinkActive: 'active', toggle: false, submenus: []}
                    ]}
                ]
            }
        ]
    }
    
    openDialogFilter(): void {
        this.modalService.open(FilterComponent, {size: '900', centered: true}).result.then((result) => {}, (reason) => {
            this.getFilterResult();
            location.reload(); // !Important
        });
    }

    getFilterResult(){
        this.filter = JSON.parse(window.sessionStorage.getItem('result'));
    } 

    openDialogEmpresa(): void {
        this.modalService.open(EmpresaComponent, {size: '900', centered: true}).result.then((result) => {}, (reason) => {
            window.sessionStorage.setItem('empresa', reason)
        });
    }

    getNotificaoResult(){
        this.router.navigate([`/notificacao`], {
            relativeTo: this.route,
            replaceUrl: false
        });
    }

    getSuporteResult(){
        this.router.navigate([`/suporte`], {
            relativeTo: this.route,
            replaceUrl: false
        });
    }
}