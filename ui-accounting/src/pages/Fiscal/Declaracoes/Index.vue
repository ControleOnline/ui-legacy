<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-4 q-mb-md text-h6 text-left">
            {{ $t('Fiscal Declarações') }}
          </div>
          <div class="col-8 q-mb-md">
            <div class="row justify-end">
              <q-btn
                :label ="$t('Nova declaração')"
                icon   ="add"
                size   ="md"
                color  ="primary"
                class  ="q-ml-sm"
                :to    ="{
                  name: 'FiscalDeclaracaoCreate'
                }"
              />
            </div>
          </div>
        </div>
      </q-card-section>

      <FiscalDeclaracaoTabela />

    </q-card>
  </q-page>
</template>

<script>
import FiscalDeclaracaoTabela from '../../../components/fiscal/FiscalDeclaracaoTabela';

export default {
  components: {
    FiscalDeclaracaoTabela,
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
