<template>
<div>
  <div class="row">
    <h3 style="text-align: center">Search Parkings</h3>
    <hr>
    <form class="form-signin" @submit.prevent="parkingSearch">
      <div class="col-md-12">
        <div class="col-sm-3">
          <label for="inputLocation" class="sr-only">Location</label>
          <input v-model="Location" type="text" id="inputLocation" class="form-control" placeholder="Location" required autofocus>
        </div>
        <div class="col-sm-3">
          <label for="inputStartTime" class="sr-only">Start Time</label>
          <input v-model="StartTime" type="text" id="inputStartTime" class="form-control" placeholder="StartTime" required>
        </div>
        <div class="col-sm-3">
          <label for="inputEndTime" class="sr-only">EndTime</label>
          <input v-model="EndTime" type="text" id="inputEndTime" class="form-control" placeholder="EndTime" required>
        </div>
        <div class="col-sm-3">
          <button class="btn btn-sm btn-primary btn-block" type="submit">Search</button>
        </div>
      </div>
    </form>
  </div>
  <div class="row">
    <h2>Maps</h2>
    <gmap-map v-bind:center = "center" v-bind:zoom= "16" style="height: 400px ">
      <gmap-marker
      v-bind:key= "index"
      v-for = "(m,index) in markers"
      v-bind:position = "m.position"
      v-bind:clickable = "true">
      </gmap-marker>
    </gmap-map>
  </div>
  <div class="row">
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
        parkings: [],
        center: {lat:58.3826467, lng: 26.7321937},
        markers: [
          {
            position: {lat:58.3826467, lng: 26.7321937}
          }
        ]
    }
  },
  methods: {
    async parkingSearch() {
      try{
        const {data} = await axios.post('http://localhost:4000/api/search/', {destination: this.Location, starttime: this.StartTime, endtime: this.EndTime}, { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
        this.parkings = data

        data.forEach(item => {
          console.log("latitude",item['latitude'])
          console.log("longitude",item['longitude'])
          var temp = {
            position: {lat:item['latitude'], lng: item['longitude']}
          }
          this.markers.push(temp)            
        });

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
