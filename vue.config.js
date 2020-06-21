module.exports = {
  css: {
    loaderOptions: {
      sass: {       //在每個撰寫scss的地方引入變數
        prependData: `@import "src/styles/_variables.scss";`
      }
    }
  },
  publicPath:'./',  //輸出於dist時能夠正常用file://方式瀏覽
};