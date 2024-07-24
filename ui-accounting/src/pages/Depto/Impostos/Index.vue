<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-4 q-mb-md text-h6 text-left">
            {{ $t('Depto Pessoal Impostos') }}
          </div>
          <div class="col-8 q-mb-md">
            <div class="row justify-end">
              <q-btn
                :label ="$t('Novo imposto')"
                icon   ="add"
                size   ="md"
                color  ="primary"
                class  ="q-ml-sm"
                :to    ="{
                  name: 'DeptoImpostoCreate'
                }"
              />
            </div>
          </div>
        </div>
      </q-card-section>

      <DeptoImpostosTabela />

    </q-card>
  </q-page>
</template>

<script>
import DeptoImpostosTabela from '../../../components/depto/DeptoImpostosTabela';

export default {
  components: {
    DeptoImpostosTabela,
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
