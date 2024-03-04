<template>
    <q-list>
        <q-expansion-item :content-inset-level="0.3" :icon="mItem.icon" :label="mItem.label" v-for="mItem in menus"
            :key="mItem.id" default-opened>
            <q-card v-for="(item, index) in mItem.menus" :key="index" class="icon-card" @click="click(item)">
                <q-card-section class="q-pa-md">
                    <q-avatar class="big-icon">
                        <q-icon :name="item.icon" size="50px" />
                    </q-avatar>
                </q-card-section>
                <q-card-section class="q-pa-md">
                    <div class="text-center">{{ $t(item.label) }}</div>
                </q-card-section>
            </q-card>
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
    created() {

    },
    methods: {
        ...mapActions({}),
        routeExists(routeName) {
            return this.$router.options.routes.some((route) => {
                if (route.children) return route.children.some((child) => routeName === child.name);
            });
        },
        click(route) {
            this.$emit("clickmenu", route);
            this.$router.push({ name: route.route });
        },
    },
};
</script>
  
<style scoped>
.icon-card {
    width: 45%;
    /* Adjust the width of the cards as needed */
    margin: 10px;
}

.big-icon {
    margin: auto;
}
</style>
  