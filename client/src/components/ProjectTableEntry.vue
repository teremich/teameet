<template >
  <tr class="projectrow" ref="projectrow" @click="visit(props.project.id)">
    <td class="projectcolumn">
      <span class="projectcolumnspan projectname" ref="projectname"></span>
    </td>
    <td class="projectcolumn">
      <span class="projectcolumnspan projectowner" ref="projectowner"></span>
    </td>
    <td class="projectcolumn">
      <span
        class="projectcolumnspan projectdescription"
        ref="projectdescription"
      ></span>
    </td>
    <td class="projectcolumn">
      <span
        class="projectcolumnspan projectlanguages"
        ref="projectlanguages"
      ></span>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted } from "vue";

function visit(id) {
  window.location.href = "/project/?id=" + id;
}

const props = defineProps(["project"]);

const projectname = ref<HTMLSpanElement | null>(null);
const projectowner = ref<HTMLSpanElement | null>(null);
const projectdescription = ref<HTMLSpanElement | null>(null);
const projectlanguages = ref<HTMLSpanElement | null>(null);

onMounted(() => {
  projectname.value.innerText = props.project.name;
  projectowner.value.innerText = props.project.owner.name;
  projectdescription.value.innerText = props.project.description;
  projectlanguages.value.innerText = props.project.languages;
});
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
