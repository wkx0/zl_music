import axios from "../utils/axiosUtil";
import qs from "qs";

//获取歌手列表（分页）
export function getSingerList(obj) {
    return axios({
        url: '/manage/singer/list',
        method: 'get',
        params: obj
    })
}

//新建歌手
export function createSinger(obj){
    return axios({
        url: '/manage/singer/add',
        method: 'post',
        data: obj
    })
}

//删除歌手
export function deleteSinger(arr){
    return axios.delete('/manage/singer/delete', {
        params: {
            ids: arr,
        },
        paramsSerializer: params => {
            return qs.stringify(params, { indices: false })
        }})
}


//修改歌手
export function updateSinger(obj){
    return axios({
        url: '/manage/singer/update',
        method: 'post',
        data: obj
    })
}
