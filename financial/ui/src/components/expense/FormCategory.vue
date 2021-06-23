<template>
  <q-form @submit="onSubmit" class="q-mb-md">
    <div class="row items-center q-mb-md">
      <div class="text-h6">
        {{ item.id === null ? $t('Nova categoria') : $t('Edição categoria') }}
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 q-mb-md">
        <q-select stack-label emit-value map-options
          v-model ="item.parent"
          :label  ="$t('Categoria pai')"
          :options="categories"
        />
      </div>
      <div class="col-xs-12 q-mb-md">
        <q-input lazy-rules stack-label
          v-model="item.name"
          type   ="text"
          :label ="$t('Nome categoria')"
          class  ="q-mt-md"
          :rules ="[isInvalid()]"
        />
      </div>
    </div>
    <div class="row justify-end">
      <q-btn
        :loading="saving"
        icon    ="save"
        type    ="submit"
        :label  ="$t('Salvar')"
        size    ="md"
        color   ="primary"
        class   ="q-mt-md"
      />
    </div>
  </q-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Api                        from '@freteclick/quasar-common-ui/src/utils/api';

export default {
  props: {
    id : {
      required: false,
      default : null
    },
    api: {
      type    : Api,
      required: true
    },
  },

  created() {
    this.loadSelectableOptions();

    if (this.id !== null) {
      this.getItem(this.id)
        .then(item => {
          this.item.name    = item.name;
          this.item.context = item.context;
          this.item.parent  = item.parent !== null ? item.parent['@id'] : null;
        });
    }
  },

  data() {
    return {
      saving: false,
      item  : {
        "id"     : this.id,
        "name"   : null,
        "context": "expense",
        "parent" : null
      },
      categories : [],
    }
  },

  computed: {
    ...mapGetters({
      myCompany: 'people/currentCompany',
    }),
  },

  methods: {
    ...mapActions({
      getCategories : 'expense/getCategories',
      createCategory: 'expense/createCategory',
    }),

    // store method
    getItem(id) {
      return this.api.private(`categories/${id}`)
        .then(response => response.json())
        .then(response => {
          return response;
        });
    },

    // store method
    save(values, params = {}) {
      let options = {
        method : this.id === null ? 'POST' : 'PUT',
        headers: new Headers({ 'Content-Type': 'application/ld+json' }),
        body   : JSON.stringify(values),
        params : params,
      };

      let endpoint = this.id === null ?
        'categories' : `categories/${this.id}`;

      return this.api.private(endpoint, options)
        .then(response => response.json())
        .then(data => {
          if (data['@id']) {
            this.$q.notify({
              message : this.$t('Dados salvos com sucesso!'),
              position: 'bottom',
              type    : 'positive',
            });

            this.loadCategories();

            return data;
          }

          return null;
        })
        .catch(error => {
          this.$q.notify({
            message : this.$t(error.message),
            position: 'bottom',
            type    : 'negative',
          });
        });
    },

    loadSelectableOptions() {
      // load categories
      this.loadCategories();
    },

    onSubmit() {
      this.saving = true;

      this.save(
        {
          "name"   : this.item.name,
          "context": this.item.context,
          "parent" : this.item.parent,
          "company": `/people/${this.myCompany.id}`,
        }
      )
      .finally(() => {
        this.saving = false;
      });
    },

    loadCategories() {
      this.getCategories({
        params: {
          'context': 'expense',
          'company': this.myCompany.id,
        }
      }).then(members => {
        if (members.length) {
          let items = [];

          items.push({
            label: null,
            value: null
          });

          members.forEach((item, i) => {
            items.push({
              label: item.name,
              value: item['@id']
            });
          });
          this.categories = items;
        }
      });
    },

    isInvalid(field) {
      return val => {
        if (!(val && val.length > 0))
          return this.$t('Este campo é obrigatório');

        return true;
      };
    },
  },
};
</script>
