export function translate(store, value, type) {
  if (this.$te(store + "." + type + "." + value))
    return this.$t(store + "." + type + "." + value);
  else if (this.$te("default." + type + "." + value))
    return this.$t("default." + type + "." + value);
  else return this.$t(store + "." + type + "." + value);
}
