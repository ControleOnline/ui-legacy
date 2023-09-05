<template>
    <q-card class="full-width">
        <q-form ref="myForm" @submit="onSubmit">
            <div class="row q-col-gutter-xs q-pb-xs">
                <div v-for="(column, index)  in columns"  class="col-xs-12">
                    <q-input 
                    v-if="column.isIdentity != true"
                    :disable="column.editable == false" dense outlined stack-label lazy-rules v-model="data[column.name]" type="text"
                     :mask="mask(column)"   :label="$t(column.name)" :rules="[isInvalid()]" />
                </div>
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
                <q-btn :loading="isSaving" icon="save" type="submit" :label="$t('Salvar')" size="md" color="primary"
                    class="q-mt-md" />
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
            return this.$store.getters[this.configs.isSaving]
        },
        columns() {
            return this.$store.getters[this.configs.columns]
        },

    },
    watch: {


    },
    methods: {
        onSubmit() {
            this.$refs.myForm.validate().then((success) => {

                  console.log(success);
                if (success) {
                    let payload = this.data;

                    this.$emit("save", payload);
                    console.log(payload);
  
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