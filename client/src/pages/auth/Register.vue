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
        <button type="submit">Register Now</button>
        <p ref="failed">
          <span class="error">something has gone wrong</span>
        </p>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const params = new URLSearchParams(document.location.search);
const referer = decodeURI(params.get("href"));

const name = ref<HTMLInputElement | null>(null);
const email = ref<HTMLInputElement | null>(null);
const password = ref<HTMLInputElement | null>(null);
const failed = ref<HTMLParagraphElement | null>(null);

function register() {
  fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name.value.value,
      email: email.value.value,
      password: password.value.value,
    }),
  })
    .then((r) => r.json())
    .then((res) => {
      console.log(res);
      if (res.status >= 200 && res.status < 300) {
        location.href = referer || "/";
      } else {
        failed.value.innerHTML += `<span class="error">Server responded with: ${res.body.msg}</span>`;
        failed.value.querySelectorAll(".error").forEach((element) => {
          (<any>element).style.display = "block";
        });
        console.log(failed.value.innerHTML);
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
