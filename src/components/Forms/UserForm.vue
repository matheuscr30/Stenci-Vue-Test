<template>
  <v-card>
    <v-card-title class="primary white--text pl-2">
      <v-btn
        fab
        depressed
        small
        color="primary"
        class="mr-2"
        @click="goToUsersList"
      >
        <v-icon class="white--text" small>
          fas fa-arrow-left
        </v-icon>
      </v-btn>

      <span v-if="validUser">Update User</span>
      <span v-else>Create User</span>
    </v-card-title>

    <v-card-text class="pb-0">
      <v-form ref="userForm" v-model="validation.validForm" lazy-validation>
        <v-row no-gutters class="mt-2">
          <v-col cols="12" class="mt-3 text-center">
            <div class="avatar-container">
              <v-avatar color="teal" size="128" class="avatar-photo">
                <v-img
                  v-if="validation.auxiliary.photoSrc"
                  :src="validation.auxiliary.photoSrc"
                ></v-img>
                <v-icon dark v-else>fa-user-circle</v-icon>
              </v-avatar>

              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="ma-2 btn-change-photo"
                    text
                    icon
                    v-on="on"
                    @click.stop="triggerPhotoInput"
                  >
                    <v-icon>fa-pen</v-icon>
                  </v-btn>
                </template>
                <span>Alterar Foto</span>
              </v-tooltip>

              <v-tooltip right v-if="validation.auxiliary.photoSrc">
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="ma-2 btn-remove-photo"
                    text
                    icon
                    v-on="on"
                    @click.stop="removePhoto"
                  >
                    <v-icon>fa-times</v-icon>
                  </v-btn>
                </template>
                <span>Remover Foto</span>
              </v-tooltip>
            </div>

            <v-file-input
              ref="profilePhotoInput"
              @change="getPhoto"
              v-model="validation.models.profilePhoto"
              v-show="false"
              accept="image/png, image/jpeg, image/bmp"
            ></v-file-input>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-if="!validUser"
              v-model="validation.models.name"
              prepend-icon="fa-user"
              :rules="validation.rules.name"
              tabindex="1"
              label="Nome *"
              required
            />

            <v-text-field
              v-else
              v-model="validation.models.name"
              label="Nome"
              readonly
            >
            </v-text-field>
          </v-col>

          <v-col cols="12">
            <v-select
              v-if="!validUser"
              v-model="validation.models.userType"
              tabindex="2"
              :items="validation.auxiliary.userTypes"
              :rules="validation.rules.userType"
              item-text="title"
              item-value="value"
              label="Tipo *"
              required
            />

            <v-text-field
              v-else
              v-model="validation.auxiliary.userTypeText"
              label="Tipo"
              readonly
            >
            </v-text-field>
          </v-col>

          <v-slide-x-transition tag="v-row" hide-on-leave>
            <v-row
              no-gutters
              v-if="
                validation.models.userType === this.userTypes.NATURAL_PERSON
              "
            >
              <v-col cols="12">
                <v-text-field
                  v-if="!validUser"
                  v-model="validation.models.cpf"
                  :rules="validation.rules.cpf"
                  v-mask="validation.auxiliary.masks.cpf"
                  tabindex="3"
                  label="CPF *"
                  required
                />

                <v-text-field
                  v-else
                  v-model="validation.models.cpf"
                  v-mask="validation.auxiliary.masks.cpf"
                  label="CPF"
                  readonly
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-dialog
                  ref="birthDateDialog"
                  v-model="validation.auxiliary.birthDateModal"
                  :return-value.sync="validation.models.birthDate"
                  width="300px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="computedBirthDateFormatted"
                      :rules="validation.rules.birthDate"
                      tabindex="1"
                      label="Data de Nascimento *"
                      prepend-icon="event"
                      v-on="on"
                    ></v-text-field>
                  </template>

                  <v-date-picker
                    v-model="validation.models.birthDate"
                    locale="pt-BR"
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="validation.auxiliary.birthDateModal = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="
                        $refs.birthDateDialog.save(validation.models.birthDate)
                      "
                    >
                      Ok
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-col>

              <v-col cols="12" md="6" class="pl-md-5">
                <v-select
                  v-model="validation.models.gender"
                  tabindex="5"
                  prepend-icon="fa-venus-mars"
                  :rules="validation.rules.gender"
                  :items="validation.auxiliary.genders"
                  item-text="title"
                  item-value="value"
                  label="Gênero *"
                  required
                />
              </v-col>
            </v-row>
          </v-slide-x-transition>

          <v-slide-x-transition tag="v-row" hide-on-leave>
            <v-row no-gutters v-if="validation.models.userType === 2">
              <v-col cols="12">
                <v-text-field
                  v-if="!validUser"
                  v-model="validation.models.cnpj"
                  :rules="validation.rules.cnpj"
                  v-mask="validation.auxiliary.masks.cnpj"
                  tabindex="3"
                  label="CNPJ *"
                  required
                />

                <v-text-field
                  v-else
                  v-model="validation.models.cnpj"
                  v-mask="validation.auxiliary.masks.cnpj"
                  label="CNPJ"
                  readonly
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-if="!validUser"
                  v-model="validation.models.corporateName"
                  :rules="validation.rules.corporateName"
                  tabindex="4"
                  label="Razão Social *"
                  required
                />

                <v-text-field
                  v-else
                  v-model="validation.models.corporateName"
                  label="Razão Social"
                  readonly
                />
              </v-col>
            </v-row>
          </v-slide-x-transition>

          <v-col cols="12" class="mt-2">
            <span class="subtitle-2 secondary--text">Contato</span>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="validation.models.email"
              prepend-icon="mail"
              :rules="validation.rules.email"
              tabindex="6"
              label="Email"
            />
          </v-col>

          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="validation.models.residentialNumber"
                  v-mask="validation.auxiliary.masks.residentialNumber"
                  :rules="validation.rules.residentialNumber"
                  prepend-icon="fa-phone-alt"
                  tabindex="7"
                  label="Telefone Residencial"
                />
              </v-col>

              <v-col cols="12" md="6" class="pl-md-3">
                <v-text-field
                  v-model="validation.models.cellPhoneNumber"
                  v-mask="validation.auxiliary.masks.cellPhoneNumber"
                  :rules="validation.rules.cellPhoneNumber"
                  tabindex="8"
                  label="Telefone Celular"
                />
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <span class="subtitle-2 secondary--text">Endereço</span>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="validation.models.address"
              tabindex="9"
              label="Endereço"
            />
          </v-col>

          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="validation.models.addressNumber"
                  tabindex="10"
                  type="number"
                  min="1"
                  step="1"
                  label="Número"
                />
              </v-col>

              <v-col cols="12" sm="6" md="4" class="pl-sm-3 pl-md-3">
                <v-text-field
                  v-model="validation.models.additionalAddress"
                  tabindex="11"
                  label="Complemento"
                />
              </v-col>

              <v-col cols="12" sm="6" md="4" class="pl-md-3">
                <v-text-field
                  v-model="validation.models.neighborhood"
                  tabindex="12"
                  label="Bairro"
                />
              </v-col>

              <v-col cols="12" sm="6" md="4" class="pl-sm-3 pl-md-0">
                <v-text-field
                  v-model="validation.models.cep"
                  v-mask="validation.auxiliary.masks.cep"
                  :rules="validation.rules.cep"
                  tabindex="13"
                  label="CEP"
                />
              </v-col>

              <v-col cols="12" sm="6" md="4" class="pl-md-3">
                <v-text-field
                  v-model="validation.models.city"
                  tabindex="14"
                  label="Cidade"
                />
              </v-col>

              <v-col cols="12" sm="6" md="4" class="pl-sm-3 pl-md-3">
                <v-text-field
                  v-model="validation.models.state"
                  tabindex="15"
                  label="Estado"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-row>
        <v-col class="pb-1 px-4">
          <v-btn v-if="!validUser" color="error" @click="goToUsersList"
            >Cancelar</v-btn
          >
          <v-btn
            color="success"
            class="float-right"
            @click="save"
            tabindex="16"
            @keyup.enter="save"
            :disabled="!validation.validForm"
            :loading="loadingForm"
          >
            <span v-if="validUser">Salvar</span>
            <span v-else>Criar</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import { EventBus } from "@/plugins/eventBus.js";

export default {
  name: "UserForm",
  props: {
    user: {
      default: () => {
        return {};
      },
      type: Object
    }
  },
  data() {
    return {
      validUser: false,
      loadingForm: false,
      validation: {
        validForm: true,
        models: {
          name: "",
          userType: "",
          cpf: "",
          birthDate: "",
          gender: "",
          cnpj: "",
          corporateName: "",
          email: "",
          residentialNumber: "",
          cellPhoneNumber: "",
          address: "",
          addressNumber: "",
          additionalAddress: "",
          neighborhood: "",
          cep: "",
          city: "",
          state: "",
          profilePhoto: null
        },
        rules: {
          name: [v => !!v || "Nome é obrigatório"],
          userType: [v => !!v || "Tipo é obrigatório"],
          cpf: [
            v => !!v || "CPF é obrigatório",
            v =>
              /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v) || "CPF tem que ser valido"
          ],
          birthDate: [v => !!v || "Data de Nascimento é obrigatório"],
          gender: [v => !!v || "Gênero é obrigatório"],
          cnpj: [
            v => !!v || "CNPJ é obrigatório",
            v =>
              /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(v) ||
              "CNPJ tem que ser valido"
          ],
          corporateName: [v => !!v || "Razão Social é obrigatório"],
          email: [
            v =>
              !v ||
              /^\s*(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\s*$/.test(
                v
              ) ||
              "E-mail tem que ser valido"
          ],
          residentialNumber: [
            v =>
              !v ||
              /^\(\d{2}\)\d{4}-\d{4}$/.test(v) ||
              "Telefone tem que ser valido"
          ],
          cellPhoneNumber: [
            v =>
              !v ||
              /^\(\d{2}\)\d{5}-\d{4}$/.test(v) ||
              "Telefone tem que ser valido"
          ],
          cep: [
            v =>
              !v || /^\d{2}\.\d{3}-\d{3}$/.test(v) || "CEP tem que ser valido"
          ]
        },
        auxiliary: {
          birthDateModal: false,
          userTypeText: "",
          userTypes: [
            { title: "Pessoa Física", value: 1 },
            { title: "Pessoa Jurídica", value: 2 }
          ],
          genders: [
            { title: "Masculino", value: 1 },
            { title: "Feminino", value: 2 },
            { title: "Não Binário", value: 3 },
            { title: "Não Especificado", value: 4 }
          ],
          masks: {
            cpf: "###.###.###-##",
            cnpj: "##.###.###/####-##",
            residentialNumber: "(##)####-####",
            cellPhoneNumber: "(##)#####-####",
            cep: "##.###-###"
          },
          photoSrc: null
        }
      }
    };
  },
  computed: {
    computedBirthDateFormatted: {
      get() {
        return this.formatDate(this.validation.models.birthDate);
      },
      set() {}
    },
    genders() {
      return this.$store.getters.genders;
    },
    userTypes() {
      return this.$store.getters.userTypes;
    }
  },
  created() {
    if (!this.isEmptyObj(this.user)) this.loadUser();
  },
  mounted() {
    if (this.isEmptyObj(this.user)) this.$refs.userForm.reset();
  },
  methods: {
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    getPhoto(file) {
      if (file) this.validation.auxiliary.photoSrc = URL.createObjectURL(file);
    },
    goToUsersList() {
      this.$router.push({ name: "UsersList" });
    },
    isEmptyObj(obj) {
      return Object.keys(obj).length === 0 && obj.constructor === Object;
    },
    loadUser() {
      this.validUser = true;
      this.validation.models.name = this.user.name;
      this.validation.models.userType = this.user.userType;

      if (this.user.userType === this.userTypes.NATURAL_PERSON) {
        this.validation.auxiliary.userTypeText = "Pessoa Física";
        this.validation.models.cpf = this.user.cpf;
        this.validation.models.gender = this.validation.auxiliary.genders.find(
          gender => gender.value === this.user.gender
        ).value;
        let auxDate = new Date(this.user.birthDate);
        this.validation.models.birthDate = `${auxDate.getFullYear()}-${auxDate.getMonth()}-${auxDate.getDate()}`;
      } else {
        this.validation.auxiliary.userTypeText = "Pessoa Jurídica";
        this.validation.models.cnpj = this.user.cnpj;
        this.validation.models.corporateName = this.user.corporateName;
      }

      this.validation.models.email = this.user.email;
      this.validation.models.residentialNumber = this.user.residentialNumber;
      this.validation.models.cellPhoneNumber = this.user.cellPhoneNumber;
      this.validation.models.address = this.user.address;
      this.validation.models.addressNumber = this.user.addressNumber;
      this.validation.models.additionalAddress = this.user.additionalAddress;
      this.validation.models.neighborhood = this.user.neighborhood;
      this.validation.models.cep = this.user.cep;
      this.validation.models.city = this.user.city;
      this.validation.models.state = this.user.state;
    },
    removePhoto() {
      this.validation.auxiliary.photoSrc = null;
      this.validation.models.profilePhoto = null;
    },
    async save() {
      if (this.$refs.userForm.validate()) {
        this.loadingForm = true;

        let data = {
          name: this.validation.models.name,
          userType: this.validation.models.userType,
          email: this.validation.models.email,
          residentialNumber: this.validation.models.residentialNumber,
          cellPhoneNumber: this.validation.models.cellPhoneNumber,
          address: this.validation.models.address,
          addressNumber: this.validation.models.addressNumber,
          additionalAddress: this.validation.models.additionalAddress,
          neighborhood: this.validation.models.neighborhood,
          cep: this.validation.models.cep,
          city: this.validation.models.city,
          state: this.validation.models.state,
          cpf: this.validation.models.cpf,
          birthDate: this.validation.models.birthDate,
          gender: this.validation.models.gender,
          cnpj: this.validation.models.cnpj,
          corporateName: this.validation.models.corporateName,
          profilePhoto: this.validation.models.profilePhoto
        };

        if (this.validUser) {
          data._id = this.user._id;
          const res = await this.$store.dispatch("updateUser", data);
          if (res.error) {
            EventBus.$emit("newMsg", {
              text: res.msg,
              error: true
            });
          } else {
            EventBus.$emit("newMsg", {
              text: "Usuario foi atualizado com sucesso!!",
              error: false
            });

            this.$router.push({
              name: "UsersList"
            });
          }
        } else {
          const res = await this.$store.dispatch("createUser", data);
          if (res.error) {
            EventBus.$emit("newMsg", {
              text: res.msg,
              error: true
            });
          } else {
            EventBus.$emit("newMsg", {
              text: "Usuario foi criado com sucesso!!",
              error: false
            });

            this.$router.push({
              name: "UsersList"
            });
          }
        }

        this.loadingForm = false;
      }
    },
    triggerPhotoInput() {
      this.$refs.profilePhotoInput.$el.querySelector("input").click();
    }
  }
};
</script>

<style lang="scss">
.v-form {
  .v-icon {
    font-size: 21px !important;
  }

  .v-avatar {
    .v-icon {
      font-size: 35px !important;
    }
  }
}

input[type="number"] {
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

.v-text-field.v-input--is-readonly > .v-input__control > .v-input__slot:before {
  border-image: repeating-linear-gradient(
      to right,
      rgba(0, 0, 0, 0.38) 0px,
      rgba(0, 0, 0, 0.38) 2px,
      transparent 2px,
      transparent 4px
    )
    1 repeat;
}
</style>
