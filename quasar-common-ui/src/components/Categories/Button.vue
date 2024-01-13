<template>
    <q-btn class="q-pa-xs" dense icon="settings" color="primary" @click="openModal = true">
        <q-tooltip>
            {{
                $t('default.btn.categories_' + componentProps.context)
            }}
        </q-tooltip>
    </q-btn>
    <q-dialog v-model="openModal" maximized>
        <q-card class="">
            <q-card-section class="row col-12 q-pa-sm">
                <q-toolbar class="">
                    <q-toolbar-title class="">{{
                        $t('default.title.categories_' + componentProps.context)
                    }}</q-toolbar-title>
                    <q-btn no-caps flat v-close-popup round dense icon="close" />
                </q-toolbar>
            </q-card-section>
            <q-card-section class="row q-pa-md">
                <Table :context="componentProps.context" />
            </q-card-section>
        </q-card>
    </q-dialog>
</template>
<script>
import Table from "./Table";

export default {
    props: {
        componentProps: {

        }
    },
    components: {
        Table
    },
    computed: {
    },
    created() {
    },
    data() {
        return {
            openModal: false
        }
    },
    watch: {
    },
    methods: {
    }
}
</script>