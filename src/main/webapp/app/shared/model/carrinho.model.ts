import { Moment } from 'moment';
import { ICliente } from 'app/shared/model//cliente.model';
import { IProduto } from 'app/shared/model//produto.model';

export interface ICarrinho {
    id?: number;
    data?: Moment;
    cliente?: ICliente;
    produtos?: IProduto[];
}

export class Carrinho implements ICarrinho {
    constructor(public id?: number, public data?: Moment, public cliente?: ICliente, public produtos?: IProduto[]) {}
}
