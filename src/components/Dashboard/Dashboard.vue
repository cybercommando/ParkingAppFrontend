<template>
  <div>
    <!-- Fixed navbar -->
    <nav class="navbar navbar-default navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <router-link class="navbar-brand" to="/Home">ParkingApp |</router-link>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li><router-link to="/UsersList">Users</router-link></li>
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Parkings <span class="caret"></span></a>
              <ul class="dropdown-menu">
                <li><router-link to="/ParkingList">Parking List</router-link></li>
                <li><router-link to="/ParkingSearch">Search</router-link></li>
                <li role="separator" class="divider"></li>
                <li class="dropdown-header">Booking</li>
                <li><router-link to="/BookingList">My Bookings</router-link></li>
              </ul>
            </li>
            <li><router-link to="/PaymentHistory">Payment</router-link></li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{{user_fullname}} <span class="caret"></span></a>
              <ul class="dropdown-menu">
                <li><router-link to="/Profile">Profile</router-link></li>
                <li><router-link to="/ChangePassword">Change Password</router-link></li>
                <li role="separator" class="divider"></li>
                <li><a @click="logout">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>

    <div class="container">

      <!-- Main component for a primary marketing message or call to action -->
      <div class="jumbotron">
        <router-view />
      </div>
    </div> <!-- /container -->
  </div>
</template>

<script>

import { Socket} from 'phoenix-socket'

export default {
  name: 'Dashboard',
  data () {
    return {
      msg: 'Welcome to Parking App',
      user_fullname: ''
    }
  },
  methods: {
    logout: function () {
      this.$store.dispatch('logout')
      .then(() => {
        this.$router.push('/')
        })
    }
  },
  // Notification Engine using Phoenix Socket and Channel
  mounted() { 
      this.userID = localStorage.getItem('userID')
      this.userName = localStorage.getItem('userName')
      let socket = new Socket("ws://agile-project-tartu-university.appspot.com/socket")
      socket.connect();
      this.channel = socket.channel(`user:${this.userID}`)
      this.channel.join()
      this.channel.on('new_link_added', payload => {
      this.$toasted.show('Hi '+ this.userName + " " + payload.link.data,{ 
                      theme: "bubble", 
                      position: "top-right", 
                      duration : 10000,
                      action : [
                        {
                        text : 'Ignore',
                          onClick : (e, toastObject) => {
                              toastObject.goAway(0);
                      }}
                        ,{
                          text : 'Extend',
                          push : { name: 'ExtendBooking', params: { bk: payload.link.booking } , // Not yet done completely
                            // this will prevent toast from closing
                            dontClose : true
                          }

    }]}
    )
      });
    },
  created () {
    this.user_fullname = localStorage.getItem('userName')
    this.$router.push('/Home')
  }
}
</script>

