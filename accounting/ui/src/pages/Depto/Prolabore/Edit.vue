<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 q-mb-md text-h6 text-left">
            {{translate('Editar Pro-Labore')}}
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
import translate from "@controleonline/../../src/boot/translate";
import FormProLabore from './../../../components/depto/FormProLabore';

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
