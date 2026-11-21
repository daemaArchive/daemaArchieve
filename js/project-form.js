import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { addDoc, collection, doc, getDoc } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { auth, db } from './firebase.js';

onAuthStateChanged(auth, function (user) {
  if (!user) location.href = 'login.html';
});

const form = document.getElementById('project-form');
const formMessage = document.getElementById('form-message');
const techInput = document.getElementById('tech-stack');
const techList = document.getElementById('tech-list');
const memberId = document.getElementById('member-id');
const memberRole = document.getElementById('member-role');
const teamMembers = document.getElementById('team-members');

const techStacks = [];
const members = [];

document.getElementById('add-tech').addEventListener('click', function () {
  const value = techInput.value.trim();
  if (!value) return;
  techStacks.push(value);

  const tag = document.createElement('button');
  tag.type = 'button';
  tag.className = 'tech-tag';
  tag.textContent = value + ' ×';
  tag.addEventListener('click', function () {
    techStacks.splice(techStacks.indexOf(value), 1);
    tag.remove();
  });
  techList.appendChild(tag);
  techInput.value = '';
});

document.getElementById('add-member').addEventListener('click', function () {
  const id = memberId.value.trim();
  const role = memberRole.value.trim();
  if (!id || !role) {
    formMessage.textContent = '팀원 아이디와 역할을 모두 입력해 주세요.';
    return;
  }

  const member = { loginId: id, role: role };
  members.push(member);

  const row = document.createElement('tr');
  row.innerHTML = '<td>' + id + '</td><td>' + role + '</td><td><button type="button" class="remove-member">×</button></td>';
  row.querySelector('.remove-member').addEventListener('click', function () {
    members.splice(members.indexOf(member), 1);
    row.remove();
  });
  teamMembers.appendChild(row);
  memberId.value = '';
  memberRole.value = '';
  formMessage.textContent = '';
});

