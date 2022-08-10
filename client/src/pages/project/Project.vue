<template>
  <div>
    <Navbar />
    <main>
      <h2 id="name">{{ project.name }}</h2>
      <div id="info">
        <label>description:</label>
        <p id="description">{{ project.description }}</p>
        <br />
        <p>
          owner:
          <a class="personlink" :href="'/profile/?id=' + project.owner.uuid">{{
            project.owner.name
          }}</a>
        </p>
        <p>
          members:
          <a
            class="personlink"
            v-for="member in project.members"
            :key="member.id"
            :href="'/profile/?id=' + member.uuid"
            >{{ member.name }},</a
          >
        </p>
      </div>
      <div>
        <button
          @click="remove()"
          style="display: none"
          ref="settings"
          id="settings"
        >
          delete this project
        </button>
        <a
          class="button"
          style="display: none"
          ref="memberlogin"
          id="memberlogin"
          >login to become a member</a
        >
        <button
          ref="joinbutton"
          id="joinbutton"
          style="display: none; cursor: pointer"
          @click="join()"
        >
          become a member
        </button>
        <span ref="member" id="member" style="display: none"
          >you are a member</span
        >
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Navbar from "../../components/Navbar.vue";

// TODO: make this site more beautiful
// TODO: what if project doesn't exist

const project = ref({
  name: "sorry, we coudn't find this project",
  description: "you can go back to the homepage",
  owner: {
    name: "",
    uuid: 0,
  },
  members: [],
});

const memberlogin = ref<HTMLLinkElement | null>(null);
const settings = ref<HTMLLinkElement | null>(null);
const member = ref<HTMLElement | null>(null);
const joinbutton = ref<HTMLAnchorElement | null>(null);

const params = new URLSearchParams(document.location.search);

// TODO
function join() {}

function remove() {
  fetch("/api/project/?id=" + params.get("id"), {
    method: "DELETE",
  }).then((r) => {
    window.location.href = "/";
  });
}

onMounted(() => {
  if (params.get("id")) {
    fetch("/api/project?id=" + params.get("id"))
      .then((r) => r.json())
      .then((res) => {
        if (res.status != 200) {
          console.error(res);
          return;
        }
        project.value = res.body.projects[0];
        document.title = `${project.value.name} | Teameet`;
        main();
      });
  } else {
    location.href = "/";
  }
  function isMember(userid, project) {
    for (let mem of project.members) {
      if (mem.uuid == userid) {
        return true;
      }
    }
    return false;
  }
  function main() {
    fetch("/api/login")
      .then((r) => r.json())
      .then(async (r) => {
        if (r.status != 200) {
          memberlogin.value.href =
            "/login?href=" + encodeURI("/project/?id=" + params.get("id"));
          memberlogin.value.style.display = "";
          return;
        }
        if (r.body.uuid == project.value.owner.uuid) {
          settings.value.style.display = "";
          settings.value.href = "/project/settings/?id=" + params.get("id");
          return;
        }
        if (isMember(r.body.uuid, project.value)) {
          member.value.style.display = "";
        } else {
          joinbutton.value.style.display = "";
          joinbutton.value.href = "/project/join/?id=" + params.get("id");
        }
      });
  }
});
</script>

<style scoped>
.personlink {
  text-decoration: none;
  color: var(--primary-color);
  cursor: pointer;
}
#description {
  background-color: var(--navbar-color);
  padding: 1vw;
}
</style>