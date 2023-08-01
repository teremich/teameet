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
          class="textarea"
          rows="5"
          ref="description"
          placeholder="Tell us about your project…"
        ></textarea>
        <p>
          <span class="error" id="nd"
            >Please provide a name for your project as well as a
            description.</span
          >
          <span class="error" id="ntoolong"
            >Please make sure that your project name is at most 255 characters long.</span
          >
          <span class="error" id="ptoomany"
            >You can only have up to 255 projects.</span
          >
        </p>
        <button style="margin-left: 30px; font-size: larger">CREATE</button>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// @ts-ignore
import Navbar from "@/components/Navbar.vue";

const name = ref<HTMLInputElement | null>(null);
const description = ref<HTMLInputElement | null>(null);

function onLoaded(event: { loggedIn: boolean }) {
  if (!event.loggedIn) {
    window.location.href = "/login?href=/project/new";
  }
}

function submit() {
  const n = name.value?.value;
  const d = description.value?.value;
  if (n && d) {
    fetch("/api/v0/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: n,
        description: d,
      }),
    })
      .then(async (r) => {
        switch (r.status) {
          case 201:
            window.location.href = "/project/?id=" + (await r.json()).id;
            break;
          case 401:
            window.location.href = "/login?href=/project/new";
            break;
          case 403:
            document.getElementById("ptoomany")!.style.display = "block";
            break;
          case 413:
            document.getElementById("ntoolong")!.style.display = "block";
            break;
          default:
            console.error(r);
        }
      });
  } else {
    document.getElementById("nd")!.style.display = "block";
  }
}
</script>

<style lang="scss" scoped>
input,
textarea {
  font-size: 24pt;
}
</style>
