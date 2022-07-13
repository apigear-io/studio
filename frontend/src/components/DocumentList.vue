<template>
  <q-tabs vertical>
    <q-tab v-for="item in items" :key="item.icon"></q-tab>
  </q-tabs>
</template>

<script>
export default {
  setup() {
    return {
      items: [
        {
          title: "Dashboard",
          icon: "school",
          link: "https://quasar.dev",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
