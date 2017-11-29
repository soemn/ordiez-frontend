const vm = new Vue({
  el: "#app",
  data: {
    showAllOrders: "",
    user: { name: "Ernesto" }
  },
  template: `
    <div>
      <h1>Hi {{ user.name }}</h1>
      <h2>Thank you for ordering with us. Your feedback is important in helping us imporve and design new exciting meals in the future.</h2>
      <div v-for="order in showAllOrders.orders">
        <order-item :order=order></order-item>
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

Vue.component("order-item", {
  props: {
    order: {
      type: Object
    },
    showModal: false
  },
  data: function() {
    return {
      mutableShowModal: this.showModal
    }
  },
  template: `
  <div>
    {{order}}
    <p>Order ID: {{order.order_id}}</p>
    <p>Delivery Date: {{order.delivery_date}} at {{order.delivery_time}}</p>

    <button id="show-modal" @click="mutableShowModal = true">Give Feedback!</button>
    <modal v-if="mutableShowModal" @close="mutableShowModal = false" :order=order></modal>
  </div>
  `,
  methods: {
    submitFeedback: function() {
      console.log("submited" + this.order.id)
    }
  }
})

Vue.component("modal", {
  props: {
    order: {
      type: Object
    }
  },
  template: "#modal-template",
  methods: {
    submitFeedback: function() {
      console.log("submited " + this.order.id)
    }
  }
})

vm.getData()
