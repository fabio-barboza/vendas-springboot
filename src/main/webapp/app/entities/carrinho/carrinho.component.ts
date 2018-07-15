import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ICarrinho } from 'app/shared/model/carrinho.model';
import { Principal } from 'app/core';
import { CarrinhoService } from './carrinho.service';

@Component({
    selector: 'jhi-carrinho',
    templateUrl: './carrinho.component.html'
})
export class CarrinhoComponent implements OnInit, OnDestroy {
    carrinhos: ICarrinho[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private carrinhoService: CarrinhoService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {}

    loadAll() {
        this.carrinhoService.query().subscribe(
            (res: HttpResponse<ICarrinho[]>) => {
                this.carrinhos = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInCarrinhos();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ICarrinho) {
        return item.id;
    }

    registerChangeInCarrinhos() {
        this.eventSubscriber = this.eventManager.subscribe('carrinhoListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
