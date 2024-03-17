<template>
  <q-list>
    <q-expansion-item
      :content-inset-level="0.3"
      class="home-menu"
      :icon="mItem.icon"
      :label="mItem.label"
      v-for="(mItem, mIndex) in menus"
      :key="mItem.id"
      default-opened
    >
      <div class="row q-col-gutter-md">
        <div
          class="q-pa-md col-md-3 col-sm-6 col-lg-2 col-xl-1 col-sm-6 col-xs-12 d-flex flex-wrap justify-between"
          v-for="(item, index) in mItem.menus"
          :key="index"
        >
          <q-card
          class="icon-card"
            @click="click(item)"
            :style="{
              backgroundColor: getCardBackground(
                mIndex.toString() + index.toString()
              ),
            }"
          >
            <q-card-section class="q-pa-md">
              <q-avatar class="big-icon">
                <q-icon :name="item.icon" size="50px" />
              </q-avatar>
            </q-card-section>
            <q-card-section class="q-pa-md">
              <div class="text-center">{{ $t(item.label) }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-expansion-item>
  </q-list>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {};
  },

  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
    }),
    menus() {
      return this.$copyObject(this.$store.getters["theme/menus"]);
    },
  },
  created() {},
  methods: {
    ...mapActions({}),
    routeExists(routeName) {
      return this.$router.options.routes.some((route) => {
        if (route.children)
          return route.children.some((child) => routeName === child.name);
      });
    },
    click(route) {
      this.$emit("clickmenu", route);
      this.$router.push({ name: route.route });
    },
    getCardBackground(index) {
      const colors = [
        "#ff6f61", // Vermelho
        "#6b5b95", // Roxo
        "#88b04b", // Verde
        "#f8b500", // Amarelo
        "#4a4e4d", // Cinza
        "#003f5c", // Azul Escuro
      ];
      return colors[parseInt(index) % colors.length];
    },
  },
};
</script>

<style scoped>
.icon-card {
  cursor: pointer;
}
.home-menu {
  width: 100%;
}

.big-icon {
  margin: auto;
}
</style>
