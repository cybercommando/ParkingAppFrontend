<template>
    <div class="row">
        <h2 style="text-align: center">Confirm Booking</h2>
        <fieldset>
            <legend>Parking Details</legend>
            <div class="col-md-6">
                <h4 style="font-weight: bold">Parking Slot Details</h4>
                <h5><span style="font-weight: bold">Parking Slot:</span> {{bookingData.ParkingSlotDetails.name}}</h5>
                <h5><span style="font-weight: bold">Parking Zone:</span> {{bookingData.ParkingSlotDetails.catname}}</h5>
                <h5><span style="font-weight: bold">Free Minutes:</span> {{bookingData.ParkingSlotDetails.freeminutes}}</h5>
                <h5><span style="font-weight: bold">Hourly Rate:</span> {{bookingData.ParkingSlotDetails.ratehour}}</h5>
                <h5><span style="font-weight: bold">Real Time Rate:</span> {{bookingData.ParkingSlotDetails.raterealtime}}</h5>
                <h5><span style="font-weight: bold">Start Time:</span> {{bookingData.start_time | formatDate}}</h5>
                <h5><span style="font-weight: bold">End Time:</span> {{bookingData.end_time | formatDate}}</h5>
            </div>
            <div class="col-md-6">
                <h4 style="font-weight: bold">Payment Summary</h4>
                <h5><span style="font-weight: bold">Estimated Hourly Rate:</span> {{bookingData.hourlyprice}}</h5>
                <h5><span style="font-weight: bold">Estimated Real Time Rate:</span> {{bookingData.realtimeprice}}</h5>
                <h5><span style="font-weight: bold">Payment Type:</span> {{bookingData.calc_criteria | PaymentType}}</h5>
                <h5><span style="font-weight: bold">Payment Mode - (for Real Time):</span> {{userData.paymentpreference}}</h5>
                <h2><span style="font-weight: bold">Amount:</span> {{amount}}</h2>
            </div>
        </fieldset>
        <fieldset>
        <legend>Payment Details</legend>
        <form class="form-signin" @submit.prevent="parkingConfirmation">
            <div class="col-md-5">
                <div class="col-sm-12">
                    <label for="CardName">Name on Card</label>
                    <input v-model="CardName" type="text" id="CardName" class="form-control" placeholder="Name on Card" required autofocus>
                </div>
                <div class="col-sm-12">
                    <label for="CardNumber">Card Number</label>
                    <input v-model="CardNumber" type="text" id="CardNumber" class="form-control date" placeholder="Card Number" required>
                </div>
            </div>
            <div class="col-md-5">
                <div class="col-sm-12">
                    <label for="CVV">CVV</label>
                    <input v-model="CVV" type="text" id="CVV" class="form-control" placeholder="CVV" required autofocus>
                </div>
                <div class="col-sm-12">
                    <label for="ExpiryDate">Expiry Date</label>
                    <input v-model="ExpiryDate" type="date" id="ExpiryDate" class="form-control date" placeholder="ExpiryDate" required>
                </div>
            </div>
            <div class="col-md-2">
                <button class="btn btn-lg btn-success" type="submit" style="float: right">Confirm</button>
            </div>
        </form>
        </fieldset>
  </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'PaymentConfirm',
    data () {
        return {
        userData:'',
        bookingData: '',
        //Payment Details
        CardName:'',
        CardNumber:'',
        CVV:'',
        ExpiryDate:'',
        paymentStatus: '',
        amount: '',
        bookingId: ''
        }
    },
    async created () {
        this.bookingData = this.$route.params.bd;
        if(this.bookingData.calc_criteria == "1")
        {
            this.amount = this.bookingData.hourlyprice
            this.paymentStatus = 'COMPLETED'
        }
        else {
            this.amount = '0'
            this.paymentStatus = 'PENDING'
        }
        try {
            const {data} = await axios.get('http://localhost:4000/api/my_account', { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
            this.userData = data
        } catch (e) {
            console.log(e)
        }
    },
    methods: {
        async parkingConfirmation() {
            //Creating Booking
            try{
                const {data} = await axios.post('http://localhost:4000/api/bookings/new', {start_time: this.bookingData.start_time, end_time: this.bookingData.end_time, parking_id: this.bookingData.parking_id, calc_criteria: this.bookingData.calc_criteria}, { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
                this.bookingId = data.id
                
                await axios.post('http://localhost:4000/api/payments/create', {cardno: this.CardNumber, nameoncard: this.CardName, expirydate: this.ExpiryDate, cvv: this.CVV, amount: this.amount, status: this.paymentStatus, booking_id: this.bookingId}, { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
                
                this.$toasted.show('Success: Booking Confirmed',{
                    theme: "outline",
                    position: "top-right", 
                    duration : 2000
                })
                this.$router.push('/BookingList')
            } catch(e) {
                console.log(e)
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
</script>

