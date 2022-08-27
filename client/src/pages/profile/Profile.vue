<template>
  <div>
    <header>
      <Navbar />
    </header>
    <main>
      <div v-if="user?.ownInfo">
        <p>Hello there, {{ user.payload.name }}!</p>
      </div>
      <div v-else-if="!user">
        <p>Sorry, we couldn't find this user :/</p>
      </div>
      <div v-else>
        <p>This is the beautiful profile of {{ user.payload.name }}!</p>
      </div>
      <div v-if="user">
        <div v-if="user.payload.bio?.default">
          <label>bio:</label>
          <p id="bio">
            {{ user.payload.bio?.default }}
          </p>
        </div>
        <p style="font-weight: bold">owner of</p>
        <p v-if="!user.payload.ownerOf.length">no projects</p>
        <p v-else v-for="p in user.payload.ownerOf" :key="p.id">
          <a class="link" :href="'/project/?id=' + p.id">{{ p.name }}</a
          >: {{ truncate(p.description, 100) }}
        </p>
        <p style="font-weight: bold">member of</p>
        <p v-if="!user.payload.memberOf.length">no projects</p>
        <p v-else v-for="p in user.payload.memberOf" :key="p.id">
          <a class="link" :href="'/project/?id=' + p.id">{{ p.name }}</a
          >: {{ truncate(p.description, 100) }}
        </p>
      </div>
      <div v-if="user?.ownInfo">
        <p style="font-weight: bold">your join requests</p>
        <p v-if="!user.payload.joins.length">
          you have no unanswered join requests
        </p>
        <p v-else v-for="(j, i) in user.payload.joins" :key="i">
          <a class="link" :href="'/project/?id=' + j.receiver.id">{{
            j.receiver.name
          }}</a
          >: {{ j.message }}
        </p>
        <a href="/profile/settings" class="button">settings</a>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// @ts-ignore
import Navbar from "@/components/Navbar.vue";

function closestValue(list: number[], value: number) {
  if (!list.length) {
    return [null, null];
  }
  let cv = list[0];
  let dist = cv > value ? cv - value : value - cv;
  for (const num of list) {
    const d = num > value ? num - value : value - num;
    if (d < dist) {
      dist = d;
      cv = num;
    }
  }
  return [cv, dist];
}

function truncate(input: string) {
  if (input.length < 100) {
    return input;
  }
  const regexList = [/[!.?;]\s/g, /,\s/g, /.\s/g];
  let result;
  const indices = new Set<number>();
  let cv = null;
  let dist = null;
  for (const regex of regexList) {
    while ((result = regex.exec(input))) {
      indices.add(result.index + 1);
    }
    [cv, dist] = closestValue(
      [...indices].filter((v) => {
        return v <= 120 && v >= 70;
      }),
      100
    );
    if (dist && dist < 10) {
      return input.substring(0, <number>cv) + "…";
    }
  }
  if (dist && dist < 20) {
    return input.substring(0, <number>cv) + "…";
  }
  return input.substring(0, 100) + "…";
}

interface Project {
  id: number;
  ownerId: number;
  name: string;
  description: string;
  createdAt: Date;
  additional: any | null;
}

interface publicInfo {
  uuid: number;
  name: string;
  ownerOf: Project[];
  memberOf: Project[];
  bio: any;
  additional: any | null;
}

interface privateInfo extends publicInfo {
  email: string;
  createdAt: Date;
  joins: {
    additional: any;
    createdAt: Date;
    message: string;
    receiver: Project;
  }[];
}

const user = ref<{
  ownInfo: boolean;
  payload: publicInfo | privateInfo;
} | null>(null);

const params = new URLSearchParams(document.location.search);

fetch("/api/v0/profile/?id=" + params.get("id"))
  .then((r) => r.json())
  .then(
    async (r: {
      status: number;
      body: {
        ownInfo: boolean;
        payload: publicInfo | privateInfo;
      };
    }) => {
      if (r.status != 200) {
        console.error(r);
        return;
      }
      document.title = `Profile of ${r.body.payload.name} | Teameet`;
      user.value = r.body;
    }
  );
</script>

<style scoped>
#bio {
  background-color: var(--navbar-color);
  padding: 1vw;
}
</style>