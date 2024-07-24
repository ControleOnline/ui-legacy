<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 q-mb-md text-h6 text-left">
            {{$t('Novo imposto')}}
          </div>
          <div class="col-12 q-mb-md">
            <FormImposto />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import FormImposto from '../../../components/depto/FormImposto';

export default {
  components: {
    FormImposto
  },

  data () {
    return {
    }
  },
}
</script>
