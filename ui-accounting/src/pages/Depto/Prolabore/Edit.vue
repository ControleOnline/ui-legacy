<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 q-mb-md text-h6 text-left">
            {{$t('Editar Pro-Labore')}}
          </div>
          <div class="col-12 q-mb-md">
            <FormProLabore
              :id="id"
            />
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
