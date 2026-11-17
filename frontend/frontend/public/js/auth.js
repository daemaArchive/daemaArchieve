/* 서버가 연결되기 전까지 입력값만 확인합니다. */
const signupForm = document.querySelector('#signup-form');
const loginForm = document.querySelector('#login-form');

if (signupForm) {
  signupForm.querySelector('button[type=submit]').disabled = false;
  const nameInput = document.querySelector('#signup-name');
  const idInput = document.querySelector('#signup-id');
  const passwordInput = document.querySelector('#signup-password');
  const passwordConfirm = document.querySelector('#signup-password-confirm');
  const signupMessage = document.querySelector('#signup-message');

  signupForm.addEventListener('submit', function (event) {
    event.preventDefault();
    signupMessage.textContent = '';

    // 공백만 입력한 이름과 아이디는 빈 값으로 처리합니다.
    nameInput.setCustomValidity(nameInput.value.trim() ? '' : '이름을 입력해 주세요.');
    idInput.setCustomValidity(idInput.value.trim() ? '' : '아이디를 입력해 주세요.');
    passwordConfirm.setCustomValidity(
      passwordConfirm.value && passwordInput.value !== passwordConfirm.value
        ? '비밀번호가 일치하지 않습니다.'
        : ''
    );

    if (!signupForm.reportValidity()) return;

    // 여기에 회원가입 API를 연결하고 응답에 따라 안내합니다.
    signupMessage.textContent = '입력 내용을 확인했습니다. 회원가입과 이메일 인증은 서버 연결 후 사용할 수 있습니다.';
  });

  // 수정 중에는 이전 오류가 계속 남지 않도록 지웁니다.
  signupForm.addEventListener('input', function () {
    signupMessage.textContent = '';
  });
  nameInput.addEventListener('input', function () {
    nameInput.setCustomValidity('');
  });
  idInput.addEventListener('input', function () {
    idInput.setCustomValidity('');
  });
  passwordInput.addEventListener('input', function () {
    passwordConfirm.setCustomValidity('');
  });
  passwordConfirm.addEventListener('input', function () {
    passwordConfirm.setCustomValidity('');
  });
}

if (loginForm) {
  loginForm.querySelector('button[type=submit]').disabled = false;
  const loginMessage = document.querySelector('#login-message');

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    loginMessage.textContent = '';

    if (!loginForm.reportValidity()) return;

    // 여기에 로그인 API를 연결하고 응답에 따라 안내합니다.
    loginMessage.textContent = '로그인은 서버 연결 후 사용할 수 있습니다. 아직 로그인되지 않았습니다.';
  });

  loginForm.addEventListener('input', function () {
    loginMessage.textContent = '';
  });
}
