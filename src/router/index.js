import Vue from "vue";
import VueRouter from "vue-router";

import Main from "@/views/Main.vue";
import UsersList from "@/views/Users/UsersList";
import UserDetail from "@/views/Users/UserDetail";
import UserCreate from "@/views/Users/UserCreate";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
    children: [
      {
        path: "users/",
        name: "UsersList",
        component: UsersList
      },
      {
        path: "users/create",
        name: "UserCreate",
        component: UserCreate
      },
      {
        path: "users/:id",
        name: "UserDetail",
        component: UserDetail
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
