<template>
  <header class="border-b bg-gradient-to-r from-yellow-200 via-pink-200 to-blue-200 shadow-lg">
    <nav class="container py-4 flex gap-8 items-center">
      <RouterLink
        class="text-lg font-bold hover:text-pink-600 transition-colors rounded-full px-4 py-2 bg-white shadow ice-cream-link"
        to="/"
      >
        🍦 Customizer
      </RouterLink>
      <RouterLink
        class="text-lg font-bold hover:text-blue-700 transition-colors rounded-full px-4 py-2 bg-white shadow ice-cream-link"
        to="/admin"
      >
        🍫 Admin
      </RouterLink>
      <span class="ml-auto text-base text-blue-800 font-cursive drop-shadow ice-cream-title">
        Ben & Jerry’s Demo
      </span>
    </nav>
  </header>

  <main class="container py-8 bg-white bg-opacity-80 rounded-3xl shadow-md mt-6">
    <router-view />
  </main>
</template>

<style scoped>
header {
  font-family: 'Comic Sans MS', 'Comic Sans', cursive, sans-serif;
  border-radius: 0 0 2rem 2rem;
}
main {
  min-height: 60vh;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive, sans-serif;
}
</style>
