<template>
    <div class="row outlined-div">
        <div class="col-11 col-sm-11col-md-11 col-lg-11 col-xg-11 col-xs-11 flex">
            <div class="label-range-date row" v-if="labelType == 'stack-label'">
                {{ $translate(configs.store, column.label, 'input') }}
            </div>
            <q-input borderless stack-label readonly :label="$translate(configs.store, 'dateFrom', 'input')"
                class="q-pa-none custom-input" dense v-model="from" mask="##/##/####"></q-input>
            <q-input borderless stack-label readonly :label="$translate(configs.store, 'dateTo', 'input')"
                class="q-pa-none custom-input" dense v-model="to" mask="##/##/####"></q-input>
        </div>
        <div class="col-1 col-sm-1 col-md-1 col-lg-1 col-xg-1 col-xs-1 q-pa-sm  flex flex-end justify-end items-center">
            <q-icon :clickable="true" @click="dateModel = { from: null, to: null }; setinputDate()" name="event"
                class="vertical-middle cursor-pointer text-primary" size="sm">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="dateModel" range mask="DD/MM/YYYY">
                        <div class="row items-center justify-end">
                            <q-btn v-close-popup @click="apply" :label="$translate(configs.store, 'apply', 'btn')"
                                color="primary" flat />
                        </div>
                    </q-date>
                </q-popup-proxy>
            </q-icon>
        </div>
    </div>
</template>   
<script>
import * as DefaultFiltersMethods from '@controleonline/quasar-default-ui/src/components/Default/Scripts/DefaultFiltersMethods.js';
import {
  buildAmericanDate,
  formatDateYmdTodmY,
} from "@controleonline/quasar-common-ui/src/utils/formatter";

export default {
    props: {
        initialRange: {
            type: Object,
            required: true,
        },
        labelType: {
            type: String,
            required: false,
            default: 'stack-label'
        },
        column: {
            type: Object,
            required: true,
        },
        configs: {
            type: Object,
            required: true,
        },
    },
    computed: {

    },
    data() {
        return {
            listObject: {},
            from: null,
            to: null,
            dateModel: {},
            initied: false
        }
    },
    created() {

    },
    mounted() {
        this.dateModel = this.rangeDate(this.initialRange);
        this.setinputDate();
        this.initied = true;
    },
    watch: {
    },
    methods: {
        ...DefaultFiltersMethods,
        apply() {
            let dateModel = {};
            this.setinputDate();
            if (typeof this.dateModel === 'object')
                dateModel = this.dateModel
            else
                dateModel = { from: this.dateModel, to: this.dateModel }

            this.$emit('changedDateInput', dateModel);
        },
        rangeDate(range) {
            let filters = this.$copyObject(range);
            let initialDate = {};
            initialDate.from = formatDateYmdTodmY(filters?.before);
            initialDate.to = formatDateYmdTodmY(filters?.after);
            return initialDate;
        },
        setinputDate() {
            if (typeof this.dateModel === 'object') {
                this.from = this.dateModel.from;
                this.to = this.dateModel.to;
            } else {
                this.from = this.dateModel;
                this.to = this.dateModel;
            }
        }
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
    padding: 0px;
}

.custom-input {
    width: 50%;
}

.custom-input .q-field__native {
    padding-top: 18px;
    padding-left: 25px;
    width: 100px;
}

.custom-input .q-field__label {
    top: 25px;
    font-size: 14px;
}
</style>