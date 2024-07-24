<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 q-mb-md text-h6 text-left">
            {{ $t('Depto Funcionários') }}
          </div>
        </div>
      </q-card-section>

      <DeptoFuncionariosTabela />

    </q-card>
  </q-page>
</template>

<script>
import DeptoFuncionariosTabela from '../../../components/depto/DeptoFuncionariosTabela';

export default {
  components: {
    DeptoFuncionariosTabela,
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
