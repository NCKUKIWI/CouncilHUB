<template>
  <div class="error_window container window">
    <div class="error_container">
      <span class="error_block">錯 誤</span>
      <p class="error_message">會議簽到未開放/已過期</p>
      <button class="error_return">返 回</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorWindow',
}
</script>

<style lang="scss">
.error_container{
  width: 100%;
}
.error_block{
  background-color: $primary;
  border-radius: 7px;
  border: none;
  color: #fff;
  font-size: $text_s;
  font-weight: bold;
  padding: 5px 30px;
}
.error_return{
  border: 1.5px #767171 solid;
  border-radius: 7px;
  background-color: #ffffff00;
  padding: 5px 30px;
  font-size: $text_s;
  font-weight: bold;
  color: $primary;
  cursor: pointer;
  margin-top: 20px;
}
</style>