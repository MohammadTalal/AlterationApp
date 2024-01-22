<template>
    <div class="home">
        <div v-if="error" class="error">Could not fetch the data</div>
        <div v-if="documents && user">
            <div class="subwrapper">
                <div class="searchBox">
                    <input type="text" name="search" id="search" placeholder="Search for Customer By Phone Number..." maxlength="10" v-model="requiredCustomer"> 
                    <button class="btn" @click="createNewCustomer()">
                        <font-awesome-icon icon="fa-solid fa-user-plus" />
                        New Customer
                    </button>
                    <button class="btn" style="margin-left:5px;">
                        <font-awesome-icon icon="fa-solid fa-calendar-day" />
                        Today's Orders
                    </button>
                </div>
            </div>
            <CustomerList :customers="documents"/>
        </div>
        <div v-if="!user">
            <h2 class="text-center">You are not logged in.</h2>
            <h2 class="text-center">
                <router-link :to="{ name: 'Login' }">
                    Log in
                </router-link>
            </h2>
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
    margin: 5px;
}
.backgroundGreen {
    background: green;
}
.subwrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 !important;
}
.searchBox {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;
}
.searchBox input {
    font-size: 1.2rem;
    float: left;
    height: 50px;
    margin: 0 !important;
    border-radius: 5px !important;
    width: 70%;
}
a {
    text-decoration: underline;
}
</style>