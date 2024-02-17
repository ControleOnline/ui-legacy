
<script>
import { DOMAIN } from 'src/config/domain';
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
      const themeColors = this.defaultCompany.theme.colors || {};
      Object.keys(themeColors).forEach(key => {
        document.documentElement.style.setProperty(`--${key}`, themeColors[key]);
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
  },
  data() {
    return {
      themeLoaded: false
    };
  },
};
</script>