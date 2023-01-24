<template>
  <q-page>
    <MenuDefaultHeader
      :title="$t('concluded_guides_header')"
      icon="o_history"
    >
    </MenuDefaultHeader>

    <q-item>
      <q-item-section>
        <q-item-label class="text-bold">
          {{ $t('see_where_you_been') }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <CardGuidesCustomers
      v-for="(guide, index) in next_guides"
      :key="index"
      :image_guide="guide.image_guide"
      :title_guide="guide.title_guide"
      :provider="guide.provider"
      :date="guide.date"
    >
    </CardGuidesCustomers>
  </q-page>
</template>

<script>
import MenuDefaultHeader from '@controleonline/quasar-common-ui/src/components/Header/MenuDefaultHeader';
import CardGuidesCustomers from '@controleonline/quasar-common-ui/src/components/Card/CardGuidesCustomers';

export default {
  components: {
    MenuDefaultHeader,
    CardGuidesCustomers,
  },

  computed: {
    next_guides: {
      get() { return this.$store.getters['Guides/getNextGuides']; },
      set(value) { this.$store.commit('Guides/setNextGuides', { next_guides: value }); },
    },
  },
};
</script>
