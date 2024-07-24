<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 q-mb-md text-h6 text-left">
            {{$t('Nova declaração')}}
          </div>
          <div class="col-12 q-mb-md">
            <FormDeclaracao />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import FormDeclaracao from '../../../components/depto/FormDeclaracao';

export default {
  components: {
    FormDeclaracao
  },

  data () {
    return {
    }
  },
}
</script>
