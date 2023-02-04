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
                        <q-input
                            dense
                            outlined
                            stack-label
                            label="Prioridade"
                            v-model="priority"
                        ></q-input>
                    </div>
                    <div class="col-12">
                        <q-input
                            dense
                            type="date"
                            outlined
                            stack-label
                            label="Hora do registro"
                            v-model="registerTime"
                        ></q-input>
                    </div>
                    <div class="col-12">
                        <q-input
                            dense
                            type="date"
                            outlined
                            stack-label
                            label="Hora da atualização"
                            v-model="updateTime"
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
                            label="Pessoa"
                            v-model="people.label"
                            >
                        </q-input>
                        <PeopleAutocomplete
                            v-else
                            class="col-11"
                            :source="searchPeople"
                            :isLoading="isSearching"
                            label="Pessoa"
                            @selected="onSelectPeople"
                            placeholder="Pesquisar..."
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
                            v-model="status.label"
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
import { date } from "quasar";

export default {
    components: {
        Api,
        PeopleAutocomplete
    },

    props: {
        queuePeopleObj: {
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
            editPeople: false,

            queuePeopleId: null,

            priority: null,
            registerTime: null,
            updateTime: null,
            people: {},
            status: {},

            statusOptions: [],
        }
    },

    created() {
        

        if (this.queuePeopleObj) {
            let registerDate = new Date(this.queuePeopleObj.registerTime).toLocaleDateString().replaceAll("/","-")
            let updateDate = new Date(this.queuePeopleObj.updateTime).toLocaleDateString().replaceAll("/","-")

            this.queuePeopleId = this.queuePeopleObj ? this.queuePeopleObj.id : null;
            this.priority = this.queuePeopleObj ? this.queuePeopleObj.priority : null;
            this.registerTime = this.queuePeopleObj ? this.buildAmericanDate(registerDate) : null;
            this.updateTime = this.queuePeopleObj.updateTime ? this.buildAmericanDate(updateDate) : null;
            this.people = this.queuePeopleObj.people ? this.queuePeopleObj.people : null;
            this.status = this.queuePeopleObj.status ? this.queuePeopleObj.status : null;
        }
        if (this.queuePeopleId)
            this.editMode = true;

        this.getStatusOptions();
    },
    watch: {
        registerTime(e) {
            console.log(e)
        }
    },

    methods: {
        ...mapActions({
            search: "people/searchPeople",
        }),

        searchPeople(input) {
            this.isSearching = true;

            return this.search(input).then((result) => {
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
                } else {
                    this.isSearching = false;
                    this.$q.notify({
                        message: this.$t("messages.gmapsReqNoData"),
                        position: "bottom",
                        type: "negative",
                    });
                }
            });
        },

        onSelectPeople(item) {
            this.people = {
                label: item.alias,
                value: item.id,
            }
        },

        toggleEditPeople(action) {
            if (action === 'enter') {
                this.editPeople = true;
                this.editMode = false;
                this.tempPeople = structuredClone(this.people);
            } else if (action === 'cancel') {
                this.editPeople = false;
                this.editMode = true;
                this.people = this.tempPeople;
            }
        },

        save() {

            let values = {};
            values.priority = this.priority;
            values.registerTime = this.registerTime;
            values.updateTime = this.updateTime;
            values.people = "people/" + this.people.value;
            values.status = "statuses/" + this.status.value;

            let endpoint = this.queuePeopleId ?  `queue_people/${this.queuePeopleId}` : `queue_people`;

            let options = {
                method: this.queuePeopleId ? "PUT" : "POST",
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
                .then((response) => response.json())
                .then((result) => {
                    let members = result["hydra:member"];

                    if (members.length) {
                        this.statusOptions = [];
                        for (let index in members) {
                            this.statusOptions.push({
                                label: this.$t(`queue.status.${members[index]["status"]}`),
                                value: members[index]["@id"].replaceAll("/statuses/",""),
                            });
                        }
                    } else {
                        this.$q.notify({
                            message: this.$t("Status não encontrados!"),
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
    },
};
</script>