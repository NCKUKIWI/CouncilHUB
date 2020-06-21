<template>
  <div class="conference_choose">
    <LoginWindow
      :delibrationID="delibrationID"
      :semester="semester"
      :period="period"
      :name="name"
      :startTime="startTime"
      :position="position"
      v-if="LOGIN_SHOW"
      @close-window="LOGIN_SHOW = 0"
    />
    <ErrorWindow style="display: none" />
    <p>請 選 擇 會 議</p>
    <div class="conference_list">
      <div
        v-for="(item,index) in conferenceList"
        :key="index"
        class="conference_item"
        @click="openLoginWindow(item)"
      >
        <div class="item_block">
          <h3 class="item_block__session">{{item.semester}}學年度第{{convertNumber(item.period)}}學期</h3>
          <h2 class="item_block__name">{{item.name}}</h2>
          <div class="item_block__time">{{item.startTime}} 開放登入</div>
        </div>
        <p class="item_authority">權限：{{item.position}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import LoginWindow from "@/components/LoginWindow.vue";
import ErrorWindow from "@/components/ErrorWindow.vue";
import { delibration } from "../api/delibration";
import { convertNumber } from "../services/converter";

export default {
  name: "ConferenceChoose",
  components: {
    LoginWindow,
    ErrorWindow
  },
  data() {
    return {
      conferenceList: [],
      delibrationID: '',
      semester: 0,
      period: 0,
      name: "",
      startTime: "",
      position: "",
      LOGIN_SHOW: 0
    };
  },
  created() {
    this.getDelibration();
  },
  methods: {
    async getDelibration() {
      let response = await delibration();
      this.conferenceList = response.data;
    },
    convertNumber(num) {
      return convertNumber(num);
    },
    openLoginWindow({delibrationID, semester, period, name, startTime, position}) {
      this.$emit('update-title', semester, period, name)
      this.delibrationID = delibrationID
      this.semester = semester
      this.period = period
      this.name = name
      this.startTime = startTime
      this.position = position
      this.LOGIN_SHOW = 1
    }
  }
};
</script>

<style lang="scss">
.conference_choose {
  width: 100%;
  // flex-grow: 1;
  & > p {
    color: #000;
    font-size: $text_s;
    margin-bottom: 0;
  }
}
.conference_list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.conference_item {
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 28px;
}

.item_block {
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $primary;
  border-radius: 20px;
  color: #fff;
  padding: 10px;
  &__session {
    // font-size: $text_m;
    margin-bottom: 0;
  }
  &__name {
    // font-size: 34px;
    letter-spacing: 5px;
  }
  &__time {
    color: $title1;
    width: calc(100% - 40px);
    padding: 2px 20px;
    border-radius: 5px;
    background-color: $secondary;
  }
}
</style>