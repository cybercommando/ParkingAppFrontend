<template>
<div class="row">
  <div class="col-md-8">
    <div class="row">
      <fieldset>
        <legend>Search Parkings</legend>
        <form @submit.prevent="parkingSearch">
          <div class="col-md-12">
            <div class="col-sm-4">
              <label for="inputLocation">Location</label>
              <input v-model="Location" type="text" id="inputLocation" placeholder="Location" required autofocus>
            </div>
            <div class="col-sm-4">
              <label for="inputStartTime">Start Time</label>
              <!-- <date-picker id="st" name="start_time" v-model="StartTime"></date-picker> -->
              <datetime type="datetime" id="st" v-model="StartTime"></datetime>
              <!--enddate <input v-model="StartTime" type="text" id="inputStartTime" class="form-control date" placeholder="StartTime" required> -->
            </div>
            <div class="col-sm-4">
              <label for="inputEndTime">EndTime</label>
              <!-- <date-picker id="et" name="end_time" v-model="EndTime"></date-picker> -->
              <datetime type="datetime" id="et" v-model="EndTime" :min-datetime="StartTime"></datetime>
              <!-- <input v-model="EndTime" type="text" id="inputEndTime" class="form-control date" placeholder="EndTime" required> -->
            </div>
          </div>
          <div class="col-sm-12">
              <hr />
              <button class="btn btn-sm btn-primary btn-block" id="searchButton" style="float: right" type="submit">Search</button>
          </div>
        </form>
      </fieldset>
    </div>
    <div class="row">
      <br />
      <fieldset>
        <gmap-map v-bind:center = "center" v-bind:zoom= "12" style="height: 400px">
          <gmap-info-window v-bind:options="infoOptions" v-bind:position="infoWindowPos" v-bind:opened="infoWinOpen" @closeclick="infoWinOpen=false">
          </gmap-info-window>
          <gmap-marker
          v-bind:key= "index"
          v-for = "(m,index) in markers"
          v-bind:position = "m.position"
          v-bind:clickable = "true"
          v-bind:animation = "2"
          @click="toggleInfoWindow(m,index)">
          </gmap-marker>
        </gmap-map>
      </fieldset>
    </div>
  </div>
  <div class="col-md-4">
    <div class="col-sm-12">
      <fieldset>
        <legend>Location Details</legend>
        <div class="col-sm-12">
          <label>Parking Slot: {{parkingObj.name}} </label>
        </div>
        <div class="col-sm-12">
          <label>Parking Zone: {{parkingObj.catname}} </label>
        </div>
        <div class="col-sm-12">
          <label>Free Minutes: {{parkingObj.freeminutes}} </label>
        </div>
        <div class="col-sm-12">
          <label>Hourly Rate: {{parkingObj.ratehour}} </label>
        </div>
        <div class="col-sm-12">
          <label>Real Time Rate: {{parkingObj.raterealtime}} </label>
        </div>  
        <div class="col-sm-6">
          <label for="extHourly">Estimated Hourly Rate:</label>
          <input v-model="HourlyPrice" type="text" class="form-control" readonly>
        </div>
        <div class="col-sm-6">
          <label for="estRealTime">Estimated RealTime Rate:</label>
          <input v-model="RealTimePrice" type="text" class="form-control" readonly>
        </div>
      </fieldset>
    </div>
    <div class="col-sm-12">
      <br />
      <fieldset>
        <legend>Booking Confirmation</legend>
        <form class="form" @submit.prevent="parkingPayment">
          <div class="col-md-12">
            <input v-model="FinalLocation" type="text" id="inputLocation" class="form-control" placeholder="Location" required readonly style="display: none">
            <input v-model="FinalStartDate" type="text" id="inputLocation" class="form-control" placeholder="Location" required readonly style="display: none">
            <input v-model="FinalEndDate" type="text" id="inputLocation" class="form-control" placeholder="Location" required readonly style="display: none">
            <div class="col-sm-12">
              <label for="inputEndTime">Payment Type</label>
              <!-- <input v-model="FinalPaymentType" type="text" id="inputEndTime" class="form-control date" placeholder="EndTime" required> -->
              <select v-model="FinalPaymentType" class="form-control">
                <option value="1" selected>Hourly</option>
                <option value="2">Real Time</option>
              </select>
            </div>
            <div class="col-sm-12">
              <br />
              <button class="btn btn-sm btn-success btn-block" :disabled="FinalPaymentButton" type="submit">Payment</button>
            </div>
            
          </div>
        </form>
      </fieldset>
    </div>
    
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

<script>
import moment from 'moment';
import datePicker from 'vue-bootstrap-datetimepicker';

import { Datetime } from 'vue-datetime'
// You need a specific loader for CSS files
import 'vue-datetime/dist/vue-datetime.css'

// You have to add CSS yourself
import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css';
// Bootstrap css  
import 'bootstrap/dist/css/bootstrap.css';

import axios from 'axios'
import strip_bom from 'strip-bom';

function formatDateFun(value){
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY hh:mm:ss a')
  }
}


export default {
  name: 'ParkingSearch',
  data () {
    return {
        Location: '',
        StartTime: new Date(),
        EndTime: new Date(),
        parkings: [],
        parkingObj: {},
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
        ],
        
        //Confirmation DataFields
        FinalLocation: '',
        FinalStartDate:'',
        FinalEndDate:  '',
        FinalPaymentType: '1',
        // Price Calculation
        HourlyPrice: '0',
        RealTimePrice: '0',

        //Booking Data
        BookingData: {}
    }
  },
  components:{
    datePicker,
    datetime: Datetime
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
      this.parkingObj = this.parkings[idx];
      
      //Setting Final Confirmation Details
      this.FinalLocation = this.parkingObj.id;
      this.FinalStartDate = this.StartTime;
      this.FinalEndDate = this.EndTime;

      //Calculating Price using time
      if(this.EndTime != String.empty && this.StartTime != String.empty) {
        function diff_hours(dt2, dt1) 
        {
          var diff =(dt2.getTime() - dt1.getTime()) / 1000;
          diff /= (60 * 60);
        //   return Math.abs(Math.ceil(diff));
        //   return Math.abs(diff);
          return Math.ceil(Math.abs(diff));
        }
        function diff_mins(dt2, dt1) 
        {
          var diff =(dt2.getTime() - dt1.getTime()) / 1000;
          diff /= (60);
          return Math.abs(Math.round(diff));
        }
        var timeStart = new Date(this.StartTime);
        var timeEnd = new Date(this.EndTime);
        this.HourlyPrice = this.parkingObj.ratehour * diff_hours(timeStart,timeEnd)
        this.RealTimePrice = this.parkingObj.raterealtime * Math.abs(Math.ceil((diff_mins(timeStart,timeEnd)/5)))
      }
      this.FinalPaymentButton = false;
    },
    async parkingSearch() {
      try{
        const {data} = await axios.post('https://parkingapp.gigalixirapp.com/api/search/', {destination: this.Location, starttime: this.StartTime, endtime: this.EndTime}, { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
        this.parkings = data
        
        this.markers = []
        
        data.forEach(item => {
          var temp = {
            position: {
              lat:item['latitude'], 
              lng: item['longitude']
            },
            infoText: '<strong>'+ item['name'] +'</strong>',
            catname: item["catname"] 
          }
          this.markers.push(temp)            
        });

      } catch(e) {
        console.log(e)
      }
    },
    parkingPayment (){
        this.BookingData.start_time= this.FinalStartDate
        this.BookingData.end_time= this.FinalEndDate
        this.BookingData.parking_id= this.FinalLocation
        this.BookingData.calc_criteria= this.FinalPaymentType
        this.BookingData.ParkingSlotDetails= this.parkingObj
        this.BookingData.hourlyprice= this.HourlyPrice
        this.BookingData.realtimeprice= this.RealTimePrice

        if(this.FinalPaymentType == '1' ){
            if(this.BookingData.start_time == '' || this.BookingData.end_time == ''){
                this.$toasted.show('Error: Please Enter a Valid End Time for Hourly Payment',{
                        type: "Error",
                        theme: "bubble", 
                        position: "top-right", 
                        duration : 2000
                    })
            }
            else{
                this.$router.push({ name: 'PaymentConfirm', params: { bd: this.BookingData }})
            }
        }else{
            if(this.BookingData.start_time == ''){
                this.$toasted.show('Error: Please Enter a Valid Start Time for Realtime Payment',{
                        type: "Error",
                        theme: "bubble", 
                        position: "top-right", 
                        duration : 2000
                    })
            }
            else{
                this.$router.push({ name: 'PaymentConfirm', params: { bd: this.BookingData }})
            }
        }

        

    //   try{
    //     const {data} = await axios.post('https://parkingapp.gigalixirapp.com/api/bookings/new', {start_time: this.FinalStartDate, end_time: this.FinalEndDate, parking_id: this.FinalLocation, calc_criteria: this.FinalPaymentType}, { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
    //     this.parkings = data
    //     alert('Booking Created')
    //     this.$router.push('/BookingList')
    //   } catch(e) {
    //     console.log(e)
    //     alert('Error:'+ e)
    //   }
    }
  },
  async created () {
    this.FinalPaymentButton = true;
    this.markers = []
    try {
      // $('.date').datetimepicker();
      const {data} = await axios.get('https://parkingapp.gigalixirapp.com/api/search/index', { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
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
