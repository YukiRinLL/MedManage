<template>
  <router-view />
</template>

<script setup>
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

#app {
  width: 100%;
  height: 100vh;
}

.dashboard,
.patients-container,
.health,
.medication,
.notification,
.activities,
.news,
.diagnosis,
.insurance,
.schedule,
.education,
.blood-test-container,
.medical-staff,
.page-container,
.users,
.feedback {
  padding: 16px !important;
}
</style>
