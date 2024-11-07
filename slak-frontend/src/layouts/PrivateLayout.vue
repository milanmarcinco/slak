<template>
  <q-layout view="hHh lpR LFr">
    <q-header class="q-px-md q-pt-md text-white">
      <q-toolbar class="bg-primary rounded-borders">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <AppBrand />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      class="q-pl-md q-py-md"
    >
      <SidebarContent />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="q-pb-md q-px-md"><CommandLine /></q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import CommandLine from 'components/command-line/CommandLine.vue';
import SidebarContent from 'components/sidebar/SidebarContent.vue';
import AppBrand from 'components/shared/AppBrand.vue';

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

defineOptions({
  name: 'PrivateLayout',
});
</script>

<style lang="scss">
.q-header {
  background-color: $dark-page;

  .q-toolbar__title {
    &.ellipsis {
      overflow: visible;
    }
  }

  .q-avatar__content {
    overflow: visible !important;
  }
}

.q-drawer {
  background-color: transparent;
}

.q-footer {
  background-color: $dark-page;
}
</style>
