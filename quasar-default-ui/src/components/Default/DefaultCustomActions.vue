<template>
  <q-btn :dense="btnDense" :color="btnColor ? btnColor : 'primary'" :label="btnTitle" :icon="btnIcon" :flat="btnFlat">
    <q-menu>
      <q-list>
        <template v-for="(itm, idx) in items" :key="idx">
          <q-item clickable v-close-popup @click="open(idx, itm)">
            <q-item-section v-if="itm.icon" side>
              <q-icon size="sm" :name="itm.icon"></q-icon>
            </q-item-section>
            <q-item-section>
              {{ itm.title }}
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-menu>
  </q-btn>

  <template v-for="(itm, idx) in items" :key="idx">
    <q-dialog v-if="component" persistent v-model="openModal[idx]">
      <div style="max-width: 90vw">
        <component :is="component" :row="row" @loadData="loadData" />
      </div>
    </q-dialog>
  </template>
</template>

<script>
export default {
  name: 'DefaultCustomActionsComponent',

  props: {
    componentProps: Object,
    row: Object
  },

  data() {
    return {
      openModal: [],
      component: false,
    }
  },

  created() {
    if (!this.componentProps.items) this.items = [];

    for (let k in this.componentProps) {
      this[k] = this.componentProps[k];
    }
  },
  methods: {
    open(idx, itm) {
      this.openModal = [];
      this.component = itm.component;
      this.openModal[idx] = true;
    },
    loadData() {
      this.$emit('loadData')
    }
  }
}
</script>
