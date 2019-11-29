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
            </tr>
        </thead>
        <tbody>
            <tr v-for="booking in bookingList" :key="booking.id">
                <td>{{booking.id}}</td>
                <td>{{booking.start_time}}</td>
                <td>{{booking.end_time}}</td>
                <td>{{booking.calc_criteria}}</td>
                <td>{{booking.parking_id}}</td> <!-- get parking object with it, to show parking place name -->
                <td>{{booking.status}}</td>
            </tr>
        </tbody>
    </table>   
</div>
</template>

<script>
import axios from 'axios'

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
        bookingList: []
    }
  },
  async created () {
      try {
          const {data} = await axios.get('http://localhost:4000/api/bookings/all', { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
          this.bookingList = data
      } catch (e) {
          console.log(e)
      }
  }
}
</script>
