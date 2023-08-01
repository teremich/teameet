<template>
  <div>
    <header>
      <Navbar @loadfinished="onLoaded" />
    </header>
    <main>
      <h2>configure your profile</h2>
      <div id="left">
        <!-- TODO (post v1.0): change name / email / password -->
        <label>bio:</label><br />
        <textarea
          @focus="hideBioSuccess()"
          id="biotextarea"
          class="textarea"
          rows="3"
          :value="user.bio"
          placeholder="Tell us something about yourself..."
        /><br />
        <button class="button" @click="updatebio()">update your bio</button><br />
        <p id="biosuccess" style="display: none; color: var(--success-color)">successfully updated your bio</p>
        <br />
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
        <h3 v-if="user.memberOf.length != 1">you are part in these {{ user.memberOf.length }} projects:</h3>
        <h3 v-else>you are part of this project:</h3>
        <ul>
          <li v-for="p of user.memberOf" :key="p.id">
            <button class="button" @click="leave(p.id)">leave</button> <a class="link" :href="'/project/?id='+p.id">{{ p.name }}</a>
          </li>
        </ul>
        <h3 v-if="user.ownerOf.length != 1">you can delete these {{ user.ownerOf.length }} projects:</h3>
        <h3 v-else>you can delete this project:</h3>
        <ul>
          <li v-for="p of user.ownerOf" :key="p.id">
            <button class="button" @click="del(p.id)">delete</button> <a class="link" :href="'/project/?id='+p.id">{{ p.name }}</a>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import Navbar from "@/components/Navbar.vue";
import { ref } from "vue";

interface User {
  bio: any;
  memberOf: any[],
  ownerOf: any[]
}

const user = ref<User>({ bio: "", ownerOf: [], memberOf: [] });

function hideBioSuccess() {
  document.getElementById("biosuccess")!.style.display = "none";
}

function del(project: string) {
  fetch("/api/v0/project?id=" + project, {
    method: "DELETE"
  }).then(r => {
    if (r.status == 200) {
      window.location.reload();
    }
  })
}

function leave(project: string) {
  fetch(`/api/v0/leave?project=${project}&ban=0`, {
    method: "POST"
  }).then(r => {
    if (r.status == 200) {
      window.location.href = "/profile/settings"
    } else {
      console.error(r);
      r.text().then(console.error);
    }
  });
}

function onLoaded(event: { loggedIn: boolean; payload?: User }) {
  console.log(event.payload);
  if (!event.loggedIn) {
    window.location.href = "/login/?href=/profile/settings";
    return;
  }
  user.value = {
    bio: event.payload!.bio.default,
    memberOf: event.payload!.memberOf,
    ownerOf: event.payload!.ownerOf
  };
}

function updatebio() {
  fetch("/api/v0/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ bio: { default: (<HTMLTextAreaElement>document.getElementById("biotextarea"))!.value } })
  });
  document.getElementById("biosuccess")!.style.display = "block";
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
li{
  margin: 20px;
}
</style>