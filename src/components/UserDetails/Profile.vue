<template>
    <div>
        <form class="form-signin" @submit.prevent="userUpdate">
            <fieldset>
                <legend>Personal Information</legend>
                <label for="inputUsername" >Username</label>
                <input v-model="userData.username" type="text" id="inputUsername" class="form-control" placeholder="Username" required readonly>
                <label for="inputFullname" >Full Name</label>
                <input v-model="userData.full_name" type="text" id="inputFullname" class="form-control" placeholder="Full Name" required autofocus>
                <label for="inputEmail" >Email</label>
                <input v-model="userData.email" type="text" id="inputEmail" class="form-control" placeholder="Email" required >
                <label for="inputAge" >Age</label>
                <input v-model="userData.age" type="text" id="inputAge" class="form-control" placeholder="Age" required>
                <label for="inputAddress" >Address</label>
                <input v-model="userData.address" type="text" id="inputAddress" class="form-control" placeholder="Address" required>
            </fieldset>
            <hr />
            <fieldset>
                <legend>App Configurations</legend>
                <label for="paymentType">Payment Mode - (Realtime)</label>
                <select v-model="userData.paymentpreference" class="form-control">
                    <option value="EOP">Pay after Booking Ends</option>
                    <option value="EOM">Pay Monthly</option>
                </select>
            </fieldset>
            <hr />
            <button class="btn btn-lg btn-primary" style="float: right" type="submit">Save</button>
        </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Profile',
    data () {
        return {
        userData:''
        }
    },
    async created () {
        try {
            const {data} = await axios.get('http://localhost:4000/api/my_account', { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
            this.userData = data
        } catch (e) {
            console.log(e)
        }
    },
    methods: {
        async userUpdate() {
            try {
                const {data} = await axios.post('http://localhost:4000/api/users/update2', {id:this.userData.id,email:this.userData.email,address:this.userData.address,age:this.userData.age,is_active:this.userData.is_active,full_name:this.userData.full_name,usertype:this.userData.usertype,paymentpreference:this.userData.paymentpreference}, { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
                this.parkings = data
                this.$toasted.show('Success: Settings Saved',{
                    theme: "outline",
                    position: "top-right", 
                    duration : 2000
                })
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

