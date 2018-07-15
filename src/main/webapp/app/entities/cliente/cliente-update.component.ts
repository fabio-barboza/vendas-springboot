import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { ICliente } from 'app/shared/model/cliente.model';
import { ClienteService } from './cliente.service';

@Component({
    selector: 'jhi-cliente-update',
    templateUrl: './cliente-update.component.html'
})
export class ClienteUpdateComponent implements OnInit {
    private _cliente: ICliente;
    isSaving: boolean;
    nascimento: string;

    constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ cliente }) => {
            this.cliente = cliente;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.cliente.nascimento = moment(this.nascimento, DATE_TIME_FORMAT);
        if (this.cliente.id !== undefined) {
            this.subscribeToSaveResponse(this.clienteService.update(this.cliente));
        } else {
            this.subscribeToSaveResponse(this.clienteService.create(this.cliente));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ICliente>>) {
        result.subscribe((res: HttpResponse<ICliente>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
    get cliente() {
        return this._cliente;
    }

    set cliente(cliente: ICliente) {
        this._cliente = cliente;
        this.nascimento = moment(cliente.nascimento).format(DATE_TIME_FORMAT);
    }
}
