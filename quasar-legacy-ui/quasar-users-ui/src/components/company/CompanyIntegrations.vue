<template>
  <div>
    <q-tabs no-caps align="justify" v-model="currentTab" class="bg-white text-primary">
      <q-tab name="mercado_livre" label="Mercado Livre" />
      <q-tab name="clicksign" label="Clicksign" />
    </q-tabs>
    <q-tab-panels v-model="currentTab">
      <q-tab-panel name="mercado_livre">
        <div class="row q-pt-md">
          {{ configs }}
        </div>

        <div class="col-12">
          <div class="row justify-end">
            <q-btn :loading="saving" icon="save" label="Conectar" size="md" color="yellow" class="q-mt-md"
              @click="autenticateMl()" />
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="clicksign">
        <div class="row q-pt-md">

        </div>

      </q-tab-panel>
    </q-tab-panels>

  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    companyId: {
      type: Number,
      required: true,
    },
  },
  watch: {
    myCompany(myCompany) {
      console.log(myCompany);
      this.configs = myCompany.configs;
    },
  },
  data() {
    return {
      configs: {},
      saving: false,
      integrations: null,
      currentTab: "mercado_livre",
      items: {
        email: {
          value: null,
          changed: false,
        },
      },
      select: {
        signature_providers: [
          {
            label: "Selecione uma opção",
            value: null,
          },
          {
            label: "Clicksign",
            value: "clicksign",
          },
          {
            label: "Zapsign",
            value: "zapsign",
          },
        ],
      },
    };
  },

  created() {
    this.onRequest();
  },

  computed: {
    ...mapGetters({
      isLoading: "profile/isLoading",
      myCompany: "people/currentCompany",
    }),
  },

  methods: {
    ...mapActions({
      saveConfig: "config/saveConfig",
      getEmails: "profile/getEmails",
      saveEmail: "profile/updateProfile",
    }),
    autenticateMl() {
      window.open(this.configs['mercado_livre_authorization_url'] + '?' + 'response_type=code&client_id=' +
        this.configs['mercado_livre_app_id'] +
        '&redirect_uri=' +
        this.configs['mercado_livre_return_authorization_url']
        + '&state=' + this.myCompany.id
        , '_blank');
    },
    
    onRequest() {
      this.configs = this.myCompany?.configs;
    },
  },
};
</script>
