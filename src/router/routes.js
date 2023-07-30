
const routes = [
  {
    path: '/',
    redirect: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/home', component: () => import('pages/IndexPage.vue') },
      { path: '/builder', component: () => import('pages/BuilderPage.vue') },
      { path: '/settings', component: () => import('pages/SettingsPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
