<template>
  <q-btn round dense flat color="grey-8" icon="notifications">
            <q-badge
            v-if="notifications.length > 0"
              color="red"
              text-color="white"
              floating
            >
            {{notifications.length}}
            </q-badge>
            <q-tooltip>Notificações</q-tooltip>
          </q-btn>
</template>



<script>
import { mapActions, mapGetters } from "vuex";
import API from "@controleonline/quasar-common-ui/src/utils/api";

export default {
  props: {
    peopleId: {
      required: true,
    },
  },

  data() {
    return {
      API: new API(this.$store.getters["auth/user"].token),
      company: null,
      notifications: [],
    };
  },

  created() {
  },

  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
    }),
  },

  watch: {
    myCompany(company) {
      this.company = company;
      this.getNotifications();
    },
  },

  methods: {
    ...mapActions({}),

    getNotifications() {
      console.log(this.peopleId);
      return this.API.private(`/task_interations`, {
        params: { registeredBy: '/people/'+this.peopleId },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result['hydra:member']);
          this.notifications = result['hydra:member'];
        });
    },

    click(route) {
      this.$emit("clickmenu", route);
    },
  },
};
</script>