import axios from "../utils/axiosUtil";
import qs from "qs";

//获取专辑列表（分页）
export function getAlbumList(obj) {
    return axios({
        url: '/manage/album/list',
        method: 'get',
        params: obj
    })
}

//新建专辑
export function createAlbum(obj){
    return axios({
        url: '/manage/album/add',
        method: 'post',
        data: obj
    })
}

//删除专辑
export function deleteAlbum(arr){
    return axios.delete('/manage/album/delete', {
        params: {
            ids: arr,
        },
        paramsSerializer: params => {
            return qs.stringify(params, { indices: false })
        }})
}


//修改专辑
export function updateAlbum(obj){
    return axios({
        url: '/manage/album/update',
        method: 'post',
        data: obj
    })
}
