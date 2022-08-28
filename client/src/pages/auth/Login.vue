<template>
  <div>
    <header>
      <h1>login to your Teameet accout</h1>
    </header>
    <main>
      <form @submit.prevent="login()">
        <input id="email" ref="email" placeholder="E-Mail" type="email" />
        <br />
        <input
          id="password"
          ref="password"
          placeholder="Password"
          type="password"
        />
        <br />
        <button class="button" type="submit" @click="login()">Log In</button>
        <p>
          <span class="error" :style="loginfailed ? { display: 'block' } : {}"
            >You typed in the wrong E-Mail or Password</span
          >
        </p>
      </form>
      <br />
      <div>
        You don't have an account, yet?
        <a class="button" :href="'/register/?href=' + referer"
          >you can register a new one here</a
        >
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// TODO: please fix this site for mobile
// see a youtube tutorial how

const params = new URLSearchParams(document.location.search);
const referer = decodeURI(params.get("href") ?? "/");

const email = ref<HTMLInputElement | null>(null);
const password = ref<HTMLInputElement | null>(null);

const loginfailed = ref(false);

fetch("/api/v0/login")
  .then((r) => r.json())
  .then((res) => {
    if (res.status == 200) {
      window.location.href = referer;
    }
  });

function login() {
  fetch("/api/v0/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.value?.value,
      password: password.value?.value,
    }),
  })
    .then((r) => r.json())
    .then((res) => {
      console.log(res);
      if (res.status == 200) {
        location.href = referer;
      } else {
        loginfailed.value = true;
      }
    });
}
</script>

<style scoped>
input {
  margin-bottom: 20px;
  font-size: large;
}

header {
  margin-left: 20vw;
  margin-bottom: 10vh;
}

main {
  margin-left: 10vw;
}
</style>