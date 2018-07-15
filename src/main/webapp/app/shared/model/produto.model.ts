import { ICarrinho } from 'app/shared/model//carrinho.model';

export interface IProduto {
    id?: number;
    nome?: string;
    preco?: number;
    produtos?: ICarrinho[];
}

export class Produto implements IProduto {
    constructor(public id?: number, public nome?: string, public preco?: number, public produtos?: ICarrinho[]) {}
}
