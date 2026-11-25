import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { collection, doc, getDocs, updateDoc } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { auth, db } from './firebase.js';

const list = document.getElementById('project-list');
const tabs = document.querySelectorAll('.tab');
const detail = document.getElementById('project-detail');
const detailEmpty = document.getElementById('detail-empty');
const reasonInput = document.getElementById('review-reason');
const message = document.getElementById('review-message');
const result = document.getElementById('review-result');
const approveButton = document.getElementById('approve-button');
const rejectButton = document.getElementById('reject-button');

let projects = [];
let selectedStatus = '검토중';
let selectedProject = null;

async function loadProjects() {
  const snapshot = await getDocs(collection(db, 'projects'));
  projects = [];
  for (let i = 0; i < snapshot.docs.length; i++) {
    const item = snapshot.docs[i].data();
    item.id = snapshot.docs[i].id;
    projects.push(item);
  }
  showList();
}

function showDetail(p) {
  detail.hidden = !p;
  detailEmpty.hidden = !!p;
  if (!p) return;

  document.getElementById('project-name').textContent = p.title || '';
  document.getElementById('project-meta').textContent = (p.authorName || '') + (p.createdAt ? ' · ' + p.createdAt : '');
  document.getElementById('project-summary').textContent = p.summary || '';
  document.getElementById('project-content').textContent = p.content || '';
  document.getElementById('project-reason').textContent = p.reason || '';
  document.getElementById('project-github').textContent = p.githubUrl || '-';
  document.getElementById('project-date').textContent = p.presentationDate || '-';

  let team = '';
  for (let i = 0; p.members && i < p.members.length; i++) {
    if (i > 0) team += ' · ';
    team += p.members[i].loginId + '(' + p.members[i].role + ')';
  }
  document.getElementById('project-team').textContent = team || '-';

  let techHtml = '';
  for (let i = 0; p.techStacks && i < p.techStacks.length; i++) {
    techHtml += '<span class="tech-tag">' + p.techStacks[i] + '</span>';
  }
  document.getElementById('project-tech').innerHTML = techHtml;

  reasonInput.value = p.reviewReason || '';
  document.getElementById('reason-count').textContent = reasonInput.value.length + ' / 100자';

  const processed = p.status !== '검토중';
  approveButton.disabled = processed;
  rejectButton.disabled = processed;
  reasonInput.disabled = processed;
  message.textContent = '';
}

function showList() {
  const visible = [];
  for (let i = 0; i < projects.length; i++) {
    if (projects[i].status === selectedStatus) visible.push(projects[i]);
  }
  if (!visible.includes(selectedProject)) selectedProject = visible[0] || null;

  list.innerHTML = '';
  for (let i = 0; i < visible.length; i++) {
    const p = visible[i];
    const row = document.createElement('tr');
    if (p === selectedProject) row.className = 'is-selected';

    let badge = 'status';
    if (p.status === '승인') badge += ' status-approved';
    if (p.status === '거절') badge += ' status-rejected';

