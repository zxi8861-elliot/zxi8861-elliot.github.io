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
    short: "AI 演示文稿工作流",
    category: "AI 产品 / 设计工具",
    status: "已上线",
    scope: "产品策略、提示词流程、编辑器体验、视觉质检",
    about:
      "一个智能演示文稿工作台，把模糊想法、参考资料和结构化大纲转化为可编辑的视觉页面。",
    challenge:
      "多数 AI 做稿工具停在文本生成层。这个产品需要同时处理叙事、版式密度、视觉层级和交付质量。",
    solution:
      "用档案式生成流程，把大纲、页面系统、审阅意见和导出状态放在同一个可检查界面里。",
    stack: ["LLM", "React", "页面系统", "视觉质检"],
  },
  {
    id: "ID_002",
    title: "AI Paper",
    short: "论文阅读助手",
    category: "AI 产品 / 知识工具",
    status: "原型",
    scope: "阅读链路、引用图谱、摘要卡片",
    about:
      "一个研究阅读伙伴，把复杂论文拆成可追踪的问题、观点、实验方法和后续阅读路径。",
    challenge:
      "摘要很容易生成，但不容易信任。界面必须让证据、疑点和原文位置都能被检查。",
    solution:
      "采用分屏阅读表面，结合观点标签、引用锚点和论文方法之间的图谱线索。",
    stack: ["RAG", "PDF", "图谱界面", "笔记"],
  },
  {
    id: "ID_003",
    title: "AI Design",
    short: "生成式界面系统",
    category: "AI 产品 / 创意工具",
    status: "测试版",
    scope: "布局协议、提示词评审、复用组件",
    about:
      "一个生成式设计引擎，从结构化设计 brief 中产出锋利、明确、有意图的产品界面。",
    challenge:
      "AI 视觉常常看起来合理，却缺少判断。系统需要约束、审美和可复用的界面推理过程。",
    solution:
      "在渲染高保真页面前，先评估层级、间距、密度和组件语义，形成可控的设计约束。",
    stack: ["设计 AI", "Tokens", "React", "Figma"],
  },
  {
    id: "ID_004",
    title: "AI Music",
    short: "地理声音地图",
    category: "AI 产品 / 音频地图",
    status: "概念",
    scope: "自然环境音、地图浏览、生成式混音",
    about:
      "一个声音探索产品，把地理环境转化为可聆听的氛围旅程和生成式声音明信片。",
    challenge:
      "体验需要同时有空间感和情绪，但不能退化成普通歌单或静态地图。",
    solution:
      "用分层地图浏览器呈现地形、气候、记忆和声音纹理，让它们成为可检查的创作材料。",
    stack: ["音频", "地图", "AI 混音", "移动端"],
  },
  {
    id: "ID_005",
    title: "Online Editor",
    short: "结构化内容工作台",
    category: "效率工具 / 创作工具",
    status: "已上线",
    scope: "编辑器体验、内容块、发布流程",
    about:
      "一个专注的长内容编辑器，用 AI 辅助、结构化内容块和清晰发布状态帮助创作者完成作品。",
    challenge:
      "AI 写作工具容易抹平作者声音。编辑器需要支持审美、修改和掌控感。",
    solution:
      "用块状工作区把想法捕捉、生成、编辑和最终润色拆成清晰可见的工作模式。",
    stack: ["编辑器", "CMS", "AI 辅助", "工作流"],
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
              activeProject={activeProject}
              activeProjectIndex={activeProjectIndex}
              onSelectProject={setActiveProjectIndex}
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
        <InspectorPanel mode={mode} project={activeProject} index={activeProjectIndex} />
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

      <div className="terminal-note">
        <span>// 初始化序列</span>
        <span>// 模块: AI 产品系统</span>
        <span>// 任务: 把想法转成界面</span>
      </div>
    </aside>
  );
}

function WorkIndex({
  activeProject,
  activeProjectIndex,
  onSelectProject,
}: {
  activeProject: Project;
  activeProjectIndex: number;
  onSelectProject: (index: number) => void;
}) {
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
          <button
            className={`project-row cursor-target ${activeProjectIndex === index ? "active" : ""}`}
            key={project.id}
            onClick={() => onSelectProject(index)}
          >
            <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="project-title-group">
              <span className="project-title">{project.title}</span>
              <span className="project-short">{project.short}</span>
            </span>
            <span className="project-state">{activeProjectIndex === index ? "选中" : "待机"}</span>
          </button>
        ))}
      </div>

      <article className="detail-dossier">
        <DossierBlock label="项目说明" value={activeProject.about} />
        <DossierBlock label="关键挑战" value={activeProject.challenge} />
        <DossierBlock label="解决方式" value={activeProject.solution} />
        <DossierBlock label="项目范围" value={activeProject.scope} />
      </article>
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

function InspectorPanel({ mode, project, index }: { mode: Mode; project: Project; index: number }) {
  return (
    <aside className="inspector-panel">
      <div className="inspector-top">
        <a className="hey-button cursor-target" href="mailto:zxi8861@gmail.com">
          <span>联系我</span>
          <span>{"->"}</span>
        </a>
      </div>

      <div className="contact-links">
        {[
          { label: "姓名", value: "新宇" },
          { label: "邮箱", value: "zxi8861@gmail.com", href: "mailto:zxi8861@gmail.com" },
          { label: "微信", value: "whitebirds8" },
          { label: "手机号", value: "15046310957", href: "tel:15046310957" },
          { label: "GitHub", value: "zxi8861@gmail.com" },
        ].map((contact) => (
          <a className="cursor-target" href={contact.href ?? "#"} key={contact.label}>
            <span>{contact.label}</span>
            <strong>{contact.value}</strong>
            <span>↗</span>
          </a>
        ))}
      </div>

      <div className="metadata-stack">
        <DossierBlock label="项目编号" value={mode === "Work" ? project.id : `模式_${modeLabels[mode]}`} />
        <DossierBlock label="类别" value={mode === "Work" ? project.category : "个人作品系统"} />
        <DossierBlock label="状态" value={mode === "Work" ? project.status : "就绪"} />
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
