import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { db } from './firebase.js';

const message = document.getElementById('detail-message');
const projectId = new URLSearchParams(location.search).get('id');

async function loadDetail() {
  if (!projectId) {
    message.hidden = false;
    message.textContent = '프로젝트를 찾을 수 없습니다.';
    return;
  }

  const snap = await getDoc(doc(db, 'projects', projectId));
  if (!snap.exists()) {
    message.hidden = false;
    message.textContent = '프로젝트를 찾을 수 없습니다.';
    return;
  }

  const p = snap.data();
  document.getElementById('detail-article').hidden = false;
  document.title = p.title + ' | 대마 아카이브';
  document.getElementById('detail-title').textContent = p.title || '';
  document.getElementById('detail-summary').textContent = p.summary || '';
  document.getElementById('detail-content').textContent = p.content || '';

  if (p.presentationDate) {
    document.getElementById('detail-date').textContent = '발표 ' + p.presentationDate.replaceAll('-', '.');
  }
  if (p.githubUrl) {
    document.getElementById('detail-github').hidden = false;
    document.getElementById('detail-github').href = p.githubUrl;
  }
  if (p.thumbnailUrl) {
    document.getElementById('detail-thumbnail').hidden = false;
    document.getElementById('detail-thumbnail').src = p.thumbnailUrl;
  }
  if (p.overview && p.overview.downloadUrl) {
    document.getElementById('detail-overview-section').hidden = false;
    document.getElementById('detail-overview-name').textContent = p.overview.fileName || '개요서.pdf';
    document.getElementById('detail-overview-download').href = p.overview.downloadUrl;
  }

}

loadDetail();
