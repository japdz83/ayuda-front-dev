import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Keycloak from 'keycloak-js';

import App from './App.vue'
import router from './router'

const initOptions = {
    url: import.meta.env.VITE_APP_KEYCLOACK_URL,
    realm: import.meta.env.VITE_APP_KEYCLOACK_REALM,
    clientId: import.meta.env.VITE_APP_KEYCLOACK_CLIENTID,
    onLoad: 'login-required'
}

const keycloak = new Keycloak(initOptions)

// const app = createApp(App)

keycloak.init({ onLoad: initOptions.onLoad }).then(async (auth) => {
    if (!auth) {
        window.location.reload()
    } else {
        const app = createApp(App)

        app.config.globalProperties.$keycloak = keycloak
        app.use(createPinia())
        app.use(router)

        app.mount('#app')
        await store.dispatch('user/login', {
            idToken: keycloak.token,
            name: keycloak.tokenParsed.name,
            email: keycloak.tokenParsed.email
        })
        //Token Refresh
        setInterval(async () => {
            if (keycloak.isTokenExpired()) {
                sessionStorage.clear()
                keycloak.logout({ redirectUri: import.meta.env.VITE_APP_BASE_URL })
            }
        }, 60000)
    }
})
