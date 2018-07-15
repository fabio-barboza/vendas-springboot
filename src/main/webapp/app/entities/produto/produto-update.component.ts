import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { IProduto } from 'app/shared/model/produto.model';
import { ProdutoService } from './produto.service';
import { ICarrinho } from 'app/shared/model/carrinho.model';
import { CarrinhoService } from 'app/entities/carrinho';

@Component({
    selector: 'jhi-produto-update',
    templateUrl: './produto-update.component.html'
})
export class ProdutoUpdateComponent implements OnInit {
    private _produto: IProduto;
    isSaving: boolean;

    carrinhos: ICarrinho[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private produtoService: ProdutoService,
        private carrinhoService: CarrinhoService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ produto }) => {
            this.produto = produto;
        });
        this.carrinhoService.query().subscribe(
            (res: HttpResponse<ICarrinho[]>) => {
                this.carrinhos = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.produto.id !== undefined) {
            this.subscribeToSaveResponse(this.produtoService.update(this.produto));
        } else {
            this.subscribeToSaveResponse(this.produtoService.create(this.produto));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IProduto>>) {
        result.subscribe((res: HttpResponse<IProduto>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackCarrinhoById(index: number, item: ICarrinho) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
    get produto() {
        return this._produto;
    }

    set produto(produto: IProduto) {
        this._produto = produto;
    }
}
