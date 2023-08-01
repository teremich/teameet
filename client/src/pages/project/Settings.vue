<template>
  <div>
    <header>
      <Navbar @loadfinished="onLoaded"/>
    </header>
    <main>
      <h2>configure the project <a id="projectname" class="link"></a></h2>
      <div id="left">
        <!--
          TODO:
            [ ] upsert technologies
            [ ] upsert links
            [ ] upsert tasks
            [ ] delete the project
          TODO (post v1.0):
            [ ] kick / ban members
            [ ] hide jr (like banning without letting them in)
            [ ] unban people
        -->

      </div>
      <div id="right">
          <p style="font-weight: bold">Users who want to join this project:</p>
          <div v-for="jr of project.joinRequests" :key="jr.sender.uuid">
            <router-link
              class="link"
              :to="{ path: '/profile', query: { id: jr.sender.uuid } }"
              >{{ jr.sender.name }}</router-link
            > <button @click="answerJR(jr.sender.uuid, true);" class="button">ACCEPT</button> <button @click="answerJR(jr.sender.uuid, false);" class="button" style="background-color: var(--error-color);">DENY</button>
            <p style="margin-top: 30px;"><a class="textbox"> {{ jr.message }}</a></p>
          </div>
          <p v-if="!project.joinRequests?.length">
            there are no open join requests
          </p>
          <br />
        </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
// @ts-ignore
import Navbar from "@/components/Navbar.vue";

const params = new URLSearchParams(document.location.search);

const project = ref({
  additional: <any>null,
  description: "",
  id: 0,
  name: "",
  details: <any>null,
  createdAt: <Date | null>null,
  owner: {
    name: "", uuid: 0
  },
  members: <any[]>[],
  joinRequests: <any[]>[],
  tasks: <any>null,
  banList: <any[]>[]
});

let meId;

function onLoaded(event: { loggedIn: boolean, payload?: any }) {
  if (!event.loggedIn) {
    window.location.href = "/login?href=/project/settings/?id=" + params.get("id");
    return;
  }
  if (!event.payload!.ownerOf.find((project: { id: number }) => {
    return project.id.toString() == params.get("id");
  })) {
    window.location.href = "/project/?id=" + params.get("id");
  }
  (<HTMLAnchorElement>document.getElementById("projectname")).href = "/project?id=" + params.get("id");
}

onMounted(async () => {
  const r = await fetch("/api/v0/project?id=" + params.get("id"));
  if (r.status != 200) {
    console.error(r);
    r.text().then(console.error);
    return;
  }
  const body = await r.json();
  project.value = body.projects[0];
  (<HTMLSpanElement>document.getElementById("projectname")).innerText = project.value.name;
});

async function answerJR(senderId: number, accepted: boolean) {
  const r = await fetch(`/api/v0/join?user=${senderId}&project=${params.get('id')}&accepted=${accepted}`, {
    method: "DELETE"
  });
  if (r.status == 200) {
    location.reload();
  } else {
    console.error(r);
    r.text().then(console.error);
  }
}

// eslint-disable-next-line
function remove() {
  fetch("/api/v0/project/?id=" + params.get("id"), {
    method: "DELETE",
  }).then(() => {
    window.location.href = "/";
  });
}

</script>

<style scoped>
#left {
  width: 50%;
  float: left;
}
#right {
  width: 50%;
  float: right;
}
</style>