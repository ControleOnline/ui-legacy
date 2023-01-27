<template>
  <div class="q-pa-md bg-white contracting-page">
    <div class="row">
      <div class="text-h5 text-center text-primary">
        Siga os passos para a conclusão
      </div>
      <q-space />
      <q-btn flat round dense v-close-popup icon="close" />
    </div>

    <q-stepper
      animated
      alternative-labels
      header-nav
      flat
      v-model="current"
      ref="stepper"
      color="primary"
      :vertical="$q.screen.lt.sm"
    >
      <q-step
        :header-nav="steps.retrieve.hasErrors === false"
        name="retrieve"
        title="Dados de coleta"
        icon="business"
        :done="steps.retrieve.hasErrors === false"
        :error="steps.retrieve.hasErrors === true"
      >
        <Retrieve
          ref="retrieveForm"
          :quoteContact="quoteContact"
          :order="order"
          :steps="data"
          :extra="steps.retrieve.extra"
          @saved="goToNext"
        />
      </q-step>

      <q-step
        :header-nav="steps.delivery.hasErrors === false"
        name="delivery"
        title="Dados de entrega"
        icon="business"
        :done="steps.delivery.hasErrors === false"
        :error="steps.delivery.hasErrors === true"
      >
        <Delivery
          ref="deliveryForm"
          :quoteContact="quoteContact"
          :order="order"
          :steps="data"
          :extra="steps.delivery.extra"
          @saved="goToNext"
        />
      </q-step>

      <q-step
        :header-nav="steps.summary.hasErrors === false"
        name="summary"
        title="Informações adicionais"
        icon="business"
        :done="steps.summary.hasErrors === false"
        :error="steps.summary.hasErrors === true"
      >
        <Summary
          ref="summaryForm"
          :order="order"
          :steps="data"
          :extra="steps.summary.extra"
          @saved="goToNext"
        />
      </q-step>
    </q-stepper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import Retrieve from "./Retrieve";
import Delivery from "./Delivery";
import Summary from "./Summary";

export default {
  components: {
    Retrieve,
    Delivery,
    Summary,
  },

  props: {
    order: {
      type: Object,
      required: true,
    },
    quoteContact: {
      type: Object,
      required: false,
    },
  },

  mounted() {
    this.$emit("load");
  },

  data() {
    return {
      current: "retrieve",
      steps: {
        retrieve: {
          hasErrors: null,
          extra: {},
        },
        delivery: {
          hasErrors: null,
          extra: {},
        },
        summary: {
          hasErrors: null,
          extra: {},
        },
      },
      data: {
        retrieve: { id: null },
        delivery: { id: null },
        summary: { id: null },
      },
    };
  },

  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
      defaultCompany: "people/defaultCompany",
    }),
  },

  methods: {
    ...mapActions({
      choose_retrieve_quote: "freight/choose_retireve_quote",
      choose_delivery_quote: "freight/choose_delivery_quote",
      choose_payer_quote: "freight/choose_payer_quote",
      choose_payment_quote: "freight/choose_payment_quote",
      email: "people/email",
      contact: "people/createContact",
    }),

    createContact() {
      let payload = this.data[this.current];

      let p = [];
      if (payload.contact && payload.contact.name) {
        p = {
          name: payload.name,
          alias: payload.alias,
          document: payload.document,
          contact: {
            name: payload.contact.name,
            email: payload.contact.email,
            phone: payload.contact.phone,
          },
          whereRetrieve: payload.extra.whereRetrieve,
          whereDelivery: payload.extra.whereDelivery,
          personType: payload.personType,
          address: {
            country: payload.address.country,
            state: payload.address.state,
            city: payload.address.city,
            district: payload.address.district,
            complement: payload.address.complement,
            street: payload.address.street,
            number: payload.address.number,
            postal_code: payload.address.postal_code,
          },
        };
      } else {
        p = payload;
      }

      return this.contact(p)
        .then((response) => {
          let formHasErrors = !(response && response.success === true);

          if (formHasErrors) {
            this.notifyError(response.error);
            this.steps[this.current].hasErrors = true;
            return false;
          }
          //this.data[this.current].id = response.data.companyId;
          this.data[this.current].contact.id = response.data.contactId;
          return true;
        })
        .catch((error) => {
          this.notifyError(error.message);
        });
    },

    goToNext(form) {
      this.steps[this.current].hasErrors = form.errors;
      this.steps[this.current].extra = form.extra || null;
      // if no errors

      if (form.errors === false) {
        let id = this.data[this.current].id;
        // save temp data
        this.data[this.current] = form.data;
        if (!form.data.id) this.data[this.current].id = id;
        this.data[this.current].extra = form.extra;
        if (
          this.current != "summary" &&
          (!this.data[this.current].contact ||
            !this.data[this.current].contact.id)
        ) {
          this.createContact().then((result) => {
            if (result === true) {
              if (this.current == "retrieve") {
                this.saveRetrieve(form);
              }
              if (this.current == "delivery") {
                this.saveDelivery(form);
              }
              if (this.current == "summary") {
                if (this.defaultCompany.domainType == "ceg") {
                  this.savePaymentType(form);
                } else {
                  this.savePayer(form);
                }
              }
            }
          });
        } else {
          if (this.current == "retrieve") {
            this.saveRetrieve(form);
          }
          if (this.current == "delivery") {
            this.saveDelivery(form);
          }
          if (this.current == "summary") {
            if (this.defaultCompany.domainType == "ceg") {
              this.savePaymentType(form);
            } else {
              this.savePayer(form);
            }
          }
        }
      }
    },
    saveRetrieve(form) {
      let payload = {
        id: this.order.id,
        values: {
          quote: this.order.choose,
          retrieve: {
            name: form.data.name,
            alias: form.data.alias,
            document: form.data.document,
            personType: form.personType
              ? form.personType
              : form.extra.personType,
            whereRetrieve: form.extra.whereRetrieve,
            whereDelivery: form.extra.whereDelivery,
            id: this.data.retrieve.id,
            address: this.data.retrieve.address,
            contact: this.data.retrieve.contact.id,
          },
        },
      };

      if (this.myCompany !== null)
        payload.query = {
          myCompany: this.myCompany.id,
        };

      this.choose_retrieve_quote(payload)
        .then((response) => {
          if (!response["@id"]) {
            if (form.hasCallback) {
              form.hasCallback();
            }

            if (response && response.response && response.response.error) {
              this.notifyError(this.$t(response.response.error));
            } else {
              this.notifyError(
                "Não foi possivel finalizar o checkout, verifique se você tem permissão ou tente novamente mais tarde."
              );
            }
          } else {
            this.data.retrieve.id = response["retrieve_people"];
            this.$refs.stepper.next();
          }
        })
        .catch((e) => {
          if (form.hasCallback) {
            form.hasCallback();
          }

          if (response && response.response && response.response.error) {
            this.notifyError(this.$t(response.response.error));
          } else {
            this.notifyError(
              "Não foi possivel finalizar o checkout, verifique se você tem permissão ou tente novamente mais tarde."
            );
          }
        });
    },
    saveDelivery(form) {
      let payload = {
        id: this.order.id,
        values: {
          quote: this.order.choose,
          delivery: {
            name: form.data.name,
            alias: form.data.alias,
            document: form.data.document,
            personType: form.personType
              ? form.personType
              : form.extra.personType,
            whereRetrieve: form.extra.whereRetrieve,
            whereDelivery: form.extra.whereDelivery,
            id: this.data.delivery.id,
            address: this.data.delivery.address,
            contact: this.data.delivery.contact.id,
          },
        },
      };

      if (this.myCompany !== null)
        payload.query = {
          myCompany: this.myCompany.id,
        };

      this.choose_delivery_quote(payload)
        .then((response) => {
          if (!response["@id"]) {
            if (form.hasCallback) {
              form.hasCallback();
            }
            if (response && response.response && response.response.error) {
              this.notifyError(this.$t(response.response.error));
            } else {
              this.notifyError(
                "Não foi possivel finalizar o checkout, verifique se você tem permissão ou tente novamente mais tarde."
              );
            }
          } else {
            this.data.delivery.id = response["delivery_people"];
            this.$refs.stepper.next();
          }
        })
        .catch((e) => {
          if (form.hasCallback) {
            form.hasCallback();
          }

          if (response && response.response && response.response.error) {
            this.notifyError(this.$t(response.response.error));
          } else {
            this.notifyError(
              "Não foi possivel finalizar o checkout, verifique se você tem permissão ou tente novamente mais tarde."
            );
          }
        });
    },
    savePaymentType(form) {
      let payload = {
        id: this.order.id,
        values: {
          paymentType: this.data.summary.paymentType,
        },
      };

      if (this.myCompany !== null)
        payload.query = {
          myCompany: this.myCompany.id,
        };

      this.choose_payment_quote(payload)
        .then((response) => {
          if (response["@id"]) {
            this.$emit("finished", payload);
          } else {
            if (form.hasCallback) {
              form.hasCallback();
            }
            if (response && response.response && response.response.error) {
              this.notifyError(this.$t(response.response.error));
            } else {
              this.notifyError(
                "Não foi possivel finalizar o checkout, verifique se a forma de pagamento foi escolhida."
              );
            }
          }
        })
        .catch((e) => {
          if (form.hasCallback) {
            form.hasCallback();
          }
          if (response && response.response && response.response.error) {
            this.notifyError(this.$t(response.response.error));
          } else {
            this.notifyError(
              "Não foi possivel finalizar o checkout, verifique se você tem permissão ou tente novamente mais tarde."
            );
          }
        });
    },
    savePayer(form) {
      let payload = {
        id: this.order.id,
        values: {
          quote: this.order.choose,
          payer: this.data.summary.payer,
          payerDocument: this.data.summary.peopleDocument,
          comments: this.data.summary.comments,
        },
      };

      if (this.myCompany !== null)
        payload.query = {
          myCompany: this.myCompany.id,
        };

      this.choose_payer_quote(payload)
        .then((response) => {
          if (response["@id"]) {
            this.$emit("finished", payload);
          } else {
            if (form.hasCallback) {
              form.hasCallback();
            }

            if (response && response.response && response.response.error) {
              this.notifyError(this.$t(response.response.error));
            } else {
              this.notifyError(
                "Não foi possivel finalizar o checkout, verifique se você tem permissão ou tente novamente mais tarde."
              );
            }
          }
        })
        .catch((e) => {
          if (form.hasCallback) {
            form.hasCallback();
          }

          if (response && response.response && response.response.error) {
            this.notifyError(this.$t(response.response.error));
          } else {
            this.notifyError(
              "Não foi possivel finalizar o checkout, verifique se você tem permissão ou tente novamente mais tarde."
            );
          }
        });
    },

    notifyError(message) {
      this.$q.notify({
        message: message,
        position: "bottom",
        type: "negative",
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.contracting-page {
  min-width: 75vw;
}

@media (max-width: $breakpoint-xs-max) {
  .contracting-page {
    min-width: 100%;
  }
}
</style>
