<template>
    <div v-for="customer in customers" :key="customer.id" @click="goToOrders(customer.phoneNumber)" class="wrapper">
        <div class="single">
            <div class="thumbnail">
                <img src="../assets/user.png" alt="Customer Icon">
            </div>
            <div class="info">
                <h3>{{ customer.name }}</h3>
                <p><span class="bold">Phone Number:</span> {{ customer.phoneNumber }}</p>
                <p><span class="bold">Last Visit:</span> {{ (customer.lastVisitDate.toDate()).toDateString() }}</p>
            </div>
            <div class="order-number">
                <p>{{ customer.orderCount }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import router from '@/router'
export default {
    props: ['customers'],
    setup() {

        const goToOrders = async (phoneNumber) => {
            router.push({name: 'Orders', params: {customerID: phoneNumber }})
        }

        return { goToOrders }
    }  
}
</script>

<style scoped>

.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 !important;
}
.single {
    display: flex;
    align-items: center;
    border-radius: 10px;
    background: white;
    margin: 5px 0;
    transition: all ease 0.2s;
    width: 80%;
}
.single:hover {
    box-shadow: 1px 2px 3px rgba(50, 50, 50, 0.05);
    transform: scale(1.02);
    transition: all ease 0.2s;
    cursor: pointer;
}
.thumbnail {
    max-width: 150px;
    max-height: 150px;
    overflow: hidden;
    border-radius: 10px;
}
.img {
    max-width: 150%;
    max-height: 150%;
    display: block;
}
.info {
    margin: 0 30px;
}
.order-number {
    margin-left: auto;
    padding-right: 20px;
}
.bold {
    font-weight: 600 !important;
}

</style>