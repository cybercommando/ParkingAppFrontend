<template>
<div class="border border-light">
    <h3 style="text-align: center">My Booking(s) History</h3>
    <table class="table">
        <thead>
            <tr>
                <th>S/n</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Payment Type</th>
                <th>Parking Place</th>
                <th>Status</th>
                <th>Options</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="booking in bookingList" :key="booking.id">
                <td>{{booking.id}}</td>
                <td>{{booking.start_time | formatDate}}</td>
                <td>{{booking.end_time | formatDate}}</td>
                <td>{{booking.calc_criteria | PaymentType}}</td>
                <td>{{booking.parking_id}}</td> <!-- get parking object with it, to show parking place name -->
                <td>{{booking.status}}</td>
                <td>
                    <!-- <button type="button" @click="btnExtendClick(booking.id)" class=" btn btn-sm btn-success">Extend</button> -->
                    <!-- <button type="button" @click="btnCancelClick(booking.id)" class=" btn btn-sm btn-danger">Cancel</button> -->
                    <button type="button" v-on:click="btnSelectBooking(booking)" class=" btn btn-sm btn-success">Extend</button>
                    <!-- <button type="button" v-on:click="btnCancelClick(booking)" class=" btn btn-sm btn-danger">End</button> -->
                    <button type="button" v-on:click="btnEndClick(booking)" class=" btn btn-sm btn-danger">End</button>
                </td>
            </tr>
        </tbody>
    </table>
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
  name: 'BookingList',
  data () {
    return {
        // bookingModel:{
        //     start_time: '',
        //     end_time: '',
        //     status: '',
        //     calc_criteria: 0,
        //     user_id: 0,
        //     parking_id: 0
        // },
        ExtendTime: new Date(),
        bookingList: [],
        selectedBooking: ''
    }
  },
  async created () {
      try {
          const {data} = await axios.get('http://localhost:4000/api/bookings', { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
          this.bookingList = data
      } catch (e) {
          console.log(e)
      }
  },
  methods: {
      btnSelectBooking (booking) {
          function diff_mins(dt2, dt1) {
              var diff =(dt2.getTime() - dt1.getTime()) / 1000;
              diff /= (60);
              return Math.round(diff);
          }
          var nd = new Date();
          var ed = new Date(booking.end_time);

          if(diff_mins(ed,nd) <= 2){
              
              this.$toasted.show('Error: You cant extend time now',{
                    type: "Error",
                    theme: "bubble", 
                    position: "top-right", 
                    duration : 2000
                })
          } else if (booking.status === 'CANCELLED'){
              this.$toasted.show('Error: You cant extend time now',{
                    type: "Error",
                    theme: "bubble", 
                    position: "top-right", 
                    duration : 2000
                })
          } else if (booking.calc_criteria == '2'){
              this.$toasted.show('Error: Realtime Booking type cant Extend',{
                    type: "Error",
                    theme: "bubble", 
                    position: "top-right", 
                    duration : 2000
                })
          }
          else{
              this.$router.push({ name: 'ExtendBooking', params: { bk: booking } })
          }
          this.selectedBooking = booking;
      },
      async btnEndClick(bookingObj){
          if( bookingObj.status == 'COMPLETED' || bookingObj.status == 'CANCELLED'){
              this.$toasted.show('Error: Completed Bookings can not be Ended Again !!!',{
                        type: "Error",
                        theme: "bubble", 
                        position: "top-right", 
                        duration : 2000
                    })
          }else {
            function diff_mins(dt2, dt1) 
            {
                var diff =(dt2.getTime() - dt1.getTime()) / 1000;
                diff /= (60);
                return Math.abs(Math.round(diff));
            }
            var currentDatetime = new Date();
            try {
                if(bookingObj.calc_criteria == '1'){
                    await axios.post('http://localhost:4000/api/bookings/end', {id: bookingObj.id, end_time: currentDatetime}, { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
                }else if(bookingObj.calc_criteria == '2'){
                    await axios.post('http://localhost:4000/api/bookings/end', {id: bookingObj.id, end_time: currentDatetime}, { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
                    const {data} = await axios.post('http://localhost:4000/api/search/get_detail', {parking_id: bookingObj.parking_id}, { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
                    var rate = data.raterealtime
                    var date_start = formatDateFun(bookingObj.start_time)
                    var mins = Math.abs(Math.ceil((diff_mins(new Date(date_start),currentDatetime)/5)))
                    
                    //Calculating Price
                    var RealTimePrice = rate * mins

                    //payments/updateamountRT
                    await axios.post('http://localhost:4000/api/payments/updateamountRT', {booking_id: bookingObj.id,amount: RealTimePrice, status: 'PENDING'}, { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
                    
                    //Redirection to payment
                    if(localStorage.getItem('paymentPreference') == 'EOP'){
                        const {data} = await axios.post('http://localhost:4000/api/payments/updatestatusRT', {booking_id:  bookingObj.id, status: 'COMPLETED'}, { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
                        this.$toasted.show('Amount is deducted from your account',{
                        theme: "outline",
                        position: "top-right", 
                        duration : 5000 })
                    }else {
                        this.$toasted.show('Payment Preference is: Monthly Payment (You will can pay After )',{
                        theme: "outline",
                        position: "top-right", 
                        duration : 5000 })
                    }
                }
                this.$toasted.show('Success: Booking Ended',{
                    theme: "outline",
                    position: "top-right", 
                    duration : 2000 })
                const {data} = await axios.get('http://localhost:4000/api/bookings', { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
                this.bookingList = data
            } catch(e) {
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
}
</script>
