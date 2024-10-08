<template>
  <q-layout view="hHh lpR LFr">
    <q-header class="q-px-md q-pt-md text-white">
      <q-toolbar class="bg-primary rounded-borders">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <div class="app-brand row items-center non-selectable">
            <q-avatar>
              <SlakLogo white />
            </q-avatar>

            <span class="app-brand__name">{{ $t('title') }}</span>
          </div>
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
import SlakLogo from 'components/shared/SlakLogo.vue';
import SidebarContent from 'components/sidebar/SidebarContent.vue';

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

defineOptions({
  name: 'PrivateLayout',
});
</script>

<style lang="scss">
.app-brand {
  &__name {
    margin-left: 0.25rem;

    font-size: 1rem;
    font-weight: 900;
    letter-spacing: 2px;
    text-transform: uppercase;

    text-shadow: 0px 0px 16px rgba(255, 255, 255, 1);
  }
}

.q-header {
  background-color: $dark-page;
}

.q-drawer {
  background-color: transparent;
}

.q-footer {
  background-color: $dark-page;
}
</style>
