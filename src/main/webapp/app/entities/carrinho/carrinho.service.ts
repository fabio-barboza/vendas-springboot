import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICarrinho } from 'app/shared/model/carrinho.model';

type EntityResponseType = HttpResponse<ICarrinho>;
type EntityArrayResponseType = HttpResponse<ICarrinho[]>;

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
    private resourceUrl = SERVER_API_URL + 'api/carrinhos';

    constructor(private http: HttpClient) {}

    create(carrinho: ICarrinho): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(carrinho);
        return this.http
            .post<ICarrinho>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(carrinho: ICarrinho): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(carrinho);
        return this.http
            .put<ICarrinho>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<ICarrinho>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ICarrinho[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    private convertDateFromClient(carrinho: ICarrinho): ICarrinho {
        const copy: ICarrinho = Object.assign({}, carrinho, {
            data: carrinho.data != null && carrinho.data.isValid() ? carrinho.data.toJSON() : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.data = res.body.data != null ? moment(res.body.data) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((carrinho: ICarrinho) => {
            carrinho.data = carrinho.data != null ? moment(carrinho.data) : null;
        });
        return res;
    }
}
