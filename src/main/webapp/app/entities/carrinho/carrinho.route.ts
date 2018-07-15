import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Carrinho } from 'app/shared/model/carrinho.model';
import { CarrinhoService } from './carrinho.service';
import { CarrinhoComponent } from './carrinho.component';
import { CarrinhoDetailComponent } from './carrinho-detail.component';
import { CarrinhoUpdateComponent } from './carrinho-update.component';
import { CarrinhoDeletePopupComponent } from './carrinho-delete-dialog.component';
import { ICarrinho } from 'app/shared/model/carrinho.model';

@Injectable({ providedIn: 'root' })
export class CarrinhoResolve implements Resolve<ICarrinho> {
    constructor(private service: CarrinhoService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((carrinho: HttpResponse<Carrinho>) => carrinho.body));
        }
        return of(new Carrinho());
    }
}

export const carrinhoRoute: Routes = [
    {
        path: 'carrinho',
        component: CarrinhoComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'vendasApp.carrinho.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'carrinho/:id/view',
        component: CarrinhoDetailComponent,
        resolve: {
            carrinho: CarrinhoResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'vendasApp.carrinho.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'carrinho/new',
        component: CarrinhoUpdateComponent,
        resolve: {
            carrinho: CarrinhoResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'vendasApp.carrinho.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'carrinho/:id/edit',
        component: CarrinhoUpdateComponent,
        resolve: {
            carrinho: CarrinhoResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'vendasApp.carrinho.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const carrinhoPopupRoute: Routes = [
    {
        path: 'carrinho/:id/delete',
        component: CarrinhoDeletePopupComponent,
        resolve: {
            carrinho: CarrinhoResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'vendasApp.carrinho.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
