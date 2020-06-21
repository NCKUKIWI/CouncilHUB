<template>
  <div class="conference_detail">
    <div class="schedule_block">
      <h3 class="schedule_block__title">四、議案與討論事項</h3>
    </div>
    <!-- <div class="detail_table">
      <div class="row">
        <div class="case_number"></div>
        <div class="case_proposer"></div>
      </div>
      <div class="row"></div>
      <div class="row"></div>
      <div class="row"></div>
    </div> -->
    <table class="detail_table">
      <tr class="case_info">
        <td class="title" width="25px">案次</td>
        <td class="title_data">第一案</td>
        <td class="title" width="50px">提案單位</td>
        <td class="title_data">{{proposal.dept}}</td>
      </tr>
      <tr class="case_summary">
        <td class="title">案由</td>
        <td colspan="3" align="left">{{proposal.reason}}</td>
      </tr>
      <tr class="case_description">
        <td class="title">說明</td>
        <td colspan="3" align="left">
          <li v-for="(description,index) in proposal.description" :key="index">{{description}}</li>
        </td>
      </tr>
      <tr>
        <td class="title">討論</td>
        <td colspan="3" align="left">{{proposal.discussion}}</td>
      </tr>
    </table>
    <VoteWindow style="display:none"/>
    <VoteDetailWindow style="display:none"/>
  </div>
</template>

<script>
import VoteWindow from '@/components/VoteWindow.vue'
import VoteDetailWindow from '@/components/VoteDetailWindow.vue'
import { proposalID } from '../api/proposal'

export default {
  name: 'ConferenceDetail',
  components: {
    VoteWindow,
    VoteDetailWindow,
  },
  data() {
    return{
      proposal: {},
    }
  },
  created() {
    this.getProposalDetail(this.$route.params.delibrationID, this.$route.params.proposalID)
  },
  methods: {
    async getProposalDetail(dID, pID) {
      let response = await proposalID(dID, pID);
      this.proposal = response.data;
    },
  }
}
</script>

<style lang="scss">
.conference_detail{
  padding-top: 20px;
  width: 100%;
}
.detail_table{
  border-color:#fff;
  border-collapse:collapse;
  margin-bottom: 130px;
  .case_summary{
    font-weight: 700;
  }
  .title{
    background-color: $primary;
    color: #fff;
    font-weight: 700;
    &_data{
      background-color: $secondary;
      font-weight: 700;
    }
  }
  td{
    border: 5px solid #fff;
  }
  li{
    margin-bottom: 10px;
  }
}
</style>