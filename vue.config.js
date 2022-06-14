module.exports = {
  pages:{
    index:{
      //入口
      entry: 'src/main.js'
    },
  },
  // lintOnSave:false,//关闭语法检查
  devServer:{
    port: 8082,
    proxy:{
      '/api':{
        target: 'http://localhost:3000/',
        ws:true,
        changeOrigin:true,
        pathRewrite:{
          '^/api': ''
        },
      },
      '/songApi':{
        target: 'https://v1.hitokoto.cn/',
        ws:true,
        changeOrigin:true,
        pathRewrite:{
          '^/songApi': ''
        },
      },
      '/manage':{
        target: 'http://localhost:9000/',
        ws:true,
        changeOrigin:true,
      },
      '/zl':{
        target: 'http://localhost:9000/',
        ws:true,
        changeOrigin:true,
        pathRewrite:{
          '^/zl': ''
        },
      },
    }
  }
}
