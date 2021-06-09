
export default {
  data() {
    return {
      routes: {
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
