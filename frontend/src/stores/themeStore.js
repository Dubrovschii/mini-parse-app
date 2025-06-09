// stores/themeStore.js
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('themeStore', {
  state: () => ({
    isDark: false,
  }),
  actions: {
    init() {
      const cookieTheme = this.getCookie('theme')
      if (cookieTheme === 'dark') {
        this.isDark = true
      } else if (cookieTheme === 'light') {
        this.isDark = false
      } else {
        this.isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      this.applyTheme()
    },
    toggleTheme() {
      this.isDark = !this.isDark
      this.setCookie('theme', this.isDark ? 'dark' : 'light', 365)
      this.applyTheme()
    },
    applyTheme() {
      if (this.isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    getCookie(name) {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop().split(';').shift()
      return null
    },
    setCookie(name, value, days) {
      const expires = new Date()
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;Secure;SameSite=Strict`
    },
  },
})
