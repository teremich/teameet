<template>
  <div>
    <Navbar />
    <main>
      <h2 id="name">{{ project.name }}</h2>
      <div id="public">
        <div id="info">
          <label style="font-weight: bold">description:</label>
          <p id="description" class="textbox">{{ project.description }}</p>
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
            >:
            <router-link class="link" :to="link.target">{{
              link.target
            }}</router-link>
          </p>
          <br />
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
      <div id="private">
        <div>
          <label>tasks</label>
        </div>
        <!-- [ ] display tasks -->
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

const project = ref({
  name: "sorry, we coudn't find this project",
  description: "you can go back to the homepage",
  owner: {
    name: "",
    uuid: 0,
  },
  members: <any[]>[],
  joinRequests: <any[]>[],
  additional: <any>null
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

onMounted(() => {
  if (params.get("id")) {
    fetch("/api/v0/project?id=" + params.get("id"))
      .then((r) => {
        if (r.status != 200) {
          console.error(r);
          r.text().then(console.error);
        } else {
          return r.json();
        }
      })
      .then((body) => {
        project.value = body.projects[0];
        document.title = `${project.value.name} | Teameet`;
        fetch("/api/v0/login")
          .then(async (r) => {
            if (r.status != 200) {
              user.value = { level: level.logged_out, uuid: 0 };
              (document.getElementById("memberlogin") as any).to.query = {
                href: document.location.href,
              };
              return;
            }
            r.json().then(body => {
              user.value.uuid = body.uuid;
              if (body.uuid == project.value.owner.uuid) {
                user.value.level = level.owner;
                return;
              }
              if (isMember(body.uuid, project.value)) {
                user.value.level = level.member;
              } else {
                user.value.level = level.logged_in;
              }
            });
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
</style>