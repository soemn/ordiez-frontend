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
      // http://localhost:3000/orders
      this.$http.get("https://rocky-bastion-42678.herokuapp.com/orders").then(
        response => {
          this.showAllOrders = response.body
        },
        response => {
          console.log(response)
        }
      )
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
    <!-- {{order}} -->
    <p>Order ID: {{order.order_id}}</p>
    <p>Delivery Date: {{order.delivery_date}} at {{order.delivery_time}}</p>
    <ul v-for="item in order.order_items">
      <li>
        {{item.name}}
      </li>
    </ul>
    <div v-if="order.feedback_submitted">
      <strong><p>Thank you for your feedback!</p></strong>
    </div>
    <div v-else>
      <button id="show-modal" @click="mutableShowModal = true">Give Feedback!</button>
      <modal v-if="mutableShowModal" @close="mutableShowModal = false" :order=order></modal>
    </div>
  </div>
  `
})

Vue.component("modal", {
  props: {
    order: {
      type: Object
    }
  },
  data: function() {
    return {
      message: this.message,
      delivery: this.delivery
    }
  },
  template: "#modal-template",
  methods: {
    submitFeedback: function() {
      let payload = []
      let deliveryFeedback = {
        ratable_id: this.order.id,
        ratable_type: "DeliveryOrder",
        rating: this.delivery,
        comment: this.message
      }
      payload.push(deliveryFeedback)

      this.order.order_items.map(food => {
        foodFeedback = {
          ratable_id: food.id,
          ratable_type: "OrderItem",
          rating: food.rating,
          comment: food.comment
        }
        payload.push(foodFeedback)
      })

      let postAddress =
        "https://rocky-bastion-42678.herokuapp.com/orders/" +
        this.order.order_id +
        "/feedbacks"

      // let postAddress =
      //   "http://localhost:3000/orders/" + this.order.order_id + "/feedbacks"

      {
        this.$http
          .post(postAddress, {
            feedbacks: payload
          })
          .then(
            response => {
              response.status
              response.statusText
              response.headers.get("Expires")
              this.someData = response.body

              alert("Success! Thank you for your feedback")

              vm.getData()
            },
            response => {
              // error callback
              console.log(response)
            }
          )
      }
    }
  }
})

vm.getData()
