<template>
  <div class="login_window container window">
    <div class="close_layer" @click="$emit('close-window')"></div>
    <div class="login_container">
      <div class="login_target">
        <div class="conference_item">
          <div class="item_block">
            <h3 class="item_block__session">{{semester}}學年度第{{period}}會期</h3>
            <h2 class="item_block__name">{{name}}</h2>
            <div class="item_block__time">{{startTime}} 開放登入</div>
          </div>
          <p class="item_authority">權限：{{position}}</p>
        </div>
      </div>
      <div class="login_form">
        <div class="login_form__account">
          <label for="account">帳 號</label>
          <input class="input" id="account" v-model="studentID" type="text" placeholder="學號" required>
        </div>
        <div class="login_form__password">
          <label for="password">密 碼</label>
          <input class="input" id="password" v-model="password" type="password" placeholder="學號信箱密碼" required>
        </div>
        <button class="login_form__enter" @click="login(studentID, password)">登 入</button>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from "../api/user"
import router from '@/router'

export default {
  name: 'LoginWindow',
  data() {
    return {
      studentID: '',
      password: '',
    }
  },
  props: {
    delibrationID: String,
    semester: Number,
    period: Number,
    name: String,
    startTime: String,
    position: String,
  },
  methods: {
    async login(studentID, password) {
      if(this.studentID!=='' && this.password!=='') {
        let response = await login(studentID, password);
        if (response.data.isLogin === "success") {
          router.push({name: 'schedule', params: {delibrationID:this.delibrationID}})
        }
      }
    }
  }
}
</script>

<style lang="scss">
.login_container{
  width: 100%;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 360px;
  align-items: center;
  .login_target{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  .login_form{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    label{
      color:$title1;
    }
    input.input{
      text-align: center;
      font-size: $text;
      border: 1.5px #767171 solid;
      border-radius: 7px;
      margin-left: 15px;
      margin-bottom: 20px;
      padding: 10px 5px;
      background-color: #ffffff00;
    }
    &__enter{
      background-color: $primary;
      border-radius: 7px;
      border: none;
      color: #fff;
      font-size: $text_s;
      font-weight: bold;
      padding: 5px 30px;
      margin: 0;
      cursor: pointer;
    }
  }
}
.close_layer{
  position: fixed;
  width: 100vw;
  height: 100vh;
}
</style>