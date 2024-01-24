<template>
    <div class="orders">
        <div v-if="error" class="error">Could not fetch the data</div>
        <div v-if="user" >
            <div style="display:flex;justify-content:space-between;">
                <div style="display:flex;">
                    <CreateService :disableBtn="editServiceFlag" />
                    
                    <button v-show="!editServiceFlag" style="margin:auto 5px;" @click="editService()">
                        <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                    </button>
                    
                    <button v-show="editServiceFlag" style="margin:auto 5px;background-color:#f44336;" @click="stopEditService()">
                        <font-awesome-icon icon="fa-solid fa-stop" />
                    </button>
                </div>
                
                <h2>Customer: {{ selectedCustomer?.name }}</h2>
                <button class="checkout-button" :class="{ 'pulsate': serviceAddedFlag }" :disabled="editServiceFlag" @click="openModal()">
                    <font-awesome-icon icon="fa-solid fa-cart-shopping" />
                    Check Out <span style="color:green;font-size:1rem">{{ numberOfServices }}</span>
                </button>
            </div>
            <div class="wrapper"> 
                <div class="single" v-for="(service, index) in services" :key="index" :class="{ 'pulse': editServiceFlag }" >
                    <div class="info">
                        {{ service.serviceName }}
                    </div>
                    <div class="order-number">
                        <div class="price">
                            ${{ Number(service.servicePrice).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}
                        </div>
                        <button @click="addToCart(service)" v-show="!editServiceFlag">
                            <font-awesome-icon icon="plus" />
                        </button>
                        <button @click="deleteService(service)" style="margin-left:5px;" v-show="editServiceFlag" >
                            <font-awesome-icon icon="fa-solid fa-trash" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!user">
            <h2 class="text-center">You are not logged in.</h2>
            <h2 class="text-center"><a href="/login">Log in</a></h2>
        </div>
        <div v-if="isModalOpen" class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h2 class="text-left">
                        <font-awesome-icon icon="fa-solid fa-cart-shopping" style="color:white;margin-right: 10px;" />
                        Check Out
                    </h2>
                </div>
                <div style="margin: 0 10px;">
                    <label for="pickupDate">Choose Pickup Date</label>
                    <input type="date" name="pickupDate" id="pickupDate" v-model="pickupDate">
                </div>
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th class="text-left">Service</th>
                                <th>Price</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, index) in cartItems" :key="index">
                                <td class="text-left">
                                    {{ row.serviceName }}
                                </td>
                                <td>
                                    ${{ row.servicePrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}
                                </td>
                                <td>
                                    <button @click="removeFromCart(index, row)">
                                        <font-awesome-icon icon="fa-solid fa-trash" />
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-right bold">Tax</td>
                                <td>${{ orderTax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})  }}</td>
                                
                            </tr>
                        </tbody>
                        <tfoot v-if="cartItems.length > 0">
                            <tr>
                                <td class="bold text-right">Total</td>
                                <td class="bold" style="color:green;">
                                    ${{ (orderTotal + orderTax).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div class="modal-footer">
                    <button @click="checkout()" :disabled="!pickupDate || cartItems.length == 0">
                        <font-awesome-icon icon="fa-sollid fa-sack-dollar" />
                        Place Order
                    </button>
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
import { ref, computed } from 'vue'
import getUser from '@/composables/getUser'
import getServices from '@/composables/getServices';
import CreateService from './CreateService.vue';
import { useRoute } from 'vue-router';
import useCollection from '@/composables/useCollection'
import { timestamp } from '@/firebase/config'
import router from '@/router'
import getOrders from '@/composables/getOrders';
import getCollection from '@/composables/getCollection';


export default {
    name: 'ServicesView',
    components: { CreateService },
    setup() {
        const { error, services } = getServices('services')
        const { documents: customers } = getCollection('customers')
        const { addDoc } = useCollection('orders')
        const { updateDoc } = useCollection('customers')
        const { deleteDoc } = useCollection('services')
        const { orders } = getOrders('orders')
        const { user } = getUser()
        const { params } = useRoute();
        const numberOfServices  = ref(0)
        const cartItems = ref([])
        const serviceAddedFlag = ref(false)
        const isModalOpen = ref(false)
        const pickupDate = ref('')
        const orderTotal = ref(0)
        const orderTax = ref(0)
        const isPending = ref(false)
        const editServiceFlag = ref(false)

        const currentCustomer = ref({})

        const selectedCustomer = computed(() => {
            if (!params.customerID) {
                return customers.value;
            }
            currentCustomer.value =  customers.value?.filter((customer) =>
                customer.phoneNumber?.includes(params.customerID)
            )[0];
            return currentCustomer.value
        });

        const addToCart = (service) => {
            numberOfServices.value += 1
            cartItems.value.push(service)
            serviceAddedFlag.value = true
            setTimeout(() => {
                serviceAddedFlag.value = false
            }, 500);
            orderTotal.value += service.servicePrice
            orderTax.value = orderTotal.value * 0.13
        }

        const removeFromCart = (index, service) => {
            numberOfServices.value -= 1
            cartItems.value.splice(index, 1)
            orderTotal.value -= service.servicePrice
            orderTax.value = orderTotal.value * 0.13
        }
        
        const checkout = async () => {
            isPending.value = true
            // Get Max Order Number
            const maxOrderNumber = orders.value.reduce((maxID, order) => {
                return order.orderNumber > maxID ? order.orderNumber : maxID;
            }, -1);
            // Set currect pickup date
            let originalDate = new Date(pickupDate.value)
            originalDate.setDate(originalDate.getDate() + 1)
            // Add Order
            await addDoc({
                customerID: params.customerID,
                orderDate: timestamp(),
                orderNumber: maxOrderNumber + 1,
                orderTotal: orderTotal.value + orderTax.value,
                pickupDate: originalDate,
                orderDetails: cartItems.value,
                tax: orderTax.value
            })

            // Update last visit date for the customer
            if(selectedCustomer.value){
                await updateDoc(
                    selectedCustomer.value.id,
                    {
                        lastVisitDate: timestamp(),
                        orderCount: selectedCustomer.value.orderCount +1
                    }
                )
            }
            isPending.value = false
            
            router.push({name: 'Orders', params: {customerID: params.customerID }})
            
        }

        const openModal = () => {
            isModalOpen.value = true
        }

        const closeModal = () => {
            isModalOpen.value = false
        }

        const editService = () => {
            editServiceFlag.value = true
        }

        const stopEditService = () => {
            editServiceFlag.value = false
        }

        const deleteService = async (service) => {
            await deleteDoc(service.id)
        }

        return { 
            error, 
            user, 
            services, 
            addToCart, 
            removeFromCart,
            numberOfServices, 
            serviceAddedFlag, 
            closeModal, 
            openModal, 
            isModalOpen, 
            cartItems,
            checkout,
            pickupDate,
            orderTotal,
            orderTax,
            selectedCustomer,
            editServiceFlag,
            editService,
            stopEditService,
            deleteService
        } 
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
@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.02);
    }
}
.single.pulse {
    animation: pulse 1s ease-in-out infinite;
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
    animation: pulsate 0.5s infinite;
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


.modal {
    background: white;
    width: 30%;
    height: 70vh;
    display: flex;
    flex-direction: column;
    min-height: 50vh;
}
.modal-footer {
    margin-top: auto;
	padding: 0;
	margin: 10px;
}
.modal-header {
    h2 {
        color: white !important;
    }
}
.close-btn {
    background: rgb(255, 121, 121);
    margin-left: 10px;
}
.table-wrapper {
    flex: 1; /* Take up remaining space */
    overflow-y: auto;
    margin: 0 10px;
}
label {
    font-size: 0.9em;
}
input {
    width: 60%;
    margin: 5px 0 10px 0;
    padding: 0;
    cursor: pointer;
}
table {
    width: 100%;
    overflow: auto;
    thead {
        position: sticky;
        top: 0;
        background: white;
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
</style>