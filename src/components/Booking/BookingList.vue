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
                    <button type="button" @click="btnExtendClick(booking)" class=" btn btn-sm btn-success" data-toggle="modal" data-target="#extendModal">Extend</button>
                    <button type="button" v-on:click="btnCancelClick(booking)" class=" btn btn-sm btn-danger">Cancel</button>
                </td>
            </tr>
        </tbody>
    </table> 
        <!-- Modal -->
    <div id="extendModal" class="modal fade" role="dialog">
        <div class="modal-dialog">

            <!-- Modal content-->
            <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Extend Booking</h4>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="usr">Extend Time:</label>
                    <!-- <date-picker v-model="ExtendTime"></date-picker> -->
                    <input type="text" class="form-control" id="usr">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-success">
                    <span class="glyphicon glyphicon-floppy-disk"></span> Save
                </button>
            </div>
            </div>

        </div>
    </div>  
</div>
</template>

<script>
// import moment from 'moment';
// import datePicker from 'vue-bootstrap-datetimepicker';
// // You have to add CSS yourself
// import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css';
// // Bootstrap css  
// import 'bootstrap/dist/css/bootstrap.css';

import Vue from 'vue'
import VueSweetAlert from 'vue-sweetalert'

import axios from 'axios'

Vue.use(VueSweetAlert)

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
        // ExtendTime: new Date(),
        bookingList: [],
    }
  },
  async created () {
      try {
          const {data} = await axios.get('http://localhost:4000/api/bookings/all', { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
          this.bookingList = data
      } catch (e) {
          console.log(e)
      }
  },
  methods: {
      btnExtendClick (bookingObj) {
          console.log("bookingObj",bookingObj);
      },
      btnCancelClick(bookingObj){
          this.$swal(
              {
                    title: 'Are you sure?',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, cancel it!",
                    cancelButtonText: "No, keep safe!"
              }, 
                async function(isConfirm) {
                    if (isConfirm) {
                        // handle confirm
                        try {
                            const {data} = await axios.post('http://localhost:4000/api/bookings/cancel', {id: bookingObj.id}, { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
                        } catch(e) {
                            alert('Error:'+ e)
                        }
                        
                        try {
                            const {data} = await axios.get('http://localhost:4000/api/bookings/all', { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
                            this.bookingList = data
                        } catch (e) {
                            console.log(e)
                        }
                    } else {
                        this.$swal("Cancelled", "Your booking is saved back to your list", "error");
                        // handle all other cases
                    }
                }
          )
      }
    //   async btnCancelClick(id){
    //       try {
    //           const {data} = await axios.post('http://localhost:4000/api/bookings/cancel', {id: id}, { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
    //       } catch(e) {
    //           alert('Error:'+ e)
    //       }
          
    //       try {
    //           const {data} = await axios.get('http://localhost:4000/api/bookings/all', { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
    //           this.bookingList = data
    //       } catch (e) {
    //           console.log(e)
    //       }
    //   }
  }
}
</script>
