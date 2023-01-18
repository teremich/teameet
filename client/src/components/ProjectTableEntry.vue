<template >
  <router-link
    :to="{ path: '/project', query: { id: props.project.id } }"
    style="display: contents"
    class="projectrow"
  >
    <div class="projectcolumn">
      <span class="projectcolumnspan projectname">{{
        props.project.name
      }}</span>
    </div>
    <div class="projectcolumn">
      <span class="projectcolumnspan projectowner">{{
        props.project.owner.name
      }}</span>
    </div>
    <div class="projectcolumn">
      <span class="projectcolumnspan projectdescription">{{
        props.project.description
      }}</span>
    </div>
    <div class="projectcolumn">
      <span class="projectcolumnspan projectlanguages">{{
        props.project.details.languages ??
        "no languages or technologies defined"
      }}</span>
    </div>
  </router-link>
</template>

<script setup lang="ts">
// eslint-disable-next-line
function visit(id: number) {
  window.location.href = "/project/?id=" + id;
}
const props = defineProps(["project"]);
</script>

<style scoped>
@import "@/assets/tablestyle.css";

span.projectcolumnspan {
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 5vh;
  min-width: 200px;
}

span.projectcolumnspan:hover {
  cursor: default;
}

.projectrow {
  width: 90vw;
  height: 5vh;
  vertical-align: top;
}
.projectrow:hover > * {
  background-color: var(--primary-color);
  color: var(--secondary-color);
  transition: color 250ms linear;
  transition-property: background-color, color;
}
</style>
