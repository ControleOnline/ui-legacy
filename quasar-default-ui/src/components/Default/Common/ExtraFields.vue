<template>
  <q-btn
    class="q-pa-xs btn-primary"
    dense
    icon="variable_add"
    @click="openFields = true"
  >
    <q-tooltip>
      {{ $translate(configs.store, "extra", "tooltip") }}
    </q-tooltip>
  </q-btn>
  <q-dialog v-model="openFields" full-width>
    <q-card class="">
      <q-card-section class="row col-12 q-pa-sm">
        <q-toolbar class="">
          <q-toolbar-title class="">{{
            $translate(configs.store, "filters", "title")
          }}</q-toolbar-title>
          <q-btn no-caps flat v-close-popup round dense icon="close" />
        </q-toolbar>
      </q-card-section>
      <q-card-section class="row items-center no-wrap">
        <FieldsTypes :context="configs.extraFields.context || configs.store" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import * as DefaultFiltersMethods from "@controleonline/quasar-default-ui/src/components/Default/Scripts/DefaultFiltersMethods.js";
import FieldsTypes from "@controleonline/quasar-common-ui/src/components/Fields/types";

export default {
  props: {
    configs: {
      type: Object,
      required: true,
    },
  },

  components: {
    FieldsTypes,
  },
  computed: {},
  created() {},
  data() {
    return {
      openFields: false,
    };
  },

  watch: {},
  methods: {},
};
</script>
