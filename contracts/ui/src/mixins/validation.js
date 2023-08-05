
export default {
  methods: {
    isInvalid(key) {
      return val => {
        switch (key) {
          case 'email':
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
              return this.translate('messages.email_invalid');
            }
          break;

          case 'phone':
            if (!/^\d{10,11}$/.test(val)) {
              return this.translate('messages.value_invalid');
            }
          break;

          case 'time':
            if (!/^\d{2}:\d{2}:\d{2}$/.test(val)) {
              return this.translate('messages.value_invalid');
            }
          break;

          case 'date':
            if (!/^\d{2}[-\/]\d{2}[-\/]\d{4}$/.test(val)) {
              return this.translate('messages.value_invalid');
            }
          break;

          default:
            if (!(val && val.length > 0)) {
              return this.translate('messages.field_required');
            }
        }

        return true;
      };
    },
  },
}
