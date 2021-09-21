import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login ({ commit }, loginForm) {
    const {
      username,
      password,
      captchaId,
      captchaCode
    } = loginForm
    return new Promise((resolve, reject) => {
      this.axios.form('/api/login/signin', {
        username,
        password,
        captchaId,
        captchaCode
      }).then(data => {
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  async getInfo ({ commit, state }) {
    // return new Promise((resolve, reject) => {
    //   getInfo(state.token).then((response) => {
    //     const { data } = response;
    //     if (!data) {
    //       reject('Verification failed, please Login again.');
    //     }
    //     const {
    //       roles, name, avatar, introduction,
    //     } = data;
    //     // roles must be a non-empty array
    //     if (!roles || roles.length <= 0) {
    //       reject('getInfo: roles must be a non-null array!');
    //     }
    //     commit('SET_ROLES', roles);
    //     commit('SET_NAME', name);
    //     commit('SET_AVATAR', avatar);
    //     commit('SET_INTRODUCTION', introduction);
    //     resolve(data);
    //   }).catch((error) => {
    //     reject(error);
    //   });
    // });

    return new Promise((resolve, reject) => {
      const data = {
        roles: 'admin',
        name: 'hello',
        avatar: '',
        introduction: ''
      }
      if (!data) {
        reject(new Error('Verification failed, please Login again.'))
      }
      const { roles, name, avatar, introduction } = data
      // roles must be a non-empty array
      if (!roles || roles.length <= 0) {
        reject(new Error('getInfo: roles must be a non-null array!'))
      }
      commit('SET_ROLES', roles)
      commit('SET_NAME', name)
      commit('SET_AVATAR', avatar)
      commit('SET_INTRODUCTION', introduction)
      resolve(data)
    })
  },

  // user logout
  logout ({ commit, state, dispatch }) {
    // return new Promise((resolve, reject) => {
    //   logout(state.token).then(() => {
    //     commit('SET_TOKEN', '');
    //     commit('SET_ROLES', []);
    //     removeToken();
    //     resetRouter();
    //     // reset visited views and cached views
    //     // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
    //     dispatch('tagsView/delAllViews', null, { root: true });
    //     resolve();
    //   }).catch((error) => {
    //     reject(error);
    //   });
    // });
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles ({ commit, dispatch }, role) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const token = `${role}-token`

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
