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
                            label="Hardware"
                            v-model="hardware"
                        ></q-input>
                    </div>
                    <div class="col-12">
                        <q-input
                            dense
                            outlined
                            stack-label
                            label="Imei"
                            v-model="imei"
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
                            label="Empresa"
                            v-model="company.label"
                            >
                        </q-input>
                        <PeopleAutocomplete
                            v-else
                            class="col-11"
                            :source="searchPeople"
                            :isLoading="isSearching"
                            label="Empresa"
                            @selected="onSelectCompany"
                            placeholder="Pesquisar..."
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
        hardwareObj: {
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
            editCompany: false,

            hardwareId: null,

            hardware: null,
            imei: null,
            company: null,

            companyOptions: [],
        }
    },

    created() {
        if (this.hardwareObj) {
            this.hardwareId = this.hardwareObj ? this.hardwareObj.id : null;
            this.hardware = this.hardwareObj ? this.hardwareObj.hardware : null;
            this.imei = this.hardwareObj.imei ? this.hardwareObj.imei : null;
            this.company = this.hardwareObj.company ? this.hardwareObj.company : null;
        }
        if (this.hardwareId)
            this.editMode = true;
    },
    watch: {
        editMode(v){
            console.log('editMode')
            console.log(v)
        },
        editCompany(v){
            console.log('editCompany')
            console.log(v)
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

        onSelectCompany(item) {
            console.log('item')
            console.log(item)
            this.company = {
                label: item.alias,
                value: item.id,
            }
        },

        toggleEditCompany(action) {
            if (action === 'enter') {
                this.editCompany = true;
                this.editMode = false;
                this.tempCompany = structuredClone(this.company);
            } else if (action === 'cancel') {
                this.editCompany = false;
                this.editMode = true;
                this.company = this.tempCompany;
            }
        },

        save() {

            let values = {};
            values.hardware = this.hardware;
            values.imei = this.imei;
            values.company = "people/" + this.company.value;

            let endpoint = this.hardwareId ?  `hardware/${this.hardwareId}` : `hardware`;

            let options = {
                method: this.hardwareId ? "PUT" : "POST",
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