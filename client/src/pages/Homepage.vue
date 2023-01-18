<template>
  <div>
    <header>
      <Navbar />
    </header>
    <main id="desktop-version">
      <div>
        <div
          style="
            display: grid;
            grid-template-columns: repeat(4, minmax(0, auto));
            grid-gap: 10px;
          "
        >
          <div class="projecttableheader projectname">NAME</div>
          <div class="projecttableheader projectowner">OWNER</div>
          <div
            style="outline: white"
            class="projecttableheader projectdescription"
          >
            DESCRIPTION
          </div>
          <div class="projecttableheader projectlanguages">
            TECHNOLOGIES AND NOTES
          </div>

          <ProjectTableEntry v-for="p in projects" :key="p.id" :project="p" />
        </div>
        <div id="newproj">
          <router-link class="button" to="/project/new">
            create a new Project
          </router-link>
        </div>
      </div>
    </main>
    <main id="mobile-version"></main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
// @ts-ignore
import Navbar from "@/components/Navbar.vue";
// @ts-ignore
import ProjectTableEntry from "@/components/ProjectTableEntry.vue";

const projects = ref([]);

onMounted(async () => {
  const p = await fetch("/api/v0/project").then((r) => r.json());
  projects.value = p.body["projects"];
});
</script>

<style scoped lang="scss">
@import "@/assets/tablestyle.css";

@media only screen and (max-device-width: 900px) {
  main {
    display: none;
  }
}

h1 {
  text-align: center;
  text-decoration: underline;
}

#projectstable {
  margin: 5vw;
  margin-top: 0;
  padding: 0;
  table-layout: fixed;
  border-spacing: 0 1vh;
}

.projecttableheader {
  text-align: left;
}

#newproj {
  margin: 5vw 1vh;
}
</style>
