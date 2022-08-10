<template>
  <div>
    <Navbar @loadfinished="onLoaded" />
    <main>
      <div>
        <p style="padding-left: 15px; font-size: 20pt">Make A New Project</p>
      </div>
      <form @submit.prevent="submit()">
        <input
          id="newprojname"
          style="margin: 10px"
          placeholder="Project Name"
          type="text"
          ref="name"
        /><br />
        <textarea
          id="newprojdescription"
          style="margin: 10px; width: 200pt; height: 100pt"
          ref="description"
          placeholder="Tell us about your project…"
        ></textarea>
        <p>
          <span ref="failed" class="error"
            >Please provide a name for your project as well as a
            description.</span
          >
        </p>
        <button style="margin-left: 30px; font-size: larger">CREATE</button>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Navbar from "../../components/Navbar.vue";

const name = ref<HTMLInputElement | null>(null);
const description = ref<HTMLInputElement | null>(null);

const failed = ref<HTMLElement | null>(null);

function onLoaded(event) {
  if (!event.loggedIn) {
    window.location.href = "/login?href=/project/new";
  }
}

function submit() {
  const n = name.value.value;
  const d = description.value.value;
  if (n && d) {
    fetch("/api/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: n,
        description: d,
      }),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.status == 201) {
          window.location.href = "/project/?id=" + r.id;
        } else if (r.status == 401) {
          window.location.href = "/login?href=/project/new";
        } else {
          console.error(r);
        }
      });
  } else {
    failed.value.style.display = "block";
  }
}
</script>

<style scoped>
</style>
