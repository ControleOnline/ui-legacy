<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 q-mb-md text-h6 text-left">
            {{ $t('Depto Solicitações de Serviços Adicionais') }}
          </div>
        </div>
      </q-card-section>

      <ServicosAdicionaisTabela />

    </q-card>
  </q-page>
</template>

<script>
import ServicosAdicionaisTabela from '../../../components/depto/ServicosAdicionaisTabela';

export default {
  components: {
    ServicosAdicionaisTabela,
  },

  computed: {
    user() {
      return this.$store.getters['auth/user'] || {};
    },
  },

  data () {
    return {

    }
  },

  methods: {

  },
}
</script>
