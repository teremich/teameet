<template>
  <div>
    <header>
      <Navbar @loadfinished="onLoaded" />
    </header>
    <main>
      <h2>configure your profile</h2>
      <div id="left">
        <!-- TODO: change name / email / password -->
        <label>bio:</label><br />
        <textarea
          class="textarea"
          rows="3"
          :value="user.bio.default ?? ''"
          placeholder="Tell us something about yourself..."
        /><br />
        <button class="button" @click="updatebio">update your bio</button><br />
        <br />
        <button class="button" @click="logout()">log out</button><br />
        <button
          class="button"
          style="background-color: var(--error-color)"
          @click="deleteaccount()"
        >
          delete my account</button
        ><br />
      </div>
      <div id="right">
        <!-- TODO: leave projects -->
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import Navbar from "@/components/Navbar.vue";
import { ref } from "vue";

// TODO: set bio

interface User {
  bio: any;
}

const user = ref<User>({ bio: "" });

function onLoaded(event: { loggedIn: boolean; payload?: User }) {
  if (!event.loggedIn) {
    window.location.href = "/login/?href=/profile/settings";
  }
  console.log(event.payload);
  user.value = {
    bio: (event.payload as User).bio.default,
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
.button {
  margin: 5px;
}
#left {
  width: 50%;
  float: left;
}
#right {
  width: 50%;
  float: right;
}
</style>