<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawerMenu"
      :stateless="!$isMobile"
      clipped
      app
    >
      <v-list nav dense>
        <v-list-item-group color="primary">
          <v-list-item
            link
            v-for="item in drawerItems"
            :key="item.ref"
            :to="{ name: item.ref }"
            exact
          >
            <v-list-item-icon>
              <v-icon class="fa-icons">{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left dark color="primary">
      <v-app-bar-nav-icon
        @click="drawerMenu = !drawerMenu"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>User CRUD - Stenci Test</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-snackbar
        v-model="snackbarMsg.active"
        :color="snackbarMsg.color"
        multi-line
        top
      >
        {{ snackbarMsg.text }}
        <v-btn dark text @click="snackbarMsg.active = false">
          Close
        </v-btn>
      </v-snackbar>

      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer app> </v-footer>
  </v-app>
</template>

<script>
import { EventBus } from "@/plugins/eventBus.js";

export default {
  name: "Main",
  data() {
    return {
      drawerMenu: false,
      drawerItems: [
        {
          icon: "fa-users",
          title: "Users",
          ref: "UsersList"
        },
        {
          icon: "fa-user-plus",
          title: "Create User",
          ref: "UserCreate"
        }
      ],
      snackbarMsg: {
        active: false,
        color: "",
        text: ""
      }
    };
  },
  watch: {
    $isMobile() {
      this.drawerMenu = !this.$isMobile;
    }
  },
  created() {
    if (this.$route.name === "main") this.$router.push({ name: "UsersList" });

    EventBus.$on("newMsg", ({ text, error }) => {
      this.snackbarMsg.text = text;
      this.snackbarMsg.color = error ? "error" : "success";
      this.snackbarMsg.active = true;
    });
  }
};
</script>

<style scoped lang="scss">
.v-toolbar {
  .v-icon {
    font-size: 19px !important;
  }
}

.v-list-item {
  .fa-icons {
    color: rgba(0, 0, 0, 0.54);
    font-size: 17px !important;
    margin-left: 4px;
  }

  &.v-list-item--active {
    .fa-icons {
      color: var(--v-primary-base);
    }
  }
}
</style>
