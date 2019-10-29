const state = {
  userTypes: {
    NATURAL_PERSON: 1,
    LEGAL_PERSON: 2
  },
  genders: {
    MALE: 1,
    FEMALE: 2,
    NON_BINARY: 3,
    NOT_SPECIFIED: 4
  }
};

const getters = {
  userTypes(state) {
    return state.userTypes;
  },
  genders(state) {
    return state.genders;
  }
};

const mutations = {};

const actions = {};

export default {
  state,
  getters,
  mutations,
  actions
};
