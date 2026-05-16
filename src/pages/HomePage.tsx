import { useMemo, useState } from "react";
import Shuffle from "../components/Shuffle";
import TargetCursor from "../components/Target_cursor";

type Project = {
  id: string;
  title: string;
  short: string;
  category: string;
  status: string;
  scope: string;
  about: string;
  challenge: string;
  solution: string;
  stack: string[];
};

const projects: Project[] = [
  {
    id: "ID_001",
    title: "AIPPT",
    short: "AI 演示文稿生成产品",
    category: "AI 产品 / PPT 生成",
    status: "已上线",
    scope: "0-1 产品规划、Prompt 工作流、Web 端编辑器、生成效果评估",
    about:
      "主导 AI PPT 生成产品从 0 到 1 落地，把主题输入、资料解析、大纲生成和页面编辑串成完整工作流。",
    challenge:
      "PPT 生成不仅要有内容，还要兼顾结构、版式、视觉一致性和可编辑交付，不能停在文本草稿层。",
    solution:
      "拆解生成链路，建立 Prompt 模板、页面结构协议和质检规则，让产研设计能快速迭代上线。",
    stack: ["LLM", "Prompt", "Web 编辑器", "视觉评估"],
  },
  {
    id: "ID_002",
    title: "AI Paper",
    short: "论文阅读与知识助手",
    category: "AI 产品 / 知识工具",
    status: "已上线",
    scope: "RAG 检索、长文解析、摘要卡片、阅读链路设计",
    about:
      "面向论文和长文资料的 AI 阅读工具，把复杂材料拆成问题、观点、方法和可追踪的摘要卡片。",
    challenge:
      "AI 总结容易流畅但不一定可信，需要让用户看到依据、原文位置和后续追问路径。",
    solution:
      "基于 RAG 和分层摘要流程设计阅读闭环，把要点提取、引用定位和笔记沉淀放在同一界面。",
    stack: ["RAG", "Agent", "PDF", "知识卡片"],
  },
  {
    id: "ID_003",
    title: "AI Design",
    short: "AI 设计图生成产品",
    category: "AI 产品 / 设计生成",
    status: "已上线",
    scope: "设计生成链路、Prompt 工程、效果评估、组件规范",
    about:
      "主导 AI 设计图生成产品，把业务需求、风格约束和素材输入转成可评审的视觉方案。",
    challenge:
      "设计生成结果需要稳定、可控、可解释，同时服务产研协作，而不是只产出一张漂亮图片。",
    solution:
      "建立风格参数、生成评估标准和组件化复用机制，用产品规则约束模型输出质量。",
    stack: ["设计 AI", "Prompt", "组件库", "评估规范"],
  },
  {
    id: "ID_004",
    title: "AI Music",
    short: "地理声音地图",
    category: "AI 产品 / 音频地图",
    status: "开发中",
    scope: "自然环境音、地图浏览、生成式声音卡片、移动端体验",
    about:
      "一个地理自然环境音产品，把地点、气候和自然场景转化为可聆听、可收藏的声音体验。",
    challenge:
      "产品需要同时具备地图的空间感和音频的情绪价值，避免变成普通歌单或静态资料库。",
    solution:
      "以地图探索为主线组织声音素材，结合 AI 生成描述、氛围标签和可分享的声音卡片。",
    stack: ["音频", "地图", "AI 生成", "移动端"],
  },
  {
    id: "ID_005",
    title: "Online Editor",
    short: "内容创作工具编辑器",
    category: "效率工具 / 创作工具",
    status: "已上线",
    scope: "Web 编辑器、内容块、素材标签化、审核与发布流程",
    about:
      "面向内容生产团队的在线编辑器，承接 AI 生成、人工编辑、素材管理和发布审核。",
    challenge:
      "内容生产链路分散在素材、审核、编辑和发布之间，效率瓶颈会直接影响运营节奏。",
    solution:
      "用结构化编辑区和流程状态串联素材标签、AI 辅助、审核自动化与发布交付。",
    stack: ["编辑器", "CMS", "AI 辅助", "Workflow"],
  },
];

const modes = ["Work", "About", "Playground", "Contact"] as const;
type Mode = (typeof modes)[number];

const modeLabels: Record<Mode, string> = {
  Work: "作品",
  About: "关于",
  Playground: "实验",
  Contact: "联系",
};

export function HomePage() {
  const [mode, setMode] = useState<Mode>("Work");
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [expandedProjectIndex, setExpandedProjectIndex] = useState<number | null>(null);
  const activeProject = projects[activeProjectIndex];

  const statusLine = useMemo(() => {
    if (mode === "Work") {
      return `项目 ${String(activeProjectIndex + 1).padStart(3, "0")} / ${String(projects.length).padStart(3, "0")} - 正在查看`;
    }

    return `模式 ${modeLabels[mode]} - 系统就绪`;
  }, [activeProjectIndex, mode]);

  return (
    <>
      <TargetCursor spinDuration={2} hideDefaultCursor parallaxOn hoverDuration={0.2} />

      <main className="portfolio-shell">
        <NavRail mode={mode} onModeChange={setMode} />

        <section className="content-panel">
          <div className="panel-toolbar">
            <span>// 标识符</span>
            <span>{mode === "Work" ? "001_WORK" : `00${modes.indexOf(mode) + 1}_${mode.toUpperCase()}`}</span>
          </div>

          {mode === "Work" ? (
            <WorkIndex
              activeProjectIndex={activeProjectIndex}
              onSelectProject={setActiveProjectIndex}
              expandedProjectIndex={expandedProjectIndex}
              onToggleProject={setExpandedProjectIndex}
            />
          ) : (
            <ModePanel mode={mode} />
          )}

          <div className="status-bar">
            <span>C:\HSINYAEL\{mode.toUpperCase()}</span>
            <span>{statusLine}</span>
          </div>
        </section>

        <PreviewPanel mode={mode} project={activeProject} index={activeProjectIndex} />
        <InspectorPanel project={activeProject} index={activeProjectIndex} />
      </main>
    </>
  );
}

function NavRail({
  mode,
  onModeChange,
}: {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}) {
  return (
    <aside className="nav-rail">
      <div className="brand-block">
        <button className="brand-mark cursor-target" onClick={() => onModeChange("Work")} aria-label="返回作品">
          HY
        </button>
        <span className="brand-year">AI PM / 2026</span>
      </div>

      <nav className="nav-links" aria-label="主导航">
        {modes.map((item) => (
          <button
            className={`nav-item cursor-target ${mode === item ? "active" : ""}`}
            key={item}
            onClick={() => onModeChange(item)}
          >
            <span className="nav-icon">{item === "Work" ? "01" : item === "About" ? "02" : item === "Playground" ? "03" : "04"}</span>
            <span>{modeLabels[item]}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

function WorkIndex({
  activeProjectIndex,
  onSelectProject,
  expandedProjectIndex,
  onToggleProject,
}: {
  activeProjectIndex: number;
  onSelectProject: (index: number) => void;
  expandedProjectIndex: number | null;
  onToggleProject: (index: number | null) => void;
}) {
  const handleProjectClick = (index: number) => {
    onSelectProject(index);
    onToggleProject(expandedProjectIndex === index ? null : index);
  };

  return (
    <div className="work-index">
      <div className="intro-block">
        <span className="eyebrow">AI 产品经理</span>
        <Shuffle
          text="AI PM creating intelligent and visual experiences."
          tag="h1"
          textAlign="left"
          shuffleDirection="right"
          duration={0.35}
          animationMode="evenodd"
          shuffleTimes={1}
          ease="power3.out"
          stagger={0.03}
          threshold={0.1}
          triggerOnce={true}
          triggerOnHover
          respectReducedMotion={true}
          loop={false}
          loopDelay={0}
        />
        <p>
          关注 AI 产品、体验设计、内容工具和创意系统，擅长把松散想法压缩成可以被使用、被讨论、被迭代的界面。
        </p>
      </div>

      <div className="section-label">
        <span>精选项目</span>
        <span>{projects.length} 个已收录</span>
      </div>

      <div className="project-list">
        {projects.map((project, index) => (
          <div className={`project-item ${expandedProjectIndex === index ? "expanded" : ""}`} key={project.id}>
            <button
              className={`project-row cursor-target ${activeProjectIndex === index ? "active" : ""}`}
              onClick={() => handleProjectClick(index)}
              aria-expanded={expandedProjectIndex === index}
            >
              <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="project-title-group">
                <span className="project-title">{project.title}</span>
                <span className="project-short">{project.short}</span>
              </span>
              <span className="project-state">{expandedProjectIndex === index ? "折叠" : "展开"}</span>
            </button>

            {expandedProjectIndex === index ? (
              <article className="detail-dossier">
                <DossierBlock label="项目说明" value={project.about} />
                <DossierBlock label="关键挑战" value={project.challenge} />
                <DossierBlock label="解决方式" value={project.solution} />
                <DossierBlock label="项目范围" value={project.scope} />
              </article>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function ModePanel({ mode }: { mode: Mode }) {
  if (mode === "About") {
    return (
      <div className="mode-panel">
        <span className="eyebrow">身份档案</span>
        <Shuffle
          text="System architect for AI-native product experiences."
          tag="h1"
          textAlign="left"
          shuffleDirection="right"
          duration={0.35}
          animationMode="evenodd"
          shuffleTimes={1}
          ease="power3.out"
          stagger={0.03}
          threshold={0.1}
          triggerOnce={true}
          triggerOnHover
          respectReducedMotion={true}
          loop={false}
          loopDelay={0}
        />
        <p>
          Hsin Yael 横跨产品策略、交互设计和创意 AI 系统。工作方式很直接：把模糊意图压缩成可用的产品结构，再让结构在界面里变得清楚。
        </p>
        <div className="mode-grid">
          <DossierBlock label="当前关注" value="AI 产品、内容工具、设计系统和创作者工作流。" />
          <DossierBlock label="工作方法" value="尽早原型化，检查真实行为，压缩复杂度，让界面保持诚实。" />
          <DossierBlock label="擅长动作" value="把暧昧的创作流程转化为结构清晰、有编辑感的可视系统。" />
        </div>
      </div>
    );
  }

  if (mode === "Playground") {
    return (
      <div className="mode-panel">
        <span className="eyebrow">实验目录</span>
        <Shuffle
          text="Small tools, strange interfaces, and AI experiments in motion."
          tag="h1"
          textAlign="left"
          shuffleDirection="right"
          duration={0.35}
          animationMode="evenodd"
          shuffleTimes={1}
          ease="power3.out"
          stagger={0.03}
          threshold={0.1}
          triggerOnce={true}
          triggerOnHover
          respectReducedMotion={true}
          loop={false}
          loopDelay={0}
        />
        <div className="experiment-list">
          {["Generative Topographies", "Neural Semantic Trees", "Scan Texture Synth", "Prompt Critic", "Ambient Map Sketch"].map((item, index) => (
            <div className="experiment-row" key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
              <em>{index === 0 ? "运行中" : "归档"}</em>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mode-panel">
      <span className="eyebrow">联系协议</span>
      <Shuffle
        text="Say hey, send context, or open a new collaboration thread."
        tag="h1"
        textAlign="left"
        shuffleDirection="right"
        duration={0.35}
        animationMode="evenodd"
        shuffleTimes={1}
        ease="power3.out"
        stagger={0.03}
        threshold={0.1}
        triggerOnce={true}
        triggerOnHover
        respectReducedMotion={true}
        loop={false}
        loopDelay={0}
      />
      <p>
        邮件是最好的入口。可以聊产品想法、AI 工作流实验、作品集反馈，或一段边界清楚的协作。
      </p>
      <a className="large-mail-link cursor-target" href="mailto:zxi8861@gmail.com">
        zxi8861@gmail.com
      </a>
    </div>
  );
}

function PreviewPanel({ mode, project, index }: { mode: Mode; project: Project; index: number }) {
  return (
    <section className={`preview-panel preview-${mode.toLowerCase()}`}>
      <div className="panel-toolbar">
        <span>// 可视化预览</span>
        <span>X:0106PX Y:0116PX</span>
      </div>

      <div className="preview-canvas">
        <div className="canvas-tag">画布渲染 / {modeLabels[mode]}</div>
        <div className="active-coordinate">NODE_{String(index + 1).padStart(2, "0")}</div>

        {mode === "Work" ? <ProjectVisual project={project} index={index} /> : <ModeVisual mode={mode} />}

        <div className="crosshair horizontal" />
        <div className="crosshair vertical" />
      </div>
    </section>
  );
}

function ProjectVisual({ project, index }: { project: Project; index: number }) {
  return (
    <div className="project-visual" aria-label={`${project.title} abstract project preview`}>
      <div className="visual-main">
        <div className="slide-stack">
          <div className="slide-card large">
            <span>{project.title}</span>
            <i />
            <b />
          </div>
          <div className="slide-card small top" />
          <div className="slide-card small bottom" />
        </div>
        <div className="wire-grid">
          {Array.from({ length: 16 }).map((_, cellIndex) => (
            <span className={cellIndex % (index + 2) === 0 ? "on" : ""} key={cellIndex} />
          ))}
        </div>
      </div>

      <div className="visual-strip">
        <div className="mini-chart">
          {project.stack.map((_, stackIndex) => (
            <span style={{ height: `${28 + stackIndex * 14}%` }} key={stackIndex} />
          ))}
        </div>
        <div className="poster-block">
          <span>自动生成协议</span>
          <strong>{project.category.split("/")[0]}</strong>
          <small>{project.id} / {project.status}</small>
        </div>
      </div>
    </div>
  );
}

function ModeVisual({ mode }: { mode: Mode }) {
  return (
    <div className="mode-visual">
      <div className="id-card">
        <span>{mode === "About" ? "身份卡片" : mode === "Playground" ? "实验视窗" : "联系面板"}</span>
        <strong>{mode === "About" ? "HSIN YAEL" : mode === "Playground" ? "GEN-TOPO ALPHA" : "OPEN_CHANNEL"}</strong>
        <div />
      </div>
      <div className="orbital-map">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function InspectorPanel({ project, index }: { project: Project; index: number }) {
  const [copyNotice, setCopyNotice] = useState<string | null>(null);

  const contacts = [
    { label: "姓名", value: "新宇" },
    { label: "邮箱", value: "zxi8861@gmail.com" },
    { label: "微信", value: "whitebirds8" },
    { label: "手机号", value: "15046310957" },
    { label: "GitHub", value: "zxi8861@gmail.com" },
    { label: "Base", value: "上海" },
  ];

  const copyContact = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopyNotice(`${label} 已复制`);
    window.setTimeout(() => setCopyNotice(null), 1600);
  };

  return (
    <aside className="inspector-panel">
      <div className="inspector-top">
        <div className="hey-button" aria-label="联系我">
          <span>联系我</span>
          <span>{"->"}</span>
        </div>
      </div>

      <div className="contact-links">
        {contacts.map((contact) => (
          <button className="cursor-target" key={contact.label} onClick={() => copyContact(contact.label, contact.value)}>
            <span>{contact.label}</span>
            <strong>{contact.value}</strong>
            <span>复制</span>
          </button>
        ))}
        {copyNotice ? <div className="copy-toast" role="status">{copyNotice}</div> : null}
      </div>

      <div className="metadata-stack">
        <DossierBlock label="状态" value={project.status} />
        <DossierBlock label="链接" value="网站 / GitHub / 演示" />
      </div>

      <div className="thumbnail-box">
        <span>缩略图_{String(index + 1).padStart(2, "0")}</span>
        <div className="thumbnail-grid">
          {Array.from({ length: 9 }).map((_, cellIndex) => (
            <i className={cellIndex === index || cellIndex % 4 === 0 ? "active" : ""} key={cellIndex} />
          ))}
        </div>
      </div>

      <div className="tech-stack">
        <span>技术栈</span>
        <div>
          {project.stack.map((item) => (
            <b key={item}>{item}</b>
          ))}
        </div>
      </div>

      <footer className="rights">
        <span>保留所有权利。</span>
        <span>由 HSIN YAEL 创建。</span>
      </footer>
    </aside>
  );
}

function DossierBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="dossier-block">
      <span>{label}</span>
      <p>{value}</p>
    </div>
  );
}
