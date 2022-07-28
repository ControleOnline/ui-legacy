<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 col-md-4 q-mb-md text-h6 text-left">
            {{ $t('Auditoria Fiscal (Impostos e Declarações)') }}
          </div>
          <div class="col-12 col-md-8 q-mb-md">
            <div class="row justify-end">
              <q-btn
                label="Novo Registro"
                icon="add"
                size="md"
                color="primary"
                :to="{
                  name: 'AuditFiscalCreate'
                }"
              />
            </div>
          </div>
        </div>
      </q-card-section>

      <FiscalImpostosTabela/>

    </q-card>
  </q-page>
</template>

<script>
import FiscalImpostosTabela from './../../components/docs/AuditFiscalArquivosTabela';

export default { //
  components: {
    FiscalImpostosTabela,
  },

  computed: {
    user() {
      return this.$store.getters['auth/user'] || {};
    },
  },

  data() {
    return {}
  },

  methods: {},
}
</script>
