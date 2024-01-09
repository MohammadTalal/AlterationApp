<template>
    <div class="home">
        <div v-if="error" class="error">Could not fetch the data</div>
        <div v-if="documents && user">
            <div class="searchBox">
                <button class="btn" @click="createNewCustomer()">
                    Add New Customer
                </button>
                <input type="text" name="search" id="search" placeholder="Search for Customer By Phone Number..." maxlength="10" v-model="requiredCustomer"> 
            </div>
            <CustomerList :customers="documents"/>
        </div>
        <div v-if="!user">
            <h2 class="text-center">You are not logged in.</h2>
            <h2 class="text-center"><a href="/login">Log in</a></h2>
        </div>

    </div>
</template>

<script>
import getCollection from '@/composables/getCollection';
import CustomerList from '@/components/CustomersList.vue';
import getUser from '@/composables/getUser'
import router from '@/router';
import {ref, computed} from 'vue'
export default {
    name: 'HomeView',
    components: { CustomerList },
    setup() {
        const requiredCustomer = ref('')
        const { error, documents } = getCollection('customers')
        const { user } = getUser()
    
        const createNewCustomer = () => {
            router.push({name: "CreateCustomer"})
        }

        const filteredDocuments = computed(() => {
            if (!requiredCustomer.value) {
                return documents.value;
            }
            const searchQuery = requiredCustomer.value;
            return documents.value.filter((customer) =>
                customer.phoneNumber?.includes(searchQuery)
            );
        });

        return { error, documents: filteredDocuments, user, createNewCustomer, requiredCustomer } 
    },
}
</script>

<style scoped>
@import "@/assets/main.css";
.btn {
    width: 15%;
    height: 40px;
    margin: 5px 10px;
}
.backgroundGreen {
    background: green;
}
.searchBox {
    width: 100%;
    margin: auto 10%;
}
.searchBox input {
    font-size: 1.2rem;
    float: left;
    width: 60%;
    height: 50px;
    margin: 0 auto !important;
    border-radius: 5px !important;
}
a {
    text-decoration: underline;
}
</style>