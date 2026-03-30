import axios from "axios";

const base_url = 'https://gdgt.maiminhhoang.id.vn'
// const base_url = 'http://localhost:8087'
// const base_url = 'https://atgt-backend.onrender.com'
// const base_url = 'https://gdgt-project.onrender.com'
// const base_url = 'https://colt-easy-kindly.ngrok-free.app'

let headers = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        "ngrok-skip-browser-warning": "69420",

    },
    "Access-Control-Allow-Origin": "*", // CORS

}
try {
    var user = localStorage.getItem('info')
    var username = localStorage.getItem('account')
    var password = localStorage.getItem('password')
} catch (error) {
    console.log(error)
}
let headersauth = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
        "ngrok-skip-browser-warning": "69420",

        // 'Authorization': `Basic ${btoa('vM94gZtgEB:h27KSuVMmj')}`

    },
    "Access-Control-Allow-Origin": "*", // CORS


}

class Api {
    // PostImage(img) {

    //     const data = new FormData();
    //     data.append('file', img);
    //     data.append('upload_preset', 'ey8cuam4');
    //     data.append('cloud_name', 'dqwouu351');
    //     data.append('folder', 'Home');
    //     return axios.post('https://api.cloudinary.com/v1_1/dqwouu351/image/upload', data);
    // }
    PostImage(img) {

        const data = new FormData();
        data.append('file', img);
        data.append('upload_preset', 'xosulpvx');
        data.append('cloud_name', 'dxmczmcpn');
        data.append('folder', 'Home');
        return axios.post('https://api.cloudinary.com/v1_1/dxmczmcpn/image/upload', data);
    }

    async login(account, password, provider) {
        return await axios.post(`${base_url}/api/users/login?account=${account}&password=${password}&hasprovider=${provider}`, headers);

    }
    async register(account, password, name) {
        return await axios.post(`${base_url}/api/users/signup`, {
            "name": name,
            "account": account,
            "password": password
        }, headers);
    }
    async upPost(title, content, image) {
        console.log(headersauth)
        return await axios.post(`${base_url}/api/users/uppost?ownerId=${user}`, {
            title,
            content,
            image
        }, headersauth);
    }

    async getPost() {
        return await axios.get(`${base_url}/api/users/allpost`, headersauth);
    }

    async getPostById(id) {
        return await axios.get(`${base_url}/api/posts/${id}?userId=${user}`, headers);
    }

    async postVideo(title, idVideo) {
        return await axios.post(`${base_url}/api/videos/postVideo?userId=${user}`, { "title": title, "youtubeId": idVideo }, headersauth);
    }

    async getAllVideo() {
        return await axios.get(`${base_url}/api/videos/getAllVideo`, headers);
    }
    async getVideoById(id) {
        return await axios.get(`${base_url}/api/videos/getVideoById/${id}`, headers);
    }

    async insertImage(url, ownerId) {
        console.log(username)
        return await axios.post(`${base_url}/api/videos/postImage?url=${url}&ownerId=${ownerId}`, { 'url': url }, headersauth);
    }

    async getImages() {
        return await axios.get(`${base_url}/api/videos/getAllImages`, headers);
    }

    async postExam(name, time, maxTimes, questions) {
        return await axios.post(`${base_url}/api/exams/postExamAndQuestions?ownerId=${user}`, { name, time, maxTimes, questions }, headersauth);
    }

    async getListExams() {
        return await axios.get(`${base_url}/api/exams/getListExams`, headersauth);
    }

    async getExamById(id) {
        return await axios.get(`${base_url}/api/exams/getExamById?id=${id}`, headersauth);
    }

    async postReact(postId, react) {
        return await axios.post(`${base_url}/api/posts/react?postId=${postId}&userId=${user}&react=${react}`, {}, headersauth);
    }

    async postComment(postid, content) {
        return await axios.post(`${base_url}/api/posts/comment?postId=${postid}&userId=${user}&content=${content}`, {}, headersauth);
    }

    async getInfo() {
        return await axios.get(`${base_url}/api/users/info?userId=${user}`, headersauth);
    }

    async updateInfo(email, password, name, school, avatar, gender, ofClass) {
        return await axios.put(`${base_url}/api/users/info?userId=${user}`, { id: user, email, password, name, school, avatar, gender, ofClass }, headersauth);
    }

    async updateAvatar(avatar) {
        return await axios.put(`${base_url}/api/users/avatar?userId=${user}&avatar=${avatar}`, {}, headersauth);
    }

    async postResult(examId, numberCorrect, time, totalQuestion) {
        return await axios.post(`${base_url}/api/exams/result`, { resultId: { examId, userId: user }, numberCorrect, time, totalQuestion }, headersauth);
    }

    async getRank(examId) {
        return await axios.get(`${base_url}/api/exams/rank?examId=${examId}`, headersauth);
    }
}

export default new Api();