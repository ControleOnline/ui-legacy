<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 q-mb-md text-h6 text-left">
            {{ $t('Auditoria Contábil') }}
          </div>
        </div>
      </q-card-section>

      <q-tabs
        align  ="justify"
        v-model="currentTab"
        class  =" text-primary"
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
import AuditAdministrativo from '../../../components/contabil/AuditAdministrativo';
import AuditDeclaracoes from '../../../components/contabil/AuditDeclaracoes';
import AuditExtratos from '../../../components/contabil/AuditExtratos';
import AuditImpostos from '../../../components/contabil/AuditImpostos';

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
