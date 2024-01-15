<template>
    <div class="orders">
        <div v-if="error" class="error">Could not fetch the data</div>
        <div v-if="user" >
            
            <div style="display:flex;justify-content:space-between;">
                <CreateService />
                <button class="checkout-button" :class="{ 'pulsate': serviceAddedFlag }">
                    <font-awesome-icon icon="fa-solid fa-cart-shopping" />
                    Check Out <span style="color:green;font-size:1rem">{{ numberOfServices }}</span>
                </button>
            </div>
            <div class="wrapper"> 
                <div class="single" v-for="(service, index) in services" :key="index" >
                    <div class="info">
                        {{ service.serviceName }}
                    </div>
                    <div class="order-number">
                        <div class="price">
                            ${{ Number(service.servicePrice).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}
                        </div>
                        <button @click="addToCart(service)">
                            <font-awesome-icon icon="plus" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!user">
            <h2 class="text-center">You are not logged in.</h2>
            <h2 class="text-center"><a href="/login">Log in</a></h2>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import getUser from '@/composables/getUser'
import getServices from '@/composables/getServices';
import CreateService from './CreateService.vue';

export default {
    name: 'ServicesView',
    components: { CreateService },
    setup() {
        const { error, services } = getServices('services')
        const { user } = getUser()
        const numberOfServices  = ref(0)
        const cartItems = ref([])
        const serviceAddedFlag = ref(false)
    
        const addToCart =  (service) => {
            numberOfServices.value += 1
            cartItems.value.push(service)
            console.log(cartItems.value)
            serviceAddedFlag.value = true
            setTimeout(() => {
                serviceAddedFlag.value = false
            }, 1000);
            
        }
        return { error, user, services, addToCart, numberOfServices, serviceAddedFlag } 
    },

}
</script>

<style lang="scss" scoped>

.wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.single {
    width: 30%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    float: left;
    padding: 1%;
    border-radius: 10px;
    background: white;
    transition: all ease 0.2s;
    margin-top: 10px;
}
.price {
    font-weight: bold !important;
    padding-right: 25px;
}
.order-number {
    display: flex;
    align-items: center;
    margin-left: auto;
}
button:hover {
    box-shadow: 1px 2px 3px rgba(50, 50, 50, 0.05);
    transform: scale(1.02);
    transition: all ease 0.2s;
    cursor: pointer;
}
button.checkout-button {
  /* Add your button styles here */
    color: black;
    transition: background-color 0.3s ease, color 0.3s ease;
}
button.checkout-button.pulsate {
    animation: pulsate 1s infinite;
}

@keyframes pulsate {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}
</style>