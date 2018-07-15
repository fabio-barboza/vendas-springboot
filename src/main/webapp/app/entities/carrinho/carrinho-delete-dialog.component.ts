import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICarrinho } from 'app/shared/model/carrinho.model';
import { CarrinhoService } from './carrinho.service';

@Component({
    selector: 'jhi-carrinho-delete-dialog',
    templateUrl: './carrinho-delete-dialog.component.html'
})
export class CarrinhoDeleteDialogComponent {
    carrinho: ICarrinho;

    constructor(private carrinhoService: CarrinhoService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.carrinhoService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'carrinhoListModification',
                content: 'Deleted an carrinho'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-carrinho-delete-popup',
    template: ''
})
export class CarrinhoDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ carrinho }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(CarrinhoDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.carrinho = carrinho;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
