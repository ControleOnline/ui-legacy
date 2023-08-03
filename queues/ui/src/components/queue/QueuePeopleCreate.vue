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
              :label="$t(`queue.priority.Priority`)"
              v-model="priority"
              :rules="[(val) => val != null]"
              hide-bottom-space
            ></q-input>
          </div>
          <div class="row col-12 items-center">
            <q-input
              v-if="this.editMode"
              class="col-11"
              dense
              outlined
              readonly
              stack-label
              :label="$t(`people`)"
              v-model="people.label"
            >
            </q-input>
            <PeopleAutocomplete
              v-else
              class="col-11"
              :source="searchPeople"
              :isLoading="isSearching"
              :label="$t(`people`)"
              @selected="onSelectPeople"
              :placeholder="$t(`search`)"
            />
            <div v-if="this.queuePeopleId">
              <q-btn
                v-if="!editPeople"
                dense
                flat
                color="primary"
                icon="edit"
                @click="toggleEditPeople('enter')"
              ></q-btn>
              <q-btn
                v-else
                dense
                flat
                color="primary"
                icon="cancel"
                @click="toggleEditPeople('cancel')"
              ></q-btn>
            </div>
          </div>
          <div class="col-12">
            <q-select
              dense
              outlined
              stack-label
              label="Status"
              :options="statusOptions"
              v-model="status"
              :rules="[(val) => val != null]"
              hide-bottom-space
            ></q-select>
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
import { date } from "quasar";
import { mapActions } from "vuex";

export default {
  components: {
    Api,
    PeopleAutocomplete,
  },

  props: {
    queuePeopleObj: {
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
      editPeople: false,

      queuePeopleId: null,

      priority: null,
      registerTime: null,
      updateTime: null,
      people: {},
      status: null,

      statusOptions: [],
    };
  },

  created() {
    if (this.queuePeopleObj) {
      let registerDate = new Date(this.queuePeopleObj.registerTime)
        .toLocaleDateString()
        .replaceAll("/", "-");
      let updateDate = new Date(this.queuePeopleObj.updateTime)
        .toLocaleDateString()
        .replaceAll("/", "-");

      this.queuePeopleId = this.queuePeopleObj ? this.queuePeopleObj.id : null;
      this.priority = this.queuePeopleObj ? this.queuePeopleObj.priority : null;
      this.registerTime = this.queuePeopleObj
        ? this.buildAmericanDate(registerDate)
        : null;
      this.updateTime = this.queuePeopleObj.updateTime
        ? this.buildAmericanDate(updateDate)
        : null;
      this.people = this.queuePeopleObj.people ? this.queuePeopleObj.people : null;
      this.status = this.queuePeopleObj.status ? this.queuePeopleObj.status : null;
    }
    if (this.queuePeopleId) this.editMode = true;

    this.getStatusOptions();
  },
  watch: {
    status(e) {
      console.log(e);
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
          this.isSearching = false;

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

    onSelectPeople(item) {
      this.people = {
        label: item.alias,
        value: item.id,
      };
    },

    toggleEditPeople(action) {
      if (action === "enter") {
        this.editPeople = true;
        this.editMode = false;
        this.tempPeople = structuredClone(this.people);
      } else if (action === "cancel") {
        this.editPeople = false;
        this.editMode = true;
        this.people = this.tempPeople;
      }
    },

    onSubmit() {
      this.$refs.myForm.validate().then((success) => {
        if (success) this.save();
      });
    },

    save() {
      this.$q.loading.show();

      let values = {};
      values.priority = this.priority;
      values.people = "people/" + this.people.value;
      values.status = "statuses/" + this.status.value;

      let endpoint = this.queuePeopleId
        ? `queue_people/${this.queuePeopleId}`
        : `queue_people`;

      let options = {
        method: this.queuePeopleId ? "PUT" : "POST",
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

    formatDate(date) {
      return new Date(date).toLocaleString();
    },

    buildAmericanDate(dateString) {
      let formatedDate;

      if (dateString) {
        dateString = dateString.replaceAll("/", "-");
        formatedDate = date.formatDate(
          date.extractDate(dateString, "DD-MM-YYYY"),
          "YYYY-MM-DD"
        );
      } else {
        return null;
      }
      return formatedDate;
    },

    getStatusOptions() {
      let params = {};
      params.context = "queue";

      this.api
        .private("statuses", { params })

        .then((result) => {
          let members = result["hydra:member"];

          if (members.length) {
            this.statusOptions = [];
            for (let index in members) {
              this.statusOptions.push({
                label: this.$t(`queue.status.${members[index]["status"]}`),
                value: members[index]["@id"].replaceAll("/statuses/", ""),
              });
            }
          }
        });
    },
  },
};
</script>
