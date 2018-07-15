import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';

import { ICarrinho } from 'app/shared/model/carrinho.model';
import { CarrinhoService } from './carrinho.service';
import { ICliente } from 'app/shared/model/cliente.model';
import { ClienteService } from 'app/entities/cliente';
import { IProduto } from 'app/shared/model/produto.model';
import { ProdutoService } from 'app/entities/produto';

@Component({
    selector: 'jhi-carrinho-update',
    templateUrl: './carrinho-update.component.html'
})
export class CarrinhoUpdateComponent implements OnInit {
    private _carrinho: ICarrinho;
    isSaving: boolean;

    clientes: ICliente[];

    produtos: IProduto[];
    data: string;

    constructor(
        private jhiAlertService: JhiAlertService,
        private carrinhoService: CarrinhoService,
        private clienteService: ClienteService,
        private produtoService: ProdutoService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ carrinho }) => {
            this.carrinho = carrinho;
        });
        this.clienteService.query({ filter: 'carrinho-is-null' }).subscribe(
            (res: HttpResponse<ICliente[]>) => {
                if (!this.carrinho.cliente || !this.carrinho.cliente.id) {
                    this.clientes = res.body;
                } else {
                    this.clienteService.find(this.carrinho.cliente.id).subscribe(
                        (subRes: HttpResponse<ICliente>) => {
                            this.clientes = [subRes.body].concat(res.body);
                        },
                        (subRes: HttpErrorResponse) => this.onError(subRes.message)
                    );
                }
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.produtoService.query().subscribe(
            (res: HttpResponse<IProduto[]>) => {
                this.produtos = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.carrinho.data = moment(this.data, DATE_TIME_FORMAT);
        if (this.carrinho.id !== undefined) {
            this.subscribeToSaveResponse(this.carrinhoService.update(this.carrinho));
        } else {
            this.subscribeToSaveResponse(this.carrinhoService.create(this.carrinho));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ICarrinho>>) {
        result.subscribe((res: HttpResponse<ICarrinho>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackClienteById(index: number, item: ICliente) {
        return item.id;
    }

    trackProdutoById(index: number, item: IProduto) {
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
    get carrinho() {
        return this._carrinho;
    }

    set carrinho(carrinho: ICarrinho) {
        this._carrinho = carrinho;
        this.data = moment(carrinho.data).format(DATE_TIME_FORMAT);
    }
}
