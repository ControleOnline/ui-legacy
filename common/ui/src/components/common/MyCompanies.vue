<template>
  <!-- eslint-disable -->
  <q-btn-dropdown outline
    color     ="primary"
    text-color="white"
    :label    ="currentCompany !== null ? currentCompany.name : 'Loading...'"
    class     ="ellipsis full-width"
  >
    <q-list>
      <q-item clickable v-close-popup dense
        v-for="(company, index) in myCompanies"
        :key  ="index"
        @click="onCompanySelection(company)"
      >
        <q-item-section>
          <q-item-label lines="1">{{ company.name }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters } from 'vuex';

export default {
  props: {
    selected: {
      type    : Number,
      required: false,
      default : -1
    }
  },

  data () {
    return {
      myCompanies   : [],
      currentCompany: null,
      menuOpen      : false,
    }
  },

  created() {
    this.getMyCompanies();
  },

  computed: {
    ...mapGetters({
      myCompany: 'people/currentCompany',
      companies: 'people/companies'     ,
    }),
  },

  watch: {
    myCompany(company) {
      this.$emit('selected', company);
    },

    companies(companies) {
      this.setCompanies(companies);
    },
  },

  methods: {
    ...mapActions({
      getCompanies: 'people/mySalesCompanies',
      setCompany  : 'people/currentCompany' ,
    }),

    setCompanies(companies) {
      let data = [];

      for (let index in companies) {
        let item = companies[index];
        let logo = null;

        if (item.logo !== null) {
          logo = 'https://' + item.logo.domain + item.logo.url;
        }

        data.push({
          'id'        : item.id,
          'name'      : item.alias,
          'logo'      : logo || null,
          'commission': item.commission,
        });
      }

      this.myCompanies = data;

      if (this.selected != -1) {
        let _company = data.find(companies => companies.id === this.selected);

        this.currentCompany = _company !== undefined ?
          _company : (data.length > 0 ? data[0] : null);
      }
      else
        this.currentCompany = data.length > 0 ? data[0] : null;

      if (this.currentCompany !== null)
        this.setCompany(this.currentCompany);
    },

    getMyCompanies() {
      this.getCompanies()
        .then(response => {
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
