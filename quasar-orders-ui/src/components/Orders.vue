<template>
    <DefaultTable :configs="configs" v-if="configs" />
</template>
<script>
import DefaultTable from "@controleonline/quasar-default-ui/src/components/Default/DefaultTable";
import { mapActions, mapGetters } from "vuex";
import Status from "@controleonline/quasar-common-ui/src/components/Status/Button";
import OtherInformations from "./OtherInformations/Button";
export default {
    components: {
        DefaultTable,
        Status,
        OtherInformations
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
        configs() {
            return {
                companyParam: this.context == 'sales' ? 'provider' : 'client',
                filters: true,
                store: 'orders',
                add: true,
                delete: false,
                selection: true,
                search: false,
                columns: {
                    category: {
                        filters: {
                            context: this.context,
                            company: '/people/' + this.myCompany.id
                        }
                    },
                    status: {
                        filters: {
                            context: 'order'
                        }
                    }
                },
                components: {
                    tableActions: {
                        component: OtherInformations,
                        props: {
                            context: this.context
                        }
                    },
                    headerActions: {
                        component: Status,
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
        const columns = this.$copyObject(this.columns);
        const columnIndex = columns.findIndex(c => c.name === 'provider' || c.name === 'client');
        if (columnIndex !== -1) {
            columns[columnIndex].name = this.context === 'sales' ? 'client' : 'provider';
            columns[columnIndex].label = this.context === 'sales' ? 'client' : 'provider';
        };

        const columnIdIndex = columns.findIndex(c => c.name === 'id');
        if (columnIdIndex !== -1) {
            columns[columnIdIndex].to = (value) => {
                let route = this.context === 'sales' ? 'OrderDetails' : 'PurchasingOrderDetails';
                return {
                    name: route,
                    params: {
                        id: value
                    }
                };
            };
        }

        this.$store.commit(this.configs.store + '/SET_COLUMNS', columns);

    },
    methods: {
    },
};
</script>