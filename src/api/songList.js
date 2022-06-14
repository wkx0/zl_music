import axios from "../utils/axiosUtil";

export function removeLoveSong(obj) {
    return axios({
        url: '/manage/songs/removeSong',
        method: 'get',
        params: obj
    })
}

export function addLoveSong(obj) {
    return axios({
        url: '/manage/songs/addLoveSong',
        method: 'get',
        params: obj
    })
}

export function getSongsByTag(obj) {
    return axios({
        url: '/manage/songs/top',
        method: 'get',
        params: obj
    })
}

export function getSongsByHot(obj) {
    return axios({
        url: '/manage/songs/hot',
        method: 'get',
        params: obj
    })
}

export function addSongsPlayAmount(obj) {
    return axios({
        url: '/manage/songs/play/add',
        method: 'get',
        params: obj
    })
}

export function getSongIdBySongListId(obj){
    return axios({
        url: '/manage/songs/allSongId',
        method: 'get',
        params: obj
    })
}
