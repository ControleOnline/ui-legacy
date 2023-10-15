<template>
    <q-card>
        <q-card-section class="q-pa-md">
            <div class="row items-center">
                <label class="text-h5">Edição</label>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup @click="$emit('close')" />
            </div>
        </q-card-section>
        <q-card-section class="q-pa-md">
            <div class="row q-col-gutter-sm">
                <div class="col-6">
                    <q-input dense outlined readonly stack-label label="Franquia" :model-value="myCompany.alias"></q-input>
                </div>
                <div class="col-6">
                    <q-input dense outlined readonly stack-label label="Automóvel" :model-value="vehicle"></q-input>
                </div>
                <q-input class="col-4" dense outlined readonly stack-label label="Endereço da coleta"
                    :model-value="collectionAddress"></q-input>
                <q-input class="col-4" dense outlined readonly stack-label label="Endereço da entrega"
                    :model-value="destinationAddress"></q-input>
                <q-input class="col-4" dense outlined readonly stack-label label="Valor do seguro"
                    :model-value="invoiceTotal"></q-input>
            </div>
        </q-card-section>
        <q-separator></q-separator>

        <q-card-section class="q-pa-md">
            <div class="row q-col-gutter-sm">

                <q-form class="row q-col-gutter-sm" ref="myForm" @submit="onSubmit">
                    <q-select class="col-12" dense outlined stack-label label="Status" :options="statusOptions"
                        v-model="stretch.status" :rules="[(val) => val != null]" hide-bottom-space>
                    </q-select>
                    <!-- Origem -->
                    <div class="col-6">
                        <div class="row q-col-gutter-sm">
                            <label class="col-12">Origem</label>
                            <PeopleAutocomplete class="col-12 reset-padding-bottom" ref="provider" :key="updateProvider"
                                :source="searchPeople" :isLoading="originProviderLoading" placeholder="Pesquisar..."
                                label="Fornecedor de origem" @selected="onSelectOriginPeople" :input="stretch.provider" />
                            <q-select class="col-12" dense outlined stack-label label="Tipo de origem" hide-bottom-space
                                :options="originTypeOptions" v-model="stretch.originType"
                                :rules="[(val) => val != null]"></q-select>
                            <div v-if="stretch.originType == 'Base'" class="col-12">
                                <q-select v-if="originProviderHasAddress" :options="originProviderAddressOptions" dense
                                    outlined stack-label label="Origem endereço" v-model="tempOriginAddressAdd"></q-select>
                                <PeopleAutocomplete v-else class="reset-padding-bottom" :key="updateAddress"
                                    :source="getGeoPlaces" :isLoading="originAddressLoading" label="Busca de endereço"
                                    @selected="onSelectOrigin"
                                    placeholder="Digite o endereço completo (rua, número, bairro, CEP)"
                                    :input="stretch.originAdress" />
                            </div>
                            <div v-else class="col-12">
                                <PeopleAutocomplete class="col-11" ref="addressAutoComplete" :source="getGeoPlaces"
                                    :isLoading="originAddressLoading" label="Busca de endereço" @selected="onSelectOrigin"
                                    placeholder="Digite o endereço completo (rua, número, bairro, CEP)"
                                    :input="stretch.originAdress" />
                            </div>
                            <q-input class="col-12" dense outlined readonly stack-label label="Localizador de origem"
                                v-model="stretch.originLocator" />
                        </div>
                    </div>
                    <!-- Destino -->
                    <div class="col-6">
                        <div class="row q-col-gutter-sm">
                            <label class="col-12">Destino</label>
                            <PeopleAutocomplete class="col-12 reset-padding-bottom" :source="searchPeople"
                                :isLoading="destinationProviderLoading" label="Fornecedor de destino"
                                @selected="onSelectDestinationPeople" placeholder="Pesquisar..."
                                :input="stretch.destinationProvider" />
                            <q-select class="col-12" dense outlined stack-label label="Tipo de destino"
                                :options="destinationTypeOptions" v-model="stretch.destinationType"
                                :rules="[(val) => val != null]" hide-bottom-space></q-select>

                            <div v-if="stretch.destinationType != 'Base'" class="col-12">
                                <PeopleAutocomplete class="reset-padding-bottom" :source="getGeoPlaces"
                                    :isLoading="destinationAddressLoading" label="Busca de endereço"
                                    @selected="onSelectDestination"
                                    placeholder="Digite o endereço completo (rua, número, bairro, CEP)"
                                    :input="stretch.destinationAdress" />
                            </div>
                            <div v-if="stretch.destinationType == 'Base'" class="col-12">
                                <q-select v-if="destinationProviderHasAddress" :options="destinationProviderAddressOptions"
                                    dense outlined stack-label label="Destino endereço"
                                    v-model="tempDestinationAddressAdd"></q-select>
                                <PeopleAutocomplete v-else class="reset-padding-bottom" ref="destinationAddress"
                                    :source="getGeoPlaces" :isLoading="destinationAddressLoading" label="Busca de endereço"
                                    @selected="onSelectDestination"
                                    placeholder="Digite o endereço completo (rua, número, bairro, CEP)"
                                    :input="stretch.destinationAdress" />
                            </div>
                            <q-input class="col-12" dense outlined readonly stack-label label="Localizador de destino"
                                v-model="stretch.destinationLocator" />
                        </div>
                    </div>
                    <!-- Extras -->
                    <div class="col-12">
                        <div class="row q-col-gutter-sm">
                            <q-select class="col-3" dense outlined stack-label label="Taxa" :options="stretchValueOptions"
                                v-model="stretchValueSelected"></q-select>

                            <q-input class="col-3" dense type="number" outlined stack-label label="Valor"
                                v-model="stretch.price" :rules="[(val) => val != null]" hide-bottom-space></q-input>

                            <q-input class="col-3" dense type="number" outlined stack-label label="Valor Pago"
                                v-model="stretch.amountPaid"></q-input>

                            <q-input class="col-3" dense type="number" outlined readonly stack-label label="Saldo"
                                v-model="stretch.balance"></q-input>
                        </div>
                    </div>
                    <!-- Data -->
                    <div class="col-12">
                        <div class="row q-col-gutter-sm">
                            <q-input class="col-3" dense type="date" outlined stack-label label="Previsão de embarque"
                                v-model="stretch.estimatedShippingDate" :rules="[(val) => val != null]"
                                hide-bottom-space></q-input>

                            <q-input class="col-3" dense type="date" outlined stack-label label="Embarque"
                                v-model="stretch.shippingDate"></q-input>

                            <q-input class="col-3" dense type="date" outlined stack-label label="Previsão de Chegada"
                                v-model="stretch.estimatedArrivalDate" :rules="[(val) => val != null]"
                                hide-bottom-space></q-input>

                            <q-input class="col-3" dense type="date" outlined stack-label label="Chegada"
                                v-model="stretch.arrivalDate"></q-input>
                        </div>
                    </div>
                    <div class="row justify-end col-12 q-gutter-sm q-mt-md">
                        <q-btn color="positive" label="Salvar" @click="onSubmit()"></q-btn>
                        <q-btn color="negative" label="Cancelar" v-close-popup @click="$emit('close')"></q-btn>
                    </div>
                </q-form>
            </div>
        </q-card-section>
    </q-card>
</template>

<script>

import ListAutocomplete from "@controleonline/quasar-common-ui/src/components/Common/ListAutocomplete";
import PeopleAutocomplete from "@controleonline/quasar-common-ui/src/components/Common/PeopleAutocomplete";
import { date } from "quasar";
import { mapActions, mapGetters } from "vuex";

export default {
    props: {
        orderId: {
            type: [Number, String],
            required: false,
        },
        myCompany: {
            type: Object,
            required: true,
        },
        vehicle: {
            type: String,
            required: false,
        },
        collectionAddress: {
            type: String,
            required: false,
        },
        destinationAddress: {
            type: String,
            required: false,
        },
        invoiceTotal: {
            type: String,
            required: false,
        },
        statusOptions: {
            type: Array,
            required: false,
        },
        stretchValueOptions: {
            type: Array,
            required: false,
        },
        stretchToEdit: {
            type: Object,
            required: false,
        },
    },
    components: {
        ListAutocomplete,
        PeopleAutocomplete,
    },

    created() {
        if (Object.keys(this.stretchToEdit).length) {
            this.stretch = this.stretchToEdit;
            this.stretch.estimatedShippingDate = this.stretch.estimatedShippingDate ?
                date.formatDate((new Date(this.stretch.estimatedShippingDate)).getTime(), 'YYYY-MM-DD') :
                null;
            this.stretch.shippingDate = this.stretch.shippingDate ?
                date.formatDate((new Date(this.stretch.shippingDate)).getTime(), 'YYYY-MM-DD') :
                null;
            this.stretch.estimatedArrivalDate = this.stretch.estimatedArrivalDate ?
                date.formatDate((new Date(this.stretch.estimatedArrivalDate)).getTime(), 'YYYY-MM-DD') :
                null;
            this.stretch.arrivalDate = this.stretch.arrivalDate ?
                date.formatDate((new Date(this.stretch.arrivalDate)).getTime(), 'YYYY-MM-DD') :
                null;
        } else {
            this.requestPreviewStretch();
        }
    },

    beforeUnmount() {
        this.onReset();
    },

    methods: {
        ...mapActions({
            geoplace: "gmaps/geoplace",
            // search: "salesOrder/getProviders",
            search: "people/searchPeople",
            people: "people/getPeople",
            orderLogistics: "salesOrder/getOrderLogistics",
            saveOrderLogistics: "salesOrder/saveOrderLogistic",
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
                    } else {
                        this.$q.notify({
                            message: this.$t("Forncedor não encontrado"),
                            position: "bottom",
                            type: "negative",
                        });
                    }
                })
                .finally((data) => {
                    this.isUpdating = false;
                    this.isSearching = false;

                });
        },
        getGeoPlaces(input) {
            this.isSearching = true;

            return this.geoplace(input)
                .then((result) => {
                    if (result.success) {
                        let items = [];
                        for (let i = 0; i < result.data.length; i++) {
                            items.push({
                                label: result.data[i].description,
                                value: result.data[i],
                            });
                        }
                        return items;
                    } else {
                        this.$q.notify({
                            message: this.$t("messages.gmapsReqNoData"),
                            type: "negative",
                            position: "bottom",
                        });
                    }
                })
                .finally((data) => {
                    this.isUpdating = false;
                    this.isSearching = false;

                });
        },

        requestPreviewStretch() {
            let params = {};
            params['order.id'] = this.orderId;
            this.orderLogistics(params).then((result) => {
                if (result) {
                    let lastStretch = result[result.length - 1];
                    this.stretch.originRegion = lastStretch.destinationRegion;
                    this.stretch.originState = lastStretch.destinationState;
                    this.stretch.originCity = lastStretch.destinationCity;
                    this.stretch.originAdress = lastStretch.destinationAdress;
                    this.tempOriginAddressAdd = lastStretch.destinationAdress;
                    this.$refs.addressAutoComplete['model'] = lastStretch.destinationAdress;
                    this.stretch.provider = { label: lastStretch.destinationProvider.name, value: lastStretch.destinationProvider.id };

                    let destinationType = '';
                    if (lastStretch.destinationType == 'b') {
                        destinationType = 'Base';
                    } else if (lastStretch.destinationType == 'p') {
                        destinationType = 'Ponto de encontro';
                    }
                    this.stretch.originType = destinationType;
                    this.updateProvider++;
                    this.updateAddress++;
                }
            });
        },

        getProviderAddress(providerId, typeProvider) {
            return this.people(providerId).then((result) => {
                if (result["@id"] && result.address.length > 0) {
                    return result.address;
                } else {
                    this.$q.notify({
                        message: `Endereço de fornecedor de ${typeProvider} para base não encontrado`,
                        position: "bottom",
                        type: "negative",
                    });
                    return null;
                }
            });
        },

        onSelectOriginPeople(item) {
            if (item?.value) {
                this.stretch.provider = item.value;
            } else {
                this.stretch.provider = item.id;
            }
            if (this.stretch.originType == "Base") {
                this.getProviderAddress(this.stretch.provider, 'origem').then((data) => {
                    if (data != null && data.length != 0) {
                        this.originProviderHasAddress = true;
                        this.originProviderAddressOptions = [];

                        for (let index in data) {
                            let address = {};
                            address.country =
                                data[index].street.district.city.state.country.countryname || "";
                            address.state = data[index].street.district.city.state.uf || "";
                            address.region = this.getRegion(address.state) || "";
                            address.city = data[index].street.district.city.city || "";
                            address.district = data[index].street.district.district || "";
                            address.cep = data[index].street.cep.cep || "";
                            address.street = data[index].street.street || "";
                            address.number = data[index].number || "";
                            address.complement = data[index].complement || "";
                            address.locator = data[index].locator || "";
                            let formatedAddress = `${address.street}, ${address.number}, ${address.complement} - ${address.district}, ${address.cep}, ${address.city} ${address.state}, ${address.country}`;

                            this.originProviderAddressOptions.push({
                                label: formatedAddress,
                                value: address,
                            });
                        }
                    } else {
                        this.originProviderHasAddress = false;
                    }
                });
            }
        },

        onSelectDestinationPeople(item) {
            if (item?.value) {
                this.stretch.destinationProvider = item.value;
            } else {
                this.stretch.destinationProvider = item.id;
            }
            if (this.stretch.destinationType == "Base") {
                this.getProviderAddress(this.stretch.destinationProvider, 'destino').then((data) => {
                    if (data != null) {
                        this.destinationProviderHasAddress = true;
                        this.destinationProviderAddressOptions = [];

                        for (let index in data) {
                            let address = {};
                            address.country =
                                data[index].street.district.city.state.country.countryname || "";
                            address.state = data[index].street.district.city.state.uf || "";
                            address.region = this.getRegion(address.state) || "";
                            address.city = data[index].street.district.city.city || "";
                            address.district = data[index].street.district.district || "";
                            address.cep = data[index].street.cep.cep || "";
                            address.street = data[index].street.street || "";
                            address.number = data[index].number || "";
                            address.complement = data[index].complement || "";
                            address.locator = data[index].locator || "";
                            let formatedAddress = `${address.street}, ${address.number}, ${address.complement} - ${address.district}, ${address.cep}, ${address.city} ${address.state}, ${address.country}`;

                            this.destinationProviderAddressOptions.push({
                                label: formatedAddress,
                                value: address,
                            });
                        }
                    } else {
                        this.destinationProviderHasAddress = false;
                    }
                });
            }
        },

        onSelectOrigin(item) {
            if (typeof item == 'string') {
                return;
            }
            this.stretch.originRegion = this.getRegion(item.state);
            this.stretch.originState = item.state;
            this.stretch.originCity = item.city;
            this.stretch.originAdress = item.description;
        },

        onSelectDestination(item) {
            this.stretch.destinationRegion = this.getRegion(item.state);
            this.stretch.destinationState = item.state;
            this.stretch.destinationCity = item.city;
            this.stretch.destinationAdress = item.description;
        },

        getRegion(locale) {
            let states = this.collectionStateOptions;
            for (let index in states) {
                if (states[index][1] == locale) {
                    return states[index][2];
                }
            }
        },

        onSubmit() {
            this.$refs.myForm.validate().then((success) => {
                if (success) {
                    this.saveStretch();
                }
            });
        },
        saveStretch() {
            let stretch = this.deepClone(this.stretch);

            stretch.status = stretch.status.value;
            if (stretch.provider)
                stretch.provider = stretch.provider.value
                    ? stretch.provider.value
                    : stretch.provider;
            if (stretch.destinationProvider)
                stretch.destinationProvider = stretch.destinationProvider.value
                    ? stretch.destinationProvider.value
                    : stretch.destinationProvider;

            if (stretch.originType == "Base") stretch.originType = "b";

            if (stretch.originType == "Coleta") stretch.originType = "c";

            if (stretch.originType == "Ponto de encontro") stretch.originType = "p";

            if (stretch.destinationType == "Base") stretch.destinationType = "b";

            if (stretch.destinationType == "Entrega") stretch.destinationType = "e";

            if (stretch.destinationType == "Ponto de encontro") stretch.destinationType = "p";

            if (stretch.order == null) stretch.order = this.orderId;

            stretch.price = parseFloat(this.stretch.price);
            stretch.amountPaid = parseFloat(this.stretch.amountPaid);
            stretch.balance = parseFloat(this.stretch.balance);

            stretch.lastModified = this.lastModified();

            let options = {
                id: this.stretch.id ? this.stretch.id : null,
                values: (stretch),
            };
            this.saveOrderLogistics(options)
                .then((result) => {
                    if (result) {
                        this.$q.notify({
                            message: this.$t("Dados salvos com sucesso!"),
                            position: "bottom",
                            type: "positive",
                        });
                    }
                })
                .finally(() => {
                    this.onReset();
                    this.$emit('loadLogistics');
                });
        },

        lastModified() {
            let date = new Date();
            let modified = this.formatDateTime(date);
            return modified;
        },

        padTo2Digits(num) {
            return num.toString().padStart(2, "0");
        },
        formatDateTime(date) {
            return (
                [
                    date.getFullYear(),
                    this.padTo2Digits(date.getMonth() + 1),
                    this.padTo2Digits(date.getDate()),
                ].join("-") +
                " " +
                [
                    this.padTo2Digits(date.getHours()),
                    this.padTo2Digits(date.getMinutes()),
                    this.padTo2Digits(date.getSeconds()),
                ].join(":")
            );
        },

        deepClone(obj) {
            if (obj === null || typeof obj !== 'object') {
                return obj;
            }

            if (Array.isArray(obj)) {
                const newArray = [];
                for (let i = 0; i < obj.length; i++) {
                    newArray[i] = this.deepClone(obj[i]);
                }
                return newArray;
            }

            const newObj = {};
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    newObj[key] = this.deepClone(obj[key]);
                }
            }

            return newObj;
        },

        onReset() {
            this.editModal = false;
            this.stretch.id = null;
            this.stretch.status = null;
            this.stretch.estimatedShippingDate = null;
            this.stretch.shippingDate = null;
            this.stretch.estimatedArrivalDate = null;
            this.stretch.arrivalDate = null;
            this.stretch.originType = null;
            this.stretch.originRegion = null;
            this.stretch.originState = null;
            this.stretch.provider = null;
            this.stretch.originCity = null;
            this.stretch.originAdress = null;
            this.stretch.originType = null;
            this.stretch.originLocator = null;
            this.stretch.destinationType = null;
            this.stretch.destinationRegion = null;
            this.stretch.destinationState = null;
            this.stretch.destinationProvider = null;
            this.stretch.destinationCity = null;
            this.stretch.destinationAdress = null;
            this.stretch.destinationLocator = null;
            this.stretch.price = null;
            this.stretch.amountPaid = null;
            this.stretch.balance = null;
            this.stretch.order = null;
        },
    },

    data() {
        return {
            originProviderLoading: false,
            originAddressLoading: false,
            destinationProviderLoading: false,
            destinationAddressLoading: false,
            isLoading: false,
            isSearching: false,
            editShippingTax: true,
            shippingTax: null,
            hasOrderId: null,
            isSuper: null,
            testes: true,
            updateAddress: 0,
            updateProvider: 0,
            confirmDelete: false,
            idRowToDelete: false,
            isFirstStretch: null,
            addNewStretch: false,
            originProviderHasAddress: false,
            destinationProviderHasAddress: false,
            toggleAddStretch: false,
            indexRowEdit: null,


            selectedStatus: null,
            selectedProvider: null,
            tempProvider: {},
            tempAdress: {},
            tempDestinationAdress: {},
            tempDestinationProvider: {},
            tempOriginAddressAdd: null,
            tempDestinationAddressAdd: null,
            editAdress: false,
            editProvider: false,
            editDestinationAdress: false,
            editDestinationProvider: false,
            stretch: { price: 0 },

            // stretchValueOptions: [],
            stretchValueSelected: null,
            originProviderAddressOptions: [],
            destinationProviderAddressOptions: [],

            originTypeOptions: ["Coleta", "Base", "Ponto de encontro"],
            destinationTypeOptions: ["Entrega", "Base", "Ponto de encontro"],
            originRegionOptions: ["Norte", "Nordeste", "Sul", "Sudeste", "Centro-Oeste"],
            destinationRegionOptions: ["Norte", "Nordeste", "Sul", "Sudeste", "Centro-Oeste"],
            collectionStateOptions: [
                ["Acre", "AC", "Norte"],
                ["Alagoas", "AL", "Nordeste"],
                ["Amapá", "AP", "Norte"],
                ["Amazonas", "AM", "Norte"],
                ["Bahia", "BA", "Nordeste"],
                ["Ceará", "CE", "Nordeste"],
                ["Distrito Federal", "DF", "Centro-Oeste"],
                ["Espírito Santo", "ES", "Sudeste"],
                ["Goiás", "GO", "Centro-Oeste"],
                ["Maranhão", "MA", "Nordeste"],
                ["Mato Grosso", "MT", "Centro-Oeste"],
                ["Mato Grosso do Sul", "MS", "Centro-Oeste"],
                ["Minas Gerais", "MG", "Sudeste"],
                ["Pará", "PA", "Norte"],
                ["Paraíba", "PB", "Nordeste"],
                ["Paraná", "PR", "Sul"],
                ["Pernambuco", "PE", "Nordeste"],
                ["Piauí", "PI", "Nordeste"],
                ["Rio de Janeiro", "RJ", "Sudeste"],
                ["Rio Grande do Norte", "RN", "Nordeste"],
                ["Rio Grande do Sul", "RS", "Sul"],
                ["Rondônia", "RO", "Norte"],
                ["Roraima", "RR", "Norte"],
                ["Santa Catarina", "SC", "Sul"],
                ["São Paulo", "SP", "Sudeste"],
                ["Sergipe", "SE", "Nordeste"],
                ["Tocantins", "TO", "Norte"],
            ],
        };
    },

    watch: {
        "stretch.price"(val) {
            if (this.stretch.amountPaid && this.stretch.amountPaid != null) {
                this.stretch.balance = val - this.stretch.amountPaid;
            }
        },

        "stretch.amountPaid"(val) {
            if (this.stretch.price && this.stretch.price != null) {
                this.stretch.balance = this.stretch.price - val;
            }
        },

        "stretch.originType"(newVal, oldVal) {
            console.log('watch');
            if (newVal == 'Base' && this.stretch.provider) {
                let id;
                if (this.stretch.provider?.value) {
                    id = this.stretch.provider.value
                } else {
                    id = this.stretch.provider;
                }
                this.getProviderAddress(id, 'origem').then((data) => {
                    if (data != null) {
                        this.originProviderHasAddress = true;
                        this.originProviderAddressOptions = [];

                        for (let index in data) {
                            let address = {};
                            address.country =
                                data[index].street.district.city.state.country.countryname || "";
                            address.state = data[index].street.district.city.state.uf || "";
                            address.region = this.getRegion(address.state) || "";
                            address.city = data[index].street.district.city.city || "";
                            address.district = data[index].street.district.district || "";
                            address.cep = data[index].street.cep.cep || "";
                            address.street = data[index].street.street || "";
                            address.number = data[index].number || "";
                            address.complement = data[index].complement || "";
                            address.locator = data[index].locator || "";
                            let formatedAddress = `${address.street}, ${address.number}, ${address.complement} - ${address.district}, ${address.cep}, ${address.city} ${address.state}, ${address.country}`;

                            this.originProviderAddressOptions.push({
                                label: formatedAddress,
                                value: address,
                            });
                        }
                    } else {
                        this.originProviderHasAddress = false;
                    }
                });
            }
        },

        "stretch.destinationType"(newVal, oldVal) {
            if (newVal == 'Base' && this.stretch.destinationProvider) {
                let id;
                if (this.stretch.destinationProvider?.value) {
                    id = this.stretch.destinationProvider.value
                } else {
                    id = this.stretch.destinationProvider;
                }
                this.getProviderAddress(id, 'destino').then((data) => {
                    if (data != null) {
                        this.destinationProviderHasAddress = true;
                        this.destinationProviderAddressOptions = [];

                        for (let index in data) {
                            let address = {};
                            address.country =
                                data[index].street.district.city.state.country.countryname || "";
                            address.state = data[index].street.district.city.state.uf || "";
                            address.region = this.getRegion(address.state) || "";
                            address.city = data[index].street.district.city.city || "";
                            address.district = data[index].street.district.district || "";
                            address.cep = data[index].street.cep.cep || "";
                            address.street = data[index].street.street || "";
                            address.number = data[index].number || "";
                            address.complement = data[index].complement || "";
                            address.locator = data[index].locator || "";
                            let formatedAddress = `${address.street}, ${address.number}, ${address.complement} - ${address.district}, ${address.cep}, ${address.city} ${address.state}, ${address.country}`;

                            this.destinationProviderAddressOptions.push({
                                label: formatedAddress,
                                value: address,
                            });
                        }
                    } else {
                        this.destinationProviderHasAddress = false;
                        if (!Object.keys(this.stretchToEdit).length) {
                            this.$refs.destinationAddress['model'] = null;
                        }
                    }
                });
            }
        },

        tempOriginAddressAdd(address) {
            if (typeof address == 'string') {
                return;
            }
            this.stretch.originRegion = address.value.region;
            this.stretch.originState = address.value.state;
            this.stretch.originCity = address.value.city;
            this.stretch.originAdress = address.label;
            this.stretch.originLocator = address.value.locator;
        },
        tempDestinationAddressAdd(address) {
            this.stretch.destinationRegion = address.value.region;
            this.stretch.destinationState = address.value.state;
            this.stretch.destinationCity = address.value.city;
            this.stretch.destinationAdress = address.label;
            this.stretch.destinationLocator = address.value.locator;
        },

        stretchValueSelected(value) {
            if (value && value.price) {
                let val = value.price.toFixed(2);
                this.stretch.price = parseFloat(val);
            }
        },
    }

};

</script>