<template>
  <div id="navbar">
    <h2 id="logo"><router-link to="/">TEAMEET</router-link></h2>
    <div>
      <router-link
        class="account"
        :to="{ path: '/login' }"
        ref="login"
        v-if="!profile.loaded"
        >login</router-link
      >
      <router-link
        class="account"
        v-if="profile.loaded"
        :to="{ path: '/profile/', query: { id: profile.uuid } }"
        >{{ profile?.name }}</router-link
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const login = ref<HTMLLinkElement | null>(null);
const profile = ref({
  loaded: false,
  name: "",
  uuid: 0,
});

const userInfo = defineEmits(["loadfinished"]);

onMounted(() => {
  (login as any).value.to.query = {
    href: encodeURI(window.location.pathname + window.location.search) || "/",
  };
  fetch("/api/v0/login")
    .then((r) => r.json())
    .then((r) => {
      if (r.status != 200) {
        userInfo("loadfinished", {
          loggedIn: false,
        });
      } else {
        profile.value = {
          loaded: true,
          name: r.body.name,
          uuid: r.body.uuid,
        };
        userInfo("loadfinished", {
          loggedIn: true,
          payload: r.body,
        });
      }
    });
});
</script>

<style scoped lang="scss">
.account {
  position: absolute;
  right: 3em;
  top: 2em;
  text-decoration: none;
  background-color: var(--secondary-color);
  color: var(--link-color);
  padding: 0.4rem;
}
#navbar {
  background-color: var(--navbar-color);
  padding: 1rem;
  padding-left: 3rem;
  margin: 0;
  position: relative;
}
#logo {
  a {
    text-decoration: none;
    color: var(--link-color);
  }
}
</style>
