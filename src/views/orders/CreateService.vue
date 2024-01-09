<template>
    <div>
        <button @click="openModal" style="margin-left:10px">Add New Service</button>
        <div v-if="isModalOpen" class="modal-overlay">
            <div class="modal">
                <form @submit.prevent="handleSubmit">
                    <h4>Create New Service</h4>
                    <input type="text" placeholder="Service Name" v-model="serviceName" required>
                    <input type="number" placeholder="Service Price" v-model="servicePrice" required>
                    <button v-if="!isPending">Create</button>
                    <button v-else disabled>Saving...</button>
                    <button @click="closeModal" class="close-btn">Close</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import useCollection from '@/composables/useCollection'
import getServices from '@/composables/getServices';

export default {
    setup(){
        const { error, addDoc } = useCollection('services')
        const { services } = getServices('services')

        const serviceName = ref('')
        const servicePrice = ref('')
        const isPending = ref(false)
        const isModalOpen = ref(false)

        const openModal = () => {
            console.log(isModalOpen.value)
            isModalOpen.value = true
        }
        const closeModal = () => {
            isModalOpen.value = false
        }

        

        const handleSubmit = async () => {
            isPending.value = true
            const maxServiceID = services.value.reduce((maxID, service) => {
                return service.serviceID > maxID ? service.serviceID : maxID;
            }, -1);
            await addDoc({
                serviceName: serviceName.value,
                servicePrice: servicePrice.value,
                serviceID: maxServiceID +1
            })
            serviceName.value = ''
            servicePrice.value = ''
            
            isPending.value = false
            if(!error.value){
                console.log('services added')
            }
            isModalOpen.value = false 
        }
        return { serviceName, servicePrice, handleSubmit, error, isPending, openModal, closeModal, isModalOpen }
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
    padding: 20px;
    border: 1px solid #ccc;
    width: 22%;
}

.close-btn {
    background: rgb(255, 121, 121);
    margin-left: 10px;
}
</style>