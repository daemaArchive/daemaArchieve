import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { auth, db } from './firebase.js';

const headerArea = document.getElementById('header');

if (headerArea) {
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = '../css/header.css';
  document.head.appendChild(style);

  headerArea.innerHTML =
    '<header class="header">' +
    '<a class="logo" href="index.html">대마 아카이브</a>' +
    '<nav class="header-nav">' +
    '<a href="index.html">프로젝트</a>' +
    '<a href="mypage.html" class="user-only" hidden>마이페이지</a>' +
    '<a href="admin.html" id="admin-menu" hidden>관리자</a>' +
    '<a href="login.html" class="guest-only">로그인</a>' +
    '<a href="signup.html" class="guest-only">회원가입</a>' +
    '<button type="button" id="logout-btn" class="user-only" hidden>로그아웃</button>' +
    '</nav></header>';

  const guestMenus = headerArea.querySelectorAll('.guest-only');
  const userMenus = headerArea.querySelectorAll('.user-only');
  const adminMenu = document.getElementById('admin-menu');

  onAuthStateChanged(auth, async function (user) {
    for (let i = 0; i < guestMenus.length; i++) guestMenus[i].hidden = !!user;
    for (let i = 0; i < userMenus.length; i++) userMenus[i].hidden = !user;
    adminMenu.hidden = true;

    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data().role === 'ADMIN') adminMenu.hidden = false;
    }
  });

  document.getElementById('logout-btn').addEventListener('click', async function () {
    await signOut(auth);
    location.href = 'index.html';
  });
}
