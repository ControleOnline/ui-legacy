
export default {
  data() {
    return {
      Params: {
        Company: {
          getter() {
            return null
          },

          get() {
            return this.getter();
          }
        },
        ViewType: {
          getter() {
            return null
          },

          get() {
            return this.getter();
          }
        },
      },
    }
  },
}
