<template>
    <form @submit.prevent="handleSubmit">
        <h4>Create New Customer</h4>
        <input type="text" placeholder="Full Name" v-model="name" required>
        <input type="text" placeholder="Phone Number" v-model="phoneNumber" maxlength="10" minlength="10" required>
        <input type="email" placeholder="Email Address" v-model="email">
        <div class="error">{{ error }}</div>
        <button v-if="!isPending">Create</button>
        <button v-else disabled>Saving...</button>
    </form>
</template>

<script>
import { ref } from 'vue'
import useCollection from '@/composables/useCollection'
import getUser from '@/composables/getUser'
import { timestamp } from '@/firebase/config'
import router from '@/router'

export default {
    setup(){
        
        const { error, addDoc } = useCollection('customers')
        const { user } = getUser()

        const name = ref('')
        const phoneNumber = ref('')
        const email = ref('')
        const isPending = ref(false)

        const handleSubmit = async () => {
            isPending.value = true
            await addDoc({
                name: name.value,
                phoneNumber: phoneNumber.value,
                email: email.value,
                enteredBy: user.value.displayName,
                createdAt: timestamp(), 
                lastVisitDate: timestamp(),
                orders: []
            })
            isPending.value = false
            if(!error.value){
                console.log('customer added')
                router.push({name: 'Home'})
            }
        }
        return { name, phoneNumber, email, handleSubmit, error, isPending }
    }
}
</script>

<style scoped>
form {
    background: white;
}
button {
    margin-top: 20px;
}
</style>