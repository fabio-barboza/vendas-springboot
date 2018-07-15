/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { VendasTestModule } from '../../../test.module';
import { CarrinhoUpdateComponent } from 'app/entities/carrinho/carrinho-update.component';
import { CarrinhoService } from 'app/entities/carrinho/carrinho.service';
import { Carrinho } from 'app/shared/model/carrinho.model';

describe('Component Tests', () => {
    describe('Carrinho Management Update Component', () => {
        let comp: CarrinhoUpdateComponent;
        let fixture: ComponentFixture<CarrinhoUpdateComponent>;
        let service: CarrinhoService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [VendasTestModule],
                declarations: [CarrinhoUpdateComponent]
            })
                .overrideTemplate(CarrinhoUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(CarrinhoUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CarrinhoService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Carrinho(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.carrinho = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Carrinho();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.carrinho = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
