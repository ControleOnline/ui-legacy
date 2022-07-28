<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 q-mb-md text-h6 text-left">
            {{idRoute === null ? 'Inserindo Novo' : 'Editando'}} Imposto / Declaração
          </div>
          <div class="col-12 q-mb-md">
            <FormImposto
              :idRoute="idRoute"
              @setIdRoute="setIdRoute"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script>
import FormImposto from './../../components/docs/FormImpDec';

export default { //
  components: {
    FormImposto
  },
  data() {
    return {
      idRoute: null
    }
  },
  methods: {
    setIdRoute(idRoute) {
      this.idRoute = idRoute;
    }
  },
  created() {
    if (typeof this.$route.params.id !== 'undefined') { // Quando é de uma rota de edição de registro
      this.idRoute = this.$route.params.id;
    }
  }
}
</script>
