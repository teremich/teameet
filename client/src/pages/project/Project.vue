<template>
  <div>
    <Navbar />
    <main>
      <!-- TODO: feature to leave a project -->
      <h2 id="name">{{ project.name }}</h2>
      <div id="public">
        <div id="info">
          <label style="font-weight: bold">description:</label>
          <p id="description">{{ project.description }}</p>
          <label
            style="font-weight: bold"
            v-if="project.additional?.links?.length"
            >links
            <span style="opacity: 0.3; font-weight: initial"
              >(warning: be cautious visiting other web sites)</span
            ></label
          >
          <p v-for="(link, index) in project.additional?.links" :key="index">
            <span>{{ link.name }}</span
            >: <a class="link" :href="link.target">{{ link.target }}</a>
          </p>
          <br />
          <p style="font-weight: bold">
            owner:
            <a
              style="font-weight: initial"
              class="link"
              :href="'/profile/?id=' + project.owner.uuid"
              >{{ project.owner.name }}</a
            >
          </p>
          <p style="font-weight: bold">
            members:
            <a
              class="link"
              style="font-weight: initial"
              v-for="(member, i) in project.members"
              v-text="
                member.name + (i == project.members.length - 1 ? '' : ', ')
              "
              :key="i"
              :href="'/profile/?id=' + member.uuid"
            >
            </a>
            <span style="font-weight: initial" v-if="!project.members.length">
              no members
            </span>
          </p>
          <div v-if="user.level >= level.member">
            <p style="font-weight: bold">Users who want to join this project</p>
            <p v-for="jr in project.joinRequests" :key="jr.sender.uuid">
              <a class="link" :href="'/profile/?id=' + jr.sender.uuid">{{
                jr.sender.name
              }}</a
              >: {{ jr.message }}
            </p>
            <p v-if="!project.joinRequests?.length">
              there are no open join requests
            </p>
          </div>
        </div>
        <br />
        <div>
          <a
            class="button"
            :href="'/project/settings/?id=' + params.get('id')"
            v-if="user.level == level.owner"
            id="settings"
          >
            settings
          </a>
          <a
            v-if="user.level == level.logged_out"
            class="button"
            id="memberlogin"
            :href="'/login?href=/project/?id=' + id"
            >login to become a member</a
          >
          <a
            id="joinbutton"
            class="link"
            v-if="user.level == level.logged_in"
            :href="'/project/join/?id=' + params.get('id')"
          >
            become a member
          </a>
          <button
            class="button"
            @click="leave"
            v-if="user.level == level.member"
          >
            leave the project
          </button>
        </div>
      </div>
      <div id="private">
        <!-- TODO: display tasks (maybe interactive) -->
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
// @ts-ignore
import Navbar from "@/components/Navbar.vue";

const project = ref({
  name: "sorry, we coudn't find this project",
  description: "you can go back to the homepage",
  owner: {
    name: "",
    uuid: 0,
  },
  members: <any[]>[],
  joinRequests: [],
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
  console.log(
    `/api/v0/leave?project=${params.get("id")}&user=${user.value.uuid}`,
    { method: "POST" }
  );
}

onMounted(() => {
  if (params.get("id")) {
    fetch("/api/v0/project?id=" + params.get("id"))
      .then((r) => r.json())
      .then((res) => {
        if (res.status != 200) {
          console.error(res);
          return;
        }
        project.value = res.body.projects[0];
        document.title = `${project.value.name} | Teameet`;
        fetch("/api/v0/login")
          .then((r) => r.json())
          .then(async (r) => {
            if (r.status != 200) {
              user.value = { level: level.logged_out, uuid: 0 };
              return;
            }
            user.value.uuid = r.body.uuid;
            if (r.body.uuid == project.value.owner.uuid) {
              user.value.level = level.owner;
              return;
            }
            if (isMember(r.body.uuid, project.value)) {
              user.value.level = level.member;
            } else {
              user.value.level = level.logged_in;
            }
          });
      });
  } else {
    location.href = "/";
  }
});
</script>

<style scoped>
#public {
  width: 50%;
  float: left;
}

#private {
  width: 50%;
  float: right;
}

#description {
  background-color: var(--navbar-color);
  padding: 1vw;
}
</style>