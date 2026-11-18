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

    let date = '';
    if (p.presentationDate) date = '발표 ' + p.presentationDate.replaceAll('-', '.');

    let tags = '';
    if (p.techStacks) {
      for (let j = 0; j < p.techStacks.length; j++) {
        tags += '<span class="card-tag">' + p.techStacks[j] + '</span>';
      }
    }

    let thumb = '';
    if (p.thumbnailUrl) thumb = '<img class="card-thumb" src="' + p.thumbnailUrl + '" alt="' + p.title + '">';

    html +=
      '<a class="project-card" href="project-detail.html?id=' + docSnap.id + '">' +
      thumb + '<h3>' + p.title + '</h3>' +
      '<p class="card-summary">' + p.summary + '</p>' +
      '<div class="card-techs">' + tags + '</div>' +
      '<div class="card-footer"><span>' + team + '</span><span>' + date + '</span></div></a>';
  }
  document.getElementById('project-cards').innerHTML = html;
}

loadProjects();
