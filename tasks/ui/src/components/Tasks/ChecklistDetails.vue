<template>
  <div class="q-pa-lg">
    <div class="row">
      <div v-for="(field, i) in fields" :key="i" class="q-pa-lg">
        <h7> {{ field.label }} </h7>
        <q-option-group
          v-model="group[field.value]"
          :options="default_options"
          color="primary"
          inline
        />
        <q-separator />
      </div>
    </div>
  </div>
</template>


<script>
import { ref } from "vue";

export default {
  props: {
    default_options: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      group: {},
      fields: [
        {
          label: "Antena",
          value: "antenna",
        },
        {
          label: "Calota",
          value: "hubcap",
        },
        {
          label: "Cartao",
          value: "card",
        },
        {
          label: "Code",
          value: "code",
        },
        {
          label: "Chave de Roda",
          value: "tire",
        },
        {
          label: "Chave do veiculo",
          value: "key",
        },
        {
          label: "Documentos",
          value: "documents",
        },
        {
          label: "Estepe",
          value: "steppe",
        },
        {
          label: "Extintor",
          value: "extinguisher",
        },
        {
          label: "Macaco",
          value: "jack",
        },
        {
          label: "Radio",
          value: "radio",
        },
        {
          label: "Radio Central Multimidia",
          value: "multimedia",
        },
        {
          label: "Rodas de Ferro",
          value: "iron_wheels",
        },
        {
          label: "Rodas de liga leve",
          value: "alloy_wheels",
        },
        {
          label: "Tapetes",
          value: "carpets",
        },
        {
          label: "Triangulo",
          value: "triangle",
        },
      ],
    };
  },
};
</script>