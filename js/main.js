document.addEventListener('DOMContentLoaded', function(){
  // index -> sub navigation
  const startBtn = document.getElementById('startBtn');
  if(startBtn){
    startBtn.addEventListener('click', function(){
      window.location.href = 'sub/subpage.html';
    });
  }

  // subpage interactions
  const langBtns = document.querySelectorAll('.lang');
  langBtns.forEach(b=>b.addEventListener('click', (e)=> {
    langBtns.forEach(x=>x.classList.remove('active'));
    e.currentTarget.classList.add('active');
  }));

  const stepBtns = document.querySelectorAll('.step');
  stepBtns.forEach(b=>b.addEventListener('click', (e)=> {
    stepBtns.forEach(x=>x.classList.remove('active'));
    e.currentTarget.classList.add('active');
  }));

  // categories (multiple select)
  const cats = document.querySelectorAll('.cat');
  cats.forEach(c=>{
    c.addEventListener('click', () => {
      c.classList.toggle('active');
      hideAlert();
    });
  });

  const beginBtn = document.getElementById('beginBtn');
  if(beginBtn){
    beginBtn.addEventListener('click', () => {
      const activeCats = document.querySelectorAll('.cat.active');
      if(activeCats.length === 0){
        showAlert('최소 1개의 카테고리를 선택해주세요!');
        return;
      }
      // 첫 번째 로딩 화면으로 진행 (design-only)
      showGeneratingScreen();
    });
  }

  function showAlert(msg){
    const a = document.getElementById('alertBox');
    if(!a) return;
    a.textContent = msg;
    a.hidden = false;
    a.style.opacity = '1';
    a.animate([{opacity:0},{opacity:1}],{duration:240});
    a.scrollIntoView({behavior:'smooth',block:'center'});
  }
  function hideAlert(){
    const a = document.getElementById('alertBox');
    if(!a) return;
    a.hidden = true;
  }

  // 디자인 미리보기를 위한 간단한 시뮬레이션 내비게이션:
  function showGeneratingScreen(){
    // 문서 내용을 로딩 화면으로 대체 (design-only)
    document.body.innerHTML = `
      <main class="loading-wrap">
        <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100">
          <div class="bar" id="genBar">A.I SPEAKING GENERATING...</div>
        </div>
      </main>
    `;
    // 진행 상황 애니메이션을 만든 다음 AI 화면으로 이동합니다
    setTimeout(()=> {
      const bar = document.getElementById('genBar');
      bar.style.width = '65%';
      setTimeout(()=> goToAiScreen(), 1600);
    }, 80);
  }

  function goToAiScreen(){
    document.body.innerHTML = `
      <main class="ai-screen">
        <div class="generated-text" id="generatedText">나는 생각한다, 고로 존재한다.</div>
        <div class="camera-box"><img src="assets/images/placeholder.svg" id="cameraImg" alt="camera placeholder"></div>
        <button class="mic-btn" id="micBtn" aria-pressed="false" title="녹음 시작/정지">🎤</button>
        <div class="mic-hint">버튼을 누르고 말해주세요!</div>
      </main>
    `;
    // 분석 화면으로 이동하려면 마이크 버튼을 클릭합니다 (design-only)
    const mb = document.getElementById('micBtn');
    let recording = false;
    mb.addEventListener('click', ()=> {
      recording = !recording;
      mb.textContent = recording ? '■' : '🎤';
      mb.setAttribute('aria-pressed', recording ? 'true' : 'false');
      if(!recording){
        // 녹음 중지 시뮬레이션 -> 분석으로 이동합니다
        showAnalyzingScreen();
      }
    });
  }

  function showAnalyzingScreen(){
    document.body.innerHTML = `
      <main class="loading-wrap">
        <div style="text-align:center">
          <div class="generated-text" style="margin-bottom:20px">나는 생각한다, 고로 존재한다.</div>
          <div style="font-size:24px;color:var(--muted)">AI가 열심히 분석중입니다...</div>
        </div>
      </main>
    `;
    setTimeout(()=> showResultScreen(), 1400);
  }

  function showResultScreen(){
    document.body.innerHTML = `
      <main class="result-wrap">
        <div class="generated-text">나는 생각한다, 고로 존재한다.</div>
        <div class="result-card">
          <h3>View Details</h3>
          <ul>
            <li>나는 생각한다, 고로 존재한다. <button style="margin-left:8px;padding:6px 10px;border-radius:10px;border:none;background:linear-gradient(180deg,#cfe7ff,#a9d0ff);">음성듣기</button></li>
            <li><span style="color:#d36b0d;text-decoration:underline">나는 생각흔다</span>, 고로 존재한다.</li>
          </ul>
        </div>
        <div class="next-row">
          <button class="next-btn" id="nextBtn">다음으로 ▶</button>
        </div>
      </main>
    `;
    const nb = document.getElementById('nextBtn');
    nb.addEventListener('click', ()=> {
      alert('데시보드 제작중...');
    });
  }

});
