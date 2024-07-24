<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-4 q-mb-md text-h6 text-left">
            {{ $t('Depto Administrativo') }}
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
                  name: 'DeptoAdministrativoCreate'
                }"
              />
            </div>
          </div>
        </div>
      </q-card-section>

      <DeptoAdministrativoTabela />

    </q-card>
  </q-page>
</template>

<script>
import DeptoAdministrativoTabela from '../../../components/depto/DeptoAdministrativoTabela';

export default {
  components: {
    DeptoAdministrativoTabela,
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
