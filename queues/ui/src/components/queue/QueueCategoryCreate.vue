<template>
  <div class="col-12">
    <div>
      <q-card class="col-12 q-pa-md">
        <q-form class="row flex q-gutter-y-md" ref="myForm">
          <div class="col-12">
            <q-select
              dense
              outlined
              stack-label
              :label="$t(`Category`)"
              :options="categoryOptions"
              v-model="category"
              :rules="[(val) => val != null]"
              hide-bottom-space
            ></q-select>
          </div>
          <div class="col-12">
            <q-select
              dense
              outlined
              stack-label
              :label="$t(`queue.queue`)"
              :options="queueOptions"
              v-model="queue"
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

export default {
  components: {
    Api,
  },

  props: {
    catQueue: {
      type: Object,
      required: false,
    },
  },

  data() {
    return {
      loadingStatuses: null,
      isLoading: null,

      catQueueId: null,

      category: null,
      queue: null,

      categoryOptions: [],
      queueOptions: [],
    };
  },

  created() {
    console.log(this.catQueue);
    if (this.catQueue) {
      this.catQueueId = this.catQueue ? this.catQueue.id : null;
      this.category = this.catQueue.category ? this.catQueue.category : null;
      this.queue = this.catQueue.queue ? this.catQueue.queue : null;
    }
    this.getCategories();
    this.getQueues();
  },
  watch: {},

  methods: {
    getCategories() {
      let params = {};
      params.context = "queue";

      this.api
        .private(`categories`, { params })

        .then((result) => {
          let members = result["hydra:member"];

          if (members.length) {
            this.categoryOptions = [];
            for (let index in members) {
              this.categoryOptions.push({
                label: members[index]["name"],
                value: members[index]["id"],
              });
            }
          }
        });
    },

    getQueues() {
      this.api
        .private(`queues`, {})

        .then((result) => {
          let members = result["hydra:member"];

          if (members.length) {
            this.queueOptions = [];
            for (let index in members) {
              this.queueOptions.push({
                label: members[index]["queue"],
                value: members[index]["id"],
              });
            }
          }
        });
    },

    onSubmit() {
      this.$refs.myForm.validate().then((success) => {
        if (success) this.save();
      });
    },

    save() {
      this.$q.loading.show();

      let values = {};
      values.category = "categories/" + this.category.value;
      values.queue = "queues/" + this.queue.value;

      let endpoint = this.catQueueId
        ? `queue_categories/${this.catQueueId}`
        : `queue_categories`;

      let options = {
        method: this.catQueueId ? "PUT" : "POST",
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
