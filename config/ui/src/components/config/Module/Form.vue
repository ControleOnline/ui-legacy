<template>
  <q-form @submit="onSubmit">
    <div class="row items-center">
      <div class="text-h6">
        {{ item.id === null ? $t("Novo Menu") : $t("Edição de Menu") }}
      </div>
    </div>
    <div class="row q-col-gutter-y-sm q-pt-md">
      <div class="col-xs-12">
        <q-select
          stack-label
          emit-value
          map-options
          outlined
          v-model="item.category"
          :label="$t('Categoria')"
          :options="categories"
        />
      </div>

      <div class="col-xs-12">
        <q-select
          stack-label
          emit-value
          map-options
          outlined
          v-model="item.module"
          :label="$t('Modulo')"
          :options="modules"
        />
      </div>

      <div class="col-xs-12">
        <q-input
          lazy-rules
          stack-label
          outlined
          v-model="item.menu"
          type="text"
          :label="$t('Nome Menu')"
          class="q-mt-md"
          :rules="[isInvalid()]"
        />
      </div>

      <div class="col-xs-12">
        <q-input
          lazy-rules
          stack-label
          outlined
          v-model="item.route"
          type="text"
          :label="$t('Rota')"
          class="q-mt-md"
          :rules="[isInvalid()]"
        />
      </div>

      <div class="col-xs-12">
        <q-input
          lazy-rules
          stack-label
          outlined
          v-model="item.color"
          type="text"
          :label="$t('Cor')"
          class="q-mt-md"
          :rules="[isInvalid()]"
        />
      </div>

      <div class="col-xs-12">
        <q-input
          lazy-rules
          stack-label
          outlined
          v-model="item.icon"
          type="text"
          :label="$t('Ícone')"
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
        :label="$t('Salvar')"
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
import { mapActions, mapGetters } from "vuex";
import Api from "@controleonline/quasar-common-ui/src/utils/api";

export default {
  props: {
    id: {
      required: false,
      default: null,
    },
    api: {
      type: Api,
      required: true,
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
        this.item.route = item.route;
        this.item.color = item.color;
        this.item.menu = item.menu;
        this.item.icon = item.icon;
        this.item.context = this.context;

        this.item.module =
          item.module !== null && item.module !== undefined
            ? item.module.id
            : null;
        this.item.category =
          item.category !== null && item.category !== undefined
            ? item.category.id
            : null;
      });
    }
  },

  data() {
    return {
      saving: false,
      item: {
        module: null,
        route: null,
        color: null,
        icon: null,
        id: this.id,
        menu: null,
        context: this.context,
        category: null,
      },
      categories: [],
      modules: [],
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
      return this.api
        .private(`menus/${id}`)
        .then((response) => response.json())
        .then((response) => {
          return response;
        });
    },

    // store method
    save(values, params = {}) {
      console.log(values);
      console.log(params);

      let options = {
        method: this.id === null ? "POST" : "PUT",
        headers: new Headers({ "Content-Type": "application/ld+json" }),
        body: JSON.stringify(values),
        params: params,
      };

      let endpoint = this.id === null ? "menus" : `menus/${this.id}`;

      return this.api
        .private(endpoint, options)
        .then((response) => response.json())
        .then((data) => {
          if (data["@id"]) {
            this.$q.notify({
              message: this.$t("Dados salvos com sucesso!"),
              position: "bottom",
              type: "positive",
            });

            this.loadCategories();
            this.loadModules();
            return data;
          }

          return null;
        })
        .catch((error) => {
          this.$q.notify({
            message: this.$t(error.message),
            position: "bottom",
            type: "negative",
          });
        });
    },

    loadSelectableOptions() {
      // load categories
      this.loadCategories();
      this.loadModules();
    },

    onSubmit() {
      this.saving = true;

      this.save({
        route: this.item.route,
        menu: this.item.menu,
        module: "/module/" + this.item.module,
        color: this.item.color,
        icon: this.item.icon,        
        category: "/category/" + this.item.category,
        //company: `/people/${this.myCompany.id}`,
      }).finally(() => {
        this.saving = false;
      });
    },

    loadModules() {
      this.api
        .private(`modules`)
        .then((response) => response.json())
        .then((response) => {
          let data = response["hydra:member"];
          data.forEach((item, i) => {
            this.modules.push({
              label: item.name,
              value: item.id,
            });
          });
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
              value: item.id,
            });
          });
          this.categories = items;
        }
      });
    },

    isInvalid(field) {
      return (val) => {
        if (!(val && val.length > 0))
          return this.$t("Este campo é obrigatório");

        return true;
      };
    },
  },
};
</script>
