<template>
  <div>
    <header>
      <h1>Register a new Teameet accout</h1>
    </header>
    <main>
      <form @submit.prevent="register()">
        <input ref="name" placeholder="Name" type="text" />
        <br />
        <input ref="email" placeholder="E-Mail" type="email" />
        <br />
        <input ref="password" placeholder="Password" type="password" />
        <br />
        <input ref="password2" placeholder="repeat password" type="password" />
        <br />
        <button type="submit">Register Now</button>
        <p>
          <span class="error" ref="wrong">something has gone wrong</span>
          <span class="error" ref="diffpw">something has gone wrong</span>
          <span class="error" ref="servererror"
            >Server responded with: {{ failed.msg }}</span
          >
        </p>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const params = new URLSearchParams(document.location.search);
const referer = decodeURI(params.get("href") ?? "/");

const name = ref<HTMLInputElement | null>(null);
const email = ref<HTMLInputElement | null>(null);
const password = ref<HTMLInputElement | null>(null);
const password2 = ref<HTMLInputElement | null>(null);
const failed = ref({
  error: false,
  msg: "",
});

function register() {
  if (password.value?.value !== password2.value?.value) {
    return;
  }
  fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name.value?.value,
      email: email.value?.value,
      password: password.value?.value,
    }),
  })
    .then((r) => r.json())
    .then((res) => {
      console.log(res);
      if (res.status >= 200 && res.status < 300) {
        location.href = referer;
      } else {
        failed.value = {
          error: true,
          msg: res.body.msg,
        };
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
