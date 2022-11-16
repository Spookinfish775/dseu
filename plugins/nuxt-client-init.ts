import { Plugin } from '@nuxt/types'
import { vuexOidcCreateStoreModule } from 'vuex-oidc'
import { WebStorageStateStore } from 'oidc-client'
import { dataApi } from '~/static/dataApi'
import { JwtParser } from '~/infrastructure/classes/JwtParser'
import { ClaimsControler } from '~/infrastructure/classes/ClaimsControler'
import { CurrentUser } from '../infrastructure/classes/CurrentUser'
import { NavigationGenerator } from '~/infrastructure/classes/navigation/NavigationGenerator'

const accessor: Plugin = async ({ $axios, store }) => {
  const { data } = await $axios.get(dataApi.OidcConfiguration)
  const storeModule = vuexOidcCreateStoreModule(
    {
      automaticSilentRenew: true,
      silentRequestTimeout: 100,
      userStore: new WebStorageStateStore({ store: window.localStorage }),
      ...data
    },
    {
      namespaced: true,
      dispatchEventsOnWindow: true,
      publicRoutePaths: ['/callback']
    },
    {
      userLoaded: user => {
        const parsedJwt = JwtParser.parseJwt(user.access_token)
        const filteredClaims = ClaimsControler.filterClaims(parsedJwt)
        let currentUser = new CurrentUser({
          id: user.profile.sub,
          name: user.profile.name,
          role: parsedJwt.role,
          jobTitle: parsedJwt?.jobTitle,
          organizationId: parsedJwt?.organizationId,
          claims: filteredClaims
        })

        store.commit('user/INIT_USER', currentUser)
        console.log('User', parsedJwt)
        console.log('parsedJwt', parsedJwt)
        console.log('currentUser', currentUser)

        let nav = new NavigationGenerator()
        nav.generateItemsByClaims(currentUser.claims)
        store.commit('menu/SET_ITEMS', nav.items)
      }
    }
  )
  store.registerModule('oidc', storeModule)
}

export default accessor
