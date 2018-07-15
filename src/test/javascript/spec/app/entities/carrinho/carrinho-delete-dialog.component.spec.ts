/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { VendasTestModule } from '../../../test.module';
import { CarrinhoDeleteDialogComponent } from 'app/entities/carrinho/carrinho-delete-dialog.component';
import { CarrinhoService } from 'app/entities/carrinho/carrinho.service';

describe('Component Tests', () => {
    describe('Carrinho Management Delete Component', () => {
        let comp: CarrinhoDeleteDialogComponent;
        let fixture: ComponentFixture<CarrinhoDeleteDialogComponent>;
        let service: CarrinhoService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [VendasTestModule],
                declarations: [CarrinhoDeleteDialogComponent]
            })
                .overrideTemplate(CarrinhoDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(CarrinhoDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CarrinhoService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
