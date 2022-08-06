<template>
  <div>
    <header>
      <Navbar />
    </header>
    <main>
      <div ref="info" id="info">
        <p ref="failed" class="failed">Sorry, we couldn't find this user</p>
        <p>Hello there, {{ user.body.name }}!</p>
        <p>Your Email is: {{ user.body.email }}</p>
        <p>
          You are member of:
          {{ user.body.memberOf.toString() || "no projects" }}
        </p>
        <p>
          You are the owner of:
          {{
            user.body.ownerOf.map((project) => project.name).toString() ||
            "no projects"
          }}
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Navbar from "../../components/Navbar.vue";

// TODO: make this site more beautiful

const info = ref<HTMLElement | null>(null);
const user = ref({
  body: {
    name: "",
    email: "",
    memberOf: [],
    ownerOf: [],
  },
});

const params = new URLSearchParams(document.location.search);
onMounted(async () => {
  fetch("/api/login")
    .then((r) => r.json())
    .then(async (r) => {
      if (r.status != 200) {
        // SHOW PUBLICLY AVAILABLE STUFF
        // location.href = "/login"
      } else {
        if (r.body.uuid != Number.parseInt(params.get("id"))) {
          // SHOW PUBLICLY AVAILABLE STUFF BUT THE PERSON IS LOGGED IN
          return;
        }
        // SHOW OWN PROFILE
        document.title = `${r.body.name} | Teameet`;
        console.log(r);
        user.value = r;
      }
    });
});
</script>

<style scoped>
</style>