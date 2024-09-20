<template>
  <q-layout view="hHh lpR LFr">
    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>

          {{ $t('title') }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
      class="column q-py-md"
    >
      <SidebarContent />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="q-pa-sm bg-dark" bordered><CommandLine /></q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SidebarContent from 'components/sidebar/SidebarContent.vue';
import CommandLine from 'src/components/command-line/CommandLine.vue';

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

defineOptions({
  name: 'MainLayout',
});
</script>
