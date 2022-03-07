<template>
  <q-card class="q-pa-sm">
    <q-table
      flat
      grid
      hide-header
      :loading="isLoading"
      :data="items"
      @request="onRequest"
      row-key="id"
      style="min-height: 90vh"
    >
      <template v-slot:top>
        <div class="col-3 q-mb-md text-h6">Empresas</div>
        <div class="col-9 q-mb-md">
          <div class="row justify-end">
            <q-btn
              label="Adicionar"
              icon="add"
              size="md"
              color="primary"
              class="q-ml-sm"
              @click="dialog = !dialog"
            />
          </div>
        </div>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-4 col-md-3 col-lg-2">
          <q-card>
            <q-img
              :contain="true"
              src="~assets/business.png"
              style="height: 100px; max-width: 100%"
            >
              <div class="absolute-bottom text-subtitle1 text-center">
                {{ props.row.name || props.row.alias }}
              </div>
            </q-img>
            <q-card-section>
              <q-list>
                <q-item dense>
                  <q-item-section avatar>
                    <q-icon name="business" />
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption>{{
                      props.row.document
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-separator />
            <q-card-actions align="around">
              <q-btn
                flat
                round
                dense
                @click="btEditCompany(props.row.id)"
                color="primary"
                icon="edit"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="red"
                icon="delete"
                @click="removeItem(props.row)"
                :loading="props.row._bussy"
                :disable="items.length == 1"
              >
                <q-tooltip>Remover</q-tooltip>
              </q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </template>
    </q-table>

    <q-dialog v-model="dialog">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center">
          <div class="text-h6">Nova empresa</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <FormCreateClient
            ref="myForm"
            :api="api"
            :employeeId="id"
            :pjOnly="true"
            @saved="
              (data) => {
                this.$q.notify({
                  message: 'Os dados foram salvos com sucesso',
                  position: 'bottom',
                  type: 'positive',
                });

                if (this.events && this.events.onSaved) {
                  this.events.onSaved(data);
                }
                this.dialog = false;
                this.onRequest();
              }
            "
            @error="
              (error) => {
                this.$q.notify({
                  message: error.message,
                  position: 'bottom',
                  type: 'warning',
                });
              }
            "
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import FormCreateClient from "./FormCreateClient.vue";
import { formatDocument } from "@controleonline/quasar-common-ui/src/utils/formatter";
import Api from "@controleonline/quasar-common-ui/src/utils/api";

export default {
  components: {
    FormCreateClient,
    Api,
  },
  props: {
    api: {
      type: Api,
      required: true,
    },
    id: {
      required: true,
    },
  },
  data() {
    return {
      items: [],
      dialog: false,
      saving: false,
      isLoading: false,
    };
  },

  created() {
    this.onRequest();
  },

  computed: {
    ...mapGetters({
      signUpFields: "auth/signUpFields",
    }),

    companyFields() {
      return this.signUpFields?.company || [];
    },
  },

  methods: {
    ...mapActions({
      save: "people/company",
    }),
    btEditCompany(id) {
      this.$router.push({ name: "ClientsDetails", params: { id } });
      location.reload();
    },
    onSaved(hasErrors) {
      if (hasErrors == false) {
        this.dialog = false;
        this.onRequest();
      }
    },
    // store method
    delete(id) {
      let options = {
        method: "DELETE",
        headers: new Headers({ "Content-Type": "application/ld+json" }),
        body: JSON.stringify({ id }),
      };

      let endpoint = `customers/${this.id}/employees`;
      return this.api
        .private(endpoint, options)
        .then((response) => response.json())
        .then((data) => {
          if (data.response) {
            if (data.response.success === false)
              throw new Error(data.response.error);

            return data.response.data;
          }

          return null;
        });
    },
    removeItem(item) {
      if (
        window.confirm(this.$t("Are you sure about to remove this element?"))
      ) {
        item._bussy = true;
        console.log(item);
        this.delete(item.people_company_id)
          .then((data) => {
            if (data) {
              this.cleanItem(item.id);
            }
          })
          .catch((error) => {
            this.$emit("error", { message: error.message });
          })
          .finally(() => {
            item._bussy = false;
          });
      }
    },
    cleanItem(id) {
      let item = this.items.find((obj) => obj["id"] == id);
      let indx = this.items.indexOf(item);
      this.items = [
        ...this.items.slice(0, indx),
        ...this.items.slice(indx + 1),
      ];
    },
    setCompanies(companies) {
      let _companies = [];

      for (let index in companies) {
        _companies.push({
          people_company_id: companies[index].people_company_id,
          id: companies[index].id,
          alias: companies[index].alias,
          logo: companies[index].logo
            ? `https://${companies[index].logo.domain}${companies[index].logo.url}`
            : null,
          document: companies[index].document
            ? formatDocument(companies[index].document)
            : null,
          _bussy: false,
        });
      }

      this.items = _companies;
    },
    getItems() {
      return this.api
        .private(`customers/${this.id}/companies`)
        .then((response) => response.json())
        .then((result) => {
          return result.response;
        });
    },
    onRequest() {
      this.items = [];

      this.isLoading = true;

      this.getItems()
        .then((response) => {
          if (response.data) {
            this.setCompanies(response.data.members);
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>