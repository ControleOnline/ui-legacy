<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 q-mb-md text-h6 text-left">
            {{translate('Editar declaração')}}
          </div>
          <div class="col-12 q-mb-md">
            <FormDeclaracao
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
import FormDeclaracao from './../../../components/depto/FormDeclaracao';

export default {
  components: {
    FormDeclaracao
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
