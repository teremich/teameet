<template >
  <tr class="projectrow" @click="visit(props.project.id)">
    <td class="projectcolumn">
      <span class="projectcolumnspan projectname">{{
        props.project.name
      }}</span>
    </td>
    <td class="projectcolumn">
      <span class="projectcolumnspan projectowner">{{
        props.project.owner.name
      }}</span>
    </td>
    <td class="projectcolumn">
      <span class="projectcolumnspan projectdescription">{{
        props.project.description
      }}</span>
    </td>
    <td class="projectcolumn">
      <span class="projectcolumnspan projectlanguages">{{
        props.project.details.languages ??
        "no languages or technologies defined"
      }}</span>
    </td>
  </tr>
</template>

<script setup lang="ts">
function visit(id: number) {
  window.location.href = "/project/?id=" + id;
}
const props = defineProps(["project"]);
</script>

<style scoped>
@import "@/assets/tablestyle.css";

.projectcolumnspan {
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 5vh;
  min-width: 200px;
}

.projectcolumnspan:hover {
  cursor: default;
}

.projectrow {
  width: 90vw;
  height: 5vh;
  vertical-align: top;
}
.projectrow:hover {
  background-color: var(--primary-color);
  color: var(--secondary-color);
}
</style>
