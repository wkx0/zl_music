import axios from "../utils/axiosUtil";

//获取专辑列表（分页）
export function getMySongListTab(obj) {
    return axios({
        url: '/manage/songs/user',
        method: 'get',
        params: obj
    })
}

export function getSongListAllSongId(obj) {
    return axios({
        url: '/manage/songs/allSongId',
        method: 'get',
        params: obj
    })
}

export function getSongDetail(obj) {
    return axios({
        url: '/api/song/detail',
        method: 'get',
        params: obj
    })
}

export function removeLoveSong(obj) {
    return axios({
        url: '/manage/songs/removeSong',
        method: 'get',
        params: obj
    })
}
