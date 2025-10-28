
<script setup>
import { useRoute, useRouter } from 'vue-router'
import LoginForm from './loginForm.vue'

const route = useRoute()
const router = useRouter()
const onSuccess = () => {
  const next = route.query.next || { name: 'post', query: { page: 1 } }
  router.push(next)
}
</script>

<template>
  <section class="login-wrap">
    <LoginForm @success="onSuccess" />
  </section>
</template>

<style scoped>
.login-wrap {
  min-height: 100%;
  padding: 40px 16px;
  display: grid;
  place-items: center;
  background: #efe6d7;
}
</style>
