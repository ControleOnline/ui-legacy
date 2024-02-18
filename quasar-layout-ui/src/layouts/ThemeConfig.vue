
<script>
import { mapActions, mapGetters } from "vuex";


export default {
  name: "ThemeConfig",
  components: {},
  methods: {
    setTheme() {
      if (!this.defaultCompany || this.themeLoaded)
        return;

      this.setTitle();
      this.setColors();
      this.themeLoaded = true;
    },
    setTitle() {
      document.title = this.defaultCompany.alias;
    },
    setColors() {
      Object.keys(this.colors).forEach(key => {
        document.documentElement.style.setProperty(`--${key}`, this.colors[key]);
      });
    }
  },

  created() {
    this.setTheme();
  },
  watch: {
    defaultCompany() {
      this.setTheme();
    }
  },
  computed: {
    ...mapGetters({
      defaultCompany: "people/defaultCompany",
    }),
    colors() {
      return this.$store.state.theme.colors;
    }
  },
  data() {
    return {
      themeLoaded: false
    };
  },
};
</script>
<style lang="scss">
:root {
  @each $key, $value in v-bind(colors) {
    --#{$key}: #{$value};
  }
}
</style>