<template>
  <div>
    <div class="row q-mb-md q-gutter-sm justify-end">
      <q-btn
        :label="translate('Cancelar despesa')"
        icon="cancel"
        color="negative"
        @click="removeExpense"
        :loading="deleting"
      />
    </div>
    <q-form @submit="editExpense">
      <div class="row">
        <div class="col-xs-12 q-mb-md">
          <q-select
            dense
            outlined
            stack-label
            emit-value
            map-options
            lazy-rules
            v-model="item.category"
            :label="translate('Categoria da despesa')"
            :options="categories"
            :rules="[(val) => val !== null || 'Selecione uma categoria']"
          />
        </div>
        <div class="col-xs-12 q-mb-md">
          <q-input
            dense
            outlined
            lazy-rules
            stack-label
            v-model="item.description"
            type="text"
            :label="translate('Descrição da despesa')"
            class="q-mt-md"
            :rules="[isInvalid()]"
          />
        </div>
        <div class="col-xs-12 q-mb-md">
          <q-select
            dense
            outlined
            v-if="item.provider"
            stack-label
            emit-value
            map-options
            lazy-rules
            v-model="item.provider"
            :label="translate('Fornecedor')"
            :options="providers"
            :rules="[(val) => val !== null || 'Selecione um fornecedor']"
          />
          <PeopleAutocomplete
            v-else
            :source="searchPeople"
            option-value="optionValue"
            :isLoading="isSearching"
            label="Definir o fornecedor"
            @selected="onSelectClient"
            placeholder="Pesquisar..."
          />

          <q-btn v-if="item.provider" @click="item.provider = null" align="right">
            Alterar
          </q-btn>
        </div>
        <div class="col-xs-12 q-mb-md">
          <q-input
            dense
            outlined
            lazy-rules
            stack-label
            reverse-fill-mask
            v-model="item.amount"
            prefix="R$"
            type="text"
            :label="translate('Valor')"
            class="q-mt-md"
            :rules="[isInvalid()]"
            mask="#,##"
            fill-mask="0"
          />
        </div>
        <div class="col-xs-12 q-mb-md">
          <q-input
            dense
            outlined
            stack-label
            v-model="item.dueDate"
            :label="translate('Data primeiro vencimento')"
            mask="##/##/####"
            class="q-mb-sm"
            :rules="[isInvalid('date')]"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy1"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="item.dueDate"
                    mask="DD/MM/YYYY"
                    @input="() => $refs.qDateProxy1.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-xs-12 q-mb-md">
          <q-select
            dense
            outlined
            stack-label
            emit-value
            map-options
            lazy-rules
            v-model="item.status"
            :label="translate('Status')"
            :options="statuses"
            :rules="[(val) => val !== null || 'Selecione um status']"
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
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import translate from "@controleonline/../../src/boot/translate";
import { formatDateYmdTodmY } from "@controleonline/quasar-common-ui/src/utils/formatter";
import { mapActions, mapGetters } from "vuex";

 import PeopleAutocomplete from "@controleonline/quasar-common-ui/src/components/Common/PeopleAutocomplete";

export default {
  components: {
    PeopleAutocomplete,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },

  created() {
    this.loadSelectableOptions();
    this.loadInvoice();
  },

  data() {
    return {
      isSearching: false,
      saving: false,
      isLoading: false,
      deleting: false,
      item: {
        category: null,
        description: null,
        provider: null,
        amount: null,
        dueDate: null,
        status: null,
      },
      categories: [],
      providers: [],
      statuses: [],
    };
  },

  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
    }),
  },

  methods: {
    ...mapActions({
      getStatuses: "payInvoice/getStatuses",
      getCategories: "categories/getCategories",
      getInvoice: "payInvoice/getInvoice",
      createCategory: "expense/createCategory",
      createProvider: "expense/createProvider",
      updateExpense: "expense/updateExpense",
      deleteExpense: "expense/deleteExpense",
      search: "people/searchPeople",
    }),
    onSelectClient(item) {
      this.item.provider = item.id;
    },

    searchPeople(input) {
      this.isSearching = true;

      return this.search(input)
        .then((result) => {
          this.isSearching = false;

          if (result && result.success) {
            let items = [];
            for (let i = 0; i < result.data.length; i++) {
              items.push({
                label:
                  result.data[i].id +
                  " - " +
                  result.data[i].name +
                  " - " +
                  result.data[i].alias,
                value: result.data[i],
              });
            }
            return items;
          }
        })
        .finally(() => {
          this.isSearching = false;
        });
    },
    loadSelectableOptions() {
      // load categories
      this.loadCategories();

      // load statuses
      this.loadStatuses();
    },
    loadCategories() {
      this.getCategories({
        params: {
          context: "expense",
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

    loadStatuses() {
      this.getStatuses({
        visibility: "public",
        context: "invoice",
        realStatus: ["open", "pending", "canceled", "closed"],
      }).then((statuses) => {
        if (statuses.length) {
          let data = [];
          for (let index in statuses) {
            let item = statuses[index];
            data.push({
              label: this.translate(`invoice.statuses.${item.status}`),
              value: item.status,
            });
          }
          this.statuses = data;
        }
      });
    },

    addCategory() {
      this.dialogs.category.saving = true;

      this.createCategory({
        values: {
          name: this.dialogs.category.expense.name,
          context: this.dialogs.category.expense.context,
          parent: this.dialogs.category.expense.parent,
          company: `/people/${this.myCompany.id}`,
        },
      })
        .then((response) => {
          this.$q.notify({
            message: this.translate("Dados salvos com sucesso!"),
            position: "bottom",
            type: "positive",
          });

          this.loadCategories();
        })
        .finally(() => {
          this.dialogs.category.saving = false;
        });
    },

    addProvider() {
      this.dialogs.provider.saving = true;

      this.createProvider({
        values: {
          name: this.dialogs.provider.item.name,
          alias: this.dialogs.provider.item.alias,
          peopleType: this.dialogs.provider.item.type,
          document: this.dialogs.provider.item.document,
        },
        params: {
          myCompany: this.myCompany.id,
        },
      })
        .then((response) => {
          this.$q.notify({
            message: this.translate("Dados salvos com sucesso!"),
            position: "bottom",
            type: "positive",
          });
        })

        .finally(() => {
          this.dialogs.provider.saving = false;
        });
    },

    editExpense() {
      this.saving = true;

      this.updateExpense({
        id: this.id,
        values: {
          company: this.myCompany.id,
          category: parseInt(this.item.category.replace(/\D/g, "")),
          provider: parseInt(this.item.provider.replace(/\D/g, "")),
          amount: parseFloat(this.item.amount.replace(",", ".")),
          dueDate: this.item.dueDate
            ? this.item.dueDate.replace(/^(\d{2})\/(\d{2})\/(\d{4})$/g, "$3-$2-$1")
            : null,
          description: this.item.description,
          status: this.item.status,
        },
        params: {
          myCompany: this.myCompany.id,
        },
      })
        .then((data) => {
          this.$q.notify({
            message: this.translate("Dados salvos com sucesso!"),
            position: "bottom",
            type: "positive",
          });

          this.$emit("updated", data);
        })

        .finally(() => {
          this.saving = false;
        });
    },

    removeExpense() {
      if (window.confirm(this.translate("Realmente deseja cancelar esta despesa?"))) {
        this.deleting = true;

        this.deleteExpense({
          id: this.id,
          values: {
            company: this.myCompany.id,
          },
        })
          .then((data) => {
            this.$q.notify({
              message: this.translate("Despesa cancelada com sucesso!"),
              position: "bottom",
              type: "positive",
            });

            this.loadInvoice();

            this.$emit("updated", data);
          })

          .finally(() => {
            this.deleting = false;
          });
      }
    },

    loadInvoice() {
      let params = {};

      this.isLoading = true;

      this.getInvoice({
        invoiceId: this.id,
        params: {
          myCompany: this.myCompany.id,
        },
      })
        .then((data) => {
          if (data["@id"]) {
            this.item.category = data.category;
            this.item.description = data.description;
            this.item.provider = data.order[0].order.provider["@id"].replace(
              /people/g,
              "providers"
            );

            this.providers.push({
              label:
                data.order[0].order.provider.name || data.order[0].order.provider.alias,
              value: this.item.provider,
            });

            this.item.amount = (parseFloat(data.price) + 0.001).toFixed(2);
            this.item.dueDate = formatDateYmdTodmY(data.dueDate);
            this.item.status = data.status.status;
          }
        })
        .catch((error) => {})
        .finally(() => {
          this.isLoading = false;
        });
    },

    isInvalid(field) {
      return (val) => {
        if (field == "date") {
          if (!/^\d{2}\/\d{2}\/\d{4}$/g.test(val)) return this.translate("A data não é válida");
        }

        if (!(val && val.length > 0)) return this.translate("Este campo é obrigatório");

        return true;
      };
    },
  },
};
</script>
