<template>
    <q-card class="full-width  q-pa-md">
        <q-form ref="myForm" @submit="onSubmit">
            <div class="row q-col-gutter-xs q-pb-xs">
                <template v-for="(column, index)  in columns">
                    <div v-if="column.isIdentity != true"
                        :class="column.formClass || 'col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 q-pa-xs'">
                        <q-select v-if="column.list" dense outlined stack-label lazy-rules
                            :options="configs.list[column.list]" :label="$t(column.label)" label-color="black"
                            v-model="data[column.name]" />
                        <q-input v-else :disable="column.editable == false" dense outlined stack-label lazy-rules
                            v-model="data[column.name]" type="text" :mask="mask(column)" :label="$t(column.name)"
                            :rules="[isInvalid()]" />
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
                <q-btn :loading="isSaving" icon="save" type="submit" :label="$t(configs.module + '.save')" size="md"
                    color="primary" class="q-mt-md" />
            </div>
        </q-form>
    </q-card>
</template>
  
<script>
export default {

    props: {
        configs: {
            type: Object,
            required: true,
        },
        rowsOptions: {
            type: Array,
            required: false,
            default() {
                return [50, 100, 200, 500];
            }
        },
    },

    components: {
    },

    data() {
        return {
            periodo: false,
            data: {},
        };
    },

    created() {

    },
    mounted() {
        this.$nextTick(() => {
        });
    },

    computed: {
        isSaving() {
            return this.$store.getters[this.configs.module + '/isSaving']
        },
        columns() {
            return this.$store.getters[this.configs.module + '/columns']
        },
    },
    watch: {
    },
    methods: {
        save(params) {
            let p = {};
            for (const name in params) {
                p[name] = this.format(name, params[name]);
            }
            this.$store.dispatch(this.configs.module + '/save', p
            ).then((data) => {
                this.$q.notify({
                    message: this.$t("Success!"),
                    position: "bottom",
                    type: "positive",
                });
                this.$emit("saved", data);
            }).catch((error) => {
                this.$emit("error", error);
                this.$q.notify({
                    message: this.$t("Erro ao salvar!"),
                    position: "bottom",
                    type: "negative",
                });
            });
        },
        format(columnName, value) {
            const column = this.columns.find((col) => {
                return col.name === columnName || col.key === columnName
            });
            if (typeof column.saveFormat == 'function')
                return column.saveFormat(value)
            else
                if (typeof value == 'object')
                    return !isNaN(value.value) ? parseFloat(value.value) : value.value;

            return !isNaN(value) ? parseFloat(value) : value;
        },
        onSubmit() {
            this.$refs.myForm.validate().then((success) => {
                if (success) {
                    let payload = this.data;
                    this.save(payload);
                }
            });
        },
        mask(column) {
            if (typeof column.mask == 'function')
                return column.mask();
        },
        isInvalid(key) {
            return true;
        },
    }
};
</script>  