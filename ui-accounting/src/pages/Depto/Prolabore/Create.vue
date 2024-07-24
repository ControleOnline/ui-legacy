<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 q-mb-md text-h6 text-left">
            {{$t('Novo Pro-Labore')}}
          </div>
          <div class="col-12 q-mb-md">
            <FormProLabore />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import FormProLabore from '../../../components/depto/FormProLabore';

export default {
  components: {
    FormProLabore
  },

  data () {
    return {
    }
  },
}
</script>
