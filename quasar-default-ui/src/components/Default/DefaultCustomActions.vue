<template>
  <q-btn :dense="btnDense" :color="componentProps.btnColor ? componentProps.btnColor : 'primary'"
    :label="componentProps.btnTitle" :icon="componentProps.btnIcon" :flat="componentProps.btnFlat">
    <q-menu>
      <q-list>
        <template v-for="(itm, idx) in componentProps.items" :key="idx">
          <q-item clickable v-close-popup @click="fire" v-if="getPermission(itm)">
            <q-item-section v-if="itm.icon" side>
              <q-icon size="sm" :name="itm.icon"></q-icon>
            </q-item-section>
            <q-item-section>
              {{ itm.title }}
            </q-item-section>
            <component :is="itm.component" :componentProps="componentProps" :row="row" @loadData="loadData"
              :fire="fired" />
          </q-item>
        </template>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
export default {
  name: 'DefaultCustomActionsComponent',
  emits: ['loadData'],
  props: {
    componentProps: Object,
    row: Object
  },

  data() {
    return {
      fired: false,
      key: 0
    }
  },
  created() {
  },
  methods: {
    getPermission(itm) {
      if (typeof itm.permission == 'function')
        return itm.permission(this.row);

      return itm.permission != false;
    },
    fire() {
      this.fired = true;
      this.key++;
      setTimeout(() => {
        this.fired = false;
      }, 200);
    },
    loadData() {
      this.$emit('loadData')
    }
  }
}
</script>