<template>
    <div class="navbar">
        <nav>
            <img src="@/assets/logo.png" alt="Logo">
            <h1><router-link :to="{name: 'Home'}">Store App</router-link></h1>
            
            <div class="links">
                <div v-if="user">
                    <span>Logged in as  <span class="bold">{{ user.displayName }}</span></span>
                    <button @click="handleClick">
                        Logout
                        <font-awesome-icon icon="fa-solid fa-right-from-bracket" />
                    </button>
                </div>
                <div v-else>
                    <router-link class="btn" :to="{ name: 'Signup' }">
                        Sign up
                        <font-awesome-icon icon="fa-solid fa-user-plus" />
                    </router-link>
                    <router-link class="btn" :to="{ name: 'Login' }">
                        Log in
                        <font-awesome-icon icon="fa-solid fa-right-to-bracket" />
                    </router-link>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
import useLogout from '@/composables/useLogout';
import getUser from '@/composables/getUser';
import { useRouter } from 'vue-router';
export default {
    setup() {
        const { user } = getUser()
        const { logout } = useLogout()
        const router = useRouter()

        const handleClick = async () => {
            await logout()
            console.log('user logged out')
            router.push({ name: 'Login' })
        }

        return { handleClick, user }
    }
}
</script>

<style scoped>
.navbar {
    padding: 16px 10px;
    margin-bottom: 30px;
    background: white;
}
nav {
    display: flex;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
}
nav h1 {
    margin-left: 20px;
}
nav .links {
    margin-left: auto;
}
nav .links a , button {
    margin-left: 16px;
    font-size: 14px;
}
nav img {
    max-height: 60px;
}
.bold {
    font-weight: 800 !important;
}
</style>