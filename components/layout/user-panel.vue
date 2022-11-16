<template>
    <div class="user-panel">
        <div class="user_info">
            <h3 class="name" :title="name">{{ name }}</h3>
            <p class="job_title" :title="jobTitle">{{ jobTitle }}</p>
        </div>
        <div class="icons">
            <i @click="goToProfile" class="dx-icon-preferences"></i>
            <i @click="logout" class="dx-icon-runner"></i>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    computed: {
        name(): string {
            return this.$store.getters["user/name"];
        },
        jobTitle(): string {
            return this.$store.getters["user/jobTitle"];
        },
    },
    methods: {
        logout(): void {
            this.$store.dispatch("oidc/signOutOidc");
        },
        goToProfile(): void {
            window.location.href = this.$dataApi.account;
        },
    },
});
</script>

<style lang="scss" scoped>
.user-panel {
    padding: 10px;
    display: flex;
    align-items: flex-start;
    border-bottom: 1px solid #ddd;
    min-height: 63px;
    .user_info {
        flex-grow: 1;
        overflow: hidden;
    }
    .icons {
        display: flex;
        align-items: center;
        justify-content: center;
        i {
            font-size: 20px;
            padding: 5px;
            cursor: pointer;

            &:hover {
                background-color: #ddd;
            }
        }
    }
}
</style>
