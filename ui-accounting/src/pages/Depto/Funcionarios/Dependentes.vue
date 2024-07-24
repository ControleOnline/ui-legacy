<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 q-mb-md text-h6 text-left">
            {{$t('Funcionários Dependentes')}}
          </div>
        </div>
      </q-card-section>

      <DeptoDependentesTabela />

    </q-card>
  </q-page>
</template>

<script>
import DeptoDependentesTabela from '../../../components/depto/DeptoDependentesTabela';

export default {
  components: {
    DeptoDependentesTabela
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
