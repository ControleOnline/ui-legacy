<template>
    <DefaultTable :configs="configs" v-if="configs" />
</template>
<script>
import DefaultTable from "@controleonline/quasar-default-ui/src/components/Default/DefaultTable";
import { mapActions, mapGetters } from "vuex";
import Status from "@controleonline/quasar-common-ui/src/components/Status/Button";
export default {
    components: {
        DefaultTable,
        Status,
    },
    props: {
        context: {
            required: true
        },
    },
    computed: {
        ...mapGetters({
            myCompany: 'people/currentCompany',
            columns: 'orders/columns',
        }),

        filters() {
            return this.$store.getters[this.configs.store + '/filters'] || {}
        },
        configs() {
            return {
                companyParam: 'provider_id',
                filters: true,
                store: 'tasks',
                add: true,
                delete: false,
                selection: false,
                search: false,
                columns: {
                    category: {
                        filters: {
                            context: this.context,
                            company: '/people/' + this.myCompany.id
                        }
                    },
                    criticality: {
                        filters: {
                            context: this.context + '-criticality',
                            company: '/people/' + this.myCompany.id
                        }
                    },
                    reason: {
                        filters: {
                            context: this.context + '-reason',
                            company: '/people/' + this.myCompany.id
                        }
                    },
                    status: {
                        filters: {
                            context: this.context
                        }
                    }
                },
                components: {
                    tableActions: {
                        //component: OtherInformations,
                        props: {
                            context: this.context
                        }
                    },
                    headerActions: {
                        //component: Status,
                        props: {
                            context: this.context
                        }
                    }
                }
            };
        }
    },
    data() {
        return {
        };
    },
    created() {
        const filters = this.$copyObject(this.filters);
        filters.task_type = this.context;
        this.$store.commit(this.configs.store + '/SET_FILTERS', filters);

    },
    methods: {
    },
};
</script>