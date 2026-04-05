import axios from "axios";

const base_url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8086';

// ─── Read credentials FRESH on every call ───────────────────────────────────
// Never cache at module level: module loads before localStorage is populated,
// and a cached invalid "Authorization: Basic null:null" header causes Spring
// Security to reject even permitAll() endpoints with 401.
const getCreds = () => {
    try {
        return {
            user: localStorage.getItem('info'),
            username: localStorage.getItem('account'),
            password: localStorage.getItem('password'),
        };
    } catch {
        return { user: null, username: null, password: null };
    }
};

// Plain headers – no Authorization (for public endpoints or unauthenticated users)
const plainConfig = () => ({
    headers: { 'Content-Type': 'application/json' },
});

// Auth headers – only included when valid credentials exist in localStorage
const authConfig = () => {
    const { username, password } = getCreds();
    if (username && password && username !== 'null' && password !== 'null') {
        return {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${btoa(`${username}:${password}`)}`,
            },
        };
    }
    // Fall back to plain (no auth header) — avoids 401 on permitAll() endpoints
    return plainConfig();
};

class Api {
    // ─── Upload ─────────────────────────────────────────────────────────────
    PostImage(img) {
        const { username, password } = getCreds();
        const authHeader = (username && password && username !== 'null')
            ? { Authorization: `Basic ${btoa(`${username}:${password}`)}` }
            : {};
        const data = new FormData();
        data.append('file', img);
        return axios.post(`${base_url}/api/upload`, data, {
            headers: { 'Content-Type': 'multipart/form-data', ...authHeader },
        });
    }

    // ─── Auth ────────────────────────────────────────────────────────────────
    async login(account, password, provider) {
        return await axios.post(
            `${base_url}/api/users/login?account=${account}&password=${password}&hasprovider=${provider}`,
            {},
            plainConfig()
        );
    }

    async register(account, password, name) {
        return await axios.post(`${base_url}/api/users/signup`, {
            name,
            account,
            password,
        }, plainConfig());
    }

    // ─── Posts ───────────────────────────────────────────────────────────────
    async upPost(title, content, image) {
        const { user } = getCreds();
        return await axios.post(
            `${base_url}/api/users/uppost?ownerId=${user}`,
            { title, content, image },
            authConfig()
        );
    }

    async getPost() {
        return await axios.get(`${base_url}/api/users/allpost`, plainConfig());
    }

    async deletePost(id) {
        return await axios.delete(`${base_url}/api/users/deleteposts/${id}`, authConfig());
    }

    async updatePost(id, post) {
        return await axios.put(`${base_url}/api/users/updatepost/${id}`, post, authConfig());
    }

    async getPostById(id) {
        const { user } = getCreds();
        return await axios.get(`${base_url}/api/posts/${id}?userId=${user}`, plainConfig());
    }

    async postReact(postId, react) {
        const { user } = getCreds();
        return await axios.post(
            `${base_url}/api/posts/react?postId=${postId}&userId=${user}&react=${react}`,
            {},
            authConfig()
        );
    }

    async postComment(postid, content) {
        const { user } = getCreds();
        return await axios.post(
            `${base_url}/api/posts/comment?postId=${postid}&userId=${user}&content=${content}`,
            {},
            authConfig()
        );
    }

    // ─── Videos ──────────────────────────────────────────────────────────────
    async postVideo(title, idVideo) {
        const { user } = getCreds();
        return await axios.post(
            `${base_url}/api/videos/postVideo?userId=${user}`,
            { title, youtubeId: idVideo },
            authConfig()
        );
    }

    async getAllVideo() {
        return await axios.get(`${base_url}/api/videos/getAllVideo`, plainConfig());
    }

    async getVideoById(id) {
        return await axios.get(`${base_url}/api/videos/getVideoById/${id}`, plainConfig());
    }

    async deleteVideo(id) {
        return await axios.delete(`${base_url}/api/videos/deleteVideo/${id}`, authConfig());
    }

    async updateVideo(id, video) {
        return await axios.put(`${base_url}/api/videos/updateVideo/${id}`, video, authConfig());
    }

    async deleteImage(id) {
        return await axios.delete(`${base_url}/api/videos/deleteImage/${id}`, authConfig());
    }

    // ─── Images ──────────────────────────────────────────────────────────────
    async insertImage(url, ownerId) {
        return await axios.post(
            `${base_url}/api/videos/postImage?url=${url}&ownerId=${ownerId}`,
            { url },
            authConfig()
        );
    }

    async getImages() {
        return await axios.get(`${base_url}/api/videos/getAllImages`, plainConfig());
    }

    // ─── Exams ───────────────────────────────────────────────────────────────
    async postExam(name, time, maxTimes, questions) {
        const { user } = getCreds();
        return await axios.post(
            `${base_url}/api/exams/postExamAndQuestions?ownerId=${user}`,
            { name, time, maxTimes, questions },
            authConfig()
        );
    }

    async getListExams() {
        return await axios.get(`${base_url}/api/exams/getListExams`, authConfig());
    }

    async getExamById(id) {
        return await axios.get(`${base_url}/api/exams/getExamById?id=${id}`, authConfig());
    }

    async postResult(examId, numberCorrect, time, totalQuestion) {
        const { user } = getCreds();
        return await axios.post(
            `${base_url}/api/exams/result`,
            { resultId: { examId, userId: user }, numberCorrect, time, totalQuestion },
            authConfig()
        );
    }

    async getRank(examId) {
        return await axios.get(`${base_url}/api/exams/rank?examId=${examId}`, authConfig());
    }

    async deleteExam(id) {
        return await axios.delete(`${base_url}/api/exams/deleteExam/${id}`, authConfig());
    }

    async updateExam(id, exam) {
        return await axios.put(`${base_url}/api/exams/updateExam/${id}`, exam, authConfig());
    }

    // ─── User info ───────────────────────────────────────────────────────────
    async getInfo() {
        const { user } = getCreds();
        return await axios.get(`${base_url}/api/users/info?userId=${user}`, authConfig());
    }

    async updateInfo(email, password, name, school, avatar, gender, ofClass) {
        const { user } = getCreds();
        return await axios.put(
            `${base_url}/api/users/info?userId=${user}`,
            { id: user, email, password, name, school, avatar, gender, ofClass },
            authConfig()
        );
    }

    async updateAvatar(avatar) {
        const { user } = getCreds();
        return await axios.put(
            `${base_url}/api/users/avatar?userId=${user}&avatar=${avatar}`,
            {},
            authConfig()
        );
    }
}

export default new Api();
