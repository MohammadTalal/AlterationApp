<template>
    <div class="orders">
        <div v-if="error" class="error">Could not fetch the data</div>
        <div v-if="user">
            
            <CreateService />
            <div v-for="(service, index) in services" :key="index"> 
                <div class="single">
                    <div class="info">
                        {{ service.serviceName }}
                    </div>
                    <div class="order-number">
                        <div class="price">
                            ${{ Number(service.servicePrice).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}
                        </div>
                        <button>
                            <font-awesome-icon icon="fa-solid fa-plus" />
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
import getUser from '@/composables/getUser'
import getServices from '@/composables/getServices';
import CreateService from './CreateService.vue';

export default {
    name: 'ServicesView',
    components: { CreateService },
    setup() {
        const { error, services } = getServices('services')
        const { user } = getUser()


        return { error, user, services } 
    },

}
</script>

<style lang="scss" scoped>
.single {
    width: 25%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    float: left;
    padding: 20px;
    border-radius: 10px;
    background: white;
    margin: 16px 10px;
    transition: all ease 0.2s;
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
</style>