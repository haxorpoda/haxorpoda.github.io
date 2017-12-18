/* eslint-disable no-multiple-empty-lines */

import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

function initModule(state, moduleName, module, savedState, commit) {
  if (savedState) commit('recoverState', { [moduleName]: savedState });
  // addPresistMutations(moduleName, module.presistMutation);
  Object.assign(
    presistMutation,
    Object.entries(module.presistMutation).reduce(
      (acc, [mutation, presistStates]) =>
        Object.assign(acc, {
          [mutation]: presistStates.map(statePath => `${moduleName}.${statePath}`),
        }),
      {}
    )
  );
  commit('setLoadedModules', moduleName);
}



export const store = new Vuex.Store({
  mutations : {},
  getters: {},
  // The state of the submodules also needs to be initialize since it's not possible
  // to bind to changes in modules
  state: {},
  actions: {

  },
  plugins: [
    // vstore => {
    //   vstore.subscribe((mutation, state) => {
    //     const presistStates =
    //       mutation.type === 'loadBackup'
    //         ? [
    //             ...new Set(
    //               Object.values(presistMutation).reduce((acc, item) => [...acc, ...item], [])
    //             ),
    //           ]
    //         : presistMutation[mutation.type];

    //     if (presistStates === undefined) return;

    //     presistStates.forEach(stateName => {
    //       indexDB
    //         .writeStore(stateName, getDotPath(state, stateName))
    //         .then()
    //         .catch(error => vstore.commit('error', `IndexDB Error ${error}`));
    //     });
    //   });
    // },
  ],
});
