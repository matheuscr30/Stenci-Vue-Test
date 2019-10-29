<template>
  <v-row>
    <v-col cols="12" sm="9" class="mx-auto">
      <v-card>
        <v-list two-line>
          <v-subheader>
            <span>USERS</span>
          </v-subheader>

          <v-alert
            v-if="users.length === 0"
            dense
            text
            type="warning"
            class="mx-4"
          >
            Ainda não há usuários
          </v-alert>

          <template v-for="(user, index) in users">
            <span :key="index">
              <v-divider v-if="index !== 0" inset></v-divider>

              <v-list-item>
                <v-list-item-avatar color="red">
                  <span class="white--text">
                    {{ user.name.substring(0, 2).toUpperCase() }}
                  </span>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{ user.name }}</v-list-item-title>
                  <span v-if="user.userType === userTypes.NATURAL_PERSON">
                    <v-list-item-subtitle>Pessoa Física</v-list-item-subtitle>
                    <v-list-item-subtitle>
                      <span class="text--primary"> CPF: </span
                      >{{ user.cpf | maskCPF }}
                    </v-list-item-subtitle>
                  </span>

                  <span v-else>
                    <v-list-item-subtitle>Pessoa Jurídica</v-list-item-subtitle>
                    <v-list-item-subtitle>
                      <span class="text--primary">CNPJ: </span>
                      {{ user.cnpj | maskCNPJ }}
                    </v-list-item-subtitle>
                  </span>
                </v-list-item-content>

                <v-list-item-action>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        fab
                        small
                        color="success"
                        elevation="2"
                        @click="goToUserDetail(user._id)"
                        v-on="on"
                      >
                        <v-icon color="white" small>
                          fas fa-pen
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Alterar Usuario</span>
                  </v-tooltip>
                </v-list-item-action>
              </v-list-item>
            </span>
          </template>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "UserList",
  filters: {
    maskCPF(value) {
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3\-\$4");
    },
    maskCNPJ(value) {
      return value.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
        "\$1.\$2.\$3\/\$4\-\$5"
      );
    }
  },
  computed: {
    users() {
      return this.$store.getters.users;
    },
    userTypes() {
      return this.$store.getters.userTypes;
    }
  },
  async created() {
    if (this.users.length === 0) await this.$store.dispatch("loadUsers");
  },
  methods: {
    goToUserDetail(userId) {
      this.$router.push({
        name: "UserDetail",
        params: { id: userId }
      });
    }
  }
};
</script>

<style lang="scss">
.v-alert__icon.v-icon {
  font-size: 15px;
}
</style>
