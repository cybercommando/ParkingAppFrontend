<template>
<div class="row">
    <div class="col-lg-12">
        <h3 style="text-align: center">Pending Payments</h3>
        <table class="table">
            <thead>
                <tr>
                    <th>S/n</th>
                    <th>Booking Id</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Options</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for=" payment in paymentPendingList" :key=" payment.id">
                    <td>{{ payment.id}}</td>
                    <td>{{ payment.booking_id}}</td>
                    <td>{{ payment.start_time | formatDate}}</td>
                    <td>{{ payment.end_time | formatDate}}</td>
                    <td>{{ payment.amount}}</td>
                    <td>{{ payment.status}}</td>
                    <td>
                        <!-- <button type="button" @click="btnExtendClick( payment.id)" class=" btn btn-sm btn-success">Extend</button> -->
                        <!-- <button type="button" @click="btnCancelClick( payment.id)" class=" btn btn-sm btn-danger">Cancel</button> -->
                        <button type="button" v-on:click="btnPaymentClick(payment)" class=" btn btn-sm btn-success">Pay It</button>
                        <!-- <button type="button" v-on:click="btnCancelClick( payment)" class=" btn btn-sm btn-danger">Cancel</button> -->
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <hr />
    <div class="col-lg-12">
        <h3 style="text-align: center">My Payment(s) History</h3>
        <table class="table">
            <thead>
                <tr>
                    <th>S/n</th>
                    <th>Booking Id</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Amount</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for=" payment in paymentList" :key=" payment.id">
                    <td>{{ payment.id}}</td>
                    <td>{{ payment.booking_id}}</td>
                    <td>{{ payment.start_time | formatDate}}</td>
                    <td>{{ payment.end_time | formatDate}}</td>
                    <td>{{ payment.amount}}</td>
                    <td>{{ payment.status}}</td>
                </tr>
            </tbody>
        </table>
    </div>

    
</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'PaymentHistory',
  data () {
    return {
        paymentList: '',
        paymentPendingList: ''
    }
  },
  async created () {
      try {
          const {data} = await axios.get('https://parkingapp.gigalixirapp.com/api/payments', { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
          this.paymentList = data
      } catch (e) {
          this.$toasted.show(e,{
                        type: "Error",
                        theme: "bubble", 
                        position: "top-right", 
                        duration : 2000
                    })
      }
      try {
          const {data} = await axios.get('https://parkingapp.gigalixirapp.com/api/payments/pending', { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
          this.paymentPendingList = data
      } catch (e) {
          this.$toasted.show(e,{
                        type: "Error",
                        theme: "bubble", 
                        position: "top-right", 
                        duration : 2000
                    })
      }
  },
  methods: {
      async btnPaymentClick(paymentObj){
          try {
              const {data} = await axios.post('https://parkingapp.gigalixirapp.com/api/payments/updatestatus', {id:  paymentObj.id, status: 'COMPLETED'}, { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
              this.$toasted.show('Success: Pending Payment Cleared',{
                    theme: "outline",
                    position: "top-right", 
                    duration : 2000 })
          } catch(e) {
              this.$toasted.show(e,{
                        type: "Error",
                        theme: "bubble", 
                        position: "top-right", 
                        duration : 2000
                    })
          }
          
          try {
                const {data} = await axios.get('https://parkingapp.gigalixirapp.com/api/payments', { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
                this.paymentList = data
            } catch (e) {
                this.$toasted.show(e,{
                                type: "Error",
                                theme: "bubble", 
                                position: "top-right", 
                                duration : 2000
                            })
            }
            try {
                const {data} = await axios.get('https://parkingapp.gigalixirapp.com/api/payments/pending', { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
                this.paymentPendingList = data
            } catch (e) {
                this.$toasted.show(e,{
                                type: "Error",
                                theme: "bubble", 
                                position: "top-right", 
                                duration : 2000
                            })
            }   
      }
  }
}
</script>
