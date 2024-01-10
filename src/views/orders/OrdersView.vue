<template>
    
    <div class="orders">
        <div v-if="error" class="error">Could not fetch the data</div>
        <div v-if="user">
            <div style="display:flex;justify-content: space-between;margin-bottom:10px;">
                <h2>Orders</h2>
                <button class="btn backgroundGreen" @click="goToServices()">
                    New Order
                    <font-awesome-icon icon="fa-solid fa-cart-shopping" />
                </button>
            </div>
            <table style="width:100%">
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

export default {
    name: 'OrdersView',
    setup() {
        const { user } = getUser()
        const { params } = useRoute();
        
        const { error, orders } = getOrders('orders', params.customerID)


        return { error, user, orders } 
    },
    methods: {
        goToServices(){
            this.$router.push({name: 'Services'})
        },
    }
}
</script>

<style lang="scss" scoped>
thead {
	th {
		border-bottom: 1px solid #000 !important;
	}
}

h1, h2, h3, h4, h5,h6{
	font-family: 'Montserrat', sans-serif !important;
}

tr,
th,
td {
	height: 33px;
	min-height: 38px;
}

th,
td {
	text-align: center;
}

.table th {
	vertical-align: middle;
	line-height: 115%;
}

.table {
	th,
	td {
		padding: 2px;
		vertical-align: middle;
		width: auto;
		border: 1px solid #bbbbbb;
	}
	td {
		textarea {
			vertical-align: middle;
			margin: 3px;
		}
	}
}
</style>