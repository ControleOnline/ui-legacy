<template>
  <q-page padding>
    <contract-detail
      :id    ="id"
      :config="setConfig"
      :panels="panels"
    >
      <template v-slot:contract="{ contract, config }">
        <contract-nav
          :config  ="config"
          :contract="contract"
        />
        <contract-form
          :config    ="config"
          :contract  ="contract"
          :readOnly  ="!contract.canEdit()"
        />
      </template>

      <template v-slot:participants="{ contract, config }">
        <div class="row q-mb-md justify-end">
          <contract-action-participant
            :config  ="config"
            :contract="contract"
            @added   ="$refs.participantList.reload()"
          />
        </div>
        <contract-participant-list
          ref      ="participantList"
          :config  ="config"
          :contract="contract"
          :readOnly="!contract.canEdit()"
        />
      </template>

      <template v-slot:products="{ contract, config }">
        <div class="row q-mb-md justify-end">
          <contract-action-product
            :config  ="config"
            :contract="contract"
            @added   ="$refs.productList.reload()"
          />
        </div>
        <contract-product-list
          ref      ="productList"
          :config  ="config"
          :contract="contract"
          :readOnly="!contract.canEdit()"
        />
      </template>

      <template v-slot:document="{ contract, config }">

      </template>
    </contract-detail>
  </q-page>
</template>

<script>

export default {
  data() {
    return {
      id     : null,
      company: 13,
      panels : []
    }
  },

  created() {
    if (this.$route.params.id) {
      this.id = decodeURIComponent(this.$route.params.id);
    }

    this.setPanels();
  },

  methods: {
    setConfig(configs) {
      // config api

      configs.Api.setAsFake (false);
      configs.Api.setBaseUrl('https://localhost:8081');
      configs.Api.setToken  ('1ce707158c54688fa80484223ec2404b');

      // config routes

      configs.Routes.Details.name  = 'ContractDetails';
      configs.Routes.Customer.name = 'CustomerDetails';

      // config params

      configs.Params.Company
        .getter = () => {
          return this.company
        };
    },

    setPanels() {
      let panels = [];

      panels.push({
        name: 'contract',
        icon: 'edit'
      });

      panels.push({
        name: 'participants',
        icon: 'people'
      });

      panels.push({
        name: 'products',
        icon: 'shopping_cart'
      });

      panels.push({
        name: 'document',
        icon: 'article'
      });

      this.panels = panels;
    },
  },
};
</script>

<style lang="sass" scoped>
.directive-target
  width : 50px
  height: 50px
</style>
