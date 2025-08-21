<template>
  <header class="border-b bg-white">
    <nav class="container py-3 flex gap-6 items-center">
      <RouterLink class="text-sm font-medium hover:text-blue-600" to="/">Customizer</RouterLink>
      <RouterLink class="text-sm font-medium hover:text-blue-600" to="/admin">Admin</RouterLink>
      <span class="ml-auto text-xs text-gray-500">Ben & Jerry’s Demo</span>
    </nav>
  </header>

  <main class="container py-6">
    <router-view />
  </main>
</template>
