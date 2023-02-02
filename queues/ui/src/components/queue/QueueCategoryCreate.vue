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
                            label="Categoria"
                            :options="categoryOptions"
                            v-model="category"
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
        catQueue: {
            type: Object,
            required: false,
        },
    },

    data() {
        return {
            api: new Api(this.$store.getters["auth/user"].token),
            loadingStatuses: null,
            isLoading: null,

            catQueueId: null,

            category: null,
            queue: null,

            categoryOptions: [],
            queueOptions: [],

        }
    },

    created() {
        console.log(this.catQueue)
        if (this.catQueue) {
            this.catQueueId = this.catQueue ? this.catQueue.id : null;
            this.category = this.catQueue.category ? this.catQueue.category : null;
            this.queue = this.catQueue.queue ? this.catQueue.queue : null;
        }
        this.getCategories();
        this.getQueues();
    },
    watch: {

    },

    methods: {
        getCategories() {
            let params = {};
            params.context = "queue";

            this.api
                .private(`categories`, { params })
                .then((response) => response.json())
                .then((result) => {
                    let members = result["hydra:member"];

                    if(members.length) {
                        this.categoryOptions = [];
                        for (let index in members) {
                            this.categoryOptions.push({
                                label: members[index]["name"],
                                value: members[index]["id"],
                            })
                        }
                    } else {
                        this.$q.notify({
                            message: this.$t("Não foi possível carregar as categorias!"),
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
            values.category = "categories/" + this.category.value;
            values.queue = "queues/" + this.queue.value;

            let endpoint = this.catQueueId ?  `queue_categories/${this.catQueueId}` : `queue_categories`;

            let options = {
                method: this.catQueueId ? "PUT" : "POST",
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