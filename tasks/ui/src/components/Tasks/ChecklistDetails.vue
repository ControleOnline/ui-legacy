<template>
  <div class="q-pa-lg">
    <div class="row">
      <h5>Condições Gerais</h5>
      <q-separator class="clear" />
      <div v-for="(field, i) in carcase_fields" :key="i" class="q-pa-lg">
        <h7> {{ field.label }} </h7>
        <q-option-group
          required
          v-model="group[field.value]"
          :options="carcase_options"
          color="primary"
          inline
        />
        <q-separator />
      </div>
    </div>
    <div class="row">
      <h5>Rodas</h5>
      <q-separator class="clear" />
      <div v-for="(field, i) in wheels_fields" :key="i" class="q-pa-lg">
        <h7> {{ field.label }} </h7>
        <q-option-group
          required
          v-model="group[field.value]"
          :options="wheels_options"
          color="primary"
          inline
        />
        <q-separator />
      </div>
    </div>
    <div class="row">
      <h5>Acessórios</h5>
      <q-separator class="clear" />
      <div v-for="(field, i) in accessories_fields" :key="i" class="q-pa-lg">
        <h7> {{ field.label }} </h7>
        <q-option-group
          required
          v-model="group[field.value]"
          :options="accessories_options"
          color="primary"
          inline
        />
        <q-separator />
      </div>
    </div>

    <div class="row">
      <h5>Observações</h5>
      <q-separator class="clear" />
      <textarea required class="full-width" rows="10"></textarea>
    </div>
    <div class="row">
      <q-checkbox
        v-model="dirty"
        label="Veículo muito sujo, sem condições de apuração detalhada da lataria, não nos responsabilizamos por arranhões que venham a ser identificados após a lavagem."
      />
      <h8>
        A empresa não se responsabiliza pelos seguintes defeitos do veículo:
        Descarga da bateria, total ou parcial, queima de farol, luzes ou
        celibim, ou qualquer mal funcionamento do motor, vazamento do radiador,
        mangueiras ou correias arrebentadas, caixa escapando, disco platinado,
        objetos de valor, dinheiro, jóias, armas e documentos sob hipótese
        alguma.
      </h8>
    </div>
  </div>
</template>


<script>
import { ref } from "vue";

export default {
  props: {
    carcase_options: {
      type: Array,
      required: true,
    },
    accessories_options: {
      type: Array,
      required: true,
    },
    wheels_options: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      group: {},
      dirty: false,
      carcase_fields: [
        {
          label: "Pintura",
          value: "paint",
        },
        {
          label: "Forração",
          value: "lining",
        },
        {
          label: "Tapeçaria",
          value: "tapestry",
        },
      ],
      accessories_fields: [
        {
          label: "Acendedor de Cig.",
          value: "cigarette_lighter",
        },
        {
          label: "Ar Condicionado",
          value: "air_conditioning",
        },
        {
          label: "Antena Comum",
          value: "common_antenna",
        },
        {
          label: "Buzina",
          value: "horn",
        },

        {
          label: "Cinto de Segurança",
          value: "seat_belt",
        },
        {
          label: "Tapetes",
          value: "carpets",
        },
        {
          label: "Bateria",
          value: "battery",
        },
        {
          label: "Auto falante",
          value: "speaker",
        },
        {
          label: "Calota",
          value: "hubcap",
        },
        {
          label: "Engate",
          value: "hitch",
        },
        {
          label: "Farol Auxiliar",
          value: "auxiliary_headlight",
        },
        {
          label: "Roda Comum",
          value: "common_wheel",
        },

        {
          label: "Roda Especial",
          value: "special_wheel",
        },

        {
          label: "Rádio CD",
          value: "radio_cd",
        },
        {
          label: "Rádio AM/FM",
          value: "radio_fm",
        },
        {
          label: "Documento",
          value: "document",
        },
        {
          label: "Manual",
          value: "manual",
        },

        {
          label: "Chave",
          value: "keys",
        },
        {
          label: "Chave Reserva",
          value: "extra_key",
        },
        {
          label: "Tampão Traseiro",
          value: "back_cap",
        },
        {
          label: "Extintor",
          value: "extinguisher",
        },
        {
          label: "Triângulo",
          value: "triangle",
        },

        {
          label: "Macaco",
          value: "jack",
        },

        {
          label: "Chave de Roda",
          value: "tire_iron",
        },
        {
          label: "Chave de Fenda",
          value: "screwdriver",
        },
      ],
      wheels_fields: [
        {
          label: "Pneu Diant. Esq.",
          value: "left_front_tire",
        },
        {
          label: "Pneu Diant. Dir.",
          value: "right_front_tire",
        },
        {
          label: "Pneu Tras. Esq.",
          value: "left_rear_tire",
        },
        {
          label: "Pneu Tras. Dir.",
          value: "right_rear_tire",
        },
        {
          label: "Estepe",
          value: "spare",
        },
      ],
    };
  },
};
</script>
<style scoped>
.clear {
  clear: both;
  width: 100%;
}
h5 {
  margin: 0;
  margin-top: 50px;
  font-weight: 500;
}
</style>