<template>
<div class="row">
  <div class="col-md-8">
    <div class="row">
      <fieldset>
        <legend>Search Parkings</legend>
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
      </fieldset>
    </div>
    <div class="row">
      <fieldset>
        <legend>Map</legend>
        <gmap-map v-bind:center = "center" v-bind:zoom= "12" style="height: 400px">
          <gmap-info-window v-bind:options="infoOptions" v-bind:position="infoWindowPos" v-bind:opened="infoWinOpen" @closeclick="infoWinOpen=false">
          </gmap-info-window>
          <gmap-marker
          v-bind:key= "index"
          v-for = "(m,index) in markers"
          v-bind:position = "m.position"
          v-bind:clickable = "true"
          @click="toggleInfoWindow(m,index)">
          </gmap-marker>
        </gmap-map>
      </fieldset>
    </div>
  </div>
  <div class="col-md-4">
    <fieldset>
      <legend>Booking</legend>
    </fieldset>
  </div>
  <!--<div class="row">
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
  </div>-->

</div>
</template>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.0/vue.js"></script>
  <script src="vue-google-maps.js"></script>

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
        center: {
          lat:58.3826467, 
          lng: 26.7321937
        },
        infoWindowPos: null,
        infoWinOpen: false,
        currentMidx: null,
        infoOptions: {
        content: '',
          //optional: offset infowindow so it visually sits nicely on top of our marker
          pixelOffset: {
            width: 0,
            height: -35
          }
        },
        markers: [
          {
            position: {lat:58.3826467, lng: 26.7321937}
          }
        ]
    }
  },
  methods: {
    toggleInfoWindow: function(marker, idx) {
      this.infoWindowPos = marker.position;
      this.infoOptions.content = marker.infoText;
      //check if its the same marker that was selected if yes toggle
      if (this.currentMidx == idx) {
        this.infoWinOpen = !this.infoWinOpen;
      }
      //if different marker set infowindow to open and reset current marker index
      else {
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    },
    async parkingSearch() {
      try{
        const {data} = await axios.post('http://localhost:4000/api/search/', {destination: this.Location, starttime: this.StartTime, endtime: this.EndTime}, { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
        this.parkings = data
        
        this.markers = []
        
        data.forEach(item => {
          var temp = {
            position: {
              lat:item['latitude'], 
              lng: item['longitude']
            },
            infoText: '<strong>'+ item['name'] +'</strong>'
          }
          this.markers.push(temp)            
        });

      } catch(e) {
        console.log(e)
      }
    }
  },
  async created () {
    this.markers = []
    try {
      const {data} = await axios.get('http://localhost:4000/api/search/index', { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
      this.parkings = data
      data.forEach(item => {
          var temp = {
            position: {
              lat:item['latitude'], 
              lng: item['longitude']
            },
            infoText: '<strong>'+ item["name"] + '</strong>'
          }
          this.markers.push(temp)            
        });
      } catch (e) {
        console.log(e)
    }
  }
}
</script>
