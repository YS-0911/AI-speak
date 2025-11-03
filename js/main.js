document.addEventListener("DOMContentLoaded", function () {
  // subpage interactions
  const langBtns = document.querySelectorAll(".lang");
  langBtns.forEach((b) =>
    b.addEventListener("click", (e) => {
      langBtns.forEach((x) => x.classList.remove("active"));
      e.currentTarget.classList.add("active");
    })
  );

  const stepBtns = document.querySelectorAll(".step");
  stepBtns.forEach((b) =>
    b.addEventListener("click", (e) => {
      stepBtns.forEach((x) => x.classList.remove("active"));
      e.currentTarget.classList.add("active");
    })
  );

  let quoteData = null;

  //제이슨 패치로 가져오기
  fetch("../json/converted_quotes.json")
    .then((res) => res.json())
    .then((data) => {
      console.log("불러온 JSON:", data);
      quoteData = data;
      // 여기서 원하는 로직 실행
    });

  // categories (multiple select)
  const cats = document.querySelectorAll(".cat");
  cats.forEach((c) => {
    c.addEventListener("click", () => {
      c.classList.toggle("active");
      hideAlert();
    });
  });

  const beginBtn = document.getElementById("beginBtn");
  if (beginBtn) {
    beginBtn.addEventListener("click", () => {
      const activeCats = document.querySelectorAll(".cat.active");
      if (activeCats.length === 0) {
        showAlert("최소 1개의 카테고리를 선택해주세요!");
        return;
      }

      // active 클래스를 가진 버튼 선택
      const activeElements = document.querySelectorAll(
        ".pill.active, .cat.active"
      );

      // 텍스트 추출
      const activeTexts = Array.from(activeElements).map((el) =>
        el.textContent.trim()
      );

      console.log("선택된 항목:", activeTexts);

      // 첫 번째 로딩 화면으로 진행 (design-only)
      showGeneratingScreen(activeTexts);
    });
  }

  function showAlert(msg) {
    const a = document.getElementById("alertBox");
    if (!a) return;
    a.textContent = msg;
    a.hidden = false;
    a.style.opacity = "1";
    a.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240 });
    a.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function hideAlert() {
    const a = document.getElementById("alertBox");
    if (!a) return;
    a.hidden = true;
  }

  // 디자인 미리보기를 위한 간단한 시뮬레이션 내비게이션:
  function showGeneratingScreen(activeTexts) {
    // 문서 내용을 로딩 화면으로 대체 (design-only)
    document.getElementById("settings-page").innerHTML = `
      <div class="loading-wrap">
        <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100">
          <div class="bar" id="genBar">AI GENERATING...</div>
        </div>
      </div>
    `;
    // 진행 상황 애니메이션을 만든 다음 AI 화면으로 이동합니다
    setTimeout(() => {
      const bar = document.getElementById("genBar");
      bar.style.width = "65%";
      setTimeout(() => goToAiScreen(activeTexts), 1600);
    }, 80);
  }

  function goToAiScreen(activeTexts) {
    const selectedLang = activeTexts[0];
    const selectedLevel = activeTexts[1];
    const selectedCategories = activeTexts.slice(2);

    let sentencePool = [];

    selectedCategories.forEach((category) => {
      const items = quoteData[category];
      if (!items) return;

      const filtered = items.filter(
        (item) => item.language === selectedLang && item.level === selectedLevel
      );

      sentencePool.push(...filtered.map((item) => item.sentence));
    });

    const randomSentence =
      sentencePool.length > 0
        ? sentencePool[Math.floor(Math.random() * sentencePool.length)]
        : "조건에 맞는 문장이 없습니다.";

    document.getElementById("settings-page").innerHTML = `
      <div class="ai-screen">
        <div class="mic-hint">마이크 버튼을 누르고 아래 문장을 따라 읽어보세요!</div>
        <div class="generated-text" id="generatedText">${randomSentence}</div>
        <div class="camera-box"><img src="" id="cameraImg" alt="영상 녹화하는 위치 ${activeTexts} : 테스트 후 수정하기"></div>
        <button class="mic-btn" id="micBtn" aria-pressed="false" title="녹음 시작/정지">🎤</button>
      </div>
    `;
    // 분석 화면으로 이동하려면 마이크 버튼을 클릭합니다 (design-only)
    const mb = document.getElementById("micBtn");
    let recording = false;
    mb.addEventListener("click", () => {
      recording = !recording;
      mb.textContent = recording ? "■" : "🎤";
      mb.setAttribute("aria-pressed", recording ? "true" : "false");
      if (!recording) {
        // 녹음 중지 시뮬레이션 -> 분석으로 이동합니다
        showAnalyzingScreen(activeTexts);
      }
    });
  }

  function showAnalyzingScreen(activeTexts) {
    document.getElementById("settings-page").innerHTML = `
      <div class="loading-wrap">
        <div class="loading-center">
          <div class="loading-text">AI가 열심히 분석중입니다...</div>
        </div>
      </div>
    `;
    setTimeout(() => showResultScreen(activeTexts), 1400);
  }

  function showResultScreen(activeTexts) {
    // 정확도에 따른 이모티콘 선택
    let emoji = "";
    let accuracyPercent = 80;
    if (accuracyPercent < 50) emoji = "😭";
    else if (accuracyPercent < 70) emoji = "😊";
    else emoji = "😃";

    const next_btn = document.getElementById("next-btn");
    next_btn.addEventListener("click", () => {
      console.log("선택된 항목:", activeTexts);
      console.log("선택된 카테고리", selectedCategories);
      showGeneratingScreen(activeTexts);
    });

    document.getElementById("settings-page").innerHTML = `
      <div class="result-wrap">
        <div class="result-text">목표 문장 : <span>나는 생각한다, 고로 존재한다.</span></div>
        <div class="result-text">읽은 문장 : <span>나는 생각한다, 고로 존재한다.</span></span></div>

        <div class="result-card">
          <div class="result-area emoji-area">
            <h3>말하기 결과</h3>
            <div class="emoji-display">${emoji}</div>
            <div class="emoji-explane">
              <ul>
                <p>정확도</p>
                <li>70% 이상 : 😃</li>
                <li>50% 이상 : 😊</li>
                <li>50% 미만 : 😭</li>
              </ul>
            </div>
          </div>
          
          <div class="result-area accuracy-area">
            <h3>정확도</h3>
            <div class="accuracy-display">${accuracyPercent}%</div>
          </div>
        </div>
        
        <div class="next-row">
          <a href="../index.html" class="btn">처음<br>으로</a>
          <button class="btn" id="next-btn">다음<br>으로</button>
        </div>
      </div>
    `;
  }
});
