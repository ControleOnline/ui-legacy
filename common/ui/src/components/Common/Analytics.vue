<script>
import { BrowserAgent } from '@newrelic/browser-agent/src/loaders/browser-agent';
import Analytics from "@controleonline/quasar-common-ui/src/components/Common/Analytics";

import { mapActions } from "vuex";

export default {
  mounted() {
    this.config().then((config) => {
      if (config['google-tag-manager'] !== null)
        Analytics.init({
          gtmId: config['google-tag-manager'],
        });
    });
  },
  created() {
    /* global configs */
    if (process.env.NEW_RELIC?.LICENSE_KEY)
      this.newrelic();
  },
  methods: {
    ...mapActions({
      config: "config/appConfig",
    }),
    newrelic() {
      const options = {
        init: {
          distributed_tracing: { enabled: true },
          privacy: { cookies_enabled: true },
          ajax: { deny_list: [process.env.NEW_RELIC.BEACON, process.env.NEW_RELIC.ERROR_BEACON] },
        }, // NREUM.init
        info: {
          beacon: process.env.NEW_RELIC.BEACON,
          errorBeacon: process.env.NEW_RELIC.ERROR_BEACON,
          licenseKey: process.env.NEW_RELIC.LICENSE_KEY,
          applicationID: process.env.NEW_RELIC.APPLICATION_ID,
          sa: 1,
        }, // NREUM.info
        loader_config: {
          accountID: process.env.NEW_RELIC.ACCOUNT_ID,
          trustKey: process.env.NEW_RELIC.TRUST_KEY,
          agentID: process.env.NEW_RELIC.APPLICATION_ID,
          licenseKey: process.env.NEW_RELIC.LICENSE_KEY,
          applicationID: process.env.NEW_RELIC.APPLICATION_ID,
        }, // NREUM.loader_config
      };
      new BrowserAgent(options);
    },
  },
};
</script>
