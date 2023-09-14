<template>
  <div class="row items-center justify-center">
    <div class="flex flex-center" v-if="isLoading">
      <q-circular-progress
        :indeterminate="isLoading"
        size="sm"
        color="primary"
        class="q-ma-md"
      />
      Carregando...
    </div>

    <div class="col-12" :style="isLoading ? 'visibility:hidden' : 'visibility:visible'">
      <div v-if="item !== null">
        <div class="row form q-mt-md q-pa-md">
          <div class="col">
            <div class="text-left text-bold">Faturamento</div>
            <div class="text-left">
              <q-input
                dense
                outlined
                lazy-rules
                stack-label
                reverse-fill-mask
                v-model="item.billing"
                prefix="R$"
                type="text"
                :rules="[isInvalid('money')]"
                mask="#,##"
                fill-mask="0"
              />
            </div>
          </div>

          <div class="col q-px-md">
            <div class="text-left text-bold">Fechamento</div>
            <div class="text-left">
              <q-select
                dense
                outlined
                stack-label
                map-options
                v-model="item.billingDays"
                :options="settings.select.periods"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey"> Sem resultados </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>

          <div class="col">
            <div class="text-left text-bold">Prazo de pagamento</div>
            <div class="text-left">
              <q-input
                dense
                outlined
                lazy-rules
                stack-label
                reverse-fill-mask
                v-model="item.paymentTerm"
                type="text"
                :rules="[isInvalid('monthday')]"
                mask="#"
              />
            </div>
          </div>

          <div class="col-12 text-right">
            <q-btn
              unelevated
              :loading="saving"
              icon="save"
              label="Salvar"
              size="md"
              color="primary"
              class="q-mt-md"
              @click="onSubmit"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>


const SETTINGS = {
  select: {
    periods: [
      {
        label: "Diário",
        value: "daily",
      },
      {
        label: "Semanal",
        value: "weekly",
      },
      {
        label: "Quinzenal",
        value: "biweekly",
      },
      {
        label: "Mensal",
        value: "monthly",
      },
    ],
  },
};

Object.freeze(SETTINGS);

export default {
  props: {
    id: {
      required: true,
    },

    people_type: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      saving: false,
      settings: SETTINGS,
      isLoading: false,
      item: {
        billing: null,
        billingDays: null,
        paymentTerm: null,
      },
    };
  },

  created() {
    this.onRequest();
  },

  methods: {
    // store method
    getItems() {
      let endpoint = `${this.people_type}/${this.id}/billing`;
      return api.fetch
        (endpoint)
        
        .then((result) => {
          return result.response.data;
        });
    },

    // store method
    save(values) {
      let options = {
        method: "PUT",
        
        body: (values),
      };

      let endpoint = `${this.people_type}/${this.id}/billing`;
      return api.fetch
        (endpoint, options)
        
        .then((data) => {
          if (data.response) {
            if (data.response.success === false) throw new Error(data.response.error);

            return data.response.data;
          }

          return null;
        });
    },

    onSubmit() {
      this.saving = true;

      this.save({
        billing: parseFloat(this.item.billing.replace(",", ".")),
        billingDays: this.item.billingDays.value,
        paymentTerm: parseInt(this.item.paymentTerm),
      })
        .then((data) => {
          if (data) {
            this.$emit("saved", data);
          }
        })
        .catch((error) => {
          this.$emit("error", { message: error.message });
        })
        .finally(() => {
          this.saving = false;
        });
    },

    onRequest() {
      if (this.isLoading) return;

      this.isLoading = true;

      this.getItems()
        .then((data) => {
          this.item.billing = (parseFloat(data.billing) + 0.001).toFixed(2);
          this.item.billingDays = data.billingDays;
          this.item.paymentTerm = data.paymentTerm;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    isInvalid(key) {
      return (val) => {
        if (key == "money") {
          if (!val || !(parseFloat(val.replace(",", ".")) > 0))
            return this.$t("messages.fieldRequired");

          return true;
        }

        if (key == "monthday") {
          if (!val || !(parseInt(val) > 0 && parseInt(val) < 32))
            return this.$t("messages.fieldRequired");

          return true;
        }

        if (!(val && val.length > 0)) return this.$t("messages.fieldRequired");

        return true;
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.form {
  background-color: white;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.24);
}
</style>
