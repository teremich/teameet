<template>
  <router-view />
</template>

<script setup lang="ts">
</script>

<style>
.button {
  text-decoration: none;
  background-color: var(--link-color);
  color: var(--secondary-color);
  padding: 0.4rem;
  border: none;
  font-size: 16pt;
  font-family: Arial, Helvetica, sans-serif;
}
.button:hover {
  cursor: pointer;
}
.error {
  color: var(--error-color);
  display: none;
  width: fit-content;
}
main {
  margin: 15px;
}
body {
  --primary-color: #f0f6f6;
  --secondary-color: #26292c;
  --navbar-color: #1c1f21;
  --link-color: #85dcfe;
  --error-color: #ff4f79;

  padding: 0;
  margin: 0;
  font-size: 16pt;
  font-family: Arial, Helvetica, sans-serif;
  color: var(--primary-color);
  background-color: var(--secondary-color);
}
.link {
  text-decoration: none;
  color: var(--link-color);
  cursor: pointer;
}
.textarea {
  margin: 10px;
  min-width: 30%;
  width: 800px;
  max-width: 800px;
  font-size: 24pt;
}
</style>
