<template>
  <div>
    <header>
      <Navbar @loadfinished="leaveIfNotLoggedIn" />
    </header>
    <main>
      <!--
        TODO:
          [ ] leave projects
          [ ] set bio
          [ ] change name / email / password
      -->
      <button @click="logout()">Log out</button>
      <button @click="deleteaccount()">delete my account</button>
    </main>
  </div>
</template>

<script setup lang="ts">
// TODO: finish this site
// @ts-ignore
import Navbar from "@/components/Navbar.vue";

function leaveIfNotLoggedIn(event: { loggedIn: boolean }) {
  if (!event.loggedIn) {
    window.location.href = "/login/?href=/profile/settings";
  }
}

function logout() {
  fetch("/api/login", {
    method: "DELETE",
  }).then(() => {
    window.location.href = "/";
  });
}

function deleteaccount() {
  if (confirm("are you sure")) {
    fetch("/api/register", { method: "DELETE" }).then((r) => {
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