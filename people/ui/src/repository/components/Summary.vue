<template>
  <div class="row items-center justify-center form q-pa-md">
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
      <div class="text-subtitle1 text-left">Resumo</div>

      <q-form @submit="onSubmit" ref="myForm">
        <div class="row q-col-gutter-sm">
          <div class="row col-xs-12 col-sm-12 justify-between">
            <div class="col">
              <q-option-group
                inline
                type="radio"
                v-model="item.type"
                @input="changeType()"
                :options="[
                  { label: 'Pessoa Física', value: 'F' },
                  { label: 'Pessoa Jurídica', value: 'J' },
                ]"
              />
            </div>

            <div class="col text-right">
              <q-toggle
                v-model="item.enabled"
                checked-icon="check"
                color="green"
                :label="!item.enabled ? 'Desativado' : 'Ativado'"
                unchecked-icon="clear"
                @input="changeEnable(item)"
              />
            </div>
          </div>

          <div :class="item.type == 'J' ? 'col-xs-12 col-sm-6' : 'col-xs-12'">
            <q-input
              dense
              outlined
              stack-label
              lazy-rules
              v-model="item.name"
              type="text"
              class="q-mb-sm"
              :label="item.type == 'J' ? $t('Razão social') : $t('Nome completo')"
              :placeholder="
                item.type == 'J' ? 'Digite a Razão social' : 'Digite o nome completo'
              "
              :rules="[isInvalid('name')]"
            />
          </div>

          <div class="col-xs-12 col-sm-6" v-if="item.type == 'J'">
            <q-input
              dense
              outlined
              stack-label
              lazy-rules
              v-model="item.alias"
              type="text"
              class="q-mb-sm"
              :label="$t('Nome Fantasia')"
              :placeholder="
                item.type == 'J' ? 'Digite o Nome fantasia' : 'Digite o sobrenome'
              "
              :rules="[isInvalid('alias')]"
            />
          </div>
        </div>

        <div class="row q-col-gutter-sm">
          <div class="col-xs-12 col-sm-grow">
            <q-input
              dense
              outlined
              stack-label
              v-model="item.birthday"
              mask="##/##/####"
              :label="item.type == 'F' ? 'Data de nascimento' : 'Data de fundação'"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy1"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="item.birthday"
                      mask="DD/MM/YYYY"
                      @input="() => $refs.qDateProxy1.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div
            v-for="(field, index) in particulars"
            :key="index"
            class="col-xs-12 col-sm-grow"
          >
            <q-input
              dense
              outlined
              stack-label
              lazy-rules
              v-model="field.value"
              type="text"
              :label="$t(field.label)"
              :rules="field.required ? [isInvalid('field_text')] : [true]"
              class="q-mb-sm"
              @input="field._updated = true"
            />
          </div>
        </div>

        <div class="row justify-end">
          <q-btn
            unelevated
            no-caps
            :loading="saving"
            type="submit"
            icon="save"
            label="Salvar"
            size="md"
            color="primary"
          />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>

import { api } from "@controleonline/../../src/boot/api";
import { mapGetters } from "vuex";

export default {
  props: {
    id: {
      required: true,
    },

    people_type: {
      type: String,
      required: true,
    },
    particulars_context: {
      type: String,
      required: false
    }
  },

  data() {
    return {
      saving: false,
      isLoading: false,
      particulars: [],
      item: {
        type: "F",
        name: null,
        alias: null,
        birthday: null,
        enabled: null,
      },
    };
  },

  created() {
    this.onRequest();
  },

  computed: {
    ...mapGetters({
      theCompany: "people/currentCompany",
    }),
  },

  methods: {
    changeEnable(people) {
      const options = {
        method: "PUT",
        
        body: JSON.stringify(people.enabled),
        params: { company: this.theCompany.id },
      };

      return api.fetch
        .private(
          `/${people_type}/${people.people_people_id}/change-status/${people.enabled}`,
          options
        )
        
        .then((result) => {
          return this.$q.notify({
            message: "Alterado com sucesso.",
            position: "bottom",
            type: "positive",
          });
        });
    },
    changeType() {
      this.isLoading = true;

      return this.getParticulars()
        .then((types) => {
          let _types = [];

          types.forEach((type) => {
            let item = {
              id: null,
              typeId: type["@id"].replace(/\D/g, ""),
              label: type.typeValue,
              value: null,
              required:
                type.required === null
                  ? false
                  : type.required.split(":").includes("peoples"),
              type: type.fieldType,
              _updated: false,
            };

            _types.push(item);
          });
          this.particulars = _types;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    // store method
    getSummary() {
      return api.fetch
        .private(`${this.people_type}/${this.id}/summary`)
        
        .then((result) => {
          return result.response.data;
        });
    },

    // store method
    save(values) {
      let options = {
        method: "PUT",
        
        body: JSON.stringify(values),
      };

      let endpoint = `${this.people_type}/${this.id}/summary`;
      return api.fetch
        .private(endpoint, options)
        
        .then((data) => {
          if (data.response) {
            if (data.response.success === false) throw new Error(data.response.error);

            return data.response.data;
          }

          return null;
        });
    },

    // store method
    getParticulars() {
      let params = {
        peopleType: this.item.type,
        context: this.particulars_context || 'peoples',
        fieldType: ["text", "password"],
      };

      return api.fetch
        .private("particulars_types", { params })
        
        .then((result) => {
          return result["hydra:member"];
        });
    },

    onSubmit() {
      this.saving = true;

      this.save({
        name: this.item.name,
        alias: this.item.alias,
        type: this.item.type,
        birthday: this.item.birthday.replace(/^(\d{2})\/(\d{2})\/(\d{4})$/g, "$3-$2-$1"),
        particulars: this.particulars
          .filter((field) => field._updated && field.value !== null)
          .map((field) => {
            return {
              id: field.id,
              type: field.typeId,
              value: field.value,
            };
          }),
        enabled: this.item.enabled,
      })
        .then((data) => {
          if (data) {
            if (data.id) {
              this.updateParticularFields(data.particulars);
            }

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

      this.getSummary().then((data) => {
        this.item.name = data.name;
        this.item.alias = data.alias;
        this.item.type = data.type;
        this.item.birthday = data.birthday.replace(
          /^(\d{4})\-(\d{2})\-(\d{2})[\W\w\d]*$/g,
          "$3-$2-$1"
        );
        this.item.enabled = data.enabled;

        this.getParticulars()
          .then((types) => {
            let _types = [];

            types.forEach((type) => {
              let item = {
                id: null,
                typeId: type["@id"].replace(/\D/g, ""),
                label: type.typeValue,
                value: null,
                required:
                  type.required === null
                    ? false
                    : type.required.split(":").includes("peoples"),
                type: type.fieldType,
                _updated: false,
              };

              if (data.particulars.length) {
                let particular = data.particulars.find((p) => p.type.id == item.typeId);
                if (particular) {
                  item.id = particular.id;
                  item.value = particular.value;
                }
              }

              _types.push(item);
            });

            this.particulars = _types;
          })
          .finally(() => {
            this.isLoading = false;
          });
      });
    },

    updateParticularFields(particulars) {
      if (particulars.length) {
        particulars.forEach((item) => {
          let field = this.particulars.find((f) => f.typeId == item.type.id);
          let index = this.particulars.indexOf(field);
          if (field) {
            this.particulars[index].id = item.id;
            this.particulars[index]._updated = false;
          }
        });
      }
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
