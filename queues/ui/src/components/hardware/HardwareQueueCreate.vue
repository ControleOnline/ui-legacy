<template>
    <div class="col-12">
        <div>
            <q-card class="col-12 q-pa-md">
                <q-form
                class="row flex q-gutter-y-md"
                ref="myForm"
                >
                    <div class="col-12">
                        <q-select
                            dense
                            outlined
                            stack-label
                            :label="$t(`hardware.hardware`)"
                            :options="hardwareOptions"
                            v-model="hardware"
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
import Api from "@controleonline/quasar-common-ui/src/utils/api";
import { ENTRYPOINT } from "../../../../../../src/config/entrypoint";

export default {
    components: {
        Api,
    },

    props: {
        hardwareQueue: {
            type: Object,
            required: false,
        },
    },

    data() {
        return {
            api: new Api(this.$store.getters["auth/user"].token),
            loadingStatuses: null,
            isLoading: null,

            hardwareQueueId: null,

            hardware: null,
            queue: null,

            hardwareOptions: [],
            queueOptions: [],

        }
    },

    created() {
        console.log(this.hardwareQueue)
        if (this.hardwareQueue) {
            this.hardwareQueueId = this.hardwareQueue ? this.hardwareQueue.id : null;
            this.hardware = this.hardwareQueue.hardware ? this.hardwareQueue.hardware : null;
            this.queue = this.hardwareQueue.queue ? this.hardwareQueue.queue : null;
        }
        this.getHardwares();
        this.getQueues();
    },
    watch: {

    },

    methods: {
        getHardwares() {
            let params = {};
            params.context = "queue";

            this.api
                .private(`hardware`, { params })
                .then((response) => response.json())
                .then((result) => {
                    let members = result["hydra:member"];

                    if(members.length) {
                        this.hardwareOptions = [];
                        for (let index in members) {
                            this.hardwareOptions.push({
                                label: members[index]["hardware"],
                                value: members[index]["id"],
                            })
                        }
                    } else {
                        this.$q.notify({
                            message: this.$t(`messages.anErrorOccurred`),
                            position: "bottom",
                            type: "negative",
                        });
                    }
                })
                .catch((error) => {
                    this.$q.notify({
                        message: this.$t(error.message),
                        position: "bottom",
                        type: "negative",
                    });
                });
        },

        getQueues() {
            this.api
                .private(`queues`, {})
                .then((response) => response.json())
                .then((result) => {
                    let members = result["hydra:member"];

                    if(members.length) {
                        this.queueOptions = [];
                        for (let index in members) {
                            this.queueOptions.push({
                                label: members[index]["queue"],
                                value: members[index]["id"],
                            })
                        }
                    } else {
                        this.$q.notify({
                            message: this.$t(`messages.anErrorOccurred`),
                            position: "bottom",
                            type: "negative",
                        });
                    }
                })
                .catch((error) => {
                    this.$q.notify({
                        message: this.$t(error.message),
                        position: "bottom",
                        type: "negative",
                    });
                });
        },

        onSubmit() {
            this.$refs.myForm.validate().then((success) => {
                if (success)
                    this.save();
            });
        },

        save() {
            this.$q.loading.show();

            let values = {};
            values.hardware = "hardware/" + this.hardware.value;
            values.queue = "queues/" + this.queue.value;

            let endpoint = this.hardwareQueueId ?  `hardware_queues/${this.hardwareQueueId}` : `hardware_queues`;

            let options = {
                method: this.hardwareQueueId ? "PUT" : "POST",
                headers: new Headers(),
                body: JSON.stringify(values),
            };

            this.api
                .private(endpoint, options)
                .then((response) => response.json())
                .then((result) => {
                    if (result["@id"]) {
                        this.$q.notify({
                            message: this.$t(`success`),
                            position: "bottom",
                            type: "positive",
                        });
                        this.$emit("savedItem", result);
                    } else {
                        this.$q.notify({
                            message: this.$t(`messages.anErrorOccurred`),
                            position: "bottom",
                            type: "negative",
                        });
                    }
                })
                .catch((error) => {
                    this.$q.notify({
                        message: this.$t(error.message),
                        position: "bottom",
                        type: "negative",
                    });
                })
                .finally(() => {
                    this.$q.loading.hide();
                });
        }
    },
};
</script>