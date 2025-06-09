<script setup>
import { ref } from 'vue'
import { useThemeStore } from '@/stores/themeStore'

const keyword = ref('')
const posts = ref([])
const loading = ref(false)
const error = ref(null)

const themeStore = useThemeStore()
themeStore.init()

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

async function fetchPosts() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('http://localhost:5003/parse')
    posts.value = await res.json()
  } catch (error) {
    error.value = 'Ошибка загрузки данных'
  } finally {
    loading.value = false
  }
}

async function search() {
  loading.value = true
  error.value = null

  try {
    const res = await fetch('http://localhost:5003/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ searchWord: keyword.value }),
    })

    if (!res.ok) throw new Error('Ошибка сервера')

    posts.value = await res.json()
  } catch (error) {
    error.value = 'Ошибка поиска'
  } finally {
    loading.value = false
  }
}

fetchPosts()
</script>

<template>
  <div
    class="container mx-auto py-4 px-4 min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
  >
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Поиск статей в блоге</h1>
      <button
        @click="themeStore.toggleTheme()"
        class="p-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        :aria-label="
          themeStore.isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'
        "
      >
        <template v-if="themeStore.isDark">
          <!-- Иконка солнца для светлой темы -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-yellow-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 3v1m0 16v1m8.66-10h-1M4.34 12h-1m15.02 4.24l-.7-.7M6.34 6.34l-.7-.7m12.02 12.02l-.7-.7M6.34 17.66l-.7-.7M12 7a5 5 0 100 10 5 5 0 000-10z"
            />
          </svg>
        </template>
        <template v-else>
          <!-- Иконка луны для тёмной темы -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-gray-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
            />
          </svg>
        </template>
      </button>
    </div>

    <form @submit.prevent="search" class="mb-6 flex gap-2">
      <input
        v-model="keyword"
        type="text"
        class="flex-grow border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
        placeholder="Искомое слово"
        required
      />
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        type="submit"
      >
        Искать
      </button>
    </form>

    <div v-if="loading" class="mb-4 flex justify-center">
      <svg
        class="animate-spin h-8 w-8 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
    </div>

    <div
      v-if="error"
      class="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md"
    >
      {{ error }}
    </div>

    <div v-if="posts.length > 0">
      <h2 class="mb-4 text-xl font-semibold">Результаты поиска</h2>
      <ul class="space-y-4">
        <li
          v-for="post in posts"
          :key="post.link"
          class="border border-gray-200 dark:border-gray-700 rounded-md p-4 hover:shadow-md transition bg-white dark:bg-gray-800"
        >
          <a
            :href="post.link"
            target="_blank"
            rel="noopener"
            class="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
          >
            {{ post.title }}
          </a>
          <br />
          <small class="text-gray-500 dark:text-gray-400">{{ formatDate(post.date) }}</small>
          <p class="mt-2 text-gray-700 dark:text-gray-300">{{ post.descr }}</p>
        </li>
      </ul>
    </div>

    <div v-else-if="!loading && !error" class="text-gray-600 dark:text-gray-400">
      Результаты отсутствуют.
    </div>
  </div>
</template>
<style>
button:focus {
  outline: none !important;
  box-shadow: none !important;
}
</style>
