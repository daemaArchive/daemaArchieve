const signupForm = document.querySelector('#signup-form');
const loginForm = document.querySelector('#login-form');

// 응답에 담긴 안내 문구를 화면에 표시합니다.
async function requestAuth(path, options) {
  const response = await fetch(path, options);
  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error('서버 응답을 확인할 수 없습니다.');
  }
  if (!response.ok) {
    const error = new Error(data.message || '요청을 처리하지 못했습니다.');
    error.code = data.code;
    throw error;
  }
  return data;
}

function postOptions(data) {
  return {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };
}

function authErrorMessage(error) {
  if (error instanceof TypeError) {
    return '서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.';
  }
  return error.message;
}

if (signupForm) {
  const submit = signupForm.querySelector('button[type=submit]');
  const nameInput = document.querySelector('#signup-name');
  const idInput = document.querySelector('#signup-id');
  const emailInput = document.querySelector('#signup-email');
  const passwordInput = document.querySelector('#signup-password');
  const passwordConfirm = document.querySelector('#signup-password-confirm');
  const message = document.querySelector('#signup-message');
  const idMessage = document.querySelector('#id-message');
  const checkId = document.querySelector('#check-login-id');
  submit.disabled = false;
  checkId.disabled = false;

  checkId.addEventListener('click', async function () {
    idInput.setCustomValidity('');
    if (!idInput.reportValidity()) return;
    const checkedId = idInput.value;
    checkId.disabled = true;
    idMessage.textContent = '확인 중입니다.';
    try {
      const data = await requestAuth('/api/auth/check-login-id?login_id=' + encodeURIComponent(checkedId), {
        credentials: 'include'
      });
      if (idInput.value === checkedId) {
        idMessage.textContent = '이미 사용 중인 아이디입니다.';
        if (data.available) idMessage.textContent = '사용할 수 있는 아이디입니다.';
      }
    } catch (error) {
      if (idInput.value === checkedId) idMessage.textContent = authErrorMessage(error);
    } finally {
      checkId.disabled = false;
    }
  });

  signupForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    message.textContent = '';
    nameInput.setCustomValidity(nameInput.value.trim() ? '' : '이름을 입력해 주세요.');
    idInput.setCustomValidity('');
    const validPassword = /[a-zA-Z]/.test(passwordInput.value) && /[0-9]/.test(passwordInput.value);
    passwordInput.setCustomValidity(passwordInput.value && !validPassword ? '영문과 숫자를 포함해 주세요.' : '');
    passwordConfirm.setCustomValidity(passwordConfirm.value && passwordInput.value !== passwordConfirm.value ? '비밀번호가 일치하지 않습니다.' : '');
    if (!signupForm.reportValidity()) return;

    submit.disabled = true;
    try {
      const data = await requestAuth('/api/auth/signup', postOptions({
        name: nameInput.value.trim(),
        login_id: idInput.value,
        email: emailInput.value.trim(),
        password: passwordInput.value,
        password_confirm: passwordConfirm.value
      }));
      message.textContent = data.message || '인증 메일을 확인해 주세요.';
    } catch (error) {
      message.textContent = authErrorMessage(error);
    } finally {
      submit.disabled = false;
    }
  });

  signupForm.addEventListener('input', function (event) {
    message.textContent = '';
    if (event.target === idInput) idMessage.textContent = '';
    nameInput.setCustomValidity('');
    idInput.setCustomValidity('');
    passwordInput.setCustomValidity('');
    passwordConfirm.setCustomValidity('');
  });
}

if (loginForm) {
  const submit = loginForm.querySelector('button[type=submit]');
  const emailInput = document.querySelector('#login-email');
  const passwordInput = document.querySelector('#login-password');
  const message = document.querySelector('#login-message');
  const resend = document.querySelector('#resend-email');
  const params = new URLSearchParams(window.location.search);
  const verified = params.get('verified');
  submit.disabled = false;

  if (verified === '1') {
    message.textContent = '이메일 인증이 완료됐습니다. 로그인해 주세요.';
  }
  if (verified === '0') {
    message.textContent = '이메일 인증에 실패했습니다. 이메일을 입력하고 인증 메일을 다시 요청해 주세요.';
    resend.hidden = false;
  }

  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    message.textContent = '';
    resend.hidden = true;
    if (!loginForm.reportValidity()) return;
    submit.disabled = true;
    try {
      await requestAuth('/api/auth/login', postOptions({ email: emailInput.value.trim(), password: passwordInput.value }));
      window.location.href = '../index.html';
    } catch (error) {
      message.textContent = authErrorMessage(error);
      if (error.code === 'EMAIL_NOT_VERIFIED') resend.hidden = false;
    } finally {
      submit.disabled = false;
    }
  });

  emailInput.addEventListener('input', function () {
    message.textContent = '';
    if (verified !== '0') resend.hidden = true;
  });
  passwordInput.addEventListener('input', function () { message.textContent = ''; });
  resend.addEventListener('click', async function () {
    if (!emailInput.reportValidity()) return;
    resend.disabled = true;
    try {
      const data = await requestAuth('/api/auth/verify-email/resend', postOptions({ email: emailInput.value.trim() }));
      message.textContent = data.message || '인증 메일을 다시 보냈습니다.';
    } catch (error) {
      message.textContent = authErrorMessage(error);
    } finally {
      resend.disabled = false;
    }
  });
}
