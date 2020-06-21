<template>
  <div class="home">
    <router-link :to="item[1]" tag="div" class="home__block_link" :class="{unopened : !item[1]}" v-for="(item, index) in home_link" :key="index">
      {{item[0]}}
    </router-link>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  data() {
    return {
      'home_link':[
        ["公共提案",""],
        ["選舉系統",""],
        ["近期議案",""],
        ["會議記錄",""],
        ["法規查詢",""],
        ["登入會議","/conference"]
      ]
    }
  },
}
</script>

<style scoped lang="scss">
.home{
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-wrap: wrap;
  flex-grow: 1;
}
// @media (min-width: 510px) {
//   .home{
//     max-width: 510px;
//   }
// }
// @media (min-width: 989px) {
//   .home{
//     min-width: 860px;
//   }
// }
.home__block_link{
  width: 120px;
  height: 120px;
  padding: 10px;
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  background-color: $primary;
  color: #fff;
  font-size: $text_l;
  font-weight: 700;
  &.unopened{
    position: relative;
    &::after{
      position: absolute;
      width: 124px;   //比原本的大一點，底層才不會走光
      height: 124px; 
      top: -2px;
      left: -2px;
      background-color: #ffffffcc;
      display: flex;
      justify-content: center;
      align-items: center;
      content: "尚未開放";
      font-size: 18px;
      color: $title1;
    }
  }
}
</style>