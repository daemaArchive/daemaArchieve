import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { collection, doc, getDoc, getDocs } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { auth, db } from './firebase.js';

function makeBadge(status) {
  let cls = 'status-badge';
  if (status === '승인') cls += ' status-approved';
  if (status === '거절') cls += ' status-rejected';
  return '<span class="' + cls + '">' + status + '</span>';
}

async function loadMyProjects(user) {
  let name = user.email;
  let loginId = '';

  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (userDoc.exists()) {
    name = userDoc.data().name || user.email;
    loginId = userDoc.data().loginId || '';
  }
  document.getElementById('mypage-user').textContent = loginId ? name + ' · @' + loginId : name;

  const snapshot = await getDocs(collection(db, 'projects'));
  let projectsHtml = '';
  let reviewsHtml = '';
  let count = 0;

  for (let i = 0; i < snapshot.docs.length; i++) {
    const docSnap = snapshot.docs[i];
    const p = docSnap.data();

    let isMine = p.authorId === user.uid;
    if (!isMine && loginId && p.members) {
      for (let j = 0; j < p.members.length; j++) {
        if (p.members[j].loginId === loginId) isMine = true;
      }
    }
    if (!isMine) continue;
    count++;

    const role = p.authorId === user.uid ? '등록자' : '팀원';
    const date = p.createdAt ? p.createdAt.replaceAll('-', '.') : '-';
    let reason = p.reviewReason || '승인 완료되었습니다.';
    if (p.status === '검토중') reason = '관리자 검토를 기다리고 있어요.';

    projectsHtml += '<tr><td><a class="project-link" href="project-detail.html?id=' + docSnap.id + '">' + p.title + '</a></td><td>' + role + '</td><td>' + makeBadge(p.status) + '</td></tr>';
    reviewsHtml += '<tr><td>' + p.title + '</td><td>' + date + '</td><td>' + makeBadge(p.status) + '</td><td>' + reason + '</td></tr>';
  }

  document.getElementById('my-projects-body').innerHTML = projectsHtml;
  document.getElementById('my-reviews-body').innerHTML = reviewsHtml;
  document.getElementById('my-projects-empty').hidden = count > 0;
  document.getElementById('my-reviews-empty').hidden = count > 0;
}

onAuthStateChanged(auth, function (user) {
  document.getElementById('mypage-login-notice').hidden = !!user;
  document.getElementById('mypage-content').hidden = !user;
  if (user) loadMyProjects(user);
});
