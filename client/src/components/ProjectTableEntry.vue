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
import { ref, onMounted } from "vue";

function visit(id) {
  window.location.href = "/project/?id=" + id;
}

const props = defineProps(["project"]);

const projectname = ref<HTMLSpanElement | null>(null);
const projectowner = ref<HTMLSpanElement | null>(null);
const projectdescription = ref<HTMLSpanElement | null>(null);
const projectlanguages = ref<HTMLSpanElement | null>(null);
</script>

<style scoped>
@import "../assets/tablestyle.css";

.projectcolumnspan {
  max-height: 45px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.projectcolumnspan:hover {
  cursor: default;
}
.projectrow {
  width: 90vw;
  height: 40px;
}
.projectrow:hover {
  background-color: var(--primary-color);
  color: var(--secondary-color);
}
</style>
