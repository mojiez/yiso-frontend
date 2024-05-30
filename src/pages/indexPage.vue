<template>
  <div class="index-page">
    <h1>fuck</h1>
    <a-input-search
      v-model:value="searchParams.text"
      placeholder="input search text"
      enter-button="Search"
      size="large"
      @search="onSearch"
    />
    <MyDivider />
    <a-tabs v-model:activeKey="activeKey" @change="onTabChange">
      <a-tab-pane key="post" tab="文章">
        <PostList :post-list="postList" />
      </a-tab-pane>
      <a-tab-pane key="user" tab="用户">
        <UserList :user-list="userList" />
      </a-tab-pane>
      <a-tab-pane key="picture" tab="图片">
        <PictureList :picture-list="pictureList" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import PostList from "@/components/PostList.vue";
import UserList from "@/components/UserList.vue";
import PictureList from "@/components/PictureList.vue";
import MyDivider from "@/components/MyDivider.vue";
import router from "@/router";
import { useRoute } from "vue-router";
import myAxios from "@/plugins/myAxios";

const initSearchParams = {
  text: "",
  pageSize: 10,
  pageNum: 1,
};
const searchParams = ref(initSearchParams);
const postList = ref([]);
const userList = ref([]);
const pictureList = ref([]);

myAxios.post("post/list/page/vo", {}).then((res: any) => {
  postList.value = res.records;
});
myAxios
  .post("picture/list/page/vo", {
    current: 5,
    pageSize: 10,
    searchText: "",
    sortField: "",
    sortOrder: "",
  })
  .then((res: any) => {
    pictureList.value = res.records;
  });
myAxios.post("user/list/page/vo", {}).then((res: any) => {
  userList.value = res.records;
});

const searchText = ref("");
const route = useRoute();
const activeKey = route.params.category;

const onSearch = (value: string) => {
  // 每次执行onSearch 就会改变页面的路由
  console.log(value);
  router.push({
    query: searchParams.value,
  });
  loadData(searchParams.value);
};

watchEffect(() => {
  // 这里是为了刷新页面的时候 searchParams的值不丢失
  // 用url控制页面
  searchParams.value = {
    ...initSearchParams,
    text: route.query.text,
  } as any;
});

/**
 * 加载数据
 * @param params
 */
const loadData = (params: any) => {
  const postQuery = {
    ...params,
    searchText: params.text,
  };
  myAxios.post("post/list/page/vo", postQuery).then((res: any) => {
    postList.value = res.records;
  });

  const pictureQuery = {
    ...params,
    searchText: params.text,
  };
  myAxios.post("picture/list/page/vo", pictureQuery).then((res: any) => {
    pictureList.value = res.records;
  });
  const userQuery = {
    ...params,
    userName: params.text,
  };
  myAxios.post("user/list/page/vo", userQuery).then((res: any) => {
    userList.value = res.records;
  });
};
// watchEffect(() => {
//   myAxios.post("post/list/page/vo", {}).then((res: any) => {
//     postList.value = res.records;
//   });
//
//   // 这里相当于监听了 searchParams.value.text,
//   myAxios
//     .post("picture/list/page/vo", {
//       current: 5,
//       pageSize: 10,
//       searchText: searchParams.value.text,
//       sortField: "",
//       sortOrder: "",
//     })
//     .then((res: any) => {
//       pictureList.value = res.records;
//     });
//   myAxios.post("user/list/page/vo", {}).then((res: any) => {
//     userList.value = res.records;
//   });
// });

// 首次请求
// todo 目前是在页面加载时，调用三个接口分别获取文章、图片、用户数据

// 两种不同的业务场景
// 其实可以用户点某个tab的时候，只调用这个tab的接口 有可能还要查询一些其他的信息，比如其他数据的总数
// 如果是针对聚合内容的网页， 其实可以直接一个请求搞定

loadData(searchParams.value);
const onTabChange = (key: string) => {
  router.push({
    path: `/${key}`,
    query: searchParams.value,
  });
};
</script>
