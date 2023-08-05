<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 q-mb-md text-h6 text-left">
            {{ translate('Depto Sócios') }}
          </div>
        </div>
      </q-card-section>

      <DeptoSociosTabela />

    </q-card>
  </q-page>
</template>

<script>
import translate from "@controleonline/../../src/boot/translate";
import DeptoSociosTabela from './../../../components/depto/DeptoSociosTabela';

export default {
  components: {
    DeptoSociosTabela,
  },

  computed: {
    user() {
      return this.$store.getters['auth/user'] || {};
    },
  },

  data () {
    return {

    }
  },

  methods: {

  },
}
</script>
