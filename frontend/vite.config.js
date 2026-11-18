// 브라우저의 /api 요청을 로컬 백엔드로 전달합니다.
const proxy = {
  '/api': 'http://localhost:3000'
};

export default {
  server: { proxy: proxy },
  preview: { proxy: proxy }
};
