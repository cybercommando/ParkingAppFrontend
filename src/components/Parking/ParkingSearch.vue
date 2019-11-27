<template>
<div class="login-wrapper border border-light">
    <h3 style="text-align: center">Search Parkings</h3>
    <hr>
    <form class="form-signin" @submit.prevent="parkingSearch">
      <label for="inputLocation" class="sr-only">Location</label>
      <input v-model="Location" type="text" id="inputLocation" class="form-control" placeholder="Location" required autofocus>
      
      <label for="inputStartTime" class="sr-only">Start Time</label>
      <input v-model="StartTime" type="text" id="inputStartTime" class="form-control" placeholder="StartTime" required>
      
      <label for="inputEndTime" class="sr-only">EndTime</label>
      <input v-model="EndTime" type="text" id="inputEndTime" class="form-control" placeholder="EndTime" required>

      <button class="btn btn-lg btn-primary btn-block" type="submit">Search</button>
    </form>
    <hr>
    <table class="table">
        <thead>
            <tr>
                <th>S/n</th>
                <th>Location</th>
                <th>Category</th>
                <th>Free Min</th>
                <th>Rate(Hourly)</th>
                <th>Rate(RealTime)</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="parking in parkings" :key="parking.id">
                <td>{{parking.id}}</td>
                <td>{{parking.name}}</td>
                <td>{{parking.catname}}</td>
                <td>{{parking.freeminutes}}</td>
                <td>{{parking.ratehour}}</td>
                <td>{{parking.raterealtime}}</td>
                <td>{{parking.status}}</td>
            </tr>
        </tbody>
    </table>   
</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ParkingSearch',
  data () {
    return {
        Location: '',
        StartTime: '',
        EndTime: '',
        parkings: []
    }
  },
  methods: {
      async parkingSearch() {
      try{
        const {data} = await axios.post('http://localhost:4000/api/search/', {destination: this.Location, starttime: this.StartTime, endtime: this.EndTime}, { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
        this.parkings = data
      } catch(e) {
        console.log(e)
      }
    }
  },
  async created () {
      try {
          const {data} = await axios.get('http://localhost:4000/api/search/index', { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
          this.parkings = data
      } catch (e) {
          console.log(e)
      }
  }
}
</script>
