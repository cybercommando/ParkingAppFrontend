import Vue from 'vue'
import Router from 'vue-router'
//import HelloWorld from '@/components/HelloWorld'

//Login Components
import Login from '@/components/Login'

//Dashboard Components
import Dashboard from '@/components/Dashboard/Dashboard'
import Home from '@/components/Home'

//Users Components
import Signup from '@/components/Register'
import UsersList from '@/components/UsersList'
import store from '../store'

import Profile from '@/components/UserDetails/Profile'
import ChangePassword from '@/components/UserDetails/ChangePassword'

//Parking Components
import ParkingList from '@/components/Parking/ParkingList'
import ParkingSearch from '@/components/Parking/ParkingSearch'

//Booking Components
import BookingList from '@/components/Booking/BookingList'
import ExtendBooking from '@/components/Booking/ExtendBooking'

//Payment Components
import PaymentConfirm from '@/components/Payment/PaymentConfirm'
import PaymentHistory from '@/components/Payment/PaymentHistory'

Vue.use(Router)

//===============================================================================
//Routing Paths
let router =  new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      meta: {
        requiresAuth: false,
        loginPage: true
      }
    },
    {
      path: '/Signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/Home',
          name: 'Home',
          component: Home
        },
        {
          path: '/Profile',
          name: 'Profile',
          component: Profile
        },
        {
          path: '/ChangePassword',
          name: 'ChangePassword',
          component: ChangePassword
        },
        {
          path: '/userslist',
          name: 'UsersList',
          component: UsersList
        },
        {
          path: '/parkinglist',
          name: 'ParkingList',
          component: ParkingList
        },
        {
          path: '/parkingsearch',
          name: 'ParkingSearch',
          component: ParkingSearch
        },
        {
          path: '/PaymentConfirm/:bd',
          name: 'PaymentConfirm',
          component: PaymentConfirm
        },
        {
          path: '/PaymentHistory',
          name: 'PaymentHistory',
          component: PaymentHistory
        },
        {
          path: '/bookinglist',
          name: 'BookingList',
          component: BookingList
        },
        {
          path: '/extendbooking/:bk',
          name: 'ExtendBooking',
          component: ExtendBooking
        }
      ]
    }
  ]
})

//Handling Router Requests
router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
        next ()
        return
    }
    next('/')
  }
  // else if (to.matched.some(record => record.meta.loginPage)) {
  //   if (store.getters.isLoggedIn) {
  //     next('/dashboard')
  //     return
  //   }
  //   next('/')
  // }
  else {
    next ()
  }
})

// Making router default
export default router