<template>
  <v-row class="mt-sm-2">
    <v-col cols="12" sm="10" class="mx-auto">
      <user-form v-if="user" :user="user"></user-form>
    </v-col>
  </v-row>
</template>

<script>
import UserForm from "@/components/Forms/UserForm";
import { EventBus } from "@/plugins/eventBus.js";

export default {
  name: "UserDetail",
  components: {
    "user-form": UserForm
  },
  data() {
    return {
      user: undefined
    };
  },
  async created() {
    this.user = this.$store.getters.getUserById(this.$route.params.id);
    if (!this.user) {
      let res = await this.$store.dispatch("loadUser", this.$route.params.id);
      if (res.error) {
        EventBus.$emit("newMsg", {
          text: "Usuario nao existe",
          error: true
        });
        this.$router.push({ name: "UsersList" });
      } else {
        this.user = res.data;
      }
    }
  }
};
</script>

<style scoped></style>
