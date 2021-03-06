(function () { 'use strict';
  Vue.component('produtos', {
    template: `<div>
  <i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw" v-if="loading"></i>
  <h3>Total de produtos: <span v-if="produtos.results">[[ produtos.results.length ]]</span> <button @click="removerTodos()">remover todos</button></h3>
  <form style="width: 30%" novalidate>
    <div>
      <input type="text" ref="nome" name="nome" v-model="produto.nome" v-validate.initial="'required'" placeholder="Nome do produto" autofocus="autofocus">
      <p v-if="serverErrors.nome">[[ serverErrors.nome[0] ]]</p>
    </div>
    <div>
      <input type="text" name="preço" v-model="produto.preco" v-validate.initial="'required'" placeholder="Preço do produto">
      <p v-if="serverErrors.preco">[[ serverErrors.preco[0] ]]</p>
    </div>
    <hr>
    <button @click.prevent="salvarProduto">[[ produto.id ? 'Atualizar' : 'Salvar' ]]</button>
  </form>

  <table style="margin-top: 20px;">
    <tbody>
      <tr v-for="p in produtos.results" :key="p.id">
        <td>[[ p.nome ]]</td>
        <td>[[ p.preco ]]</td>
        <td>
          <button @click="editarProduto(p)">editar</button>
          <button @click="removerProdutoConfirmacao(p)">remover</button>
        </td>
      </tr>
    </tbody>
  </table>

  <paginador :page-range="produtos.page_range" v-on:carregar="obterProdutos"></paginator>
</div>`,
    delimiters: ['[[', ']]'],
    data: function () {
      return {
        loading: false,
        produtos: [],
        produto: {
          nome: '',
          preco: ''
        },
        serverErrors: {},
        page: 1
      }
    },
    methods: {
      obterProdutos: function (page) {
        var self = this;
        self.page = page;
        self.$Produtos.carregarProdutos(page, function () {
          self.loading = true;
        }).then(sucesso);

        function sucesso(response) {
          self.loading = false;
          self.produtos = response.data;
        }
      },
      salvarProduto: function () {
        var self = this;
        self.serverErrors = {};

        self.$Produtos.salvarProduto(self.produto).then(sucesso).catch(erro);

        function sucesso(response) {
          self.produto = {};
          self.$refs.nome.focus();
          self.obterProdutos(self.page);
        }

        function erro(error) {
          self.serverErrors = error.body;
        }
      },
      editarProduto: function (produto) {
        this.$refs.nome.focus();
        this.produto = Object.assign({}, produto);
      },
      removerProdutoConfirmacao: function (produto) {
        var self = this;
        if (confirm('Remove?')) {
          self.removerProduto(produto);
        }
      },
      removerProduto: function (produto) {
        var self = this;

        this.$Produtos.removerProduto(produto).then(sucesso);

        function sucesso() {
          self.obterProdutos(self.page);
          self.$refs.nome.focus();
        }
      },
      removerTodos: function () {
        var self = this;
        if (confirm('Remover todos?')) {
          self.produtos.results.forEach(function (produto) {
            self.removerProduto(produto);
          });
        }
      }
    },
    mounted: function () {
      var self = this;
      self.obterProdutos(1);
      self.$refs.nome.focus();
    }
  });
})();
