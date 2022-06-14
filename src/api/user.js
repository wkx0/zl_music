import axios from '/src/utils/axiosUtil';
import qs from "qs";
//获取用户列表（分页）
export function getUserList(obj) {
    return axios({
        url: '/manage/user/list',
        method: 'get',
        params: obj
    })
}

//新建用户
export function createUser(obj){
    return axios({
        url: '/manage/user/sign',
        method: 'post',
        data: obj
    })
}
//登录用户
export function verifyUser(obj){
    return axios({
        url: '/manage/user/login',
        method: 'post',
        data: obj
    })
}
//修改用户
export function updateUser(obj){
    return axios({
        url: '/manage/user/update',
        method: 'post',
        data: obj
    })
}

//删除用户
export function deleteUser(arr){
    return axios.delete('/manage/user/delete', {
        params: {
            ids: arr,
        },
        paramsSerializer: params => {
            return qs.stringify(params, { indices: false })
        }})
}
