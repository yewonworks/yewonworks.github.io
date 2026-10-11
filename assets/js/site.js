(function () {
  "use strict";
  const projects = window.YW_PROJECTS || [];
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  function initNavigation() {
    const page = document.body.dataset.page;
    const active = page ? $(`[data-nav="${page}"]`) : null;
    if (active) active.setAttribute("aria-current", "page");
    const toggle = $(".menu-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector("span:first-child").textContent = open ? "닫기" : "메뉴";
    });
  }

  function logo(project, modifier = "") {
    const style = project.logoStyle ? ` organization-logo--${project.logoStyle}` : "";
    return `<span class="organization-logo ${modifier} organization-logo--${project.logoTone || "light"}${style}"><img src="${project.logo}" alt="${project.organization} 공식 로고" loading="lazy"></span>`;
  }

  function miniVisual(project) {
    const visual = project.thumbnail || { label: "의사결정 흐름", steps: ["질문", "근거", "선택"] };
    return `<div class="featured-diagram featured-diagram--${project.visualMode}" aria-hidden="true"><span class="featured-diagram__label mono">${visual.label}</span><div class="featured-diagram__track">${visual.steps.map((step,index)=>`<i><b class="mono">${String(index+1).padStart(2,"0")}</b><small>${step}</small></i>`).join("")}</div></div>`;
  }

  function renderFeatured() {
    const root = $("[data-featured-projects]");
    if (!root) return;
    root.innerHTML = projects.filter(p => p.featured).map((p, index) => `
      <a class="featured-card reveal" href="project.html?id=${p.id}" aria-label="${p.title} 프로젝트 보기">
        <span class="featured-card__number mono">${String(index + 1).padStart(2, "0")}</span>
        <div class="featured-card__visual">${miniVisual(p)}</div>
        <div class="featured-card__content"><h3>${p.title}</h3><p>${p.summary}</p></div>
        <div class="featured-card__meta mono"><span>${p.organization}<br>${p.category.replace(" / ", "<br>")}</span><b aria-hidden="true">↗</b></div>
      </a>`).join("");
  }

  function renderProjectLists() {
    $$('[data-project-list]').forEach(root => {
      const group = root.dataset.projectList;
      root.innerHTML = projects.filter(p => p.group === group).map(p => `
        <a class="project-row reveal" href="project.html?id=${p.id}" aria-label="${p.title} 프로젝트 보기">
          <span class="project-row__no mono">${p.number}</span>
          <div class="project-row__main"><div class="project-row__identity">${logo(p, "organization-logo--card")}<p class="project-row__org mono">${p.organization}</p></div><h3>${p.title}</h3><p>${p.summary}</p></div>
          <div class="project-row__details"><div><span class="mono">핵심 의사결정</span><p>${p.decisionLine}</p></div><div><span class="mono">활용 역량</span><p>${p.competencies.join(" · ")}</p></div></div>
          <div class="project-row__type mono"><span>프로젝트 상세</span><b aria-hidden="true">↗</b></div>
        </a>`).join("");
    });
  }

  function strategyVisual(project) {
    const step = (number, label, note = "") => `<li class="viz-step"><i class="mono">${number}</i><div><strong>${label}</strong>${note ? `<small>${note}</small>` : ""}</div></li>`;
    const flows = {
      "new-business-strategy": {
        label: "공개자료 조사에서 사람의 최종 판단까지의 분석 흐름",
        type: "linear",
        steps: [
          ["01", "공개자료 조사", "공개자료 기반 산업 리서치"],
          ["02", "시장 구조화", "시장·경쟁구조 정리"],
          ["03", "기회 선별", "근거 수준과 검증조건 평가"],
          ["04", "사람의 최종 검증", "출처 검증과 최종 판단"]
        ]
      },
      "investment-feasibility": {
        label: "투자 구조에서 의사결정 기준까지의 타당성 분석 흐름",
        type: "scenario",
        steps: [
          ["01", "투자·비용 구조", "초기비용·운영비 구조"],
          ["02", "수요 가정", "수요 가정"],
          ["03", "시나리오 분석", "핵심 변수별 민감도"],
          ["04", "판단 기준", "경제성과 회수 민감도 비교"]
        ]
      },
      "business-performance-optimization": {
        label: "업무 기준 구조화에서 반복 단계 적용까지의 검증 흐름",
        type: "validation",
        steps: [
          ["01", "업무 기준 해석", "업무 기준 구조화"],
          ["02", "계산 로직", "계산 규칙 구조화"],
          ["03", "AI 보조 구현", "함수 초안 구현"],
          ["04", "검증", "기준값·경계조건 검증"],
          ["05", "업무 적용", "반복 계산 단계 적용"]
        ],
        band: "사람의 검증으로 정확성을 통제"
      },
      "semiconductor-market-entry": {
        label: "시장기회에서 시장진입 옵션까지의 전략 흐름",
        type: "gates",
        steps: [
          ["01", "시장기회", "시장기회 평가"],
          ["02", "기술 적합성", "시장 요구와 적용 맥락"],
          ["03", "고객 조건", "고객 준비도 평가 기준"],
          ["04", "시장 진입", "진입 조건과 협력 옵션"]
        ]
      },
      "mobility-brand-growth": {
        label: "문제 구조화에서 전략 결과물 통합까지의 PM 흐름",
        type: "orchestration",
        steps: [
          ["01", "문제 구조화", "전체 분석체계 수립"],
          ["02", "Workstream 설계", "분석 모듈과 역할 설계"],
          ["03", "분석 및 피드백", "구성원별 방향·결과 피드백"],
          ["04", "전략 통합", "논리와 결과물 통합"]
        ]
      },
      "personalized-service-strategy": {
        label: "정량·정성조사와 후속 출시 서비스의 기능적 접점",
        type: "research",
        branches: [["정량", "정량조사"], ["정성", "정성조사"]],
        steps: [
          ["02", "미충족 니즈", "고객 미충족 니즈 도출"],
          ["03", "개인화 서비스", "추천구조·UX 설계"],
          ["04", "후속 출시", "기능 일치 확인"]
        ]
      },
      "new-business-model": {
        label: "시장·고객 검증에서 사업모델 검토까지의 설계 흐름",
        type: "business-model",
        branches: [["시장", "시장·경쟁 분석"], ["고객", "FGI 수요 검토"]],
        steps: [
          ["02", "시나리오 추정", "가정 기반 사업성 범위"],
          ["03", "비즈니스 모델", "가치 전달·수익 조건 검토"]
        ],
        triad: ["가치", "전달", "수익"]
      },
      "customer-segmentation": {
        label: "정성조사에서 행동 기반 락인 전략까지의 흐름",
        type: "segmentation",
        steps: [
          ["01", "정성조사", "학습 행동 탐색"],
          ["02", "행동 세분화", "행동 기준으로 구조화"],
          ["03", "고객 인사이트", "지속 사용 동인 도출"],
          ["04", "Lock-in 전략", "반복 이용 전략 연결"]
        ]
      }
    };
    const flow = flows[project.id];
    if (!flow) return "";
    const branch = flow.branches ? `<div class="viz-branch" aria-label="병렬 분석">${flow.branches.map((item, index) => `<div><i class="mono">01.${index + 1}</i><strong>${item[0]}</strong><small>${item[1]}</small></div>`).join("")}</div>` : "";
    const triad = flow.triad ? `<div class="viz-triad" aria-label="3자 가치 구조">${flow.triad.map(item => `<span>${item}</span>`).join("")}</div>` : "";
    return `<figure class="decision-visual decision-visual--${flow.type}" aria-label="${flow.label}">${branch}<ol class="viz-flow">${flow.steps.map(item => step(...item)).join("")}</ol>${triad}${flow.band ? `<figcaption>${flow.band}</figcaption>` : ""}</figure>`;
  }

  function overview(project) {
    return `<section class="v8-overview shell" aria-labelledby="project-title">
      <a class="project-hero__back mono" href="work.html">← 전체 프로젝트</a>
      <div class="v8-overview__head reveal"><div>${logo(project,"organization-logo--detail")}<p class="section-index mono">01 / 프로젝트 개요 · 프로젝트 ${project.number}</p><h1 id="project-title">${project.title}</h1><p class="v8-overview__summary">${project.summary}</p></div>${strategyVisual(project)}</div>
      <dl class="v8-facts reveal"><div><dt>기업</dt><dd>${project.organization}</dd></div><div><dt>기간</dt><dd>${project.period}</dd></div><div><dt>수행 역할</dt><dd>${project.role}</dd></div><div><dt>분야</dt><dd>${project.category}</dd></div></dl>
      <div class="v8-overview__logic reveal"><article><span class="mono">핵심 문제</span><p>${project.overview.problem}</p></article><article><span class="mono">전략 방향</span><p>${project.overview.direction}</p></article><article><span class="mono">확인된 산출물</span><p>${project.overview.result}</p></article></div>
    </section>`;
  }

  function analysis(project) {
    return `<section class="v8-section v8-analysis shell" aria-labelledby="analysis-title"><header><p class="section-index mono">02 / 핵심 분석</p><h2 id="analysis-title">근거가 의사결정으로<br>이어지는 과정.</h2><p>분석의 이유와 전략적 영향을 한 흐름에서 읽도록 연결했습니다.</p></header><div class="analysis-flow">${project.analysis.map((x,i)=>`
      <article class="analysis-step reveal"><span class="analysis-step__no mono">${String(i+1).padStart(2,"0")}</span><div><small>분석 질문</small><h3>${x.question}</h3></div><div><small>평가 기준</small><p>${x.criteria}</p></div><div><small>핵심 발견</small><p>${x.finding}</p></div><div class="analysis-step__impact"><small>전략적 시사점</small><p>${x.implication}</p></div></article>`).join("")}</div></section>`;
  }

  function featuredOutcome(project) {
    const item = project.featuredOutcome;
    if (!item) return "";
    return `<section class="featured-outcome shell" id="featured-outcome" aria-labelledby="featured-outcome-title">
      <div class="featured-outcome__content reveal">
        <p class="section-index mono">${item.eyebrow}</p>
        <h2 id="featured-outcome-title">${item.headline}</h2>
        <p class="featured-outcome__lead">${item.text}</p>
        <dl class="featured-outcome__metric"><div><dt>서비스 성과</dt><dd>${item.metric}</dd></div><div><dt>기간</dt><dd>${item.period}</dd></div><div><dt>출처</dt><dd>${item.reference}</dd></div></dl>
        <div class="featured-outcome__actions">
          <a class="featured-outcome__cta featured-outcome__cta--primary" href="${item.primary.url}" target="_blank" rel="noreferrer"><span>${item.primary.label}</span><b aria-hidden="true">↗</b></a>
          <a class="featured-outcome__cta featured-outcome__cta--secondary" href="${item.secondary.url}" target="_blank" rel="noreferrer"><span>${item.secondary.label}</span><b aria-hidden="true">↗</b></a>
        </div>
      </div>
      <figure class="featured-outcome__media reveal">
        <div class="service-screen"><img src="${item.image}" width="506" height="831" alt="${item.imageAlt}" loading="lazy"></div>
        <figcaption><span>${item.caption}</span><small class="mono">${item.captionEn}</small></figcaption>
        <p>출시 서비스 확인을 위한 실제 화면이며, 개인 기여는 고객조사·서비스 아이디어·기획에 해당합니다.</p>
      </figure>
    </section>`;
  }

  function decision(project) {
    const d = project.decision;
    return `<section class="v8-section v8-decision shell" aria-labelledby="decision-title"><header><p class="section-index mono">03 / 전략적 판단</p><h2 id="decision-title">선택과<br>트레이드오프.</h2><p class="decision-criteria"><span class="mono">판단 기준</span>${d.criteria.join(" · ")}</p></header><div class="alternative-table reveal"><div class="alternative-table__head mono"><span>대안</span><span>강점</span><span>리스크 / 한계</span></div>${d.alternatives.map(a=>`<div><strong>${a.option}</strong><p>${a.strength}</p><p>${a.risk}</p></div>`).join("")}</div><div class="choice-panel reveal"><span class="mono">권고 방향</span><p>${d.choice}</p><small>${d.rationale}</small></div></section>`;
  }

  function outcome(project) {
    const o = project.outcome;
    const items = o.items || [];
    const statusItems = items.map(item => `<article><span>${item.label}</span><p>${item.value}</p>${item.sourceUrl ? `<a class="outcome-source mono" href="${item.sourceUrl}" target="_blank" rel="noreferrer">${item.sourceLabel || "출처"} ↗</a>` : ""}</article>`).join("");
    return `<section class="v8-section v8-outcome shell" aria-labelledby="outcome-title"><header><p class="section-index mono">04 / 주요 결과 및 기여</p><h2 id="outcome-title">산출물과<br>직접 기여.</h2></header><div class="outcome-status outcome-status--${items.length} reveal" style="--outcome-count:${Math.min(items.length, 4)}">${statusItems}</div><div class="contribution-panel reveal"><span class="mono">직접 기여</span><ol>${o.contribution.map((x,i)=>`<li><i>${String(i+1).padStart(2,"0")}</i><p>${x}</p></li>`).join("")}</ol></div></section>`;
  }

  function renderProjectDetail() {
    const root = $("[data-project-root]");
    if (!root) return;
    const id = new URLSearchParams(location.search).get("id");
    const project = projects.find(p => p.id === id) || projects[0];
    const next = projects[(projects.indexOf(project)+1)%projects.length];
    document.title = `${project.title} — Yewon Works`;
    const meta = $('meta[name="description"]'); if (meta) meta.content = project.summary;
    root.innerHTML = `${overview(project)}${featuredOutcome(project)}${analysis(project)}${decision(project)}${outcome(project)}<section class="project-next"><div class="project-next__inner shell"><span class="mono">다음 프로젝트 / ${next.number}</span><a href="project.html?id=${next.id}">${next.title}<b aria-hidden="true">↗</b></a></div></section>`;
  }

  function initReveal() {
    const elements = $$(".reveal");
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return elements.forEach(e=>e.classList.add("is-visible"));
    const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}}),{threshold:.06,rootMargin:"0px 0px -4%"});
    elements.forEach(e=>observer.observe(e));
  }

  document.addEventListener("DOMContentLoaded",()=>{ $$('[data-year]').forEach(e=>e.textContent=new Date().getFullYear()); initNavigation(); renderFeatured(); renderProjectLists(); renderProjectDetail(); initReveal(); });
}());
