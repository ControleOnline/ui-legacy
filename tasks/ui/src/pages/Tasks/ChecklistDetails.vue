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
            <ChecklistDetails
                :wheels_options="wheels_options"
                :accessories_options="accessories_options"
                :carcase_options="carcase_options"
            />
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
      carcase_options: [
        {
          label: "Bom",
          value: "good",
        },
        {
          label: "Regular",
          value: "steady",
        },
        {
          label: "Ruim",
          value: "poor",
        }
      ],
      accessories_options: [
        {
          label: "Sim",
          value: "yes",
        },
        {
          label: "Não",
          value: "no",
        }
      ],
      wheels_options: [
        {
          label: "Bom",
          value: "good",
        },
        {
          label: "Regular",
          value: "steady",
        },
        {
          label: "Ruim",
          value: "poor",
        },
        {
          label: "Falta",
          value: "missed",
        }
      ]
    };
  },
};
</script>
