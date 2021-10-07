<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 q-mb-md text-h6 text-left">
            {{ $t('Auditoria Depto Pessoal') }}
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
        <q-tab
          name  ="administrativo"
          :label="$t('Administrativo')"
        />
        <q-tab
          name  ="extratos_movimentacoes"
          :label="$t('Extratos e Movimentações')"
        />
        <q-tab
          name  ="folhas_pagamento"
          :label="$t('Folhas de Pagamento')"
        />
        <q-tab
          name  ="folhas_ponto"
          :label="$t('Folhas de Ponto')"
        />
        <q-tab
          name  ="pro_labore"
          :label="$t('Pro-Labore')"
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

        <q-tab-panel name="folhas_pagamento">
          <AuditFolhaPagamento />
        </q-tab-panel>

        <q-tab-panel name="folhas_ponto">
          <AuditFolhaPonto />
        </q-tab-panel>

        <q-tab-panel name="pro_labore">
          <AuditProLabore />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import AuditImpostos       from './../../../components/depto/AuditImpostos';
import AuditDeclaracoes    from './../../../components/depto/AuditDeclaracoes';
import AuditAdministrativo from './../../../components/depto/AuditAdministrativo';
import AuditExtratos       from './../../../components/depto/AuditExtratos';
import AuditFolhaPagamento from './../../../components/depto/AuditFolhaPagamento';
import AuditFolhaPonto     from './../../../components/depto/AuditFolhaPonto';
import AuditProLabore      from './../../../components/depto/AuditProLabore';

export default {
  components: {
    AuditImpostos      ,
    AuditDeclaracoes   ,
    AuditAdministrativo,
    AuditExtratos      ,
    AuditFolhaPagamento,
    AuditFolhaPonto    ,
    AuditProLabore     ,
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
