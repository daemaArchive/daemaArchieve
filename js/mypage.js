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

}
