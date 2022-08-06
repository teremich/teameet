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
}

.failed {
  color: red;
  display: none;
  width: fit-content;
}
main {
  margin: 15px;
}
body {
  padding: 0;
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  --primary-color: #ccd3e9;
  color: var(--primary-color);
  --secondary-color: #2c2727;
  --navbar-color: #1b1818;
  --link-color: #ffffff;
  background-color: var(--secondary-color);
}
</style>
