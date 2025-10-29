document.addEventListener('DOMContentLoaded', function(){
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
      
      // active 클래스를 가진 버튼 선택
      const activeElements = document.querySelectorAll('.pill.active, .cat.active');

      // 텍스트 추출
      const activeTexts = Array.from(activeElements).map(el => el.textContent.trim());

      console.log('선택된 항목:', activeTexts);

      // 첫 번째 로딩 화면으로 진행 (design-only)
      showGeneratingScreen(activeTexts);
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
  function showGeneratingScreen(activeTexts){
    // 문서 내용을 로딩 화면으로 대체 (design-only)
    document.body.innerHTML = `
      <main class="loading-wrap">
        <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100">
          <div class="bar" id="genBar">AI GENERATING...</div>
        </div>
      </main>
    `;
    // 진행 상황 애니메이션을 만든 다음 AI 화면으로 이동합니다
    setTimeout(()=> {
      const bar = document.getElementById('genBar');
      bar.style.width = '65%';
      setTimeout(()=> goToAiScreen(activeTexts), 1600);
    }, 80);
  }

  function goToAiScreen(activeTexts){
    document.body.innerHTML = `
      <main class="ai-screen">
        <div class="generated-text" id="generatedText">나는 생각한다, 고로 존재한다.</div>
        <div class="camera-box"><img src="" id="cameraImg" alt="영상 녹화하는 위치 ${activeTexts} : 테스트 후 수정하기"></div>
        <button class="mic-btn" id="micBtn" aria-pressed="false" title="녹음 시작/정지">🎤</button>
        <div class="mic-hint">버튼을 클릭하면 시작합니다!</div>
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
        <div class="loading-center">
          <div class="loading-text">AI가 열심히 분석중입니다...</div>
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
          <h3>정확도 결과</h3>
          <ul>
            <li>
              80%
            </li>
          </ul>
        </div>
        <div class="next-row">
          <button class="next-btn"><a href="">처음으로</a></button>
        </div>
      </main>
    `;
  }

});
