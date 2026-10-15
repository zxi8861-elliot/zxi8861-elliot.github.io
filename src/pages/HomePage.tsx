import { useEffect, useRef, useState } from "react";
import Shuffle from "../components/Shuffle";
import TargetCursor from "../components/Target_cursor";

type Mode = "Work" | "Lab" | "Notes" | "Contact";
type Section = { label: string; text: string };
type Project = {
  id: string; title: string; short: string; category: "Work" | "Lab"; status: string;
  tags: string[]; role: string; result: string; sections: Section[]; cover?: string;
  gallery?: Array<{ src: string; alt: string }>; url?: string;
};
const modes: Mode[] = ["Work", "Lab", "Notes", "Contact"];
const labels: Record<Mode, string> = { Work: "工作作品", Lab: "个人实验", Notes: "知识沉淀", Contact: "联系我" };
const coursewareDirectory = [
  ["overview", "总览"], ["diagram-index", "全部图谱"], ["beginner-guide", "新手入口"],
  ["architecture", "总架构"], ["generation", "生成链路"], ["callbacks", "调用回调"],
  ["sequence", "生成时序"], ["state", "状态机"], ["ai-calls", "AI 调用"], ["scene-types", "Scene 分支"],
  ["routing", "能力路由"], ["research", "联网搜索"], ["assets", "资源生命周期"], ["media", "媒体管线"],
  ["agents", "课堂 Agent"], ["runtime", "播放引擎"], ["interactive-runtime", "互动 HTML"],
  ["recovery", "错误恢复"], ["iteration", "编辑重生成"], ["security", "安全边界"], ["objects", "对象关系"], ["code-index", "代码索引"],
] as const;
const hasMixedCjkLatin = (text: string) => /\p{Script=Han}/u.test(text) && /[A-Za-z]/.test(text);
const isHanCharacter = (text: string) => /\p{Script=Han}/u.test(text);

function renderTitleText(text: string) {
  if (!hasMixedCjkLatin(text)) return text;
  return Array.from(text).map((character, index) => isHanCharacter(character)
    ? <span className="cjk-size-adjust" key={`${character}-${index}`}>{character}</span>
    : character);
}

const projects: Project[] = [
  {
    id: "ai-ppt", title: "AI PPT", short: "觅知网线上产品｜从主题或文档生成演示文稿",
    category: "Work", status: "线上运行", role: "产品规划 / 生成链路 / 编辑体验",
    result: "约 1.5 个月上线 / 项目累计营收千万级 / 注册充值率翻倍",
    url: "https://www.51miz.com/ai/ppt", tags: ["AI 应用", "PPT 生成", "在线编辑"],
    sections: [
      { label: "项目概览", text: "觅知网 AI PPT 线上产品。负责产品规划、生成流程与编辑体验设计。" },
      { label: "背景与问题", text: "从主题或文档开始制作 PPT，需要经历资料整理、结构规划、内容撰写和视觉排版。单独生成文本，不能完成可编辑演示稿的交付。" },
      { label: "产品策略", text: "将生成目标从“写出内容”扩展到“形成可编辑演示文稿”，围绕主题/文档输入、大纲、页面内容、排版和编辑组织完整流程。" },
      { label: "核心设计", text: "用户输入主题或上传文档后生成大纲与正文，并提供排版、配图建议。页面结构覆盖封面、目录、章节、正文和结尾；正文页按内容组织 3–10 个要点。" },
      { label: "项目成果", text: "约 1.5 个月完成核心功能并上线，跑通“需求输入 → 内容生成 → 在线编辑 → 导出 → 付费转化”闭环。项目累计营收达千万级，注册充值率较优化前翻倍。线上版本目前仍在运行，技术方案保留了当年的实现水平，后续未持续迭代。" },
      { label: "复盘沉淀", text: "项目实践沉淀了 AI PPT 内容结构、页面类型、Prompt 规则与生成效果评估方面的经验。新版技术探索作为个人实验单独展示。" },
    ],
  },
  {
    id: "ai-design", title: "AI 设计图", short: "觅知网线上产品｜生成设计图与内容模板",
    category: "Work", status: "线上运行", role: "生成流程 / Prompt 约束 / 效果评估",
    result: "百万级营收 / 节约供稿成本约 80 万元 / 作品中心年降存储及带宽成本约 200 万元",
    url: "https://www.51miz.com/ai/image", tags: ["AI 设计图", "模板生产", "在线编辑"],
    sections: [
      { label: "项目概览", text: "觅知网 AI 设计图线上产品，面向有设计素材与内容模板需求的用户。" },
      { label: "背景与问题", text: "传统素材更新依赖人工生产，内容更新速度和热点需求之间存在差距。" },
      { label: "产品策略", text: "同时覆盖后台选题批量生产和前台用户按需生成，让 AI 生成服务内容供给与用户创作。" },
      { label: "核心设计", text: "围绕设计品类与用途设置生成要求，并根据输出效果迭代 Prompt。手抄报方向明确黑白线稿、A4 版式、留白和文本框等约束；生成结果可继续在线编辑。" },
      { label: "项目成果", text: "项目实现百万级营收。AI 素材生产节约供稿成本约 80 万元；统一作品中心每年降低存储及带宽成本约 200 万元。" },
      { label: "复盘沉淀", text: "积累了面向不同设计场景拆解生成约束、用实际输出验证效果，并持续调整生成策略的实践经验。" },
    ],
  },
  {
    id: "avora", title: "Avora / 声映", short: "把形象、歌曲与分镜组合成音乐视频",
    category: "Work", status: "工作项目", role: "移动端产品 / 生成流程 / 创作体验",
    result: "RTF 从 42 降至 8 / iOS 与 Android 产品交付", tags: ["AI 音视频", "移动端", "创作流程"],
    sections: [
      { label: "项目概览", text: "面向移动端的 AI 音乐视频应用，覆盖 iOS 与 Android。" },
      { label: "背景与问题", text: "音乐视频创作需要确定人物形象、歌曲和镜头内容，用户需要清楚的创作入口与生成步骤。" },
      { label: "产品策略", text: "以创作流程组织多个输入项，让用户通过形象、歌曲和分镜模板表达创作意图。" },
      { label: "核心设计", text: "围绕预设形象、歌曲选择与分镜模板设计生成流程，形成从选择创作素材到生成视频的路径。" },
      { label: "项目成果", text: "完成 iOS 与 Android 产品的研发交付，并协同算法优化视频生成工作流，将 RTF 从 42 降至 8。RTF 的具体单位与统计口径可在确认后补充说明。" },
      { label: "复盘沉淀", text: "在多模态生成产品中，创作选项和模板需要帮助用户表达意图，同时保持流程容易理解。" },
    ],
  },
  {
    id: "meeting-workflow", title: "会议 AI 内容工作流", short: "将会议内容转为 PPT、信息图与 H5 等交付物",
    category: "Work", status: "工作项目", role: "Skill 体系 / 生成规范 / Workflow 生产链路",
    result: "AI 生成 → 质量验收 → 前台素材供给",
    tags: ["AI 会议", "Agent Skill", "内容生产"],
    sections: [
      { label: "项目概览", text: "面向 AI 会议产品的内容产物工程化项目，负责将会议内容转成 PPT、信息图、H5 等交付物，并建设对应的 Skill 体系。" },
      { label: "背景与问题", text: "会议内容需要进一步加工成不同形式的可交付产物。项目需要统一生成规范与质量标准，并让生成能力能够接入素材生产流程。" },
      { label: "产品策略", text: "将内容产物能力拆解并沉淀为 Skill，制定生成规范、质量评估与验收标准，再把生成 Skill 集成到后台 Workflow。" },
      { label: "核心设计", text: "围绕模板批量生产设计后台流程，串联生成、审核、标签与发布，让内容从 AI 生成进入前台素材供给。" },
      { label: "项目成果", text: "形成从 AI 生成、质量验收到前台素材供给的完整链路，推动内容生成能力标准化、工程化。" },
      { label: "复盘沉淀", text: "生成 Skill 只有进入可复用的生产流程，并配套清晰的验收标准，才能稳定支持规模化内容供给。" },
    ],
  },
  {
    id: "ai-ppt-lab", title: "AI PPT / 自研版", short: "以新的技术方案重新探索 PPT 生成体验",
    category: "Lab", status: "计划中", role: "个人探索", result: "等待立项与开发",
    tags: ["AI PPT", "独立探索", "新技术方案"],
    sections: [
      { label: "探索动机", text: "线上工作项目保留了当年的技术水平，希望通过独立项目探索新的技术与生成体验。" },
      { label: "当前阶段", text: "计划中，尚未发布。与觅知网线上版本分开记录，后续补充真实实现、演示与体验地址。" },
    ],
  },
  {
    id: "heara", title: "Heara / 地球声音地图", short: "把世界各地的现场录音做成可探索的沉浸式地图",
    category: "Lab", status: "持续开发", role: "产品设计 / 地图交互 / 声音内容",
    result: "世界声音地图 / 现场录音 / 实时声音流",
    tags: ["声音地图", "沉浸式体验", "独立项目"], cover: "/assets/heara-earth-voice-logo.png",
    gallery: [
      { src: "/assets/heara/earth-topology-v2.png", alt: "Heara 地球地图视觉" },
      { src: "/assets/heara/alpine-valley-desktop.jpg", alt: "Heara 山谷声音场景" },
      { src: "/assets/heara/chiang-mai-midnight-frogs.avif", alt: "Heara 清迈夜间蛙鸣声音现场" },
      { src: "/assets/heara/live-forest.jpg", alt: "Heara 实时森林声音流" },
    ],
    sections: [
      { label: "项目概览", text: "Heara 是一个探索世界现场声音的沉浸式地图，把地点、环境录音和现场声音流组织成可漫游的声音体验。" },
      { label: "探索动机", text: "声音不只是背景，也可以成为认识地点和建立空间感的入口。项目尝试把分散的环境录音整理成有地理关系、有叙事和可持续探索的内容系统。" },
      { label: "核心设计", text: "以地球地图为入口，结合地点故事、推荐声音、实时声音流和筛选能力，让用户从空间移动到具体声音现场，再进入沉浸式播放与地点信息。" },
      { label: "当前实现", text: "已完成地图、地点卡片、声音搜索、推荐与实时流、沉浸式场景和多语言界面的持续迭代，并围绕窄屏布局、筛选交互和声音内容数量做体验校验。" },
      { label: "当前阶段", text: "个人持续开发中。后续将继续完善声音来源与授权说明、地点叙事、实时流稳定性以及地图和播放体验之间的衔接。" },
    ],
  },
  {
    id: "baoda", title: "暴打老板", short: "敲键盘，出出气。一个 Mac 像素解压桌宠。",
    category: "Lab", status: "可体验", role: "产品构思与实现",
    result: "键盘触发 / 连击与暴击 / 本地运行",
    tags: ["像素桌宠", "macOS", "情绪价值"], cover: "/assets/baoda-office.webp",
    url: "https://baoda-boss-website.vercel.app/",
    sections: [
      { label: "探索动机", text: "桌宠除了可爱和陪伴，还能提供什么价值？这次尝试把日常打字变成轻量的解压反馈。" },
      { label: "核心设想", text: "让像素老板住进桌面，每次敲击键盘都触发键帽撞击和角色受击，把重复输入转化为有趣的反馈。" },
      { label: "当前实现", text: "已提供产品网站与 macOS 下载入口。玩法包含键盘触发、连击与暴击，网站也提供可点击的互动演示。" },
      { label: "体验与边界", text: "产品网站说明：输入文字不读取、不保存、不上传，动画和偏好设置留在本机。跨应用键盘反馈需要按需开启辅助功能权限。" },
      { label: "当前阶段", text: "已有可体验版本。这里展示真实产品素材与玩法；效果反馈与后续迭代记录持续补充。" },
    ],
  },
];

function readLocation() {
  const [route, query] = window.location.hash.slice(1).split("?");
  const [slug, detailId] = route.split("/");
  const mode = modes.find((item) => item.toLowerCase() === slug) ?? "Work";
  const selectedId = detailId ?? new URLSearchParams(query).get("selected");
  const selected = projects.find((project) => project.id === selectedId && project.category === mode);
  const first = mode === "Lab" ? "baoda" : projects.find((project) => project.category === mode)?.id ?? "ai-ppt";
  return { mode, id: selected?.id ?? first, detail: Boolean(detailId && selected) };
}

export function HomePage() {
  const [view, setView] = useState(readLocation);
  const scrollRef = useRef<HTMLDivElement>(null);
  const listScroll = useRef(0);
  useEffect(() => {
    const sync = () => setView(readLocation());
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  const selected = projects.find((project) => project.id === view.id) ?? projects[0];
  const collection = projects.filter((project) => project.category === view.mode);
  const changeMode = (mode: Mode) => {
    listScroll.current = 0;
    window.location.hash = mode.toLowerCase();
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };
  const open = (projectId = selected.id) => {
    listScroll.current = scrollRef.current?.scrollTop ?? 0;
    window.location.hash = `${view.mode.toLowerCase()}/${projectId}`;
    scrollRef.current?.scrollTo(0, 0);
  };
  const back = () => {
    window.location.hash = `${view.mode.toLowerCase()}?selected=${selected.id}`;
    requestAnimationFrame(() => scrollRef.current?.scrollTo(0, listScroll.current));
  };

  return (
    <>
      <TargetCursor spinDuration={2} hideDefaultCursor={false} parallaxOn hoverDuration={0.2} />
      <main className="portfolio-shell">
        <aside className="nav-rail">
          <div className="brand-block">
            <button className="brand-mark cursor-target" onClick={() => changeMode("Work")}>Hsin</button>
            <span className="brand-year">AI PM / PORTFOLIO 2026</span>
          </div>
          <nav className="nav-links" aria-label="主导航">
            {modes.map((mode, index) => (
              <button key={mode} className={`nav-item cursor-target ${view.mode === mode ? "active" : ""}`}
                onClick={() => changeMode(mode)} aria-current={view.mode === mode ? "page" : undefined}>
                <span className="nav-icon">0{index + 1}</span><span>{labels[mode]}</span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="content-panel">
          <div className="panel-toolbar"><span>// {labels[view.mode]}</span><span>0{modes.indexOf(view.mode) + 1} / INDEX</span></div>
          <div className="work-index" ref={scrollRef}>
            {view.detail ? (
              <article className="case-detail">
                <button className="back-link cursor-target" onClick={back}>← 返回{labels[view.mode]}</button>
                <span className="eyebrow">CASE / {selected.status}</span>
                <h1 className={hasMixedCjkLatin(selected.title) ? "mixed-script-title" : undefined}>{renderTitleText(selected.title)}</h1><p className="case-lede">{selected.short}</p>
                {selected.category === "Work" ? (
                  <div className="case-at-a-glance">
                    <div><span>个人职责</span><p>{selected.role}</p></div>
                    <div><span>代表成果</span><p>{selected.result}</p></div>
                  </div>
                ) : null}
                {selected.cover ? <img className="case-image" src={selected.cover} alt={`${selected.title}项目画面`} /> : null}
                {selected.gallery?.length ? <div className="case-gallery">
                  {selected.gallery.map((image) => <img key={image.src} src={image.src} alt={image.alt} />)}
                </div> : null}
                {selected.sections.map((section, index) => (
                  <section className="case-section" key={section.label}>
                    <span>0{index + 1} / {section.label}</span><p>{section.text}</p>
                  </section>
                ))}
                {selected.url ? <a className="action-link cursor-target" href={selected.url} target="_blank" rel="noreferrer">打开产品网站 ↗</a> : null}
              </article>
            ) : collection.length ? (
              <>
                {view.mode === "Work" ? <section className="portfolio-intro">
                  <span className="eyebrow">AI PRODUCT MANAGER / 6 YEARS</span>
                  <p>6 年产品经验，3 年+ AI 产品经验。聚焦 AI 内容生成与 Agent 应用，做过 AI PPT、AI 设计图、AI 音视频与会议工作流，擅长把模型能力落到生成流程、在线编辑与规模化交付。</p>
                </section> : null}
                <div className="project-list">
                  {collection.map((project, index) => (
                    <article className={`project-card ${selected.id === project.id ? "active" : ""}`} key={project.id}>
                      <button className="project-row cursor-target" onClick={() => setView((current) => ({ ...current, id: project.id }))}
                        aria-pressed={selected.id === project.id}>
                        <span className="project-number">0{index + 1}</span>
                        <span className="project-title-group">
                          {selected.id === project.id ? <Headline text={project.title} className={`project-title project-selected-title${hasMixedCjkLatin(project.title) ? " project-selected-title--mixed" : ""}`} /> : <span className={`project-title${hasMixedCjkLatin(project.title) ? " mixed-script-title" : ""}`}>{renderTitleText(project.title)}</span>}
                          <span className="project-short">{project.short}</span>
                        </span>
                        <span className="project-state">{project.status}</span>
                      </button>
                      {selected.id === project.id ? <div className="project-facts">
                          <p><span>个人职责</span>{project.role}</p><p><span>代表成果</span>{project.result}</p>
                          <div className="project-actions">
                            <button className="text-action cursor-target" onClick={() => open(project.id)}>查看完整案例 ↗</button>
                            {project.url ? <a className="text-action cursor-target" href={project.url} target="_blank" rel="noreferrer">访问线上产品 ↗</a> : null}
                          </div>
                      </div> : null}
                    </article>
                  ))}
                </div>
              </>
            ) : view.mode === "Notes" ? (
              <div className="mode-panel notes-directory-panel"><span className="eyebrow">NOTES & THINKING</span>
                <div className="notes-directory-heading">
                  <span className="eyebrow">01 / 课映</span>
                  <h1>AI PPT 系统原理地图</h1>
                  <p>左侧是阅读目录，右侧查看原理内容。点击目录项可跳转到对应章节。</p>
                </div>
                <nav className="notes-directory" aria-label="课映系统原理目录">
                  {coursewareDirectory.map(([id, label], index) => <a key={id} href={`/knowledge/courseware-system-map.html#${id}`} target="courseware-map" className="cursor-target">
                    <span>{String(index + 1).padStart(2, "0")}</span><strong>{label}</strong><em>↗</em>
                  </a>)}
                </nav>
              </div>
            ) : <Contact />}
          </div>
          <div className="status-bar"><span>ZHANG XINYU / {view.mode.toUpperCase()}</span><span>{view.detail ? "案例档案" : labels[view.mode]}</span></div>
        </section>

        {view.mode === "Notes" ? <section className="preview-panel notes-preview-panel">
          <div className="panel-toolbar"><span>// 课映系统原理</span><span>NOTES / 03</span></div>
          <div className="preview-canvas notes-preview-canvas">
            <iframe
              className="knowledge-map-frame"
              name="courseware-map"
              src="/knowledge/courseware-system-map.html"
              title="课映 AI PPT 系统原理地图"
            />
          </div>
        </section> : view.mode === "Work" || view.mode === "Lab" ? <section className="preview-panel">
          <div className="panel-toolbar"><span>// 项目预览</span><span>PORTFOLIO / 2026</span></div>
          <div className="preview-canvas editorial-canvas" key={`${view.mode}-${selected.id}`}>
            {selected.url ? <iframe
              className="product-preview-frame"
              src={selected.url}
              title={`${selected.title}产品页面预览`}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            /> : selected.gallery?.length ? <div className="project-preview-gallery">
              {selected.cover ? <img src={selected.cover} alt={`${selected.title}项目标志`} /> : null}
              {selected.gallery.map((image) => <img key={image.src} src={image.src} alt={image.alt} />)}
            </div> : selected.cover ? <img className="product-preview-image" src={selected.cover} alt={`${selected.title}产品画面`} /> : null}
          </div>
        </section> : null}

      </main>
    </>
  );
}

function Headline({ text, className }: { text: string; className?: string }) {
  return <Shuffle text={text} className={className} tag="h1" textAlign="left" duration={0.35} shuffleTimes={1} triggerOnce respectReducedMotion loop={false} />;
}

function Contact() {
  const [notice, setNotice] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const copy = async (value: string) => {
    let success = false;
    try { await navigator.clipboard.writeText(value); success = true; }
    catch {
      const field = document.createElement("textarea");
      field.value = value;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      success = document.execCommand("copy");
      field.remove();
    }
    setNotice(success ? "复制成功" : "复制失败，请重试");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(""), 2000);
  };
  return (
    <div className="mode-panel"><span className="eyebrow">CONTACT / 04</span><Headline text="Let’s talk products." />
      <p>可以聊 AI 产品、创意实验与工作流实践，也欢迎作品集反馈。</p>
      <div className="contact-directory">
        <div className="contact-row"><button className="contact-copy cursor-target" onClick={() => copy("zxi8861@gmail.com")}><span>EMAIL</span><strong>zxi8861@gmail.com</strong><span>复制 →</span></button><a href="mailto:zxi8861@gmail.com" aria-label="写邮件">写邮件 ↗</a></div>
        <div className="contact-row"><button className="contact-copy cursor-target" onClick={() => copy("zxi8861-elliot")}><span>GITHUB</span><strong>zxi8861-elliot</strong><span>复制 →</span></button><a href="https://github.com/zxi8861-elliot" target="_blank" rel="noreferrer" aria-label="打开 GitHub">打开 ↗</a></div>
        <div className="contact-row"><button className="contact-copy cursor-target" onClick={() => copy("132-***-*****")}><span>手机号</span><strong>132-***-*****</strong><span>复制 →</span></button></div>
        <div className="contact-row"><button className="contact-copy cursor-target" onClick={() => copy("********")}><span>微信号</span><strong>********</strong><span>复制 →</span></button></div>
      </div>
      {notice ? <div className="system-toast" role="status" aria-live="polite"><span aria-hidden="true">✓</span>{notice}</div> : null}
    </div>
  );
}
