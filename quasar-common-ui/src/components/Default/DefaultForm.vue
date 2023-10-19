<template>
    <q-card class="full-width  q-pa-md">
        <q-form ref="myForm" @submit="onSubmit">
            <div class="row q-col-gutter-xs q-pb-xs">
                <template v-for="(column, index)  in columns">
                    <div v-if="column.isIdentity != true"
                        :class="column.formClass || 'col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 q-pa-xs'">

                        <q-select v-if="column.list" class="col-12 q-pa-xs" dense outlined stack-label lazy-rules use-input
                            map-options hide-selected fill-input options-cover @filter="searchList" input-debounce="700"
                            :loading="isLoadingList" :options="listAutocomplete[column.list]" @focus="editingInit(column)"
                            :label="$t(configs.store + '.' + column.label)" v-model="item[column.key || column.name]">
                            <template v-slot:no-option v-if="!isLoadingList">
                                <q-item>
                                    <q-item-section class="text-grey">
                                        No results
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-select>

                        <q-input v-else :disable="column.editable == false" dense outlined stack-label lazy-rules
                            v-model="item[column.key || column.name]" type="text" :mask="mask(column)"
                            :label="$t(configs.store + '.' + column.label)" :rules="[isInvalid()]" />
                    </div>
                </template>
                <!--
                <div class="col-xs-12 col-sm-6">
                    <q-input dense outlined stack-label 
                    v-model="periodo" 
                    mask="##/####" :label="$t('Período')">
                        <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy ref="qDateProxy1" transition-show="scale" transition-hide="scale">
                                    <q-date v-model="periodo" mask="MM/YYYY" @input="() => $refs.qDateProxy1.hide()" />
                                </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                </div>
                -->
            </div>

            <div class="row justify-end">
                <q-btn :loading="isSaving" icon="save" type="submit" :label="$t(configs.store + '.save')" size="md"
                    color="primary" class="q-mt-md" />
            </div>
        </q-form>
    </q-card>
</template>
  
<script>
import * as DefaultMethods from './DefaultMethods.js';

export default {
    props: {
        configs: {
            type: Object,
            required: true,
        },
        data: {
            type: Object,
            required: false,
            default() {
                return {};
            }
        },
    },
    components: {
    },
    data() {
        return {
            showInput:null,
            listObject: {},
            listAutocomplete: [],
            editing: [],
            periodo: false,
            item: {},
            id: null,
        };
    },
    created() {
        let data = {};
        Object.keys(this.data).forEach((item, i) => {
            let column = this.columns.find((c) => {
                return (c.key || c.name) == item
            });
            if (column) {
                data[column.key || column.name] =
                    column.list ?
                        this.formatData(column, this.data, true) :
                        this.data[column.key || column.name];

                if (column.isIdentity)
                    this.id = data[column.key || column.name];
            }
        });
        this.item = data;
    },
    mounted() {
        this.$nextTick(() => {
        });
    },

    computed: {
        isSaving() {
            return this.$store.getters[this.configs.store + '/isSaving']
        },
        columns() {
            return this.$store.getters[this.configs.store + '/columns']
        },
        isLoadingList() {
            return this.$store.getters[this.configs.store + '/isLoadingList']
        }
    },
    watch: {
    },
    methods: {
        ...DefaultMethods,
        save(params) {

            let p = {};
            for (const name in params) {
                if (this.listObject[name])
                    p[name] = this.listObject[name] + '/' + params[name].value;
                else
                    p[name] = this.saveFormat(name, params[name]);
            }
            if (this.id)
                p.id = this.id;
            this.$store.dispatch(this.configs.store + '/save', p
            ).then((item) => {
                this.$q.notify({
                    message: this.$t("Success!"),
                    position: "bottom",
                    type: "positive",
                });
                this.$emit("saved", item);
            }).catch((error) => {
                this.$emit("error", error);
                this.$q.notify({
                    message: this.$t("Erro ao salvar!"),
                    position: "bottom",
                    type: "negative",
                });
            });
        },

        editingInit(col) {
            this.editing = [{ [col.key || col.name]: true }];
            return this.editing;
        },

        onSubmit() {
            this.$refs.myForm.validate().then((success) => {
                if (success) {
                    let payload = this.item;
                    this.save(payload);
                }
            });
        },
    }
};
</script>  