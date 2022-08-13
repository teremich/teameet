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

.error {
  color: #f7717d;
  display: none;
  width: fit-content;
}
main {
  margin: 15px;
}
body {
  padding: 0;
  margin: 0;
  font-size: 16pt;
  font-family: Arial, Helvetica, sans-serif;
  --primary-color: #f7ece1;
  color: var(--primary-color);
  --secondary-color: #29262c;
  --navbar-color: #1e1819;
  --link-color: #c6e7e5;
  background-color: var(--secondary-color);
}
.link {
  text-decoration: none;
  color: var(--link-color);
  cursor: pointer;
}
</style>
