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
                    <button class="btn" style="margin-left:5px;" @click="showTodayOrdersModal()">
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

        <div v-if="todayOrdersModal" class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h2 class="text-left">
                        <font-awesome-icon icon="fa-solid fa-calendar-day" style="color:white;margin-right: 10px;" />
                        Today's Orders
                    </h2>
                </div>
                <div class="table-wrapper">
                    <table v-if="orders.length > 0">
                        <thead>
                            <tr>
                                <th class="text-left" style="width:35%;">Customer</th>
                                <th style="width:30%;">Drop-off Date</th>
                                <th style="width:20%;">Order Total</th>
                                <th style="width:15%;">Completed?</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(order, index) in orders" :key="index">
                                <td class="text-left">
                                    {{ getCustomerName(order.customerID)}}
                                </td>
                                <td>
                                    {{ order.orderDate.toDate().toDateString()  }}
                                </td>
                                <td class="green-money bold">
                                    ${{ order.orderTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}
                                </td>
                                <td>
                                    <select>
                                        <option>Yes</option>
                                        <option>No</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <h2 v-else class="text-center">No Pick up for Today</h2>
                </div>
                <div class="modal-footer">
                    <button class="close-btn" @click="closeTodayOrdersModal()">
                        <font-awesome-icon icon="fa-solid fa-xmark" />
                        Close
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import getCollection from '@/composables/getCollection';
import CustomerList from '@/components/CustomersList.vue';
import getUser from '@/composables/getUser';
import getOrders from '@/composables/getOrders';
import router from '@/router';
import {ref, computed} from 'vue';

export default {
    name: 'HomeView',
    components: { CustomerList },
    setup() {
        const requiredCustomer = ref('')
        const { error, documents } = getCollection('customers')
        const { orders } = getOrders('orders', null, true)
        const { user } = getUser()
        const todayOrdersModal = ref(false)
    
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

        const showTodayOrdersModal = () => {
            todayOrdersModal.value = true
        }
        const closeTodayOrdersModal = () => {
            todayOrdersModal.value = false
        }
        const getCustomerName = (custID) => {
            return documents.value.find((customer) =>
                customer.phoneNumber == custID 
            )?.name; 
        }

        return { 
            error, 
            documents: filteredDocuments, 
            user, 
            createNewCustomer, 
            requiredCustomer,
            showTodayOrdersModal,
            closeTodayOrdersModal,
            todayOrdersModal,
            orders,
            getCustomerName
        } 
    },
}
</script>

<style lang="scss" scoped>
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
    background: white;
    padding: 0;
    width: 40vw;
    height: 60vh;
    display: flex;
    flex-direction: column;
    min-height: 50vh;
}
.modal-header {
    background-color: var(--primary); 
    padding: 10px;
    text-align: center;
    position: sticky;
    top: 0;
    margin-bottom: 10px;
    h2 {
        color: white !important;
    }
}
.modal-footer {
    margin-top: auto;
	padding: 0;
	margin-bottom: 10px;
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
    select {
        width: 50%;
        text-align: center;
    }
}

</style>