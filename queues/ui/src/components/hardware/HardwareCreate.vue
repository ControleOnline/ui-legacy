<template>
  <div class="col-12">
    <div>
      <q-card class="col-12 q-pa-md">
        <q-form class="column q-gutter-y-md" ref="myForm">
          <div class="col-6">
            <q-input
              dense
              outlined
              stack-label
              :label="$t(`hardware.hardware`)"
              v-model="hardware"
              :rules="[(val) => val != null]"
              hide-bottom-space
            ></q-input>
          </div>
          <div class="col-6">
            <q-input
              dense
              outlined
              stack-label
              label="Imei"
              v-model="imei"
              :rules="[(val) => val != null]"
              hide-bottom-space
            ></q-input>
          </div>
          <div class="row col-12 items-center" v-if="hardwareId">
            <q-input
              v-if="this.editMode"
              class="col-11"
              dense
              outlined
              readonly
              stack-label
              :label="$t(`Company`)"
              v-model="company.label"
            >
            </q-input>
            <PeopleAutocomplete
              v-else
              class="col-11"
              :source="searchPeople"
              :isLoading="isSearching"
              :label="$t(`Company`)"
              @selected="onSelectCompany"
              :placeholder="$t(`Search`)"
            />
            <div v-if="this.hardwareId">
              <q-btn
                v-if="!editCompany"
                dense
                flat
                color="primary"
                icon="edit"
                @click="toggleEditCompany('enter')"
              ></q-btn>
              <q-btn
                v-else
                dense
                flat
                color="primary"
                icon="cancel"
                @click="toggleEditCompany('cancel')"
              ></q-btn>
            </div>
          </div>

          <div class="col-12 flex justify-end q-gutter-sm">
            <q-btn
              dense
              color="primary"
              icon="save"
              :label="$t(`Save`)"
              @click="onSubmit()"
            ></q-btn>
          </div>
        </q-form>
      </q-card>
    </div>
  </div>
</template>

<script>

import { ENTRYPOINT } from "../../../../../../src/config/entrypoint";
import PeopleAutocomplete from "@controleonline/quasar-common-ui/src/components/Common/PeopleAutocomplete";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    Api,
    PeopleAutocomplete,
  },

  props: {
    hardwareObj: {
      type: Object,
      required: false,
    },
  },

  data() {
    return {
      ,
      loadingStatuses: null,
      isLoading: null,
      isSearching: null,
      editMode: false,
      editCompany: false,

      hardwareId: null,

      hardware: null,
      imei: null,
      company: null,
      tempCompany: null,

      companyOptions: [],
    };
  },

  created() {
    if (this.hardwareObj) {
      this.hardwareId = this.hardwareObj ? this.hardwareObj.id : null;
      this.hardware = this.hardwareObj ? this.hardwareObj.hardware : null;
      this.imei = this.hardwareObj.imei ? this.hardwareObj.imei : null;
      this.company = this.hardwareObj.company ? this.hardwareObj.company : null;
    } else {
      this.company = {
        label: this.myCompany.name,
        value: this.myCompany.id,
      };
    }

    if (this.hardwareId) this.editMode = true;
  },
  watch: {
    editMode(v) {
      console.log("editMode");
      console.log(v);
    },
    editCompany(v) {
      console.log("editCompany");
      console.log(v);
    },
  },

  methods: {
    ...mapActions({
      search: "people/searchPeople",
      defaultCompany: "people/defaultCompany",
      myCompany: "people/currentCompany",
    }),

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
        .finally((data) => {
          this.isSearching = false;
        });
    },

    onSelectCompany(item) {
      console.log("item");
      console.log(item);
      this.company = {
        label: item.alias,
        value: item.id,
      };
    },

    toggleEditCompany(action) {
      if (action === "enter") {
        this.editCompany = true;
        this.editMode = false;
        this.tempCompany = structuredClone(this.company);
        this.company = null;
      } else if (action === "cancel") {
        this.editCompany = false;
        this.editMode = true;
        this.company = this.tempCompany;
      }
    },

    onSubmit() {
      this.$refs.myForm.validate().then((success) => {
        if (success) {
          if (this.hardwareId) {
            if (this.company) {
              this.save();
            }
          } else {
            this.save();
          }
        }
      });
    },

    save() {
      this.$q.loading.show();

      let values = {};
      values.hardware = this.hardware;
      values.imei = parseInt(this.imei);
      values.company = "people/" + this.company.value;

      let endpoint = this.hardwareId ? `hardware/${this.hardwareId}` : `hardware`;

      let options = {
        method: this.hardwareId ? "PUT" : "POST",
        headers: new Headers(),
        body: JSON.stringify(values),
      };

      this.api
        .private(endpoint, options)

        .then((result) => {
          if (result["@id"]) {
            this.$q.notify({
              message: this.$t(`success`),
              position: "bottom",
              type: "positive",
            });
            this.$emit("savedItem", result);
          }
        })

        .finally(() => {
          this.$q.loading.hide();
        });
    },
  },
};
</script>
