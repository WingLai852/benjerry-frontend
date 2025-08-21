<template>
  <nav style="display:flex; gap:1rem; padding:12px; background:#f4f4f4;">
    <router-link to="/">Customizer</router-link>
    <router-link to="/admin">Admin</router-link>
  </nav>
  <main style="padding:16px;">
    <router-view />
  </main>
</template>