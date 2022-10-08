<template>
  <q-page>
    <MenuDefaultHeader
      :title="$t('view_edit_guide_header')"
      :save_button="false"
      icon="collections_bookmark"
    >
    </MenuDefaultHeader>
    <CardListGuides
      v-for="(item, index) in list"
      :key="item.user_name"
      :id="item.id"
      :index="index"
      :title_guide="item.title_guide"
      :price="item.price"
      :images_slide="item.images_slide"
      :image_profile="item.image_profile"
      :user_name="item.user_name"
      :assessment="item.assessment"
      :difficulty="item.difficulty"
      :distance="item.distance"
      :duration="item.duration"
      :vacancies="item.vacancies"
      :edit="true">
    </CardListGuides>
  </q-page>
</template>

<script>
import CardListGuides from '@controleonline/quasar-common-ui/src/components/card/CardListGuides';
import MenuDefaultHeader from '@controleonline/quasar-common-ui/src/components/header/MenuDefaultHeader';

export default {
  components: {
    MenuDefaultHeader,
    CardListGuides,
  },

  computed: {
    list: {
      get() { return this.$store.getters['Guides/getGuidesList']; },
      set(value) { this.$store.commit('Guides/setGuidesList', { list: value }); },
    },
  },
};
</script>
