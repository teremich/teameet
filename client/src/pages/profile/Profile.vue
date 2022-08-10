<template>
  <div>
    <header>
      <Navbar />
    </header>
    <main>
      <div></div>
      <div v-if="user?.ownInfo">
        <p>Hello, there, {{ user.payload.name }}!</p>
        <p>your email is: {{ user.payload.email }}</p>
        <p>
          you joined our community on: {{ new Date(user.payload.createdAt) }}
        </p>
        <p>your bio: {{ user.payload.bio }}</p>
        <p style="font-weight: bold">you are the owner of following projects</p>
        <p v-for="p in user.payload.ownerOf" :key="p.id">
          {{ p.name }}: {{ p.description }}
        </p>
        <p style="font-weight: bold">you are a member of following projects</p>
        <p v-for="p in user.payload.memberOf" :key="p.id">
          {{ p.name }}: {{ p.description }}
        </p>
        <button @click="logout()">log out</button>
        <br />
        <button @click="deleteaccount()">delete my account</button>
      </div>
      <div v-else-if="user">
        <p>This is the beautiful profile of {{ user.payload.name }}!</p>
        <p>bio: {{ user.payload.bio }}</p>
        <p style="font-weight: bold">owner of</p>
        <p v-for="p in user.payload.ownerOf" :key="p.id">
          {{ p.name }}: {{ p.description }}
        </p>
        <p style="font-weight: bold">member of</p>
        <p v-for="p in user.payload.memberOf" :key="p.id">
          {{ p.name }}: {{ p.description }}
        </p>
      </div>
      <div></div>
      <div v-if="!user?.ownInfo"></div>
      <div></div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Navbar from "../../components/Navbar.vue";

function deleteaccount() {
  alert("this functionality isn't implemented yet");
  return;
  if (!confirm("are you sure")) {
    return;
  }
  // TODO: implement functionality
}

function logout() {
  fetch("/api/login", {
    method: "DELETE",
  }).then(() => {
    window.location.href = window.location.href;
  });
}

// TODO: add logout feature

interface Project {
  id: number;
  ownerId: number;
  name: string;
  description: string;
  createdAt: Date;
  additional: any | null;
}

interface publicInfo {
  uuid: number;
  name: string;
  ownerOf: Project[];
  memberOf: Project[];
  bio: any;
  additional: any | null;
}

interface privateInfo extends publicInfo {
  email: string;
  createdAt: Date;
  joins: {
    additional: any;
    createdAt: Date;
    message: string;
    receiver: Project;
  }[];
}

const user = ref<{
  ownInfo: boolean;
  payload: publicInfo | privateInfo;
} | null>(null);

const params = new URLSearchParams(document.location.search);

// TODO: reflect the API change in the DOM and make a beautiful site doing so
fetch("/api/profile/?id=" + params.get("id"))
  .then((r) => r.json())
  .then(
    async (r: {
      status: number;
      body: {
        ownInfo: boolean;
        payload: publicInfo | privateInfo;
      };
    }) => {
      if (r.status != 200) {
        console.error(r);
        return;
      }
      document.title = `Profile of ${r.body.payload.name} | Teameet`;
      user.value = r.body;
    }
  );
</script>

<style scoped>
</style>