<template>
  <q-page padding>

    <div v-if="pageLoading" class="row">
      <div class="col-12 pageloader">
        <q-spinner
          color="primary"
          class="q-uploader__spinner"
        />
      </div>
    </div>

    <div v-else class="row">
      <div class="col-12">
        <contract-list
          :config="setConfig"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex';
import { ENTRYPOINT } from './../../config/entrypoint';

export default {
  name: 'ContractIndexPage',

  data() {
    return {
      pageLoading: true,
    }
  },

  computed: {
    ...mapGetters({
      defaultCompany : 'people/defaultCompany',
    })
  },

  created() {
    if (this.defaultCompany) {
      this.pageLoading = false;
    }
  },
  
  watch: {
    defaultCompany(data) {
      if (data) {
        this.pageLoading = false;
      }
    }
  },

  methods: {
    setConfig(configs) {
      // config api
      configs.Api.setAsFake (false);
      configs.Api.setBaseUrl(ENTRYPOINT);
      configs.Api.setToken  (this.$store.getters['auth/user'].token);

      // config routes
      configs.Routes.Details.name = 'Admin.Contract.Details';
      
      // config params
      configs.Params.Company
        .getter = () => {
          return this.$store.getters['people/defaultCompany'].id;
        };
    },
  },
}
</script>

<style lang="scss" scoped>
.pageloader{
  text-align: center;
  margin-top: 200px;
}
</style>