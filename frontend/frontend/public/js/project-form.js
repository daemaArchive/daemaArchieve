const form = document.querySelector('#project-form');
const submitButton = document.querySelector('#submit-button');
const formMessage = document.querySelector('#form-message');
const techInput = document.querySelector('#tech-stack');
const techList = document.querySelector('#tech-list');
const memberId = document.querySelector('#member-id');
const memberRole = document.querySelector('#member-role');
const teamMembers = document.querySelector('#team-members');

submitButton.disabled = false;

// 기술은 칩으로 표시하고, 추후 폼과 함께 보낼 수 있게 보관합니다.
document.querySelector('#add-tech').addEventListener('click', function () {
  const value = techInput.value.trim();
  if (!value) {
    techInput.focus();
    return;
  }

  const tag = document.createElement('button');
  tag.type = 'button';
  tag.className = 'tech-tag';
  tag.textContent = value + ' ×';
  tag.setAttribute('aria-label', value + ' 기술 삭제');
  const hidden = document.createElement('input');
  hidden.type = 'hidden';
  hidden.name = 'tech_stack';
  hidden.value = value;
  tag.appendChild(hidden);
  tag.addEventListener('click', function () { tag.remove(); });
  techList.appendChild(tag);
  techInput.value = '';
  techInput.setCustomValidity('');
  techInput.focus();
});

techInput.addEventListener('input', function () { techInput.setCustomValidity(''); });

// 팀원 아이디와 역할은 한 쌍으로 추가합니다. 계정 확인은 서버 연결 후 가능합니다.
document.querySelector('#add-member').addEventListener('click', function () {
  if (!memberId.value.trim() || !memberRole.value.trim()) {
    formMessage.textContent = '팀원 아이디와 역할을 모두 입력해 주세요.';
    (!memberId.value.trim() ? memberId : memberRole).focus();
    return;
  }

  const row = document.createElement('tr');
  const idCell = document.createElement('td');
  const roleCell = document.createElement('td');
  const removeCell = document.createElement('td');
  idCell.textContent = memberId.value.trim();
  roleCell.textContent = memberRole.value.trim();

  const idValue = document.createElement('input');
  idValue.type = 'hidden';
  idValue.name = 'member_id';
  idValue.value = memberId.value.trim();
  const roleValue = document.createElement('input');
  roleValue.type = 'hidden';
  roleValue.name = 'member_role';
  roleValue.value = memberRole.value.trim();
  idCell.appendChild(idValue);
  roleCell.appendChild(roleValue);

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'remove-member';
  remove.textContent = '×';
  remove.setAttribute('aria-label', memberId.value.trim() + ' 팀원 삭제');
  remove.addEventListener('click', function () { row.remove(); });
  removeCell.appendChild(remove);
  row.append(idCell, roleCell, removeCell);
  teamMembers.appendChild(row);
  memberId.value = '';
  memberRole.value = '';
  formMessage.textContent = '';
});

// 파일은 미리보기만 합니다. 실제 전송은 하지 않습니다.
const thumbnail = document.querySelector('#thumbnail');
const thumbnailPreview = document.querySelector('#thumbnail-preview');
let thumbnailUrl = '';
thumbnail.addEventListener('change', function () {
  if (thumbnailUrl) URL.revokeObjectURL(thumbnailUrl);
  const file = thumbnail.files[0];
  thumbnailPreview.hidden = !file;
  document.querySelector('#thumbnail-placeholder').hidden = Boolean(file);
  if (file) {
    thumbnailUrl = URL.createObjectURL(file);
    thumbnailPreview.src = thumbnailUrl;
  } else {
    thumbnailUrl = '';
    thumbnailPreview.removeAttribute('src');
  }
});

const images = document.querySelector('#images');
const imagePreview = document.querySelector('#image-preview');
let imageUrls = [];
images.addEventListener('change', function () {
  imageUrls.forEach(function (url) { URL.revokeObjectURL(url); });
  imageUrls = [];
  imagePreview.replaceChildren();
  Array.from(images.files).forEach(function (file) {
    const url = URL.createObjectURL(file);
    imageUrls.push(url);
    const image = document.createElement('img');
    image.src = url;
    image.alt = file.name + ' 미리보기';
    imagePreview.appendChild(image);
  });
});

form.addEventListener('submit', function (event) {
  event.preventDefault();
  formMessage.textContent = '';
  form.querySelectorAll('[required]').forEach(function (field) {
    field.setCustomValidity(field.value && !field.value.trim() ? '공백이 아닌 내용을 입력해 주세요.' : '');
  });
  techInput.setCustomValidity(techList.children.length ? '' : '기술 스택을 하나 이상 추가해 주세요.');
  if (!form.reportValidity()) return;
  if (memberId.value.trim() || memberRole.value.trim()) {
    formMessage.textContent = '입력한 팀원의 아이디와 역할을 확인한 뒤 팀원 추가 버튼을 눌러 주세요.';
    return;
  }

  // 여기에 프로젝트 API를 연결합니다. FormData 형식은 백엔드와 먼저 맞춰야 합니다.
  formMessage.textContent = '서버가 아직 연결되지 않아 검토 요청을 보낼 수 없습니다. 입력한 내용은 이 화면에 유지됩니다.';
});

const parameters = new URLSearchParams(window.location.search);
if (parameters.get('mode') === 'edit') {
  document.querySelector('#page-title').textContent = '프로젝트 수정';
  document.title = '프로젝트 수정 | 대마 아카이브';
  document.querySelector('#page-notice').textContent = '서버가 아직 연결되지 않아 기존 프로젝트를 불러올 수 없습니다. 현재는 빈 양식으로 표시됩니다.';
  submitButton.textContent = '수정 요청하기';
}
