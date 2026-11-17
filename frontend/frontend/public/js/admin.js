// 개발 서버 주소입니다. 배포할 때는 서버 주소를 바꿉니다.
const API = 'http://localhost:3000';
const list = document.querySelector('#project-list');
const tabs = document.querySelectorAll('.tab');
const detail = document.querySelector('#project-detail');
const detailEmpty = document.querySelector('#detail-empty');
const result = document.querySelector('#review-result');
const reasonInput = document.querySelector('#review-reason');
const message = document.querySelector('#review-message');
const approveButton = document.querySelector('#approve-button');
const rejectButton = document.querySelector('#reject-button');
const downloadButton = document.querySelector('#download-overview');
let selectedStatus = 'PENDING';
let selectedProject = null;
let listRequest = 0;
let detailRequest = 0;

async function request(path, options = {}) {
  const response = await fetch(API + path, { credentials: 'include', ...options });
  if (!response.ok) {
    const data = await response.json().catch(function () { return {}; });
    throw new Error(data.message || (response.status === 401 ? '로그인이 필요합니다.' : response.status === 403 ? '관리자 권한이 필요합니다.' : '요청을 처리하지 못했습니다.'));
  }
  return response;
}

function showError(error) {
  return error instanceof TypeError ? '서버에 연결할 수 없습니다. 백엔드 실행 상태를 확인해 주세요.' : error.message;
}

function statusLabel(status) {
  if (status === 'APPROVED') return '승인';
  if (status === 'REJECTED') return '거절';
  return '검토중';
}

async function loadList() {
  const requestNumber = ++listRequest;
  ++detailRequest;
  selectedProject = null;
  detail.hidden = true;
  detailEmpty.hidden = false;
  detailEmpty.textContent = '목록에서 프로젝트를 선택해 주세요.';
  document.querySelector('#empty-message').hidden = true;
  list.textContent = '';
  result.textContent = '목록을 불러오는 중입니다.';
  try {
    const response = await request('/api/admin/projects?status=' + selectedStatus);
    const data = await response.json();
    if (requestNumber !== listRequest) return;
    if (!Array.isArray(data.projects)) throw new Error('목록 응답 형식을 확인해 주세요.');
    result.textContent = '';
    document.querySelector('#empty-message').hidden = data.projects.length > 0;
    data.projects.forEach(function (project) {
      const row = document.createElement('tr');
      const title = document.createElement('td');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'project-choice';
      button.textContent = project.title;
      button.addEventListener('click', function () {
        list.querySelectorAll('tr').forEach(function (item) { item.classList.remove('is-selected'); });
        row.classList.add('is-selected');
        loadDetail(project);
      });
      title.appendChild(button);
      row.appendChild(title);
      [project.author ? project.author.name : '-', project.requested_at ? project.requested_at.slice(0, 10) : '-'].forEach(function (value) {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.appendChild(cell);
      });
      const cell = document.createElement('td');
      const badge = document.createElement('span');
      badge.className = 'status' + (project.status === 'APPROVED' ? ' status-approved' : project.status === 'REJECTED' ? ' status-rejected' : '');
      badge.textContent = statusLabel(project.status);
      cell.appendChild(badge);
      row.appendChild(cell);
      list.appendChild(row);
    });
    return true;
  } catch (error) {
    if (requestNumber === listRequest) result.textContent = showError(error);
    return false;
  }
}

async function loadDetail(project) {
  const requestNumber = ++detailRequest;
  selectedProject = null;
  detail.hidden = true;
  detailEmpty.hidden = false;
  detailEmpty.textContent = '상세 정보를 불러오는 중입니다.';
  try {
    const response = await request('/api/projects/' + encodeURIComponent(project.id));
    const data = await response.json();
    if (requestNumber !== detailRequest) return;
    selectedProject = data;
    detail.hidden = false;
    detailEmpty.hidden = true;
    document.querySelector('#project-name').textContent = data.title || '';
    const author = project.author || {};
    document.querySelector('#project-meta').textContent = (author.name || '') + (author.login_id ? ' (@' + author.login_id + ')' : '') + (project.requested_at ? ' · ' + project.requested_at.slice(0, 10) : '');
    document.querySelector('#project-summary').textContent = data.summary || '';
    document.querySelector('#project-description').textContent = data.description || '소개가 없습니다.';
    document.querySelector('#project-reason').textContent = data.registration_reason || '등록 사유가 없습니다.';
    document.querySelector('#project-team').textContent = (data.members || []).map(function (member) { return member.name || member.login_id; }).join(' · ') || '팀원 정보가 없습니다.';
    const tech = document.querySelector('#project-tech');
    tech.textContent = '';
    (data.tech_stacks || []).forEach(function (name) {
      const tag = document.createElement('span');
      tag.className = 'tech-tag';
      tag.textContent = name;
      tech.appendChild(tag);
    });
    document.querySelector('#overview-name').textContent = data.overview ? data.overview.file_name : '첨부된 파일 없음';
    downloadButton.disabled = !data.overview;
    reasonInput.value = '';
    document.querySelector('#reason-count').textContent = '0 / 100자';
    const processed = data.status !== 'PENDING';
    approveButton.disabled = processed;
    rejectButton.disabled = processed;
    reasonInput.disabled = processed;
    message.textContent = '';
  } catch (error) {
    if (requestNumber === detailRequest) detailEmpty.textContent = showError(error);
  }
}

tabs.forEach(function (tab) {
  tab.addEventListener('click', function () {
    selectedStatus = tab.dataset.status;
    tabs.forEach(function (item) {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    loadList();
  });
});

reasonInput.addEventListener('input', function () {
  document.querySelector('#reason-count').textContent = reasonInput.value.length + ' / 100자';
  message.textContent = '';
});

async function review(action) {
  if (!selectedProject) return;
  const reason = reasonInput.value.trim();
  if (action === 'reject' && !reason) {
    message.textContent = '거절 사유를 입력해 주세요.';
    reasonInput.focus();
    return;
  }
  approveButton.disabled = true;
  rejectButton.disabled = true;
  try {
    await request('/api/admin/projects/' + encodeURIComponent(selectedProject.id) + '/' + action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: reason })
    });
    if (await loadList()) {
      result.textContent = action === 'approve' ? '프로젝트를 승인했습니다.' : '프로젝트를 거절했습니다.';
    }
  } catch (error) {
    message.textContent = showError(error);
    approveButton.disabled = false;
    rejectButton.disabled = false;
  }
}

approveButton.addEventListener('click', function () { review('approve'); });
rejectButton.addEventListener('click', function () { review('reject'); });

downloadButton.addEventListener('click', async function () {
  if (!selectedProject || !selectedProject.overview) return;
  try {
    const response = await request('/api/projects/' + encodeURIComponent(selectedProject.id) + '/overview');
    const file = await response.blob();
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedProject.overview.file_name || 'overview';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    message.textContent = showError(error);
  }
});

loadList();
