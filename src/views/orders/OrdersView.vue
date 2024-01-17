<template>
    
    <div class="orders">
        <div v-if="error" class="error">Could not fetch the data</div>
        <div v-if="user">
            <div style="display:flex;justify-content: space-between;margin-bottom:10px;">
                <h2>Orders</h2>
                <button class="btn backgroundGreen" @click="goToServices()">
                    New Order
                </button>
            </div>
            <table style="width:100%" class="table">
                <thead>
                    <tr>
                        <th>Order Date</th>
                        <th>Pick Up Date</th>
                        <th>Order Total</th>
                        <th>View</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(order, index) in orders" :key="index">
                        <td>{{ (order.orderDate.toDate()).toDateString()  }}</td>
                        <td>{{ (order.pickupDate.toDate()).toDateString() }}</td>
                        <th>{{ order.orderTotal }}</th>
                        <th></th>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="!user">
            <h2 class="text-center">You are not logged in.</h2>
            <h2 class="text-center"><a href="/login">Log in</a></h2>
        </div>

    </div>
</template>

<script>
import getUser from '@/composables/getUser'
import getOrders from '@/composables/getOrders';
import { useRoute } from 'vue-router';
import router from '@/router'

export default {
    name: 'OrdersView',
    setup() {
        const { user } = getUser()
        const { params } = useRoute();
        
        const { error, orders } = getOrders('orders', params.customerID)

        const goToServices = async () => {
            router.push({name: 'Services', params: {customerID: params.customerID }})
        }

        return { error, user, orders, goToServices } 
    },
}
</script>

<style lang="scss" scoped>

h1, h2, h3, h4, h5,h6{
	font-family: 'Montserrat', sans-serif !important;
}

.table {
    thead {
        th {
            vertical-align: middle;
            line-height: 115%;
            border-bottom: 1px solid #000 !important;
        }
    }
	th,
	td {
		padding: 2px;
		vertical-align: middle;
		width: auto;
		border: 1px solid #bbbbbb;
        text-align: center;
	}
	td {
		textarea {
			vertical-align: middle;
			margin: 3px;
		}
	}
    tr,
    th,
    td {
        height: 33px;
        min-height: 38px;
        border: none;
    }
}
</style>