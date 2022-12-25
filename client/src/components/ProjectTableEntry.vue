<template >
  <!-- <router-link
      class="link"
      :to="{ path: '/project', query: { id: props.project.id } }"
    > -->
  <tr class="projectrow">
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
    <!-- </router-link> -->
  </tr>
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

td > span.projectcolumnspan {
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 5vh;
  min-width: 200px;
}

td > span.projectcolumnspan:hover {
  cursor: default;
}

tr.projectrow {
  width: 90vw;
  height: 5vh;
  vertical-align: top;
}

tr.projectrow:hover {
  background-color: var(--primary-color);
  color: var(--secondary-color);
  transition: color 250ms linear;
  transition-property: background-color, color;
}
</style>
