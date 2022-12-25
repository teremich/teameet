<template>
  <div>
    <header>
      <Navbar />
    </header>
    <main>
      <p style="max-width: 800px">
        send a join request to the project "{{ project.name }}" <br />
        <span style="opacity: 0.4"
          ><span style="text-decoration: underline">Introduce yourself</span> to
          the others, tell them
          <span style="text-decoration: underline">how familiar</span> you are
          with the technologies and languages they use and
          <span style="text-decoration: underline">explain why</span> you'd like
          to join their project. <br />
          Surely, they are waiting for someone just like you :)</span
        >
      </p>
      <textarea rows="3" ref="message" class="textarea" placeholder="Hi..." />
      <br />
      <button @click="sendJR()">JOIN NOW</button>
      <p class="error">
        Sorry, something went wrong <br />
        the server responded with: <span>nothing</span>
      </p>
    </main>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import Navbar from "@/components/Navbar.vue";
import { ref, onMounted } from "vue";
const params = new URLSearchParams(document.location.search);
const message = ref<HTMLInputElement | null>(null);
const project = ref({
  name: "...",
  id: 0,
});
onMounted(() => {
  fetch("/api/v0/project?id=" + params.get("id"))
    .then((r) => r.json())
    .then((response) => {
      if (
        response.status !== 200 ||
        response.body.projects[0]?.id != params.get("id")
      ) {
        window.location.href = "/";
      }
      project.value = {
        name: response.body.projects[0].name,
        id: response.body.projects[0].id,
      };
    });
});

function sendJR() {
  const errorElement = <HTMLElement>document.getElementsByClassName("error")[0];
  errorElement.innerHTML = `Sorry, something went wrong <br /> the server responded with: <span>nothing</span>`;
  if (!message.value?.value?.trim()) {
    errorElement.style.display = "block";
    errorElement.innerText =
      "You have to write a join request message for the members of the project to read";
    return;
  }
  fetch("/api/v0/join/?project=" + params.get("id"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: message.value?.value,
    }),
  })
    .then((r) => r.json())
    .then((res) => {
      if (res.status == 201) {
        window.location.href = "/project/?id=" + params.get("id");
      } else {
        errorElement.style.display = "block";
        errorElement.getElementsByTagName("span")[0].innerText = res.body.msg;
      }
    });
}
</script>

<style scoped lang="scss">
</style>