<template>
  <q-btn :dense="btnDense" :color="btnColor ? btnColor : 'primary'" :label="btnTitle" :icon="btnIcon" :flat="btnFlat">
    <q-menu>
      <q-list>
        <q-item v-for="(itm, idx) in items" :key="idx" clickable v-close-popup @click="itm.action($props)">
          <q-item-section v-if="itm.icon" side>
            <q-icon size="sm" :name="itm.icon"></q-icon>
          </q-item-section>
          <q-item-section>
            {{ itm.title }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
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

    }
  },

  created() {
    if (!this.componentProps.items) this.items = [];

    for (let k in this.componentProps) {
      this[k] = this.componentProps[k];
    }
  }

}
</script>
