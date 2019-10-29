import Vue from "vue";
import Vuex from "vuex";

import users from "./modules/users";
import enums from "./modules/enums";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    enums,
    users
  }
});
