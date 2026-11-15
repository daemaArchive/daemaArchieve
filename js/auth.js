import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { auth, db } from './firebase.js';

const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');

if (signupForm) {
  const message = document.getElementById('signup-message');

  signupForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const loginId = document.getElementById('signup-id').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const passwordConfirm = document.getElementById('signup-password-confirm').value;

    if (password.length < 6) {
      message.textContent = '비밀번호는 6자 이상 입력해 주세요.';
      return;
    }
    if (password !== passwordConfirm) {
      message.textContent = '비밀번호가 일치하지 않습니다.';
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', result.user.uid), {
        name: name,
        loginId: loginId,
        email: email,
        role: 'USER',
        createdAt: new Date().toISOString()
      });
      location.href = 'index.html';
    } catch (error) {
      message.textContent = '회원가입 실패: ' + error.message;
    }
  });
}

