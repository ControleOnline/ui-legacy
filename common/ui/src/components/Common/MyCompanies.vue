<template>
  <!-- eslint-disable -->
  <div>
    <q-btn-dropdown
      split
      outline
      v-if="isMultipleCompanies() == true && !dialog /*&& !this.$q.screen.gt.sm*/"
      color="primary"
      :label="currentCompany !== null ? currentCompany.name : 'Loading...'"
      class="ellipsis full-width company-swich"
    >
      <q-list>
        <q-item
          clickable
          v-close-popup
          dense
          v-for="(company, index) in myCompanies"
          :disable="
            company.enabled && company.user.employee_enabled ? false : true
          "
          :key="index"
          @click="onCompanySelection(company)"
        >
          <q-item-section>
            <q-item-label lines="1">{{ company.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <!--
    <q-btn-dropdown
      outline
      v-if="isMultipleCompanies() == true && !dialog && this.$q.screen.gt.sm"
      color="primary"
      :label="currentCompany !== null ? currentCompany.name : 'Loading...'"
      class="ellipsis full-width company-swich"
    >
      <q-list>
        <q-item
          clickable
          v-close-popup
          dense
          v-for="(company, index) in myCompanies"
          :disable="
            company.enabled && company.user.employee_enabled ? false : true
          "
          :key="index"
          @click="onCompanySelection(company)"
        >
          <q-item-section>
            <q-item-label lines="1">{{ company.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    -->

    <q-dialog v-else v-model="dialog" persistent>
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center">
          <div class="text-h6">Adicionar dados da Empresa</div>
          <q-space />
        </q-card-section>
        <q-card-section>
          <FormCompany
            @saved="onSaved"
            :person="false"
            :companyFields="companyFields"
            address="bycep"
            saveBtn="Salvar"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters } from "vuex";
import FormCompany from "@controleonline/quasar-login-ui/src/components/user/signup/Company";

export default {
  components: {
    FormCompany,
  },
  props: {
    selected: {
      type: Number,
      required: false,
      default: -1,
    },
  },

  data() {
    return {
      dialog: false,
      myCompanies: [],
      currentCompany: null,
      menuOpen: false,
    };
  },

  created() {
    this.getMyCompanies();
  },

  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
      companies: "people/companies",
      signUpCustomBg: "auth/signUpCustomBg",
      signUpFields: "auth/signUpFields",
    }),
    companyFields() {
      return this.signUpFields?.company || [];
    },
  },

  watch: {
    myCompany(company) {
      this.$emit("selected", company);
    },
    companies(companies) {
      this.dialog = companies.length > 0 ? false : true;
      this.setCompanies(companies);
    },
  },

  methods: {
    ...mapActions({
      getCompanies: "people/myCompanies",
      setCompany: "people/currentCompany",
      save: "people/company",
    }),

    onSaved(hasErrors) {
      if (hasErrors == false) {
        //this.dialog = false;
        location.reload();
      }
    },
    isMultipleCompanies() {
      return this.myCompanies.length > 1 ? true : false;
    },
    setCompanies(companies) {
      let data = [];

      for (let index in companies) {
        let item = companies[index];
        let logo = null;

        if (item.logo !== null) {
          logo = "https://" + item.logo.domain + item.logo.url;
        }
        data.push({
          id: item.id,
          enabled: item.enabled,
          name: item.alias,
          logo: logo || null,
          commission: item.commission,
          alias: item.alias,
          configs: item.configs,
          document: item.document,
          domains: item.domains,
          permission: item.permission,
          user: item.user,
        });
      }

      this.myCompanies = data;

      this.$emit("setMyCompanies", this.myCompanies);

      if (this.selected != -1) {
        let _company = data.find((companies) => companies.id === this.selected);

        this.currentCompany =
          _company !== undefined ? _company : data.length > 0 ? data[0] : null;
      } else this.currentCompany = data.length > 0 ? data[0] : null;

      if (this.currentCompany !== null) this.setCompany(this.currentCompany);
    },

    getMyCompanies() {
      this.getCompanies().then((response) => {
        if (response.success === true && response.data.length) {
          this.setCompanies(response.data);
        }
      });
    },

    onCompanySelection(company) {
      this.currentCompany = company;
      this.setCompany(company);
    },
  },
};
</script>
<style>
.company-swich button:first-of-type {
  display: none !important;
}
</style>