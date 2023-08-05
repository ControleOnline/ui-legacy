<template>
  <div class="col-12">
    <div>
      <q-card class="col-12 q-pa-md">
        <q-form class="row flex q-gutter-y-md" ref="myForm">
          <div class="col-12">
            <q-input
              dense
              outlined
              stack-label
              :label="$t(`queue.queue`)"
              v-model="queue"
              :rules="[(val) => val != null]"
              hide-bottom-space
            ></q-input>
          </div>
          <div class="col-12" v-if="this.queueId">
            <q-input
              v-if="this.editMode"
              dense
              outlined
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
            <div v-if="this.queueId">
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
import PeopleAutocomplete from "@controleonline/quasar-common-ui/src/components/Common/PeopleAutocomplete";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
   
    PeopleAutocomplete,
  },

  props: {
    queueObj: {
      type: Object,
      required: false,
    },
  },

  data() {
    return {
      loadingStatuses: null,
      isLoading: null,
      isSearching: null,
      editMode: false,
      editCompany: false,

      queueId: null,

      queue: null,
      company: null,
      tempCompany: null,

      companyOptions: [],
    };
  },

  computed: {
    ...mapGetters({
      defaultCompany: "people/defaultCompany",
      myCompany: "people/currentCompany",
    }),
  },

  created() {
    if (this.queueObj) {
      this.queueId = this.queueObj ? this.queueObj.id : null;
      this.queue = this.queueObj ? this.queueObj.queue : null;
      this.company = this.queueObj.company ? this.queueObj.company : null;
    } else {
      this.company = {
        label: this.myCompany.name,
        value: this.myCompany.id,
      };
    }
    if (this.queueId) this.editMode = true;
  },
  watch: {
    editMode(v) {
      console.log("editMode");
      console.log(v);
    },
    company(v) {
      console.log("Company");
      console.log(v);
    },
  },

  methods: {
    ...mapActions({
      search: "people/searchPeople",
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
          if (this.queueId) {
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
      values.queue = this.queue;
      values.company = "people/" + this.company.value;

      let endpoint = this.queueId ? `queues/${this.queueId}` : `queues`;

      let options = {
        method: this.queueId ? "PUT" : "POST",
        
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
            console.log("save");
            console.log(result);
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
