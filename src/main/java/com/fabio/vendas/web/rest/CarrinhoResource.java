package com.fabio.vendas.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.fabio.vendas.domain.Carrinho;
import com.fabio.vendas.repository.CarrinhoRepository;
import com.fabio.vendas.web.rest.errors.BadRequestAlertException;
import com.fabio.vendas.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Carrinho.
 */
@RestController
@RequestMapping("/api")
public class CarrinhoResource {

    private final Logger log = LoggerFactory.getLogger(CarrinhoResource.class);

    private static final String ENTITY_NAME = "carrinho";

    private final CarrinhoRepository carrinhoRepository;

    public CarrinhoResource(CarrinhoRepository carrinhoRepository) {
        this.carrinhoRepository = carrinhoRepository;
    }

    /**
     * POST  /carrinhos : Create a new carrinho.
     *
     * @param carrinho the carrinho to create
     * @return the ResponseEntity with status 201 (Created) and with body the new carrinho, or with status 400 (Bad Request) if the carrinho has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/carrinhos")
    @Timed
    public ResponseEntity<Carrinho> createCarrinho(@RequestBody Carrinho carrinho) throws URISyntaxException {
        log.debug("REST request to save Carrinho : {}", carrinho);
        if (carrinho.getId() != null) {
            throw new BadRequestAlertException("A new carrinho cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Carrinho result = carrinhoRepository.save(carrinho);
        return ResponseEntity.created(new URI("/api/carrinhos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /carrinhos : Updates an existing carrinho.
     *
     * @param carrinho the carrinho to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated carrinho,
     * or with status 400 (Bad Request) if the carrinho is not valid,
     * or with status 500 (Internal Server Error) if the carrinho couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/carrinhos")
    @Timed
    public ResponseEntity<Carrinho> updateCarrinho(@RequestBody Carrinho carrinho) throws URISyntaxException {
        log.debug("REST request to update Carrinho : {}", carrinho);
        if (carrinho.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Carrinho result = carrinhoRepository.save(carrinho);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, carrinho.getId().toString()))
            .body(result);
    }

    /**
     * GET  /carrinhos : get all the carrinhos.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many)
     * @return the ResponseEntity with status 200 (OK) and the list of carrinhos in body
     */
    @GetMapping("/carrinhos")
    @Timed
    public List<Carrinho> getAllCarrinhos(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Carrinhos");
        return carrinhoRepository.findAllWithEagerRelationships();
    }

    /**
     * GET  /carrinhos/:id : get the "id" carrinho.
     *
     * @param id the id of the carrinho to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the carrinho, or with status 404 (Not Found)
     */
    @GetMapping("/carrinhos/{id}")
    @Timed
    public ResponseEntity<Carrinho> getCarrinho(@PathVariable Long id) {
        log.debug("REST request to get Carrinho : {}", id);
        Optional<Carrinho> carrinho = carrinhoRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(carrinho);
    }

    /**
     * DELETE  /carrinhos/:id : delete the "id" carrinho.
     *
     * @param id the id of the carrinho to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/carrinhos/{id}")
    @Timed
    public ResponseEntity<Void> deleteCarrinho(@PathVariable Long id) {
        log.debug("REST request to delete Carrinho : {}", id);

        carrinhoRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
