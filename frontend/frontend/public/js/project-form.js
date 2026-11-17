const form = document.querySelector('#project-form');
const submitButton = document.querySelector('#submit-button');
const resubmitButton = document.querySelector('#resubmit-button');
const formMessage = document.querySelector('#form-message');
const techInput = document.querySelector('#tech-stack');
const techList = document.querySelector('#tech-list');
const memberId = document.querySelector('#member-id');
const memberRole = document.querySelector('#member-role');
const teamMembers = document.querySelector('#team-members');
const api = 'http://localhost:3000/api/projects';
const parameters = new URLSearchParams(window.location.search);
const editing = parameters.get('mode') === 'edit';
const projectId = parameters.get('id');
let savedAfterEdit = false;

function addTech(value) {
  const tag = document.createElement('button');
  tag.type = 'button';
  tag.className = 'tech-tag';
  tag.textContent = value + ' ×';
  tag.setAttribute('aria-label', value + ' 기술 삭제');
  const hidden = document.createElement('input');
  hidden.type = 'hidden';
  hidden.value = value;
  tag.appendChild(hidden);
  tag.addEventListener('click', function () { tag.remove(); savedAfterEdit = false; });
  techList.appendChild(tag);
  savedAfterEdit = false;
}

document.querySelector('#add-tech').addEventListener('click', function () {
  const value = techInput.value.trim();
  if (!value) { techInput.focus(); return; }
  addTech(value);
  techInput.value = '';
  techInput.setCustomValidity('');
  techInput.focus();
});
techInput.addEventListener('input', function () { techInput.setCustomValidity(''); });

function addMember(id, role) {
  const row = document.createElement('tr');
  const idCell = document.createElement('td');
  const roleCell = document.createElement('td');
  const removeCell = document.createElement('td');
  idCell.textContent = id;
  roleCell.textContent = role;
  const idValue = document.createElement('input');
  idValue.type = 'hidden'; idValue.name = 'member_id'; idValue.value = id;
  const roleValue = document.createElement('input');
  roleValue.type = 'hidden'; roleValue.name = 'member_role'; roleValue.value = role;
  idCell.appendChild(idValue);
  roleCell.appendChild(roleValue);
  const remove = document.createElement('button');
  remove.type = 'button'; remove.className = 'remove-member'; remove.textContent = '×';
  remove.setAttribute('aria-label', id + ' 팀원 삭제');
  remove.addEventListener('click', function () { row.remove(); savedAfterEdit = false; });
  removeCell.appendChild(remove);
  row.append(idCell, roleCell, removeCell);
  teamMembers.appendChild(row);
  savedAfterEdit = false;
}

document.querySelector('#add-member').addEventListener('click', function () {
  const id = memberId.value.trim();
  const role = memberRole.value.trim();
  if (!id || !role) {
    formMessage.textContent = '팀원 아이디와 역할을 모두 입력해 주세요.';
    (!id ? memberId : memberRole).focus();
    return;
  }
  addMember(id, role);
  memberId.value = ''; memberRole.value = ''; formMessage.textContent = '';
});

// 선택한 파일의 미리보기입니다.
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
    image.src = url; image.alt = file.name + ' 미리보기';
    imagePreview.appendChild(image);
  });
});

async function responseData(response) {
  const data = await response.json().catch(function () { return {}; });
  if (!response.ok) throw new Error(data.message || '요청에 실패했습니다.');
  return data;
}

async function loadProject() {
  if (!projectId || !/^\d+$/.test(projectId)) {
    formMessage.textContent = '수정할 프로젝트 번호가 필요합니다.';
    return;
  }
  try {
    const response = await fetch(api + '/' + projectId, { credentials: 'include' });
    const project = await responseData(response);
    if (!Array.isArray(project.tech_stacks) || !Array.isArray(project.members) ||
        project.members.some(function (member) { return typeof member.is_author !== 'boolean'; })) {
      throw new Error('프로젝트 정보를 모두 불러오지 못했습니다.');
    }
    document.querySelector('#project-name').value = project.title || '';
    document.querySelector('#summary').value = project.summary || '';
    document.querySelector('#content').value = project.description || '';
    document.querySelector('#reason').value = project.registration_reason || '';
    document.querySelector('#github').value = project.github_url || '';
    document.querySelector('#presentation-date').value = project.presentation_date || '';
    project.tech_stacks.forEach(addTech);
    project.members.filter(function (member) { return !member.is_author; }).forEach(function (member) {
      addMember(member.login_id, member.role);
    });
    resubmitButton.hidden = project.status !== 'REJECTED';
    document.querySelector('#page-notice').textContent = '기존 파일은 새 파일을 선택하지 않으면 유지됩니다. 수정 후 저장해 주세요.';
    submitButton.disabled = false;
  } catch (error) {
    formMessage.textContent = error.message || '프로젝트를 불러오지 못했습니다. 서버 연결을 확인해 주세요.';
  }
}

form.addEventListener('input', function () { savedAfterEdit = false; });
form.addEventListener('change', function () { savedAfterEdit = false; });
form.addEventListener('submit', async function (event) {
  event.preventDefault();
  formMessage.textContent = '';
  form.querySelectorAll('[required]').forEach(function (field) {
    field.setCustomValidity(field.value && !field.value.trim() ? '공백이 아닌 내용을 입력해 주세요.' : '');
  });
  techInput.setCustomValidity(techList.children.length ? '' : '기술 스택을 하나 이상 추가해 주세요.');
  if (!form.reportValidity()) return;
  if (memberId.value.trim() || memberRole.value.trim()) {
    formMessage.textContent = '입력한 팀원을 추가하거나 입력 내용을 지워 주세요.';
    return;
  }
  const data = new FormData(form);
  const technologies = Array.from(techList.querySelectorAll('input')).map(function (field) { return field.value; });
  const members = Array.from(teamMembers.querySelectorAll('tr')).map(function (row) {
    return { login_id: row.querySelector('[name="member_id"]').value, role: row.querySelector('[name="member_role"]').value };
  });
  data.delete('member_id'); data.delete('member_role');
  data.set('tech_stacks', JSON.stringify(technologies));
  data.set('members', JSON.stringify(members));
  // 선택하지 않은 파일은 보내지 않아 기존 파일을 유지합니다.
  ['thumbnail', 'images', 'video', 'overview'].forEach(function (name) {
    const input = form.querySelector('[name="' + name + '"]');
    if (!input.files.length) data.delete(name);
  });
  submitButton.disabled = true;
  try {
    const response = await fetch(editing ? api + '/' + projectId : api, {
      method: editing ? 'PATCH' : 'POST', credentials: 'include', body: data
    });
    const result = await responseData(response);
    savedAfterEdit = editing;
    formMessage.textContent = result.message || (editing ? '수정 내용을 저장했습니다.' : '검토 요청을 보냈습니다.');
    if (!editing) return;
    ['thumbnail', 'images', 'video', 'overview'].forEach(function (name) {
      form.querySelector('[name="' + name + '"]').value = '';
    });
    imagePreview.replaceChildren();
    thumbnailPreview.hidden = true;
    document.querySelector('#thumbnail-placeholder').hidden = false;
  } catch (error) {
    formMessage.textContent = error.message === 'Failed to fetch' ? '서버에 연결할 수 없습니다. 입력한 내용은 유지됩니다.' : error.message;
  }
  submitButton.disabled = false;
});

resubmitButton.addEventListener('click', async function () {
  if (!savedAfterEdit) {
    formMessage.textContent = '수정 내용을 먼저 저장한 뒤 재요청해 주세요.';
    return;
  }
  const reason = document.querySelector('#reason').value.trim();
  if (!reason) { formMessage.textContent = '재요청 사유를 입력해 주세요.'; return; }
  resubmitButton.disabled = true;
  try {
    const response = await fetch(api + '/' + projectId + '/resubmit', {
      method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registration_reason: reason })
    });
    await responseData(response);
    formMessage.textContent = '검토를 다시 요청했습니다.';
    resubmitButton.hidden = true;
  } catch (error) {
    formMessage.textContent = error.message === 'Failed to fetch' ? '서버에 연결할 수 없습니다.' : error.message;
  }
  resubmitButton.disabled = false;
});

if (editing) {
  document.querySelector('#page-title').textContent = '프로젝트 수정';
  document.title = '프로젝트 수정 | 대마 아카이브';
  submitButton.textContent = '수정 내용 저장';
  loadProject();
} else {
  submitButton.disabled = false;
}
