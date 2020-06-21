<template>
  <div class="vote_window">
    <h3 class="vote_topic">第一案 決議投票</h3>
    <div class="vote_block">
      <button class="vote_button " :class="[clicked[0]===false ? 'agree_vote' : 'no_vote']" @click="handleClick(0)" :disabled="clicked[0]">同意</button>
      <button class="vote_button " :class="[clicked[1]===false ? 'against_vote' : 'no_vote']" @click="handleClick(1)" :disabled="clicked[1]">反對</button>
      <button class="vote_button " :class="[clicked[2]===false ? 'null_vote' : 'no_vote']" @click="handleClick(2)" :disabled="clicked[2]">廢票</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "VoteWindow",
  data() {
    return {
      clicked: [false, false, false]
    }
  },
  methods: {
    handleClick(index){
      for(var i = 0; i<this.clicked.length; i++){
        index === i ? this.$set(this.clicked, i, false) : this.$set(this.clicked, i, true)
      }
    }
  }
}
</script>

<style lang="scss">
.vote_window{
  position: fixed;
  bottom: 48px;
  max-width: 480px;
  padding: 5px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: #fff;
  border: 5px solid $primary;
  border-radius: 18px;
  z-index: 1;
}
.vote_topic{
  color: $title1;
  letter-spacing:5px;
}
.vote_block{
  display: flex;
  justify-content: space-around;
}
.vote_button{
  width: 100px;
  height: 60px;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  color: #fff;
  font-size: $text_lm;
  font-weight: 700;
  border: none;
  cursor: pointer;
  &.not_ready{                //未開放投票
    background-color:$primary;
  }
}
.agree_vote{
  background-color: #00b050;
}
.against_vote{
  background-color: #c00000;
}
.null_vote{
  background-color: #000;
}
.no_vote{
  background-color: gray;
}
</style>