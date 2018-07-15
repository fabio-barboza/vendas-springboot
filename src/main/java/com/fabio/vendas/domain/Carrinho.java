package com.fabio.vendas.domain;


import javax.persistence.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Carrinho.
 */
@Entity
@Table(name = "carrinho")
public class Carrinho implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data")
    private Instant data;

    @OneToOne
    @JoinColumn(unique = true)
    private Cliente cliente;

    @ManyToMany
    @JoinTable(name = "carrinho_produto",
               joinColumns = @JoinColumn(name = "carrinhos_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "produtos_id", referencedColumnName = "id"))
    private Set<Produto> produtos = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getData() {
        return data;
    }

    public Carrinho data(Instant data) {
        this.data = data;
        return this;
    }

    public void setData(Instant data) {
        this.data = data;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public Carrinho cliente(Cliente cliente) {
        this.cliente = cliente;
        return this;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Set<Produto> getProdutos() {
        return produtos;
    }

    public Carrinho produtos(Set<Produto> produtos) {
        this.produtos = produtos;
        return this;
    }

    public Carrinho addProduto(Produto produto) {
        this.produtos.add(produto);
        produto.getProdutos().add(this);
        return this;
    }

    public Carrinho removeProduto(Produto produto) {
        this.produtos.remove(produto);
        produto.getProdutos().remove(this);
        return this;
    }

    public void setProdutos(Set<Produto> produtos) {
        this.produtos = produtos;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Carrinho carrinho = (Carrinho) o;
        if (carrinho.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), carrinho.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Carrinho{" +
            "id=" + getId() +
            ", data='" + getData() + "'" +
            "}";
    }
}
