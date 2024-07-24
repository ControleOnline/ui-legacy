<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-4 q-mb-md text-h6 text-left">
            {{ $t('Contábil Administrativo') }}
          </div>
          <div class="col-8 q-mb-md">
            <div class="row justify-end">
              <q-btn
                :label ="$t('Novo documento')"
                icon   ="add"
                size   ="md"
                color  ="primary"
                class  ="q-ml-sm"
                :to    ="{
                  name: 'ContabilAdministrativoCreate'
                }"
              />
            </div>
          </div>
        </div>
      </q-card-section>

      <ContabilAdministrativoTabela />

    </q-card>
  </q-page>
</template>

<script>
import ContabilAdministrativoTabela from '../../../components/contabil/ContabilAdministrativoTabela';

export default {
  components: {
    ContabilAdministrativoTabela,
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
