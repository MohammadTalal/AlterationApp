<template>
    
    <div class="orders">
        <div v-if="error" class="error">Could not fetch the data</div>
        <div v-if="user">
            <div style="display:flex;justify-content: space-between;margin-bottom:10px;">
                <h2>Orders</h2>
                <h2>Customer: {{ selectedCustomer }}</h2>
                <button class="btn backgroundGreen" @click="goToServices()">
                    <font-awesome-icon icon="fa-solid fa-plus" />
                    New Order
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
                        <th>${{ order.orderTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}</th>
                        <th>
                            <button @click="openModal(index)">
                                <font-awesome-icon icon="fa-solid fa-eye" />
                            </button>
                        </th>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="!user">
            <h2 class="text-center">You are not logged in.</h2>
            <h2 class="text-center"><a href="/login">Log in</a></h2>
        </div>

        <div v-if="isModalOpen" class="modal-overlay">
            <div class="modal">
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th class="text-left">Service</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, index) in orderDetails" :key="index">
                                <td class="text-left">
                                    {{ row.serviceName }}
                                </td>
                                <td>
                                    ${{ row.servicePrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}
                                </td>
                            </tr>
                            <tr>
                                <td class="text-right bold">Tax</td>
                                <td>
                                    ${{ orders[selectedOrderIndex].tax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}
                                </td>
                            </tr>
                            
                        </tbody>
                        <tfoot>
                            <tr>
                                <td class="text-right bold">Total</td>
                                <td class="bold" style="color:green">
                                    ${{ orders[selectedOrderIndex].orderTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div class="modal-footer">
                    <button class="close-btn" @click="closeModal()">
                        <font-awesome-icon icon="fa-solid fa-xmark" />
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import getUser from '@/composables/getUser'
import getOrders from '@/composables/getOrders';
import { useRoute } from 'vue-router';
import router from '@/router'
import { ref, computed } from 'vue'
import getCollection from '@/composables/getCollection';



export default {
    name: 'OrdersView',
    setup() {
        const { user } = getUser()
        const { params } = useRoute();
        const { error, orders } = getOrders('orders', params.customerID)
        const isModalOpen = ref(false)
        const orderDetails = ref([])
        const selectedOrderIndex = ref(0)
        const currentCustomer = ref({})

        const { documents: customers } = getCollection('customers')
        
        const selectedCustomer = computed(() => {
            if (!params.customerID) {
                return customers.value;
            }
            currentCustomer.value =  customers.value?.filter((customer) =>
                customer.phoneNumber?.includes(params.customerID)
            )[0];
            return currentCustomer.value?.name
        });


        

        const goToServices = async () => {
            router.push({name: 'Services', params: {customerID: params.customerID }})
        }
        
        const openModal = (index) => {
            orderDetails.value = orders.value[index].orderDetails;
            selectedOrderIndex.value = index
            isModalOpen.value = true
        }

        const closeModal = () => {
            isModalOpen.value = false
        }

        return { 
            error, 
            user, 
            orders, 
            goToServices,
            isModalOpen,
            openModal,
            closeModal,
            orderDetails,
            selectedOrderIndex,
            selectedCustomer
            
        } 
    },
}
</script>

<style lang="scss" scoped>
h1, h2, h3, h4, h5,h6{
	font-family: 'Montserrat', sans-serif !important;
}


table {
    width: 100%;
    overflow: auto;
    thead {
        position: sticky;
        top: 0;
        th {
            vertical-align: middle;
            border-bottom: 1px solid #000 !important;
        }
    }
	th,
	td {
		padding: 2px;
		vertical-align: middle;
		border: 1px solid #bbbbbb;
        text-align: center;
	}
    tr,
    th,
    td {
        height: 20px;
        min-height: 38px;
        border: none;
    }
    tfoot {
        td {
            border-top: 1px solid #000 !important;
        }
    }
}


.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); /* semi-transparent black background */
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    height: 50vh;
    background: white;
    padding: 20px;
    border: 1px solid #ccc;
    width: 30%;
    display: flex;
    flex-direction: column;
    min-height: 50vh;
}
.modal-footer {
    margin-top: auto;
	padding: 0;
	margin: 0;
}

.close-btn {
    background: rgb(255, 121, 121);
    margin-left: 10px;
    margin-top: 20px;
}
.table-wrapper {
    width: 100%;
    flex: 1; /* Take up remaining space */
    overflow-y: auto;
}
</style>