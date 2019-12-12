<template>
  <div class="border border-light row">
      <div class="col-md-6">
          <form class="form" @submit.prevent="extendBooking">
              <h2 style="text-align: center">Enter new extended time</h2>
              <label for="inputId" >Id</label>
              <input v-model="bookingDetails.id" type="text" id="inputId" class="form-control" placeholder="Username" required readonly>
              <label for="inputstart_time" >Start Time</label>
              <input v-model="bookingDetails.start_time" type="text" id="inputstart_time" class="form-control" placeholder="Password" required readonly>
              <label for="inputend_time" >End Time</label>
              <input v-model="bookingDetails.end_time" type="text" id="inputend_time" class="form-control" placeholder="Password" required readonly>
              <label for="inputnew_end_time" >New End Time</label>
              <!-- <input v-model="new_end_time" type="text" id="inputnew_end_time" class="form-control" placeholder="Password" required autofocus> -->
              <date-picker v-model="newEndTime"></date-picker>
              <hr />
              <button class="btn btn-sm btn-default" type="button" @click="goBack()">Back</button>
              <button class="btn btn-sm btn-success" type="submit">Extend</button>
          </form>
      </div>
      <div class="col-md-6">
          <form class="form" @submit.prevent="extendBookingPayment">
              <h2 style="text-align: center">Payment</h2>
              <label for="Amount" >Amount</label>
              <input v-model="amount" type="text" id="Amount" class="form-control" placeholder="Amount" required readonly>
              <label for="CardName" >Name on Card</label>
              <input v-model="CardName" type="text" id="CardName" class="form-control" placeholder="Name on Card" required >
              <label for="CardNumber" >Card Number</label>
              <input v-model="CardNumber" type="text" id="CardNumber" class="form-control" placeholder="Card Number" required >
              <label for="CVV" >CVV</label>
              <input v-model="CVV" type="text" id="CVV" class="form-control" placeholder="CVV" required >
              <label for="inputnew_end_time" >Expiry Date</label>
              <!-- <input v-model="new_end_time" type="text" id="inputnew_end_time" class="form-control" placeholder="Password" required autofocus> -->
              <date-picker v-model="ExpiryDate"></date-picker>
              <hr />
              <div style="float: right">
                  <!-- <button class="btn btn-sm btn-default" type="button" @click="goBack()">Back</button> -->
                  <button class="btn btn-sm btn-success" :disabled="FinalPaymentButton" type="submit">Pay It</button>
              </div>
          </form>
      </div>
    
  </div>
</template>

<script>
import moment from 'moment';
import datePicker from 'vue-bootstrap-datetimepicker';
// You have to add CSS yourself
import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css';
// Bootstrap css  
import 'bootstrap/dist/css/bootstrap.css';

import axios from 'axios'

function formatDateFun(value){
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY hh:mm:ss a')
  }
}

export default {
  name: 'ExtendBooking',
  data () {
    return {
        newEndTime: new Date(),
        bookingDetails: '',
        //Payment Details
        CardName:'',
        CardNumber:'',
        CVV:'',
        ExpiryDate: new Date(),
        paymentStatus: '',
        amount: '0',
        bookingId: ''
        
    }
  },
  created (){
      this.bookingDetails = this.$route.params.bk;
      this.bookingId = this.bookingDetails.id;
      this.FinalPaymentButton = true;
  },
  components:{
    datePicker
  },
  methods: {
    async extendBooking() {
        function diff_hours(dt2, dt1) {
            var diff =(dt2.getTime() - dt1.getTime()) / 1000;
            diff /= (60 * 60);
            return Math.ceil(Math.abs(diff));
        }
        try{
            //Get Hourly Rate
            var parkingId = this.bookingDetails.parking_id
            const {data} = await axios.post('https://parkingapp.gigalixirapp.com/api/search/get_detail', {parking_id: parkingId}, { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
            var HRate = data.ratehour
            var oldEndTime = new Date(this.bookingDetails.end_time)
            var newEndTime = new Date(this.newEndTime)
            //Calculating Amount
            this.amount = HRate * diff_hours(oldEndTime,newEndTime)
            //Enabling Button
            this.FinalPaymentButton = false;
        }catch(e){
            this.$toasted.show(e,{
                            type: "Error",
                            theme: "bubble", 
                            position: "top-right", 
                            duration : 2000
                        })
        }
    },
    async extendBookingPayment(){
        try {
            await axios.post('https://parkingapp.gigalixirapp.com/api/bookings/update', {id: this.bookingDetails.id, start_time: this.bookingDetails.start_time, end_time: this.newEndTime, calc_criteria: this.bookingDetails.calc_criteria}, { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
            
            await axios.post('https://parkingapp.gigalixirapp.com/api/payments/create', {cardno: this.CardNumber, nameoncard: this.CardName, expirydate: this.ExpiryDate, cvv: this.CVV, amount: this.amount, status: 'COMPLETED', booking_id: this.bookingId}, { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
            
            // alert('Your booking No: '+ this.bookingDetails.id +' is extended');
            this.$toasted.show('Success: Your booking No: '+ this.bookingDetails.id +' is Extended',{
                    theme: "outline",
                    position: "top-right", 
                    duration : 2000
                })
            this.$router.push('/BookingList')
        } catch(e) {
            this.$toasted.show(e,{
                            type: "Error",
                            theme: "bubble", 
                            position: "top-right", 
                            duration : 2000
                        })
        } 
    },
    goBack() {
      this.$router.push('/BookingList')
    }
  }
}
</script>

<style lang="css">

.err-message {
  text-align: center;
  color: red;
}

.login-wrapper {
  background: #D1D1D1;
  width: 60%;
  margin: 5% auto;
}

.form-signin {
  max-width: 330px;
  padding: 10% 15px;
  margin: 0 auto;
}
.form-signin .form-signin-heading,
.form-signin .checkbox {
  margin-bottom: 10px;
  text-align: center;
}
.form-signin .checkbox {
  font-weight: normal;
}
.form-signin .form-control {
  position: relative;
  height: auto;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="username"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
