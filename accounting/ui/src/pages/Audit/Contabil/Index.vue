<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 q-mb-md text-h6 text-left">
            {{ translate('Auditoria Contábil') }}
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
          :label="translate('Impostos')"
        />
        <q-tab
          name  ="declaracoes"
          :label="translate('Declarações')"
        />
        <q-tab
          name  ="administrativo"
          :label="translate('Administrativo')"
        />
        <q-tab
          name  ="extratos_movimentacoes"
          :label="translate('Extratos e Movimentações')"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels
        v-model="currentTab"
      >
        <q-tab-panel name="impostos">
          <AuditImpostos />
        </q-tab-panel>

        <q-tab-panel name="declaracoes">
          <AuditDeclaracoes />
        </q-tab-panel>

        <q-tab-panel name="administrativo">
          <AuditAdministrativo />
        </q-tab-panel>

        <q-tab-panel name="extratos_movimentacoes">
          <AuditExtratos />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import translate from "@controleonline/../../src/boot/translate";
import AuditAdministrativo from './../../../components/contabil/AuditAdministrativo';
import AuditDeclaracoes from './../../../components/contabil/AuditDeclaracoes';
import AuditExtratos from './../../../components/contabil/AuditExtratos';
import AuditImpostos from './../../../components/contabil/AuditImpostos';

export default {
  components: {
    AuditImpostos      ,
    AuditDeclaracoes   ,
    AuditAdministrativo,
    AuditExtratos      ,
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
