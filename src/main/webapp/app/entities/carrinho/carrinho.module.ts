import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { VendasSharedModule } from 'app/shared';
import {
    CarrinhoComponent,
    CarrinhoDetailComponent,
    CarrinhoUpdateComponent,
    CarrinhoDeletePopupComponent,
    CarrinhoDeleteDialogComponent,
    carrinhoRoute,
    carrinhoPopupRoute
} from './';

const ENTITY_STATES = [...carrinhoRoute, ...carrinhoPopupRoute];

@NgModule({
    imports: [VendasSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        CarrinhoComponent,
        CarrinhoDetailComponent,
        CarrinhoUpdateComponent,
        CarrinhoDeleteDialogComponent,
        CarrinhoDeletePopupComponent
    ],
    entryComponents: [CarrinhoComponent, CarrinhoUpdateComponent, CarrinhoDeleteDialogComponent, CarrinhoDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VendasCarrinhoModule {}
