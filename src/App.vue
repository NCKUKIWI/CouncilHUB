<template>
  <div id="app">
    <Navbar :semester="semester" :period="period" :name="name"/>
    <div id="main" class="container">
      <router-view @update-title="updateTitle1"/>
    </div>
    <VoteWindow/>
    <Footer/>
  </div>
</template>

<script>
import Navbar from '@/layout/components/Navbar.vue'
import Footer from '@/layout/components/Footer.vue'
import VoteWindow from '@/components/VoteWindow.vue'
// import VoteDetailWindow from '@/components/VoteDetailWindow.vue'
// import { mapState } from 'vuex'

export default {
  name: 'app',
  components: {
    Navbar,
    Footer,
    VoteWindow,
  },
  data(){
    return {
      semester: 0,
      period: 0,
      name: '成大學代會'
    }
  },
  methods: {
    updateTitle1(semester, period, name) {
      // console.log(semester, period, name)
      this.semester = semester
      this.period = period
      this.name = name
    },
  }
}
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $primary;
}

#main {
  margin-top: 84px;
  margin-bottom: 48px;
  min-height: calc(100vh - 132px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (min-width: 510px) {
  #main{
    max-width: 510px;
  }
}
// @media (min-width: 989px) {
//   #main{
//     min-width: 880px;
//   }
// }

.container{
  width: 100%; 
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}
</style>
