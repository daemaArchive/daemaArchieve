# daemaArchieve

교내에서 제작된 다양한 프로젝트를 한곳에서 편리하게 살펴볼 수 있는 웹 서비스입니다.

프로젝트명, 프로젝트 소개, 시연 자료 등을 모아 각 프로젝트의 특징과 결과물을 쉽게 파악할 수 있도록 합니다.

여러 곳에 흩어진 자료를 찾아보는 번거로움을 줄이고, 교내 프로젝트를 더 많은 사람에게 소개하는 것을 목표로 합니다.

## 실행 방법

`python3 -m http.server 8000` 으로 실행한 뒤
`http://localhost:8000/html/index.html` 로 접속하면 됩니다.

## 화면 구성

- `html/index.html` : 프로젝트 목록
- `html/project-detail.html` : 프로젝트 상세
- `html/project-form.html` : 프로젝트 등록
- `html/mypage.html` : 내 프로젝트 및 검토 내역
- `html/admin.html` : 관리자 프로젝트 검토
- `html/login.html`, `html/signup.html` : 로그인 및 회원가입
