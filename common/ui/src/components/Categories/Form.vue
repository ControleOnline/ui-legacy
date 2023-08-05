<template>
  <q-form @submit="onSubmit">
    <div class="row items-center">
      <div class="text-h6">
        {{ item.id === null ? translate("Nova categoria") : translate("Edição categoria") }}
      </div>
    </div>
    <div class="row q-col-gutter-y-sm q-pt-md">
      <div class="col-xs-12">
        <q-select
          dense
          outlined
          stack-label
          emit-value
          map-options
          v-model="item.parent"
          :label="translate('Categoria pai')"
          :options="categories"
        />
      </div>
      <div class="col-xs-12">
        <q-input
          dense
          outlined
          lazy-rules
          stack-label
          v-model="item.name"
          type="text"
          :label="translate('Nome categoria')"
          class="q-mt-md"
          :rules="[isInvalid()]"
        />
      </div>

      <div class="col-xs-12">
        <q-input
          dense
          outlined
          lazy-rules
          stack-label
          v-model="item.color"
          type="text"
          :label="translate('Cor')"
          class="q-mt-md"
          :rules="[isInvalid()]"
        />
      </div>

      <div class="col-xs-12">
        <q-input
          dense
          outlined
          lazy-rules
          stack-label
          v-model="item.icon"
          type="text"
          :label="translate('Ícone')"
          class="q-mt-md"
          :rules="[isInvalid()]"
        />
      </div>
    </div>
    <div class="row justify-end">
      <q-btn
        :loading="saving"
        icon="save"
        type="submit"
        :label="translate('Salvar')"
        size="md"
        color="primary"
        class="q-mt-md"
        unelevated
        no-caps
      />
    </div>
  </q-form>
</template>

<script>
import { api } from "@controleonline/../../src/boot/api";
import translate from "@controleonline/../../src/boot/translate";
import { mapActions, mapGetters } from "vuex";


export default {
  props: {
    id: {
      required: false,
      default: null,
    },

    context: {
      type: String,
      required: true,
    },
  },

  created() {
    this.loadSelectableOptions();

    if (this.id !== null) {
      this.getItem(this.id).then((item) => {
        this.item.name = item.name;
        this.item.color = item.color;
        this.item.icon = item.icon;
        this.item.context = this.context;
        this.item.parent = item.parent !== null ? item.parent["@id"] : null;
      });
    }
  },

  data() {
    return {
      saving: false,
      item: {
        id: this.id,
        name: null,
        context: this.context,
        parent: null,
        icon: null,
        color: null,
      },
      categories: [],
    };
  },

  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
    }),
  },

  methods: {
    ...mapActions({
      getCategories: "categories/getCategories",
      createCategory: "categories/createCategory",
    }),

    // store method
    getItem(id) {
      return api.fetch
        .private(`categories/${id}`)

        .then((response) => {
          return response;
        });
    },

    // store method
    save(values, params = {}) {
      let options = {
        method: this.id === null ? "POST" : "PUT",
        
        body: JSON.stringify(values),
        params: params,
      };

      let endpoint = this.id === null ? "categories" : `categories/${this.id}`;

      return api.fetch
        .private(endpoint, options)

        .then((data) => {
          if (data["@id"]) {
            this.$q.notify({
              message: this.translate("Dados salvos com sucesso!"),
              position: "bottom",
              type: "positive",
            });

            this.loadCategories();

            return data;
          }

          return null;
        });
    },

    loadSelectableOptions() {
      // load categories
      this.loadCategories();
    },

    onSubmit() {
      this.saving = true;

      this.save({
        context: this.context,
        name: this.item.name,
        color: this.item.color,
        icon: this.item.icon,
        context: this.item.context,
        parent: this.item.parent,
        company: `/people/${this.myCompany.id}`,
      }).finally(() => {
        this.saving = false;
      });
    },

    loadCategories() {
      this.getCategories({
        params: {
          context: this.context,
          company: this.myCompany.id,
        },
      }).then((members) => {
        if (members.length) {
          let items = [];

          items.push({
            label: null,
            value: null,
          });

          members.forEach((item, i) => {
            items.push({
              label: item.name,
              value: item["@id"],
            });
          });
          this.categories = items;
        }
      });
    },

    isInvalid(field) {
      return (val) => {
        if (!(val && val.length > 0)) return this.translate("Este campo é obrigatório");

        return true;
      };
    },
  },
};
</script>
