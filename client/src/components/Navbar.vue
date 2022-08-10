<template>
  <div id="navbar">
    <h2 id="logo"><a href="/">TEAMEET</a></h2>
    <div>
      <a class="account" ref="login" style="display: none">login</a>
      <a class="account" ref="profile" style="display: none"></a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// const accountButtonData = reactive({
//   login: null,
//   profile: null,
// });

const login = ref<HTMLLinkElement | null>(null);
const profile = ref<HTMLLinkElement | null>(null);

// TODO: emit loadfinished event with the right payload
const userInfo = defineEmits(["loadfinished"]);

onMounted(() => {
  login.value.href =
    "/login?href=" +
    (encodeURI(window.location.pathname + window.location.search) || "/");
  fetch("/api/login")
    .then((r) => r.json())
    .then((r) => {
      if (r.status != 200) {
        login.value.style.display = "";
        userInfo("loadfinished", {
          loggedIn: false,
        });
      } else {
        let element = profile.value;
        element.href = "/profile/?id=" + r.body.uuid;
        element.style.display = "";
        element.innerText = r.body.name;
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
  right: 50px;
  top: 20px;
  text-decoration: none;
  background-color: var(--secondary-color);
  color: var(--link-color);
  padding: 0.4rem;
}
#navbar {
  background-color: var(--navbar-color);
  padding: 1rem;
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
