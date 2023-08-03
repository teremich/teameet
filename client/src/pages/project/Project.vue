<template>
  <div>
    <Navbar @loadfinished="onLoaded" />
    <main style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 20px 40px;">
      <div style="grid-row: 1; grid-column-end: 4; grid-column-start: 1;">
        <h2 id="name">{{ project.name }}</h2>
        <hr />
        <br/>
      </div>
      <div id="public">
        <div id="info">
          <label style="font-weight: bold">description:</label>
          <p id="description" class="textbox">{{ project.description }}</p>
          <div style="grid-column: 3;">
            <label style="font-weight: bold;">Team</label>
            <p style="font-weight: bold">
              owner:
              <router-link
                style="font-weight: initial"
                class="link"
                :to="{ path: '/profile/', query: { id: project.owner.uuid } }"
                >{{ project.owner.name }}</router-link
              >
            </p>
            <p style="font-weight: bold">
              members:
              <router-link
                class="link"
                style="font-weight: initial"
                v-for="(member, i) in project.members"
                v-text="
                  member.name + (i == project.members.length - 1 ? '' : ', ')
                "
                :key="i"
                :to="{ path: '/profile/', query: { id: member.uuid } }"
              >
              </router-link>
              <span style="font-weight: initial" v-if="!project.members.length">
                no members
              </span>
            </p>
          </div>
        </div>
        <br />
        <div>
          <router-link
            class="button"
            :to="{
              path: '/project/settings/',
              query: { id: params.get('id') },
            }"
            v-if="user.level == level.owner"
            id="settings"
          >
            <a v-if="project.joinRequests.length" class="button" style="background-color: var(--error-color); margin: 5px; padding: 0; color: var(--secondary-color)" >{{ project.joinRequests.length || "" }}</a>settings
          </router-link>
          <router-link
            v-if="user.level == level.logged_out"
            class="button"
            id="memberlogin"
            :to="{
              path: '/login/',
            }"
            >login to become a member</router-link
          >
          <router-link
            id="joinbutton"
            class="button"
            v-if="user.level == level.logged_in"
            :to="{ path: '/project/join/', query: { id: params.get('id') } }"
          >
            JOIN
          </router-link>
          <button
            class="button"
            @click="leave"
            v-if="user.level == level.member"
          >
            leave the project
          </button>
        </div>
      </div>
      <div id="private" :style="'display: ' + ((user.level == level.member || user.level == level.owner ) ? 'block' : 'none')">
        <div>
          <label style="font-weight: bold">tasks</label>
          <div v-if="project.tasks.length">
            <div v-for="(task, index) in project.tasks" style="background-color: var(--navbar-color); border-radius: 15px; padding: 1em" :key="index">
              <label style="font-weight: bolder;">{{ task.name }}</label>
              <p>{{ task.details }}</p>
              <a v-for="uuid of task.users" :key="uuid" class="link" :href="'/profile?id=' + uuid">{{ getUserName(uuid) }}</a>
            </div>
          </div>
          <br />
        </div>
        <div>
        <label
            style="font-weight: bold"
            v-if="project.additional?.private?.links?.length"
            >links
            <span style="font-weight: initial" class="opaque"
              >(warning: be cautious visiting other web sites)</span
            ></label
          >
          <p v-for="(link, index) in project.additional?.private?.links" :key="index">
            <span>{{ link.name }}</span
            >:
            <a class="link" :href="link.target" target="_blank">{{
              link.target
            }}</a>
          </p>
          <br />
        </div>
        <!-- [ ] show links and techstack -->
        <!-- [ ] feature to leave a project -->
        <!-- [ ] show the team more beautifully -->
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
// @ts-ignore
import Navbar from "@/components/Navbar.vue";

function getUserName(uuid: number) {
  const req = new XMLHttpRequest();
  req.open("GET", "/api/v0/profile?id=" + uuid, false);
  req.send();
  const body = JSON.parse(req.responseText);
  return body.payload.name;
}

const project = ref({
  additional: <any>null,
  description: "you can go back to the homepage",
  id: 0,
  name: "sorry, we coudn't find this project",
  details: {},
  owner: {
    name: "",
    uuid: 0,
  },
  members: <any[]>[],
  joinRequests: <any[]>[],
  tasks: <any[]>[],
});

enum level {
  undefined = 0,
  logged_out,
  logged_in,
  member,
  owner,
  // admin
}

const user = ref({ level: level.undefined, uuid: 0 });

const params = new URLSearchParams(document.location.search);

function isMember(
  userid: number,
  project: {
    members: { uuid: number }[];
  }
) {
  for (const mem of project.members) {
    if (mem.uuid == userid) {
      return true;
    }
  }
  return false;
}

function leave() {
  if (user.value.level != level.member) {
    // TODO: display error message that only members can leave
    return;
  }
  fetch(`/api/v0/leave?project=${params.get("id")}&ban=0`, {
    method: "POST",
  }).then((res) => {
    if (res.ok) {
      window.location.href = "/project/?id=" + params.get("id");
    }
  });
}

async function onLoaded(event: {
  loggedIn: boolean;
  payload?: any;
}) {
  if (!params.get("id")) {
    location.href = "/";
    return;
  }
  const r = await fetch("/api/v0/project?id=" + params.get("id"))
  if (r.status != 200) {
    console.error(r);
    r.text().then(console.error);
    return;
  }
  const body = await r.json();
  project.value = body.projects[0];
  document.title = `${project.value.name} | Teameet`;
  if (!event.loggedIn) {
    user.value = { level: level.logged_out, uuid: 0 };
      (document.getElementById("memberlogin") as any).to.query = {
        href: document.location.href,
    };
    return;
  }
  user.value.uuid = event.payload!.uuid;
  if (user.value.uuid == project.value.owner.uuid) {
    user.value.level = level.owner;
    return;
  }
  if (isMember(user.value.uuid, project.value)) {
    user.value.level = level.member;
  } else {
    user.value.level = level.logged_in;
  }
}
</script>

<style scoped>
</style>