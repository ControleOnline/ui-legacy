import myFetch from "@controleonline/quasar-common-ui/src/api/fetch";
import axios from "axios";
import { DOMAIN } from "../../../../../config/domain";

const MIME_TYPE = "application/ld+json";
export const api = {
  fetch: function (uri, options = {}) {
    if (typeof options.headers === "undefined")
      Object.assign(options, { headers: new Headers() });

    let token = this.getToken();
    if (token) options.headers.set("API-TOKEN", token);

    options.headers.set("Content-Type", MIME_TYPE);
    options.headers.set("Accept", MIME_TYPE);
    options.headers.set("App-Domain", DOMAIN);

    if (options.body && typeof options.body != "string") {
      options.body = JSON.stringify(options.body);
    }

    if (options.params) {
      uri = this.buildQueryString(uri, options);
    }

    return myFetch(uri, options).catch((e) => {
      if (e.message == "Unauthorized" || e.message == "Invalid credentials.") {
        //myStore.dispatch("auth/logOut");
        //localStorage.set("session", null);
        //location.reload();
      }
    });
  },
  getToken() {
    // Obtém o valor da sessão e converte de volta para um objeto
    const sessionString = localStorage.getItem("session");
    let session = null;

    if (sessionString) {
      try {
        const cleanString = sessionString.startsWith("__q_objt|")
          ? sessionString.substring("__q_objt|".length)
          : sessionString;

        session = JSON.parse(cleanString); // Transforma a string em objeto
      } catch (e) {
        console.error("Failed to parse session from localStorage", e);
      }
    }
    return session?.token;
  },
  serialize(obj, prefix) {
    const pairs = [];
    for (const key in obj) {
      const value = obj[key];
      let fullKey = prefix ? `${prefix}[${key}]` : key;
      if (typeof value === "object" && value !== null) {
        Object.keys(value).forEach((k) => {
          pairs.push(`${key}[${k}]=${value[k]}`);
        });
      } else if (Array.isArray(value)) {
        fullKey = `${fullKey}[]`;
        value.forEach((val) => {
          pairs.push(`${fullKey}=${val}`);
        });
      } else {
        pairs.push(`${fullKey}=${value}`);
      }
    }
    return pairs;
  },

  buildQueryString(uri, options) {
    if (options.params) {
      const params = this.serialize(options.params);
      uri = `${uri}?${params.join("&")}`;
    }
    return uri;
  },
  execute: function (params) {
    return axios(params);
  },
};
