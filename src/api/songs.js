import axios from "../utils/axiosUtil";
import qs from "qs";

//获取歌单列表（分页）
export function getSongsList(obj) {
    return axios({
        url: '/manage/songs/list',
        method: 'get',
        params: obj
    })
}

//新建歌单
export function createSongs(obj){
    return axios({
        url: '/manage/songs/add',
        method: 'post',
        data: obj
    })
}

//删除歌单
export function deleteSongs(arr){
    return axios.delete('/manage/songs/delete', {
        params: {
            ids: arr,
        },
        paramsSerializer: params => {
            return qs.stringify(params, { indices: false })
        }})
}

//修改歌单
export function updateSongs(obj){
    return axios({
        url: '/manage/songs/update',
        method: 'post',
        data: obj
    })
}
