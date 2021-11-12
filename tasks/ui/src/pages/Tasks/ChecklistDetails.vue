<template>
  <q-page padding>
    <q-card style="min-height: 90vh">
      <q-card-section>
        <div class="row">
          <div class="col-12 q-pa-md text-h6"></div>

          <div class="col-12">
            <div class="q-pa-md text-subtitle1 text-center"></div>
          </div>

          <div class="col-12">
            <ChecklistDetails :default_options="default_options" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import ChecklistDetails from "../../components/Tasks/ChecklistDetails.vue";

export default {
  components: {
    ChecklistDetails,
  },

  data() {
    return {
      default_options: [
        {
          label: "Boas Condições",
          value: "good",
        },
        {
          label: "Amassado",
          value: "kneaded",
        },
        {
          label: "Falta",
          value: "lack",
        },
        {
          label: "Pique",
          value: "chop",
        },
        {
          label: "Quebrado",
          value: "broke",
        },
        {
          label: "Riscado",
          value: "scratched",
        },
        {
          label: "Trincado",
          value: "cracked",
        },
      ],
    };
  },
};
</script>