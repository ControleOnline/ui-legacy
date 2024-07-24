<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 q-mb-md text-h6 text-left">
            {{ $t('Societário') }}
          </div>
        </div>
      </q-card-section>

      <SocietarioTabela />

    </q-card>
  </q-page>
</template>

<script>
import SocietarioTabela from '../../components/societario/SocietarioTabela';

export default {
  components: {
    SocietarioTabela,
  },

  computed: {
    user() {
      return this.$store.getters['auth/user'] || {};
    },
  },

  data () {
    return {
      currentTab: 'societario',
    }
  },

  methods: {

  },
}
</script>
