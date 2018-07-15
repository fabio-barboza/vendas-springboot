import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICarrinho } from 'app/shared/model/carrinho.model';

@Component({
    selector: 'jhi-carrinho-detail',
    templateUrl: './carrinho-detail.component.html'
})
export class CarrinhoDetailComponent implements OnInit {
    carrinho: ICarrinho;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ carrinho }) => {
            this.carrinho = carrinho;
        });
    }

    previousState() {
        window.history.back();
    }
}
