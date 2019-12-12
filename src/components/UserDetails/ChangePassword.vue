<template>
    <div>
        <form class="form-signin" @submit.prevent="userUpdatePassword">
            <fieldset>
                <legend>Change Password</legend>
                <label for="newPassword" >New Password</label>
                <input v-model="newPassword" type="password" id="newPassword" class="form-control" placeholder="New Password" required >
                <label for="newPasswordRetype" >Retype New Password</label>
                <input v-model="newPasswordRetype" type="password" id="newPasswordRetype" class="form-control" placeholder="Retype New Password" required >
                <hr />
                <button class="btn btn-sm btn-primary" style="float: right" type="submit">Change</button>
            </fieldset>
        </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'ChangePassword',
    data () {
        return {
            userData: '',
            newPassword: '',
            newPasswordRetype: ''
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
        async userUpdatePassword() {
            try {
                if(this.newPassword === this.newPasswordRetype){
                    const {data} = await axios.post('http://localhost:4000/api/users/update', {id:this.userData.id,password:this.newPassword}, { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
                    this.$toasted.show('Success: Password Changed',{
                        theme: "outline",
                        position: "top-right", 
                        duration : 2000
                    })
                }
                else{
                    this.$toasted.show('Warning: Both passwords must be same !!!',{
                        theme: "bubble",
                        position: "top-right",
                        duration : 2000
                    })
                }
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
