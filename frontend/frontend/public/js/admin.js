// 예시 데이터입니다. API 연결 시 서버에서 받은 목록으로 바꿉니다.
const projects = [
  { name: '대마 아카이브', applicant: '김학생', username: 'student1', date: '2026.10.20', summary: '학생 프로젝트를 한곳에 모아요', tech: ['JavaScript', 'Express', 'MySQL'], team: '김학생 · 이학생 · 박학생 · 학생4', reason: '교내 프로젝트 전시회에서 결과물을 공유하고 싶습니다.', status: '검토중' },
  { name: '교내 일정', applicant: '이학생', username: 'student2', date: '2026.10.19', summary: '학교 일정을 한눈에 확인해요', tech: ['React', 'Firebase'], team: '이학생', reason: '학교 일정을 편리하게 공유하고 싶습니다.', status: '검토중' },
  { name: '공부 타이머', applicant: '박학생', username: 'student3', date: '2026.10.18', summary: '집중하는 습관을 만들어 보세요', tech: ['JavaScript', 'Vue'], team: '박학생', reason: '공부 시간을 기록하고 싶습니다.', status: '검토중' }
];
const list = document.querySelector('#project-list');
const tabs = document.querySelectorAll('.tab');
const detail = document.querySelector('#project-detail');
const detailEmpty = document.querySelector('#detail-empty');
const reasonInput = document.querySelector('#review-reason');
const message = document.querySelector('#review-message');
const approveButton = document.querySelector('#approve-button');
const rejectButton = document.querySelector('#reject-button');
let selectedStatus = '검토중';
let selectedProject = projects[0];

function showDetail(project) {
  if (!project) {
    detail.hidden = true;
    detailEmpty.hidden = false;
    return;
  }
  detail.hidden = false;
  detailEmpty.hidden = true;
  document.querySelector('#project-name').textContent = project.name;
  document.querySelector('#project-meta').textContent = project.applicant + ' (@' + project.username + ') · ' + project.date;
  document.querySelector('#project-summary').textContent = project.summary;
  document.querySelector('#project-team').textContent = project.team;
  document.querySelector('#project-reason').textContent = project.reason;
  const tech = document.querySelector('#project-tech');
  tech.textContent = '';
  project.tech.forEach(function (name) {
    const tag = document.createElement('span');
    tag.className = 'tech-tag';
    tag.textContent = name;
    tech.appendChild(tag);
  });
  reasonInput.value = project.reviewReason || '';
  document.querySelector('#reason-count').textContent = reasonInput.value.length + ' / 100자';
  const processed = project.status !== '검토중';
  approveButton.disabled = processed;
  rejectButton.disabled = processed;
  reasonInput.disabled = processed;
  message.textContent = '';
}

function showList() {
  const visible = projects.filter(function (project) { return project.status === selectedStatus; });
  if (!visible.includes(selectedProject)) selectedProject = visible[0] || null;
  list.textContent = '';
  visible.forEach(function (project) {
    const row = document.createElement('tr');
    if (project === selectedProject) row.className = 'is-selected';
    const title = document.createElement('td');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'project-choice';
    button.textContent = project.name;
    button.addEventListener('click', function () {
      selectedProject = project;
      showList();
      // 목록을 다시 그린 뒤에도 선택한 버튼에 키보드 초점을 유지합니다.
      const selectedButton = list.querySelector('.is-selected .project-choice');
      if (selectedButton) selectedButton.focus();
    });
    title.appendChild(button);
    row.appendChild(title);
    [project.applicant, project.date].forEach(function (text) {
      const cell = document.createElement('td');
      cell.textContent = text;
      row.appendChild(cell);
    });
    const statusCell = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = 'status' + (project.status === '승인' ? ' status-approved' : project.status === '거절' ? ' status-rejected' : '');
    badge.textContent = project.status;
    statusCell.appendChild(badge);
    row.appendChild(statusCell);
    list.appendChild(row);
  });
  document.querySelector('#empty-message').hidden = visible.length > 0;
  showDetail(selectedProject);
}

tabs.forEach(function (tab) {
  tab.addEventListener('click', function () {
    selectedStatus = tab.dataset.status;
    tabs.forEach(function (item) {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    showList();
  });
});
reasonInput.addEventListener('input', function () {
  document.querySelector('#reason-count').textContent = reasonInput.value.length + ' / 100자';
  message.textContent = '';
});

function review(status) {
  if (status === '거절' && !reasonInput.value.trim()) {
    message.textContent = '거절 사유를 입력해 주세요.';
    reasonInput.focus();
    return;
  }
  // API 연결 시 서버 성공 응답을 받은 뒤 목록을 갱신합니다.
  selectedProject.reviewReason = reasonInput.value.trim();
  selectedProject.status = status;
  showList();
  // 실제 서버에 저장되지 않는 예시임을 알립니다.
  document.querySelector('#review-result').textContent = status + ' 시연입니다. 실제로 처리되지 않았으며 새로고침하면 초기화됩니다.';
}
approveButton.addEventListener('click', function () { review('승인'); });
rejectButton.addEventListener('click', function () { review('거절'); });
showList();
