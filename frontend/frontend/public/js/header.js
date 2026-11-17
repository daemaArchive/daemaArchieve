/* 각 페이지의 #header에 공통 헤더를 불러옵니다. */
(function () {
  const headerArea = document.querySelector('#header');
  if (!headerArea) return;

  // 현재 페이지의 위치가 달라도 이 파일을 기준으로 경로를 찾습니다.
  const scriptUrl = document.currentScript.src;
  const headerUrl = new URL('../html/header.html', scriptUrl);
  const styleUrl = new URL('../css/header.css', scriptUrl);
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = styleUrl.href;
  document.head.appendChild(style);

  fetch(headerUrl.href)
    .then(function (response) {
      if (!response.ok) throw new Error('헤더를 불러오지 못했습니다.');
      return response.text();
    })
    .then(function (html) {
      headerArea.innerHTML = html;

      // 링크는 header.html의 위치를 기준으로 해석합니다.
      const links = headerArea.querySelectorAll('a[href]');
      links.forEach(function (link) {
        link.href = new URL(link.getAttribute('href'), headerUrl).href;
      });
    })
    .catch(function () {
      headerArea.className = 'header-error';
      headerArea.textContent = '헤더를 불러오지 못했습니다. 로컬 서버로 페이지를 열어 주세요.';
    });
})();
