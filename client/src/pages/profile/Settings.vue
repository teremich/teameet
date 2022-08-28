<template>
  <div>
    <header>
      <Navbar @loadfinished="onLoaded" />
    </header>
    <main>
      <!--
        TODO:
          [ ] leave projects
          [ ] set bio
          [ ] change name / email / password
      -->
      <input type="textarea" :value="user.bio"/>
      <button @click="logout()">Log out</button>
      <button @click="deleteaccount()">delete my account</button>
    </main>
  </div>
</template>

<script setup lang="ts">
// TODO: finish this site
// @ts-ignore
import Navbar from "@/components/Navbar.vue";
import { ref } from "vue";

interface User{
  bio: string;
}

const user = ref<User>({bio: ""});

function onLoaded(event: { loggedIn: boolean, payload?: User }) {
  if (!event.loggedIn) {
    window.location.href = "/login/?href=/profile/settings";
  }
  user = {
    bio: payload.bio,
  };
}

function logout() {
  fetch("/api/v0/login", {
    method: "DELETE",
  }).then(() => {
    window.location.href = "/";
  });
}

function deleteaccount() {
  if (confirm("are you sure")) {
    fetch("/api/v0/register", { method: "DELETE" }).then((r) => {
      if (r.status == 200) {
        location.href = "/";
      } else {
        console.error(r);
        r.text().then(console.error);
      }
    });
  }
}
</script>

<style scoped>
</style>