import axios from 'axios';
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});
api.interceptors.request.use((config) => {
    // Thêm API key vào header của yêu cầu
    config.headers['x-api-key'] =
        '117c8d999f62f15c28a2b46389ff38da003e96b89319109c552b15449f798c1a711be7aa1e622a643440d51ed89a090a8668e01922cc00854581b15061072100631b77abe9ebe4d4e286204e0a146d26425553327cf4ee459ab663084b5c9b1361cf14cd59e8bcb8c8a760a2eab480764859adedaf867236030e1ef92b2ba299775cb76d0b2811e1349394dcd38168779ef3794db88105c7c2cb9e1c8acd7edbde318cabfd2d082fca9b0e6c2243946cc7fdab2760614c6eb78e271af5690d4fe6298d51684112a20072954051503769993ec10004e82ae9498b77a57ada1a81ae9c0081ec4f8d87350330ced4fa0c03ff75daddc28313ea801dd00029fd64b7';
    return config;
});

export default api;
