
export default {
  data() {
    return {
      Routes: {
        Details: {
          name: 'Details',
          get(id) {
            return {
              name  : this.name,
              params: {
                id: id
              }
            }
          }
        },
      },
    }
  },
}
