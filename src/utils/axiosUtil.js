import axios from 'axios';


const service = axios.create({
    // baseURL: process.env.BASE_API, // api的base_url
    timeout: 60000 // 请求超时时间，1分钟
});


// request拦截器
service.interceptors.request.use(config => {
    // Do something before request is sent
    // console.log("请求方式：" + config.method)
    if (config.method === "post") {
        // config.data = qs.stringify(config.data);
        config.headers = {
            'Content-Type': 'application/json; charset=utf-8'
        }
    }
    // else if (config.method === "put"){
    //     config.headers = {
    //         'Content-Type':'application/x-www-form-urlencoded'
    //     }
    // }
    return config;
}, error => {
    Promise.reject(error);
})
// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 对响应错误做点什么

    return Promise.reject(error);
});
export default service;
