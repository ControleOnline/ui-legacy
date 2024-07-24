<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 q-mb-md text-h6 text-left">
            {{$t('Sócios Folhas de Ponto')}}
          </div>
        </div>
      </q-card-section>

      <DeptoFolhasTabela />

    </q-card>
  </q-page>
</template>

<script>
import DeptoFolhasTabela from '../../../components/depto/DeptoFolhasTabela';

export default {
  components: {
    DeptoFolhasTabela
  },

  created() {
    if (this.$route.params.id) {
      this.id = decodeURIComponent(this.$route.params.id);
    }
  },

  data () {
    return {
      id: null,
    }
  },
}
</script>
