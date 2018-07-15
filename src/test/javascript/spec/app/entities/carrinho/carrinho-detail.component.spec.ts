/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VendasTestModule } from '../../../test.module';
import { CarrinhoDetailComponent } from 'app/entities/carrinho/carrinho-detail.component';
import { Carrinho } from 'app/shared/model/carrinho.model';

describe('Component Tests', () => {
    describe('Carrinho Management Detail Component', () => {
        let comp: CarrinhoDetailComponent;
        let fixture: ComponentFixture<CarrinhoDetailComponent>;
        const route = ({ data: of({ carrinho: new Carrinho(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [VendasTestModule],
                declarations: [CarrinhoDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(CarrinhoDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(CarrinhoDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.carrinho).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
