<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 q-mb-md text-h6 text-left">
            {{ $t('Auditoria Fiscal') }}
          </div>
        </div>
      </q-card-section>

      <q-tabs
        align  ="justify"
        v-model="currentTab"
        class  ="bg-white text-primary"
      >
        <q-tab
          name  ="impostos"
          :label="$t('Impostos')"
        />
        <q-tab
          name  ="declaracoes"
          :label="$t('Declarações')"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels
        v-model="currentTab"
      >
        <q-tab-panel name="impostos">
          <AuditFiscalImpostos />
        </q-tab-panel>

        <q-tab-panel name="declaracoes">
          <AuditFiscalDeclaracoes />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import AuditFiscalImpostos    from './../../../components/fiscal/AuditFiscalImpostos';
import AuditFiscalDeclaracoes from './../../../components/fiscal/AuditFiscalDeclaracoes';

export default {
  components: {
    AuditFiscalImpostos   ,
    AuditFiscalDeclaracoes,
  },

  computed: {
    user() {
      return this.$store.getters['auth/user'] || {};
    },
  },

  data () {
    return {
      currentTab: 'impostos',
    }
  },

  methods: {

  },
}
</script>
