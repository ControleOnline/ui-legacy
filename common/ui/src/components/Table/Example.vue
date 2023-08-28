<template>
    <DefaultTable :configs="configs" v-if="configs" />
</template>
<script>
import DefaultTable from "@nelsys/../../src/modules/nelsys/quasar-common-ui/src/components/Table/DefaultTable";
export default {
    name: "Entrada",
    components: {
        DefaultTable
    },
    props: {
        filters: {
            type: Object,
            required: true,
        },
    },
    computed: {
        configs() {
            let module = 'logs';
            return {
                components: {
                    acoes: () => import("@nelsys/../../src/modules/nelsys/quasar-waybill-ui/src/components/pedido/acoes.vue"),
                },
                list: {
                    transportadoras: this.transportadoras,
                    pessoas: this.transportadoras,
                },
                prefix: '/webapi/',
                module: module,
                isLoading: module + '/isLoading',
                totalItems: module + '/totalItems',
                columns: module + '/columns',
                filters: module + '/filters',
                actions: {
                    getItems: module + '/getItems',
                    save: module + '/save',
                    setFilters: module + '/SET_FILTERS',
                },
                selection: false,
                search: false,
            };
        }
    },
    data() {
        return {
            transportadoras: [],
        };
    },
    created() {
        if (this.filters)
            this.$store.commit('logs/SET_FILTERS', this.filters);

        this.$store.dispatch('people/getTransportadoresAtivo', {
        }).then((data) => {

            let transportadoras = [];
            data['hydra:member'].forEach(element => {
                if (element.pessoa.IdPessoa)
                    transportadoras.push({
                        label: element.pessoa.nmCurto,
                        value: element.pessoa.IdPessoa
                    })
            });
            this.transportadoras = transportadoras;
        });

    },
    methods: {

    },
};
</script>
  