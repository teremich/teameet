<template>
  <div>
    <header>
      <Navbar />
    </header>
    <main>
      <div>
        <div>
          <div>
            <table id="projectstable">
              <tbody>
                <tr>
                  <th class="projecttableheader projectname">name</th>
                  <th class="projecttableheader projectowner">owner</th>
                  <th class="projecttableheader projectdescription">
                    description
                  </th>
                  <th class="projecttableheader projectlanguages">
                    technologies
                  </th>
                </tr>
                <ProjectTableEntry
                  v-for="p in projects"
                  :project="p"
                  :key="p.id"
                />
              </tbody>
            </table>
          </div>
          <div id="newproj">
            <a class="button" href="/project/new"> create a new Project </a>
          </div>
        </div>
      </div>
    </main>
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
  const p = await fetch("/api/project").then((r) => r.json());
  projects.value = p.body["projects"];
});
</script>

<style scoped>
@import "@/assets/tablestyle.css";

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
  margin-left: 5vw;
  margin-right: 0;
}
</style>
