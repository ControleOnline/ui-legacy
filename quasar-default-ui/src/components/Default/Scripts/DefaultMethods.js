export function translate(value, type) {
  if (this.configs && this.$te(this.configs.store + "." + type + "." + value))
    return this.$t(this.configs.store + "." + type + "." + value);
  else if (this.$te("default." + type + "." + value))
    return this.$t("default." + type + "." + value);
  else
    return this.$t(this.configs.store + "." + type + "." + value);
}