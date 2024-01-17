<template>
    <q-select dense outlined :stack-label="labelType" lazy-rules use-input use-chips map-options options-cover
        transition-show="flip-down" transition-hide="flip-up" @filter="searchList" :options="options" label-color="black"
        input-debounce="700" :loading="isLoadingList" multiple :label="labelType != 'stack-label' ? '' : $t(label, 'input')"
        v-model="data">
        <template v-slot:no-option v-if="!isLoadingList">
            <q-item>
                <q-item-section class="text-grey">
                    No results
                </q-item-section>
            </q-item>
        </template>
    </q-select>
</template>


<script>

export default {
    components: {
    },
    props: {
        labelType: {
            type: String,
            required: false,
            default: 'stack-label'
        },
        label: {
            type: String,
            required: true,
        },
        searchAction: {
            required: true,
        }
    },
    computed: {
        isLoadingList() {
            //return this.$store.getters[this.configs.store + '/isLoadingList']
        },
    },
    data() {
        return {
            data: [],
            options: [],
        }
    },
    created() {
    },

    watch: {
    },
    methods: {
        searchList(input, update, abort) {
            this.options = this.searchAction();
            console.log(this.options);
            update();
        }
    }
}

</script>