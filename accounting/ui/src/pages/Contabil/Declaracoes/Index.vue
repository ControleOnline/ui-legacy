<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-4 q-mb-md text-h6 text-left">
            {{ translate('Contábil Declarações') }}
          </div>
          <div class="col-8 q-mb-md">
            <div class="row justify-end">
              <q-btn
                :label ="translate('Nova declaração')"
                icon   ="add"
                size   ="md"
                color  ="primary"
                class  ="q-ml-sm"
                :to    ="{
                  name: 'ContabilDeclaracaoCreate'
                }"
              />
            </div>
          </div>
        </div>
      </q-card-section>

      <ContabilDeclaracaoTabela />

    </q-card>
  </q-page>
</template>

<script>
import translate from "@controleonline/../../src/boot/translate";
import ContabilDeclaracaoTabela from './../../../components/contabil/ContabilDeclaracaoTabela';

export default {
  components: {
    ContabilDeclaracaoTabela,
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
