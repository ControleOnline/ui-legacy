<template>
    <DefaultTable :configs="configs" v-if="configs" />
</template>
<script>
import DefaultTable from "@controleonline/quasar-default-ui/src/components/Default/DefaultTable";
import { mapActions, mapGetters } from "vuex";
import Filters from "@controleonline/quasar-default-ui/src/utils/filters";
import Button from "@controleonline/quasar-common-ui/src/components/Categories/Button";
import * as DefaultMethods from '@controleonline/quasar-default-ui/src/components/Default/Scripts/DefaultMethods.js';

export default {
    components: {
        DefaultTable,
        Button
    },
    props: {
        context: {
            required: true
        },
    },
    computed: {
        ...mapGetters({
            companies: 'people/companies',
            myCompany: 'people/currentCompany',
            columns: 'invoice/columns',
        }),
        configs() {
            return {
                companyParam: this.context == 'expense' ? 'payer' : 'receiver',
                filters: true,
                store: 'invoice',
                add: true,
                delete: false,
                selection: true,
                search: {

                },
                columns: {
                    category: {
                        filters: {
                            context: this.context,
                            company: '/people/' + this.myCompany.id
                        }
                    },
                    status: {
                        filters: {
                            context: 'invoice'
                        }
                    }
                },
                list: {
                    people: this.people,
                    status: this.status,
                    categories: this.categories,
                    company: this.companies
                },
                components: {
                    headerActions: {
                        component: Button,
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
            filters: new Filters()
        };
    },
    created() {
        const columns = this.copyObject(this.columns);
        const columnIndex = columns.findIndex(c => c.name === 'receiver' || c.name === 'payer');
        if (columnIndex !== -1) {
            columns[columnIndex].name = this.context === 'expense' ? 'receiver' : 'payer';
            columns[columnIndex].label = this.context === 'expense' ? 'receiver' : 'payer';
        };

        const columnIdIndex = columns.findIndex(c => c.name === 'id');
        if (columnIdIndex !== -1) {
            columns[columnIdIndex].to = (value) => {
                let route = this.context === 'expense' ? 'receiver' : 'payer';
                return {
                    name: "FinanceExpenseCategories",
                    params: {
                        id: value
                    }
                };
            };
        }

        this.$store.commit(this.configs.store + '/SET_COLUMNS', columns);

    },
    methods: {
        ...DefaultMethods,
        ...mapActions({
            categories: 'categories/getItems',
            status: 'status/getItems',
            people: 'people/getItems'
        })
    },
};
</script>