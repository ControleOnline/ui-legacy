<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 q-mb-md text-h6 text-left">
            {{$t('Nova Folha de Pagamento')}}
          </div>
          <div class="col-12 q-mb-md">
            <FormFolhaPagamento />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import FormFolhaPagamento from '../../../components/depto/FormFolhaPagamento';

export default {
  components: {
    FormFolhaPagamento
  },

  data () {
    return {
    }
  },
}
</script>
