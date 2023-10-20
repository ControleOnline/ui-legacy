<template>
  <DefaultTable :configs="configs" v-if="configs" />
</template>
<script>
import DefaultTable from "@controleonline/quasar-default-ui/src/components/Default/DefaultTable";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    DefaultTable,
  },

  computed: {
    configs() {
      return {
        store: 'receive',
        add: true,
        selection: false,
        search: false,

        list: {
          status: this.status,
          company: this.companies,
        },
      };
    }
  },
  data() {
    return {
    //   statuses: {
    //   'waiting payment': 'Aguardando pagamento',
    //   'paid': 'Pago',
    //   'divergence of values': 'Divergência de valores',
    //   'canceled': 'Cancelado',
    //   'outdated billing': 'Fatura em atraso',
    //   'open': 'Aberto',
    //   'exceeded billing': 'Limite de faturamento excedido',
    //   'waiting billing': 'Aguardando fatura',
    //   'waiting generate invoice': 'Gerando NF',
    //   'waiting for discount': 'Aguardando desconto',
    //   'resolved': 'Resolvido'
    // },

      status: [
        { label: this.$t('statusList.31'), value: '31' },
        { label: this.$t('statusList.31'), value: '31' },
        { label: this.$t('statusList.31'), value: '31' }
      ],
      companies: [],
    };
  },
  created() {
    this.getMyCompanies();
  },
  methods: {
    ...mapActions({
      getCompanies: "people/myCompanies",
    }),

    getMyCompanies() {
      this.getCompanies().then((response) => {
        console.log(response);
        if (response.success === true && response.data.length) {

          response.data.forEach((item, i) => {
            this.companies.push(
              {
                label: item.alias,
                value: item.id
              }
            );
          });


        }
      });
    },
  },
};
</script>
