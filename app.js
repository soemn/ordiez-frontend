const vm = new Vue({
  el: "#app",
  data: {
    showAllOrders: "",
    user: { name: "Ernesto" }
  },
  template: `
    <div>
      <h1>Hi {{ user.name }}</h1>
      <div v-for="order in showAllOrders.orders">
        {{ order }}
        <br>
        <br>
      </div>
    </div>
  `,
  methods: {
    getData() {
      this.$http.get("http://localhost:3000/orders").then(
        response => {
          this.showAllOrders = response.body
        },
        response => {
          console.log(response)
        }
      )
    },

    showOrderItem() {
      //
    }
  }
})

vm.getData()
