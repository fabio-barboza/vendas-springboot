/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { VendasTestModule } from '../../../test.module';
import { CarrinhoComponent } from 'app/entities/carrinho/carrinho.component';
import { CarrinhoService } from 'app/entities/carrinho/carrinho.service';
import { Carrinho } from 'app/shared/model/carrinho.model';

describe('Component Tests', () => {
    describe('Carrinho Management Component', () => {
        let comp: CarrinhoComponent;
        let fixture: ComponentFixture<CarrinhoComponent>;
        let service: CarrinhoService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [VendasTestModule],
                declarations: [CarrinhoComponent],
                providers: []
            })
                .overrideTemplate(CarrinhoComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(CarrinhoComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CarrinhoService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Carrinho(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.carrinhos[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
