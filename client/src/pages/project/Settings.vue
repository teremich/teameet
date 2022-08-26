<template>
  <div>
    <header>
      <Navbar />
    </header>
    <main>
      <!--
        TODO:
          [ ] accept / deny join requests
          [ ] set technologies
          [ ] set links
          [ ] set tasks
          [ ] kick / ban members
          [ ] delete the project
      -->
    </main>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import Navbar from "@/components/Navbar.vue";

const params = new URLSearchParams(document.location.search);

function remove() {
  fetch("/api/project/?id=" + params.get("id"), {
    method: "DELETE",
  }).then(() => {
    window.location.href = "/";
  });
}
</script>

<style scoped>
</style>