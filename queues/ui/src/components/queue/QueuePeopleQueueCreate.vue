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
                            label="Fila pessoa"
                            :options="queuePeopleOptions"
                            v-model="queuePeople"
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
import PeopleAutocomplete from "@controleonline/quasar-common-ui/src/components/Common/PeopleAutocomplete";
import { mapActions, mapGetters } from "vuex";

export default {
    components: {
        Api,
        PeopleAutocomplete
    },

    props: {
        queuePeopleQueueObj: {
            type: Object,
            required: false,
        },
    },

    data() {
        return {
            api: new Api(this.$store.getters["auth/user"].token),
            loadingStatuses: null,
            isLoading: null,
            isSearching: null,
            editMode: false,

            queuePeopleQueueId: null,

            queuePeople: {},
            queue: {},

            queuePeopleOptions: [],
            queueOptions: [],
        }
    },

    created() {
        if (this.queuePeopleQueueObj) {
            this.queuePeopleQueueId = this.queuePeopleQueueObj ? this.queuePeopleQueueObj.id : null;
            this.queuePeople = this.queuePeopleQueueObj ? this.queuePeopleQueueObj.queuePeople : null;
            this.queue = this.queuePeopleQueueObj.queue ? this.queuePeopleQueueObj.queue : null;
        }
        this.getQueueOptions();
        this.getQueuePeopleOptions();
    },
    watch: {
    },

    methods: {
        getQueuePeopleOptions() {
            this.api
                .private("queue_people", {})
                .then((response) => response.json())
                .then((result) => {
                    let members = result["hydra:member"];

                    if (members.length) {
                        this.queuePeopleOptions = [];
                        for (let index in members) {
                            this.queuePeopleOptions.push({
                                label: members[index]["priority"],
                                value: members[index]["id"]
                            });
                        }
                    } else {
                        this.$q.notify({
                            message: this.$t("Erro ao carregar opções de fila pessoa!"),
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

        getQueueOptions() {
            this.api
                .private("queues", {})
                .then((response) => response.json())
                .then((result) => {
                    let members = result["hydra:member"];

                    if (members.length) {
                        this.queueOptions = [];
                        for (let index in members) {
                            this.queueOptions.push({
                                label: members[index]["queue"],
                                value: members[index]["id"]
                            });
                        }
                    } else {
                        this.$q.notify({
                            message: this.$t("Erro ao carregar opções de fila!"),
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
            values.queuePeople = "queue_peoples/" + this.queuePeople.value;
            values.queue = "queues/" + this.queue.value;

            let endpoint = this.queuePeopleQueueId ?  `queue_people_queues/${this.queuePeopleQueueId}` : `queue_people_queues`;

            let options = {
                method: this.queuePeopleQueueId ? "PUT" : "POST",
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
                        console.log('save')
                        console.log(result)
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