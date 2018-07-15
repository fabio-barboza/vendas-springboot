import { Moment } from 'moment';

export interface ICliente {
    id?: number;
    nome?: string;
    email?: string;
    nascimento?: Moment;
}

export class Cliente implements ICliente {
    constructor(public id?: number, public nome?: string, public email?: string, public nascimento?: Moment) {}
}
