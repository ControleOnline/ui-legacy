<template>
    <DefaultTable :configs="configs" v-if="configs" />
</template>
<script>
import DefaultTable from "@controleonline/quasar-default-ui/src/components/Default/DefaultTable";
import { mapActions, mapGetters } from "vuex";
import Filters from "@controleonline/quasar-default-ui/src/utils/filters";
import Button from "@controleonline/quasar-common-ui/src/components/Categories/Button";

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
        }),
        configs() {
            return {
                filters: true,
                store: this.context,
                add: true,
                selection: false,
                search: {

                },
                columns: {
                    category: {
                        filters: {
                            context: this.context,
                            company: '/people/' + this.myCompany.id
                        }
                    }
                },
                list: {
                    categories: this.categories,
                    company: this.companies
                },
                components: {
                    headerActions: {
                        component: Button,
                        pops: {
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
    },
    methods: {
        ...mapActions({
            categories: 'categories/getItems'
        })
    },
};
</script>