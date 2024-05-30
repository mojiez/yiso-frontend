<template>
  图片列表
  <img :src="logo" />
  <a-list
    item-layout="horizontal"
    :grid="{ gutter: 16, column: 4 }"
    :data-source="props.pictureList"
  >
    <template #renderItem="{ item }">
      <a-card hoverable>
        <template #cover>
          <img alt="example" :src="item.url" />
        </template>
        <a-card-meta :title="item.title"></a-card-meta>
      </a-card>
    </template>
  </a-list>
</template>

<script setup lang="ts">
import logo from "@/assets/logo.png";
import { withDefaults, defineProps, toRefs } from "vue";
import avator from "@/assets/avator.jpeg";
// todo 这一段是什么意思
interface Props {
  pictureList: any[];
}

const props = withDefaults(defineProps<Props>(), {
  pictureList: () => [],
});
</script>

<style scoped></style>
