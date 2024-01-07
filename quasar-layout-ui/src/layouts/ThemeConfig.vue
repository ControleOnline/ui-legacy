
<script>
import { DOMAIN } from 'src/config/domain';
import { mapActions, mapGetters } from "vuex";


export default {
  name: "ThemeConfig",
  components: {},
  methods: {
    setTheme() {

      if (!this.peopleDefaultCompany || this.themeLoaded)
        return;

      const themeConfig = {
        productName: this.peopleDefaultCompany.alias,
        productDescription: 'CRM',
        iconPath: '/images/favicon.ico',
        colors: {
          primary: '#19AFBD',
          secondary: '#2e3092',
        }
      };

      this.setTitle(themeConfig);
      this.setIcon(themeConfig);
      this.setColors(themeConfig);
      this.themeLoaded = true;
    },
    setColors(themeConfig) {
      Object.keys(themeConfig.colors).forEach((key) => {
        document.documentElement.style.setProperty(`--${key}`, themeConfig.colors[key]);
      });
    },
    setIcon(themeConfig) {
      const faviconLink = document.querySelector('link[rel="icon"]');
      if (faviconLink && themeConfig.iconPath) {
        faviconLink.href = themeConfig.iconPath;
      }
    },
    setTitle(themeConfig) {
      document.title = themeConfig.productName;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.content = themeConfig.productDescription;
      }
    }
  },

  created() {
    this.setTheme();
  },
  watch: {
    peopleDefaultCompany() {
      this.setTheme();
    }
  },
  computed: {
    ...mapGetters({
      peopleDefaultCompany: "people/defaultCompany",
    }),
  },
  data() {
    return {
      themeLoaded: false
    };
  },
};
</script>