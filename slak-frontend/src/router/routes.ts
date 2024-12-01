import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/offline',
    component: () => import('layouts/PublicLayout.vue'),
    meta: {},
    children: [
      {
        path: '',
        component: () => import('pages/OfflinePage.vue'),
        name: 'offline',
      },
    ],
  },

  {
    path: '/sign-in',
    component: () => import('layouts/PublicLayout.vue'),
    meta: { public: true },
    children: [
      {
        path: '',
        component: () => import('pages/SignInPage.vue'),
        name: 'sign-in',
      },
    ],
  },

  {
    path: '/sign-up',
    component: () => import('layouts/PublicLayout.vue'),
    meta: { public: true },
    children: [
      {
        path: '',
        component: () => import('pages/SignUpPage.vue'),
        name: 'sign-up',
      },
    ],
  },

  {
    path: '/',
    component: () => import('layouts/PrivateLayout.vue'),
    meta: { private: true },
    children: [
      {
        path: '/',
        component: () => import('pages/IndexPage.vue'),
        name: 'index',
      },
      {
        path: '/:channelId',
        component: () => import('pages/ChannelPage.vue'),
        name: 'channel',
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/NotFoundPage.vue'),
    name: 'not-found',
  },
];

export default routes;
