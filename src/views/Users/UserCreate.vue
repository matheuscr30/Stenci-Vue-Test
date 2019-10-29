<template>
  <v-row class="mt-sm-2">
    <v-col cols="12" sm="10" class="mx-auto">
      <user-form></user-form>
    </v-col>
  </v-row>
</template>

<script>
import UserForm from "@/components/Forms/UserForm";

export default {
  name: "UserCreate",
  components: {
    "user-form": UserForm
  }
};
</script>

<style scoped></style>
