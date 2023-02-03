<template>
  <q-btn round dense flat color="grey-8" icon="notifications">
      <q-badge v-if="notifications.length > 0" color="red" text-color="white" floating>
          {{ notifications.length }}
      </q-badge>
      <q-tooltip>Notificações</q-tooltip>
      <q-menu>
      <template v-for="notfication in notifications ">
              <q-list style="min-width: 100px">
                  <q-separator></q-separator>

                  <q-item clickable v-close-popup @click="redirecionaTasks(notfication)">

                      <q-item-section>{{ notfication.id + ' ' + notfication.body }}</q-item-section>
                  </q-item>

              </q-list>
          </template>
      </q-menu>

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
          notificationsUnread: 0,
          taskId: '',
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
          return this.API.private(`/task_interations`, {
              params: { registeredBy: '/people/' + this.peopleId },
          })
              .then((response) => response.json())
              .then((result) => {
                  this.notifications =result['hydra:member'];
              });
      },
      redirecionaTasks(task) {
          // this.$router.push("/tasks/id/" + task.replace('/tasks',''))
      },

      click(route) {
          this.$emit("clickmenu", route);
      },
  },
};
</script>