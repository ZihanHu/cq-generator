<script lang="ts" setup>
import '@arco-design/web-vue/dist/arco.css';

useHeadSafe({
  htmlAttrs: {
    lang: 'zh-CN',
  },
  title: '口算训练生成器',
});
</script>

<template>
  <ALayoutContent>
    <NuxtPage />
  </ALayoutContent>
</template>

<style lang="postcss">
html, body, #__nuxt {
  @apply w-full h-full;
}
#__nuxt {
  @apply flex flex-col;
}
.paper-a4 {
  width: 210mm;
  height: 297mm;
  padding-top: 2.54cm;
  padding-bottom: 2.54cm;
  padding-left: 3.18cm;
  padding-right: 3.18cm;
}
</style>
