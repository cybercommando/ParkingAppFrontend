<template>
<div class="row">
    <div class="col-lg-12">
        <h3 style="text-align: center">Pending List</h3>
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
                        <button type="button" v-on:click="btnSelectpayment( payment)" class=" btn btn-sm btn-success">Pay It</button>
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
          const {data} = await axios.get('http://localhost:4000/api/payments', { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
          this.paymentList = data
      } catch (e) {
          console.log(e)
      }
      try {
          const {data} = await axios.get('http://localhost:4000/api/payments/pending', { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
          this.paymentPendingList = data
      } catch (e) {
          console.log(e)
      }
  },
  methods: {
      btnSelectpayment ( payment) {
          function diff_mins(dt2, dt1) {
              var diff =(dt2.getTime() - dt1.getTime()) / 1000;
              diff /= (60);
              return Math.round(diff);
          }
          var nd = new Date();
          var ed = new Date( payment.end_time);

          if(diff_mins(ed,nd) <= 2){
              alert('You cant extend time now');
          } else if ( payment.status === 'CANCELLED'){
              alert('You cant extend time now');
          }
          else{
              this.$router.push({ name: 'Extend payment', params: { bk:  payment } })
          }
          this.selectedpayment =  payment;
      },
      async btnCancelClick( paymentObj){
          try {
              const {data} = await axios.post('http://localhost:4000/api/ payments/cancel', {id:  paymentObj.id}, { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
          } catch(e) {
              alert('Error:'+ e)
          }
          
          try {
              const {data} = await axios.get('http://localhost:4000/api/ payments', { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
              this. paymentList = data
          } catch (e) {
              console.log(e)
          }
      }
  }
}
</script>
