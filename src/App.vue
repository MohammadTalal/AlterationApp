<template>
    
    <NavbarView />
    <div class="content">
        <router-view />
    </div>
</template>

<script>
import NavbarView from "./components/NavbarView.vue";

export default {
    components: { NavbarView },
};
</script>

<style>
.content {
    margin: 0 auto;
    max-width: 1200px;
    padding: 0 20px;
}
</style>
