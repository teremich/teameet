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
                <tr id="tableheaderrow">
                  <th class="projecttableheader projectname">NAME</th>
                  <th class="projecttableheader projectowner">OWNER</th>
                  <th
                    style="outline: white"
                    class="projecttableheader projectdescription"
                  >
                    DESCRIPTION
                  </th>
                  <th class="projecttableheader projectlanguages">
                    TECHNOLOGIES AND NOTES
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
    <div id="mobile-alternative"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
// @ts-ignore
import Navbar from "@/components/Navbar.vue";
// @ts-ignore
import ProjectTableEntry from "@/components/ProjectTableEntry.vue";

const projects = ref([]);
// window.requestAnimationFrame(() => {
//   (<HTMLElement>document.querySelector("#mobile-alternative")).innerText =
//     innerWidth.toString();
// });

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

#tableheaderrow {
  outline: white;
}

.projecttableheader {
  text-align: left;
}

#newproj {
  margin-left: 5vw;
  margin-right: 0;
}
</style>
