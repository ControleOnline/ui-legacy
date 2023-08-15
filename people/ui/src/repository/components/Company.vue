<template>
  <div class="row form q-pa-md">
    <div class="col-3 text-h6">
      <div class="text-subtitle1 text-left">{{ $t('Companies') }}</div>
    </div>
    <div class="col-9">
      <div class="row justify-end">
        <q-btn icon="add" size="sm" color="positive" class="q-ml-sm" @click="dialog = !dialog" />
      </div>
    </div>

    <div class="col-12">
      <q-table dense  bordered grid hide-header :loading="isLoading" :data="items" @request="onRequest" row-key="id">
        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-4 col-md-3 col-lg-2">
            <q-card>
              <q-img :contain="true" src="~assets/business.png" style="height: 100px; max-width: 100%">
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
                <q-btn flat round dense @click="btEditCompany(props.row.id)" color="primary" icon="edit">
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="red" icon="delete" @click="removeItem(props.row)"
                  :loading="props.row._bussy">
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
            <FormCreatePeople ref="myForm"  :people_type="people_type" :employeeId="id" :pjOnly="true" @saved="
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
            " @error="
  (error) => {
    this.$q.notify({
      message: error.message,
      position: 'bottom',
      type: 'warning',
    });
  }
" />
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { api } from "@controleonline/../../src/boot/api";
import { formatDocument } from "@controleonline/quasar-common-ui/src/utils/formatter";
import { mapActions, mapGetters } from "vuex";
import FormCreatePeople from "./FormCreate.vue";


export default {
  components: {
    FormCreatePeople,
   
  },
  props: {

    id: {
      required: true,
    },
    people_type: {
      type: String,
      required: true
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
      this.$router.push({ name: "CustomersDetails", params: { id } });
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
        
        body: ({ id }),
      };

      let endpoint = `${this.people_type}/${this.id}/employees`;
      return api.fetch
        (endpoint, options)
        
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
      return api.fetch
        (`${this.people_type}/${this.id}/companies`)
        
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

<style lang="scss" scoped>
.form {
  background-color: white;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.24);
}
</style>

