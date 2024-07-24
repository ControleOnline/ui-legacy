<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 q-mb-md text-h6 text-left">
            {{ $t('Depto Sócios') }}
          </div>
        </div>
      </q-card-section>

      <DeptoSociosTabela />

    </q-card>
  </q-page>
</template>

<script>
import DeptoSociosTabela from '../../../components/depto/DeptoSociosTabela';

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
