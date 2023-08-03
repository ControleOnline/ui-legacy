<template>
  <div class="row form q-pa-md">
    <div class="col-3 text-h6">
      <div class="text-subtitle1 text-left">{{ $t('Employees') }}</div>
    </div>
    <div class="col-12 q-mt-md">
      <q-table dense  grid hide-header :loading="isLoading" :data="items" row-key="id">
        <template v-slot:top>
          <div class="col-12 q-mb-md">
            <div class="row justify-end">
              <q-btn no-caps icon="add" size="sm" color="positive" class="q-ml-sm" @click="dialog = !dialog" />
            </div>
          </div>
        </template>

        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-4 col-md-3 col-lg-2">
            <q-card>
              <q-img basic :src="props.row.image">
                <div class="absolute-bottom text-subtitle1 text-center">
                  {{ `${props.row.name} ${props.row.alias}` }}
                </div>
              </q-img>
              <q-card-section>
                <q-list>
                  <q-item dense>
                    <q-item-section avatar>
                      <q-icon name="email" />
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label caption>{{ props.row.email }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
              <q-separator />
              <q-card-actions align="around">
                <q-btn unelevated no-caps flat round dense :to="{
                  name: 'CustomersDetails',
                  params: {
                    id: props.row.id,
                  },
                }" color="primary" icon="edit" :disable="props.row._bussy">
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>

                <q-btn flat unelevated no-caps round dense color="red" icon="delete" @click="removeItem(props.row)"
                  :loading="props.row._bussy">
                  <q-tooltip>Eliminar</q-tooltip>
                </q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="dialog">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center">
          <div class="text-h6">Novo funcionário</div>
          <q-space />
          <q-btn unelevated icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form ref="myForm" @submit="onSubmit" class="q-mt-md">
            <div class="row q-col-gutter-xs q-pb-xs">
              <h6 class="col-xs-12 q-mt-sm q-mb-sm">Dados pessoais</h6>
              <div class="col-xs-12 col-sm-6 q-mb-sm">
                <q-input
      dense
      outlined stack-label lazy-rules unmasked-value hide-bottom-space v-model="item.name" type="text"
                  label="Nome Completo" :rules="[isInvalid('name')]" />
              </div>
              <div class="col-xs-12 col-sm-6 q-mb-sm">
                <q-input
      dense
      outlined stack-label lazy-rules hide-bottom-space v-model="item.lastname" type="text"
                  label="Nome Social" />
              </div>
              <div class="col-xs-12 col-sm-6 q-mb-sm">
                <q-input
      dense
      outlined stack-label lazy-rules hide-bottom-space v-model="item.email" type="text" label="Email"
                  :rules="[isInvalid('email')]" />
              </div>
            </div>

            <div class="row justify-end">
              <q-btn unelevated no-caps :loading="saving" icon="save" type="submit" :label="$t('Save')" size="md"
                color="primary" class="q-mt-md" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>

// import { formatDocument } from '@controleonline/quasar-common-ui/src/utils/formatter';
import md5 from "md5";
import { mapGetters } from "vuex";

export default {
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
      user: this.$store.getters["auth/user"],
      item: {
        name: "",
        lastname: "",
        phone: {
          ddd: "",
          phone: "",
        },
        document: "",
        email: "",
        username: "",
        password: "",
      },
    };
  },

  computed: {
    ...mapGetters({
      theCompany: "people/currentCompany",
    }),
  },

  created() {
    this.onRequest();
  },

  watch: {
    $route(to) {
      this.$router.go(to);
    },
  },

  methods: {
    // store method
    getItems() {
      let endpoint = `${this.people_type}/${this.id}/employees`;
      return api.fetch
        .private(endpoint)
        
        .then((result) => {
          return result.response.data;
        });
    },

    // store method
    save(values) {
      let options = {
        method: "PUT",
        headers: new Headers({ "Content-Type": "application/ld+json" }),
        body: JSON.stringify(values),
        params: { company: this.theCompany.id },
      };

      let endpoint = `${this.people_type}/${this.id}/employees`;
      return api.fetch
        .private(endpoint, options)
        
        .then((data) => {
          if (data.response) {
            if (data.response.success === false)
              throw new Error(data.response.error);

            return data.response.data;
          }

          return null;
        });
    },

    // store method
    delete(id) {
      let options = {
        method: "DELETE",
        headers: new Headers({ "Content-Type": "application/ld+json" }),
        body: JSON.stringify({ id }),
      };

      let endpoint = `${this.people_type}/${this.id}/employees`;
      return api.fetch
        .private(endpoint, options)
        
        .then((data) => {
          if (data.response) {
            if (data.response.success === false)
              throw new Error(data.response.error);

            return data.response.data;
          }

          return null;
        });
    },

    gravatar(email) {
      if (!email || email === null) {
        return "";
      }
      return "https://www.gravatar.com/avatar/" + md5(email) + "?s=400";
    },

    onSubmit() {
      this.$refs.myForm.validate().then((success) => {
        if (success) {
          let payload = {
            name: this.item.name,
            alias: this.item.lastname,
            email: this.item.email,
          };

          if (this.item.document.length == 11) {
            payload["document"] = this.item.document;
          }

          if (this.item.phone.ddd.length && this.item.phone.phone.length) {
            payload["phone"] = {
              ddd: this.item.phone.ddd,
              phone: this.item.phone.phone,
            };
          }

          if (this.item.username.length) {
            payload["user"] = {
              username: this.item.username,
              password: this.item.password,
            };
          }

          this.saving = true;

          this.save(payload)
            .then((data) => {
              if (data) {
                this.$emit("saved", data);
              }
            })
            .catch((error) => {
              this.$refs.myForm.reset();

              this.$emit("error", { message: error.message });
            })
            .finally(() => {
              this.saving = false;
            });
        }
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

    onRequest() {
      if (this.isLoading) return;

      this.isLoading = true;

      this.getItems()
        .then((data) => {
          let _items = [];

          if (data.members.length) {
            for (let index in data.members) {
              _items.push({
                people_company_id: data.members[index].people_company_id,
                id: data.members[index].id,
                name: data.members[index].name,
                alias: data.members[index].alias,
                image: !data.members[index].image
                  ? this.gravatar(data.members[index].email)
                  : data.members[index].image.url,
                email: data.members[index].email,
                _bussy: false,
              });
            }
          }

          this.items = _items;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    isInvalid(key) {
      return (val) => {
        if (!(val && val.length > 0)) return this.$t("messages.fieldRequired");

        if (key == "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
          return this.$t("messages.emailInvalid");

        if (key == "password" && val.length < 6)
          return this.$t("A senha deve ter no mínimo 6 caracteres");

        if (key == "confirm" && this.item.password != this.item.confirmPassword)
          return this.$t("As senhas não coincidem");

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