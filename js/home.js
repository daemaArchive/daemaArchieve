import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { auth, db } from './firebase.js';

onAuthStateChanged(auth, function (user) {
  document.getElementById('home-intro').hidden = !!user;
  document.getElementById('add-project-btn').hidden = !user;
});

async function loadProjects() {
  const q = query(collection(db, 'projects'), where('status', '==', '승인'));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    document.getElementById('home-empty').hidden = false;
    return;
  }

  let html = '';
  for (let i = 0; i < snapshot.docs.length; i++) {
    const docSnap = snapshot.docs[i];
    const p = docSnap.data();

    let team = p.authorName || '작성자';
    if (p.members && p.members.length > 1) team += ' 외 ' + (p.members.length - 1) + '명';

}

loadProjects();
