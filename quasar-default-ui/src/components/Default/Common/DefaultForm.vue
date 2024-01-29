<template>
    <q-card class="full-width  q-pa-md">
        <q-form ref="myForm" @submit="onSubmit">
            <div class="row q-col-gutter-xs q-pb-xs">
                <template v-for="(column, index)  in columns">
                    <div v-if="column.isIdentity != true"
                        :class="column.formClass || 'col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 q-pa-xs'">
                        <FormInputs :editable="column.editable" :prefix="column.prefix" :sufix="column.sufix"
                            :inputType="column.list ? 'list' : column.inputType" :store="configs.store" :mask="mask(column)"
                            :rules="[isInvalid()]" :labelType="'stack-label'" :label="column.label"
                            :filters="getSearchFilters(column)" :initialValue="item[column.key || column.name]"
                            :searchParam="column.searchParam || 'search'" :formatOptions="column.formatList"
                            :searchAction="column.list" @focus="editingInit(column)" @changed="(value) => {
                                item[column.key || column.name] = value;
                            }" />
                    </div>
                </template>
            </div>

            <div class="row justify-end">
                <q-btn :loading="isSaving" icon="save" type="submit" :label="translate(configs.store, 'save', 'btn')
                    " size="md" color="primary" class="q-mt-md" />
            </div>
        </q-form>
    </q-card>
</template>
  
<script>
import * as DefaultFiltersMethods from '@controleonline/quasar-default-ui/src/components/Default/Scripts/DefaultFiltersMethods.js';
import * as DefaultMethods from '@controleonline/quasar-default-ui/src/components/Default/Scripts/DefaultMethods.js';
import FormInputs from "@controleonline/quasar-default-ui/src/components/Default/Filters/FormInputs";
import { mapActions, mapGetters } from "vuex";

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
        FormInputs
    },
    data() {
        return {
            showInput: {},
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
                        this.formatList(column, this.data[column.key || column.name], true) :
                        this.format(column, item, this.data[column.key || column.name]);

                if (column.isIdentity) {
                    this.id = this.data[column.key || column.name];
                    data.id = this.id;
                }
            }
        });

        if (this.data['@id'])
            data['id'] = this.data['@id'].split('/').pop();

        this.item = data;
    },
    mounted() {
        this.$nextTick(() => {
        });
    },

    computed: {
        ...mapGetters({
            myCompany: 'people/currentCompany',
        }),

        isSaving() {
            return this.$store.getters[this.configs.store + '/isSaving']
        },
        filters() {
            return this.$store.getters[this.configs.store + '/filters'] || {}
        },
        columns() {
            return this.$store.getters[this.configs.store + '/columns']
        },
        isLoadingList() {
            return this.$store.getters[this.configs.store + '/isLoadingList']
        }
    },

    methods: {
        ...DefaultFiltersMethods,
        ...DefaultMethods,
        save(params) {
            let p = this.copyObject(this.filters);
            for (const name in params) {
                if (this.listObject[name])
                    p[name] = this.listObject[name] + '/' + params[name].value;
                else
                    p[name] = this.saveFormat(name, params[name]);
            }
            if (this.id)
                p.id = this.id;

            if (this.myCompany)
                p[this.configs.companyParam || 'company'] = '/people/' + this.myCompany.id;

            this.$store.dispatch(this.configs.store + '/save', p
            ).then((item) => {
                this.$q.notify({
                    message: this.translate(this.configs.store, 'success', 'message'),
                    position: "bottom",
                    type: "positive",
                });
                this.$emit("saved", item);
            }).catch((error) => {
                this.$emit("error", error);
                this.$q.notify({
                    message: this.translate(this.configs.store, 'error', 'message'),
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