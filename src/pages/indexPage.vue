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
import { nextTick, ref, watchEffect } from "vue";
import PostList from "@/components/PostList.vue";
import UserList from "@/components/UserList.vue";
import PictureList from "@/components/PictureList.vue";
import MyDivider from "@/components/MyDivider.vue";
import router from "@/router";
import { useRoute } from "vue-router";
import myAxios from "@/plugins/myAxios";
import { message } from "ant-design-vue";

const route = useRoute();

const activeKey = route.params.category;
// const activeKey = route.params.category;
const initSearchParams = {
  type: activeKey,
  text: "",
  pageSize: 10,
  pageNum: 1,
};
const searchParams = ref(initSearchParams);
const postList = ref([]);
const userList = ref([]);
const pictureList = ref([]);

// myAxios.post("post/list/page/vo", {}).then((res: any) => {
//   postList.value = res.records;
// });
// myAxios
//   .post("picture/list/page/vo", {
//     current: 5,
//     pageSize: 10,
//     searchText: "",
//     sortField: "",
//     sortOrder: "",
//   })
//   .then((res: any) => {
//     pictureList.value = res.records;
//   });
// myAxios.post("user/list/page/vo", {}).then((res: any) => {
//   userList.value = res.records;
// });

const searchText = ref("");

const onSearch = (value: string) => {
  // 每次执行onSearch 就会改变页面的路由
  console.log(value);
  router.push({
    query: searchParams.value,
  });
  loadTypeData(searchParams.value);
};

/**
 * 加载数据
 * @param params
 */
const loadDataV1 = (params: any) => {
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

/**
 * 加载聚合数据
 * @param params
 */
const loadDataV2 = (params: any) => {
  const postQuery = {
    ...params,
    searchText: params.text,
  };
  myAxios.post("search/all", postQuery).then((res: any) => {
    postList.value = res.postVOList;
    userList.value = res.userVOList;
    pictureList.value = res.pictureList;
  });
};
/**
 * 加载单类数据
 * @param params
 */
const loadTypeData = (params: any) => {
  const { type } = params;
  if (!type) {
    message.error("类别为空");
    return;
  }
  alert(type);
  const postQuery = {
    ...params,
    searchText: params.text,
  };
  myAxios.post("search/type", postQuery).then((res: any) => {
    if (type === "post") {
      postList.value = res.postVOList;
    } else if (type === "user") {
      userList.value = res.userVOList;
    } else if (type === "picture") {
      pictureList.value = res.pictureList;
    }
  });
};
// todo 研究这段watcheffect 和下面 正确的 watcheffect的 区别
// watchEffect(() => {
//   // 这里是为了刷新页面的时候 searchParams的值不丢失
//   // 用url控制页面
//   const text_org = searchParams.value.text;
//   searchParams.value = {
//     ...initSearchParams,
//     // text: route.query.text,
//     text: text_org,
//     type: route.params.category,
//   } as any;
//   router.push({
//     query: searchParams.value,
//   });
//   loadTypeData(searchParams.value);
// });
/**
 * 避免在 watchEffect 内部直接修改被监视的响应式数据：
 * 可以通过一个临时变量来存储修改后的数据，然后在 watchEffect 外部更新响应式数据。
 * 莫名其妙就把之前的问题解决了
 * 之前（上面的watcheffect）的问题是：
 * 输入文本的时候，每输入一个字符，就会调用post接口两次 每次切换tab 也会调用post接口两次
 * 现在 输入文本不会调用post接口 点击search会调用
 * 切换tab只会调用接口一次
 */
watchEffect(() => {
  const text_org = searchParams.value.text;
  const newParams = {
    ...initSearchParams,
    text: text_org,
    type: route.params.category,
  };

  if (JSON.stringify(searchParams.value) !== JSON.stringify(newParams)) {
    nextTick(() => {
      searchParams.value = newParams;

      router.push({
        query: searchParams.value,
      });

      loadTypeData(searchParams.value);
    });
  }
});

// 首次请求
// todo 目前是在页面加载时，调用三个接口分别获取文章、图片、用户数据

// 两种不同的业务场景
// 其实可以用户点某个tab的时候，只调用这个tab的接口 有可能还要查询一些其他的信息，比如其他数据的总数
// 如果是针对聚合内容的网页， 其实可以直接一个请求搞定

// loadTypeData(searchParams.value);
const onTabChange = (key: string) => {
  router.push({
    path: `/${key}`,
    query: searchParams.value,
  });
};
</script>
