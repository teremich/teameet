<template>
  <div>
    <Navbar />
    <main>
      <span style="font-weight: bold" ref="name" id="name"></span>
      <div ref="info">
        <p id="description"></p>
        <p>owner: {{ owner.name }}</p>
        <p>members: {{ members.toString() }}</p>
      </div>
      <div>
        <a class="button" style="display: none" ref="settings" id="settings"
          >configure the settings</a
        >
        <a
          class="button"
          style="display: none"
          ref="memberlogin"
          id="memberlogin"
          >login to become a member</a
        >
        <a
          class="button"
          ref="joinbutton"
          id="joinbutton"
          style="display: none; cursor: pointer"
        >
          become a member
        </a>
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

const owner = ref({
  name: "",
});

const members = ref<string[]>([]);

const name = ref<HTMLElement | null>(null);
const info = ref<HTMLElement | null>(null);
const memberlogin = ref<HTMLLinkElement | null>(null);
const settings = ref<HTMLLinkElement | null>(null);
const member = ref<HTMLElement | null>(null);
const joinbutton = ref<HTMLAnchorElement | null>(null);

const params = new URLSearchParams(document.location.search);
let PROJECT;

onMounted(() => {
  if (params.get("id")) {
    fetch("/api/project?id=" + params.get("id"))
      .then((r) => r.json())
      .then((res) => {
        if (res.status != 200) {
          console.error(res);
          return;
        }
        PROJECT = res.body.projects[0];
        document.title = `${PROJECT.name} | Teameet`;
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
    name.value.innerText = PROJECT.name;
    (<HTMLParagraphElement>info.value.querySelector("#description")).innerText =
      PROJECT.description;
    owner.value = PROJECT.owner;
    members.value = PROJECT.members.map((member) => member.name);
    fetch("/api/login")
      .then((r) => r.json())
      .then(async (r) => {
        if (r.status != 200) {
          memberlogin.value.href =
            "/login?ref=" + encodeURI("/project/?id=" + params.get("id"));
          memberlogin.value.style.display = "";
          return;
        }
        if (r.body.uuid == PROJECT.owner.uuid) {
          settings.value.style.display = "";
          settings.value.href = "/project/settings/?id=" + params.get("id");
          return;
        }
        if (isMember(r.body.uuid, PROJECT)) {
          member.value.style.display = "";
        } else {
          joinbutton.value.style.display = "";
          joinbutton.value.href = "/project/join/?id=" + params.get("id");
        }
      });
  }
});
</script>

<style>
</style>