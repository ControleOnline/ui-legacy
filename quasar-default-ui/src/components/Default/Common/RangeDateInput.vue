<template>
    <div class="row outlined-div">
        <div class="col-10 col-sm-10 col-md-10 col-lg-10 col-xg-10 col-xs-10 flex">
            <div class="label-range-date row">{{ label }}</div>
            <q-input borderless readonly label="De: " class="q-pa-none custom-input" dense v-model="dateModel.from"
                mask="##/##/####"></q-input>
            <q-input borderless readonly label="Até: " class="q-pa-none custom-input" dense v-model="dateModel.to"
                mask="##/##/####"></q-input>
        </div>
        <div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xg-2 col-xs-2 q-pa-sm  flex flex-end justify-end align-center">
            <q-icon :clickable="true" @click="dateModel = { from: null, to: null }" name="event"
                class="vertical-middle cursor-pointer text-primary" size="sm">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="dateModel" range mask="DD/MM/YYYY">
                        <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                    </q-date>
                </q-popup-proxy>
            </q-icon>
        </div>
    </div>
</template>

   
<script>
import * as DefaultMethods from '@controleonline/quasar-default-ui/src/components/Default/DefaultMethods.js';

export default {
    props: {
        range: {
            type: Object,
            required: true,
        },
        label: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            dateModel: {}
        }
    },
    created() {
        this.dateModel = this.copyObject(this.range) || {};
    },
    watch: {
        dateModel: {
            handler: function (dateModel) {
                let persistDate = dateModel;
                persistDate.before = dateModel.from;
                persistDate.after = dateModel.to;
                this.$emit('changedDateModel', persistDate);
            },
            deep: true,
        },
    },
    methods: {
        ...DefaultMethods,
    }
}

</script>
<style>
.outlined-div {
    border: 1px solid #aaa;
    padding: 0px 10px 0px 10px;
    border-radius: 5px;
}

.label-range-date {
    position: absolute;
    font-size: 10px;
    margin-top: 3px;
}


.outlined-div>div {
    padding: 0px 10px 0px 10px;
}
.custom-input .q-field__native {
    padding-top: 18px;
    padding-left: 25px;
    width: 100px;
}

.custom-input .q-field__label {
    top: 27px;
    font-size: 14px;
}
</style>