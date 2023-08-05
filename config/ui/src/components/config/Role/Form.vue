<template>
  <q-form @submit="onSubmit">
    <div class="row items-center">
      <div class="text-h6">
        {{ item.id === null ? translate("Novo Regras") : translate("Edição de Regras") }}
      </div>
    </div>
    <div class="row q-col-gutter-y-sm q-pt-md">
      <div class="col-xs-12">
        <q-input
          dense
          outlined
          lazy-rules
          stack-label
          v-model="item.role"
          type="text"
          :label="translate('Role')"
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
        this.item.role = item.role;
      });
    }
  },

  data() {
    return {
      saving: false,
      item: {
        role: null,
      },
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
        .private(`roles/${id}`)

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

      let endpoint = this.id === null ? "roles" : `roles/${this.id}`;

      return api.fetch
        .private(endpoint, options)

        .then((data) => {
          if (data["@id"]) {
            this.$q.notify({
              message: this.translate("Dados salvos com sucesso!"),
              position: "bottom",
              type: "positive",
            });

            return data;
          }

          return null;
        });
    },

    loadSelectableOptions() {
      // load categories
    },

    onSubmit() {
      this.saving = true;

      this.save({
        role: this.item.role,
        company: `/people/${this.myCompany.id}`,
      }).finally(() => {
        this.saving = false;
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
