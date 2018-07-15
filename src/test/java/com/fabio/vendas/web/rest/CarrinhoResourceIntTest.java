package com.fabio.vendas.web.rest;

import com.fabio.vendas.VendasApp;

import com.fabio.vendas.domain.Carrinho;
import com.fabio.vendas.repository.CarrinhoRepository;
import com.fabio.vendas.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;


import static com.fabio.vendas.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the CarrinhoResource REST controller.
 *
 * @see CarrinhoResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = VendasApp.class)
public class CarrinhoResourceIntTest {

    private static final Instant DEFAULT_DATA = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATA = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private CarrinhoRepository carrinhoRepository;
    @Mock
    private CarrinhoRepository carrinhoRepositoryMock;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCarrinhoMockMvc;

    private Carrinho carrinho;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CarrinhoResource carrinhoResource = new CarrinhoResource(carrinhoRepository);
        this.restCarrinhoMockMvc = MockMvcBuilders.standaloneSetup(carrinhoResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Carrinho createEntity(EntityManager em) {
        Carrinho carrinho = new Carrinho()
            .data(DEFAULT_DATA);
        return carrinho;
    }

    @Before
    public void initTest() {
        carrinho = createEntity(em);
    }

    @Test
    @Transactional
    public void createCarrinho() throws Exception {
        int databaseSizeBeforeCreate = carrinhoRepository.findAll().size();

        // Create the Carrinho
        restCarrinhoMockMvc.perform(post("/api/carrinhos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(carrinho)))
            .andExpect(status().isCreated());

        // Validate the Carrinho in the database
        List<Carrinho> carrinhoList = carrinhoRepository.findAll();
        assertThat(carrinhoList).hasSize(databaseSizeBeforeCreate + 1);
        Carrinho testCarrinho = carrinhoList.get(carrinhoList.size() - 1);
        assertThat(testCarrinho.getData()).isEqualTo(DEFAULT_DATA);
    }

    @Test
    @Transactional
    public void createCarrinhoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = carrinhoRepository.findAll().size();

        // Create the Carrinho with an existing ID
        carrinho.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCarrinhoMockMvc.perform(post("/api/carrinhos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(carrinho)))
            .andExpect(status().isBadRequest());

        // Validate the Carrinho in the database
        List<Carrinho> carrinhoList = carrinhoRepository.findAll();
        assertThat(carrinhoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllCarrinhos() throws Exception {
        // Initialize the database
        carrinhoRepository.saveAndFlush(carrinho);

        // Get all the carrinhoList
        restCarrinhoMockMvc.perform(get("/api/carrinhos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(carrinho.getId().intValue())))
            .andExpect(jsonPath("$.[*].data").value(hasItem(DEFAULT_DATA.toString())));
    }
    
    public void getAllCarrinhosWithEagerRelationshipsIsEnabled() throws Exception {
        CarrinhoResource carrinhoResource = new CarrinhoResource(carrinhoRepositoryMock);
        when(carrinhoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restCarrinhoMockMvc = MockMvcBuilders.standaloneSetup(carrinhoResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restCarrinhoMockMvc.perform(get("/api/carrinhos?eagerload=true"))
        .andExpect(status().isOk());

        verify(carrinhoRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    public void getAllCarrinhosWithEagerRelationshipsIsNotEnabled() throws Exception {
        CarrinhoResource carrinhoResource = new CarrinhoResource(carrinhoRepositoryMock);
            when(carrinhoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restCarrinhoMockMvc = MockMvcBuilders.standaloneSetup(carrinhoResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restCarrinhoMockMvc.perform(get("/api/carrinhos?eagerload=true"))
        .andExpect(status().isOk());

            verify(carrinhoRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getCarrinho() throws Exception {
        // Initialize the database
        carrinhoRepository.saveAndFlush(carrinho);

        // Get the carrinho
        restCarrinhoMockMvc.perform(get("/api/carrinhos/{id}", carrinho.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(carrinho.getId().intValue()))
            .andExpect(jsonPath("$.data").value(DEFAULT_DATA.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingCarrinho() throws Exception {
        // Get the carrinho
        restCarrinhoMockMvc.perform(get("/api/carrinhos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCarrinho() throws Exception {
        // Initialize the database
        carrinhoRepository.saveAndFlush(carrinho);

        int databaseSizeBeforeUpdate = carrinhoRepository.findAll().size();

        // Update the carrinho
        Carrinho updatedCarrinho = carrinhoRepository.findById(carrinho.getId()).get();
        // Disconnect from session so that the updates on updatedCarrinho are not directly saved in db
        em.detach(updatedCarrinho);
        updatedCarrinho
            .data(UPDATED_DATA);

        restCarrinhoMockMvc.perform(put("/api/carrinhos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCarrinho)))
            .andExpect(status().isOk());

        // Validate the Carrinho in the database
        List<Carrinho> carrinhoList = carrinhoRepository.findAll();
        assertThat(carrinhoList).hasSize(databaseSizeBeforeUpdate);
        Carrinho testCarrinho = carrinhoList.get(carrinhoList.size() - 1);
        assertThat(testCarrinho.getData()).isEqualTo(UPDATED_DATA);
    }

    @Test
    @Transactional
    public void updateNonExistingCarrinho() throws Exception {
        int databaseSizeBeforeUpdate = carrinhoRepository.findAll().size();

        // Create the Carrinho

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restCarrinhoMockMvc.perform(put("/api/carrinhos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(carrinho)))
            .andExpect(status().isBadRequest());

        // Validate the Carrinho in the database
        List<Carrinho> carrinhoList = carrinhoRepository.findAll();
        assertThat(carrinhoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteCarrinho() throws Exception {
        // Initialize the database
        carrinhoRepository.saveAndFlush(carrinho);

        int databaseSizeBeforeDelete = carrinhoRepository.findAll().size();

        // Get the carrinho
        restCarrinhoMockMvc.perform(delete("/api/carrinhos/{id}", carrinho.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Carrinho> carrinhoList = carrinhoRepository.findAll();
        assertThat(carrinhoList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Carrinho.class);
        Carrinho carrinho1 = new Carrinho();
        carrinho1.setId(1L);
        Carrinho carrinho2 = new Carrinho();
        carrinho2.setId(carrinho1.getId());
        assertThat(carrinho1).isEqualTo(carrinho2);
        carrinho2.setId(2L);
        assertThat(carrinho1).isNotEqualTo(carrinho2);
        carrinho1.setId(null);
        assertThat(carrinho1).isNotEqualTo(carrinho2);
    }
}
