<template>
  <q-btn round dense flat color="grey-8" icon="notifications">
    <q-badge v-if="notifications.length > 0" color="red" text-color="white" floating>
      {{ notificationsUnread }}
    </q-badge>
    <q-tooltip>Notificações</q-tooltip>
    <q-menu>
      <template v-for="notfication in notifications">
        <q-list style="min-width: 100px">
          <q-separator></q-separator>

          <q-item clickable v-close-popup @click="redirecionaTasks(notfication)">
            <q-item-section>{{ notfication.notification }}</q-item-section>
          </q-item>
        </q-list>
      </template>
    </q-menu>
  </q-btn>
</template>

<script>
import { api } from "@controleonline/../../src/boot/api";
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    peopleId: {
      required: true,
    },
  },

  data() {
    return {
      company: null,
      notifications: [],
      notificationsUnread: 0,
      taskId: "",
    };
  },

  created() {
    this.getNotifications();
  },

  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
    }),
  },

  watch: {
    myCompany(company) {
      this.company = company;
    },
  },

  methods: {
    ...mapActions({}),

    getNotifications() {
      let params = {};
      params["people.id"] = this.peopleId;
      params["read"] = 0;
      params.itemsPerPage = 10;

      return api
        .fetch(`/notifications`, {
          params,
        })

        .then((result) => {
          this.notifications = result["hydra:member"];
          this.notificationsUnread = result["hydra:totalItems"];
        });
    },
    redirecionaTasks(notfication) {
      this.$router.push({ name: notfication.route, params: { id: notfication.routeId } });
    },

    click(route) {
      this.$emit("clickmenu", route);
    },
  },
};
</script>
