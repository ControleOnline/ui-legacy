<template>
  <div>
    <q-form @submit="addCoupon">
      <div class="row">
        <div class="col-xs-12 q-mb-md">
          <PeopleAutocomplete
            :source="searchPeople"
            :isLoading="isSearching"
            label="Definir o cliente"
            @selected="onSelectClient"
            placeholder="Pesquisar..."
          />
        </div>
        <div class="col-xs-12 q-mb-md text-center">
          <q-radio v-model="item.type" val="percentage" :label="$t('Porcentagem')" />
          <q-radio v-model="item.type" val="amount" :label="$t('Valor')" />
        </div>
        <div class="col-xs-12 q-mb-md">
          <q-input
            dense
            outlined
            lazy-rules
            stack-label
            reverse-fill-mask
            v-model="item.amount"
            :prefix="item.type == 'amount' ? 'R$' : ''"
            :suffix="item.type == 'amount' ? '' : '%'"
            type="text"
            :label="$t('Valor')"
            class="q-mt-md"
            :rules="[isInvalid()]"
            mask="#,##"
            fill-mask="0"
          />
        </div>

        <div class="col-xs-6 q-mb-md">
          <q-input
            dense
            outlined
            stack-label
            v-model="item.discountStartDate"
            :label="$t('Inicio da Promoção')"
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
                    v-model="item.discountStartDate"
                    mask="DD/MM/YYYY"
                    @update:model-value="() => $refs.qDateProxy1.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-xs-6 q-mb-md">
          <q-input
            dense
            outlined
            stack-label
            v-model="item.discountEndDate"
            :label="$t('Fim da Promoção')"
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
                    v-model="item.discountEndDate"
                    mask="DD/MM/YYYY"
                    @update:model-value="() => $refs.qDateProxy1.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
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
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import PeopleAutocomplete from "@controleonline/ui-legacy/ui-common/src/components/Common/PeopleAutocomplete";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    PeopleAutocomplete,
  },
  created() {
    this.loadSelectableOptions();
  },

  data() {
    return {
      isSearching: false,
      saving: false,
      item: {
        parent: null,
        client: null,
        discountStartDate: null,
        discountEndDate: null,
        type: "percentage",
      },
      categories: [],
      clients: [],
      parcels: [],
      dialogs: {
        client: {
          visible: false,
          saving: false,
          item: {
            name: null,
            alias: null,
            type: "J",
            document: null,
          },
        },
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
      createCoupon: "coupon/createCoupon",
      search: "people/searchPeople",
    }),

    onSelectClient(item) {
      this.item.client = item.id;
    },

    searchPeople(input) {
      this.isSearching = true;

      return this.search(input)
        .then((result) => {
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
      // load parcels
      for (let num = 1; num <= 12; num++) {
        this.parcels.push({
          label: `${num}x`,
          value: num,
        });
      }
      this.item.parcels = this.parcels[0].value;

      // load categories
    },

    addCoupon() {
      this.saving = true;

      this.createCoupon({
        values: {
          company: this.myCompany.id,
          client: parseInt(this.item.client),
          type: this.item.type,
          amount: parseFloat(this.item.amount.replace(",", ".")),
          discountStartDate: this.item.discountStartDate
            ? this.item.discountStartDate.replace(
                /^(\d{2})\/(\d{2})\/(\d{4})$/g,
                "$3-$2-$1"
              )
            : null,
          discountEndDate: this.item.discountEndDate
            ? this.item.discountEndDate.replace(
                /^(\d{2})\/(\d{2})\/(\d{4})$/g,
                "$3-$2-$1"
              )
            : null,
        },
        params: {
          myCompany: this.myCompany.id,
        },
      })
        .then((data) => {
          this.$q.notify({
            message: this.$t("Dados salvos com sucesso!"),
            position: "bottom",
            type: "positive",
          });

          this.$emit("created", data);
        })

        .finally(() => {
          this.saving = false;
        });
    },

    isInvalid(field) {
      return (val) => {
        if (field == "date") {
          if (!val) return true;
          if (!/^\d{2}\/\d{2}\/\d{4}$/g.test(val)) return this.$t("A data não é válida");
        }

        if (!(val && val.length > 0)) return this.$t("Este campo é obrigatório");

        return true;
      };
    },
  },
};
</script>
