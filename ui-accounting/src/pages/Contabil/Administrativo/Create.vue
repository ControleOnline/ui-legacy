<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 q-mb-md text-h6 text-left">
            {{$t('Novo documento')}}
          </div>
          <div class="col-12 q-mb-md">
            <FormDocumento />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import FormDocumento from '../../../components/contabil/FormDocumento';

export default {
  components: {
    FormDocumento
  },

  data () {
    return {
    }
  },
}
</script>
