import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
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

  {
    path: '/sign-in',
    component: () => import('layouts/PublicLayout.vue'),
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
    children: [
      {
        path: '',
        component: () => import('pages/SignUpPage.vue'),
        name: 'sign-up',
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
