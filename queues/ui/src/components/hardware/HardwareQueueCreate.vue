<template>
    <div class="col-12">
        <div class="flex flex-center" v-if="isLoading || loadingStatuses">
            <q-circular-progress :indeterminate="isLoading || loadingStatuses" size="sm" color="primary"
                class="q-ma-md" />
            Carregando...
        </div>

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
                            label="Hardware"
                            :options="hardwareOptions"
                            v-model="hardware"
                        ></q-select>
                    </div>
                    <div class="col-12">
                        <q-select
                            dense
                            outlined
                            stack-label
                            label="Fila"
                            :options="queueOptions"
                            v-model="queue"
                        ></q-select>
                    </div>

                    <div class="col-12 flex justify-end q-gutter-sm">
                        <q-btn
                            dense
                            color="primary"
                            icon="save"
                            label="Salvar"
                            @click="save()"
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
                            message: this.$t("Não foi possível carregar os hardwares!"),
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
                            message: this.$t("Não foi possível carregar as filas!"),
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

        save() {

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
                            message: this.$t("Dados salvos com sucesso!"),
                            position: "bottom",
                            type: "positive",
                        });
                        this.$emit("savedItem", result);
                    } else {
                        this.$q.notify({
                            message: this.$t("Não foi possível salvar os dados!"),
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
        }
    },
};
</script>