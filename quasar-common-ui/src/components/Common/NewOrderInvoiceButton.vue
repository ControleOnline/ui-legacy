<template>
  <div class="row q-gutter-xs items-center justify-end q-mt-sm q-mb-sm">
    <q-btn color="primary" label="Adicionar Fatura" @click="dialog = true" />

    <q-dialog
      v-model="dialog"
      transition-show="scale"
      transition-hide="scale"
      :persistent="isSaving"
    >
      <q-card>
        <div class="text-h5 q-pa-md">Adicionar nova fatura</div>
        <q-card-section>
          <q-form @submit="createInvoice" class="q-mt-sm" ref="myForm">
            <div class="row q-col-gutter-sm">
              <div class="col-xs-12">
                <q-input
                  dense
                  outlined
                  stack-label
                  lazy-rules
                  reverse-fill-mask
                  prefix="R$"
                  v-model="item.price"
                  type="text"
                  label="Valor"
                  mask="#,##"
                  :rules="[isInvalid('price')]"
                  fill-mask="0"
                />
              </div>

              <div class="col-xs-12">
                <q-input
                  dense
                  outlined
                  stack-label
                  v-model="item.dueDate"
                  mask="##/##/####"
                  label="Data vencimento"
                  :rules="[isInvalid('duedate')]"
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
            </div>

            <div class="row justify-end q-mt-lg">
              <q-btn type="submit" color="primary" label="Salvar" :loading="isSaving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { api } from "@controleonline/../../src/boot/api";
import { mapGetters } from "vuex";

export default {
  props: {
    order: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      isSaving: false,
      dialog: false,
      item: {
        price: null,
        dueDate: null,
      },
    };
  },

  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
    }),
  },

  methods: {
    createInvoice() {
      if (this.isSaving) return;

      this.isSaving = true;

      let options = {
        method: "PUT",
        body: ({
          price: parseFloat(this.item.price.replace(",", ".")),
          dueDate: this.item.dueDate.replace(
            /^(\d{2})\/(\d{2})\/(\d{4})$/,
            "\$3\-\$2\-\$1"
          ),
        }),
        params: {
          myCompany: this.myCompany.id,
        },
      };

      return api.fetch(`${this.order["@id"]}/create-invoice`, options)
        
        .then((order) => {
          if (order !== null) {
            this.$q.notify({
              message: "A fatura foi criada com sucesso",
              position: "bottom",
              type: "positive",
            });

            this.$emit("created", order);
          }
        })
        .finally(() => {
          this.isSaving = false;
        });
    },

    isInvalid(key) {
      return (val) => {
        if (!(val && val.length > 0)) return this.$t("messages.fieldRequired");
        return true;
      };
    },
  },
};
</script>
