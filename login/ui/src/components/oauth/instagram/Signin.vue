<template>
    <div class="row col-2" v-if="instagramClientId">
        <q-btn round @click="loginWithInstagram" color="white" unelevated :loading="isLoading">
            <q-avatar size="42px">
                <img v-if="isLoading" src="../../../assets/oauth/instagram/loading.gif">
                <img v-else src="../../../assets/oauth/instagram/logo.png">
            </q-avatar>
            <q-tooltip>
                {{ login.with_instagram }}
            </q-tooltip>
        </q-btn>
    </div>
</template>
  
<script>
import { mapActions, mapGetters } from "vuex";

export default {
    data() {
        return {
            instagramClientId: process.env.OAUTH_INSTAGRAM_CLIENT_ID,
        };
    },

    computed: {
        ...mapGetters({
            isLoading: "auth/isLoading",
        }),
    },

    methods: {
        ...mapActions({
            iSignIn: "auth/iSignIn",
        }),

        async loginWithInstagram() {
            try {
                const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${this.instagramClientId}&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=token`;
                window.location.href = authUrl;
            } catch (error) {
                console.error(error);
            }
        },
    },
};
</script>