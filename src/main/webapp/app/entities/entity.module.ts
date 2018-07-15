import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { VendasClienteModule } from './cliente/cliente.module';
import { VendasProdutoModule } from './produto/produto.module';
import { VendasCarrinhoModule } from './carrinho/carrinho.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        VendasClienteModule,
        VendasProdutoModule,
        VendasCarrinhoModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VendasEntityModule {}
