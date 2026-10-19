import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import TargetCursor from "../components/Target_cursor";
import LuckySnake from "../components/LuckySnake";
import { KnowledgeDirectory, KnowledgeReader } from "../components/KnowledgeLibrary";
import { Contact, projects, type Project } from "./HomePage";

type Mode = "Projects" | "Notes" | "Contact";
const modes: Mode[] = ["Projects", "Notes", "Contact"];
const labels: Record<Mode, string> = { Projects: "项目实践", Notes: "知识沉淀", Contact: "联系我" };
const timelineOrder = ["muldo", "ai-ppt-lab", "ai-ppt", "ai-design", "meeting-workflow", "ai-speed", "avora", "heara", "baoda", "lingua-float"];
const timelineProjects = timelineOrder.map((id) => projects.find((project) => project.id === id)).filter((project): project is Project => Boolean(project));
const timelineRows = Math.ceil(timelineProjects.length / 4);
const portraitGalleryIds = new Set(["ai-speed", "avora", "meeting-workflow"]);

function maxNotesDirectoryWidth() {
  const rail = window.innerWidth <= 1180 ? 90 : 110;
  const available = window.innerWidth - rail - 12;
  return Math.max(260, Math.min(Math.round(available * 0.45), available - 320));
}

function initialNotesDirectoryWidth() {
  const rail = window.innerWidth <= 1180 ? 90 : 110;
  const available = window.innerWidth - rail - 12;
  const saved = Number(localStorage.getItem("notes-directory-width"));
  return Math.min(saved || Math.round(available * 0.35), maxNotesDirectoryWidth());
}

function readLocation() {
  const [route, query] = window.location.hash.slice(1).split("?");
  const [slug, routeProjectId] = route.split("/");
  const mode: Mode = slug === "notes" ? "Notes" : slug === "contact" ? "Contact" : "Projects";
  const selectedId = routeProjectId ?? new URLSearchParams(query).get("selected");
  const selected = timelineProjects.find((project) => project.id === selectedId);
  const requestedKnowledgeId = new URLSearchParams(query).get("item") ?? "agent-edit-message";
  const knowledgeId = requestedKnowledgeId === "uiux-location-audio" || requestedKnowledgeId === "uiux" || requestedKnowledgeId === "motion" ? "uiux-libraries" : requestedKnowledgeId;
  return { mode, id: selected?.id ?? null, knowledgeId };
}

function titleText(project: Project) {
  return project.title.split(/(\s+\/\s+|\s+·\s+)/).map((part, index) => (
    <span key={`${part}-${index}`}>{part}</span>
  ));
}

function projectImage(project: Project) {
  return project.gallery?.[0]?.src ?? project.cover;
}

function ProjectArtwork({ project, detail = false }: { project: Project; detail?: boolean }) {
  if (!detail && portraitGalleryIds.has(project.id) && project.gallery?.length) {
    return (
      <div className={`project-artwork-screenshots project-artwork-screenshots--${project.id}`} aria-label={`${project.title}应用截图预览`}>
        {project.gallery.slice(0, 3).map((image) => <img key={image.src} src={image.src} alt="" />)}
      </div>
    );
  }
  const image = projectImage(project);
  if (image) return <img className="project-art-image" src={image} alt={`${project.title}项目展示`} />;
  return (
    <div className={`project-artwork project-artwork--${project.id}${detail ? " is-detail" : ""}`} aria-label={`${project.title}项目视觉封面`}>
      <span className="project-artwork-kicker">{project.source === "company" ? "COMPANY PROJECT" : "PERSONAL PROJECT"}</span>
      <strong>{project.id === "avora" ? "ARORA" : project.id === "meeting-workflow" ? "MEETING → MAKING" : project.id === "muldo" ? "MULDO" : project.id === "lingua-float" ? "LINGUA / FLOAT" : "PPT / REIMAGINED"}</strong>
      <span className="project-artwork-caption">{project.id === "avora" ? "IMAGE · MUSIC · STORY" : project.id === "meeting-workflow" ? "AGENT SKILLS · CONTENT WORKFLOW" : project.id === "muldo" ? "PEOPLE · AGENTS · PROJECTS" : project.id === "lingua-float" ? "LOCAL AUDIO · LIVE CAPTIONS · TRANSLATION" : "A NEW GENERATION EXPERIENCE"}</span>
      <i aria-hidden="true" />
    </div>
  );
}

function ProjectTimeline({ onOpen }: { onOpen: (id: string) => void }) {
  const trackPath = timelineRows === 2
    ? "M 125 160 H 875 C 900 160 910 175 910 200 V 400 C 910 425 900 440 875 440 H 125"
    : "M 125 150 H 875 C 900 150 910 165 910 190 V 410 C 910 435 900 450 875 450 H 125 C 100 450 90 465 90 490 V 710 C 90 735 100 750 125 750";
  return (
    <section className="project-overview-panel">
      <div className="panel-toolbar"><span>// 项目实践</span><span>{String(timelineProjects.length).padStart(2, "0")} PROJECTS / CURATED ORDER</span></div>
      <div className={`project-overview-scroll${timelineRows > 2 ? " has-extra-row" : ""}`}>
        <div className={`project-timeline-board${timelineRows > 2 ? " has-extra-row" : ""}`}>
          <svg className="project-timeline-track" viewBox={`0 0 1000 ${timelineRows * 300}`} preserveAspectRatio="none" aria-hidden="true">
            <path d={trackPath} />
          </svg>
          <div className={`project-timeline-grid${timelineRows > 2 ? " has-extra-row" : ""}`} style={{ "--timeline-rows": timelineRows } as CSSProperties}>
            {timelineProjects.map((project, index) => {
              const row = Math.floor(index / 4);
              const positionInRow = index % 4;
              const visualColumn = row % 2 === 0 ? positionInRow + 1 : 4 - positionInRow;
              return (
                <button
                  className={`project-timeline-card cursor-target row-${row + 1} col-${visualColumn}`}
                  key={project.id}
                  style={{ gridColumn: visualColumn, gridRow: row + 1 }}
                  onClick={() => onOpen(project.id)}
                  aria-label={`打开${project.title}项目详情`}
                >
                  <span className="project-timeline-card-art">
                    <ProjectArtwork project={project} />
                    <span className="project-source-badge">{project.source === "company" ? "公司项目" : "个人项目"}</span>
                  </span>
                  <span className="project-timeline-card-copy">
                    <span className="project-timeline-card-heading"><strong>{titleText(project)}</strong><time>{project.period}</time></span>
                    <span className="project-timeline-tags">{project.tags.slice(0, 2).map((tag) => <em key={tag}>{tag}</em>)}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="status-bar"><span>ZHANG XINYU / PROJECTS</span><span>SELECTED WORK · CURATED ORDER</span></div>
    </section>
  );
}

function ProjectCase({ project, onBack }: { project: Project; onBack: () => void }) {
  return (
    <section className="project-case-page">
      <div className="panel-toolbar project-case-toolbar">
        <div className="project-case-crumb">
          <button className="project-case-back cursor-target" onClick={onBack}>← 全部项目</button>
          <span>/</span>
          <strong>{project.title}</strong>
        </div>
        <div className="project-case-meta">
          <span>{project.period} / {project.source === "company" ? "公司项目" : "个人项目"}</span>
          <span>/</span>
          <span>ZHANG XINYU / PROJECTS</span>
        </div>
      </div>
      <div className="project-case-columns">
        <article className="project-case-story">
          <div className="project-case-story-scroll">
            <h1>{titleText(project)}</h1>
            <p className="project-case-lede">{project.short}</p>
            <div className="project-case-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="project-case-facts">
              <div><span>本人职责</span><p>{project.role}</p></div>
              <div><span>代表结果</span><p>{project.result}</p></div>
            </div>
            {project.sections.map((section, index) => (
              <section className="project-case-section" key={section.label}>
                <span>{String(index + 1).padStart(2, "0")} / {section.label}</span>
                {section.text && <p>{section.text}</p>}
                {section.cards && <div className="project-case-cards">
                  {section.cards.map((card) => <div className="project-case-card" key={card.title}>
                    <strong>{card.title}</strong><p>{card.text}</p>
                  </div>)}
                </div>}
              </section>
            ))}
          </div>
        </article>
        <aside className="project-case-visuals">
          <div className={`project-case-gallery${portraitGalleryIds.has(project.id) ? " project-case-gallery--portrait" : ""}`}>
            {project.gallery?.length ? project.gallery.map((image, index) => (
              <figure key={image.src}>
                <img src={image.src} alt={image.alt} />
                <figcaption><span>{image.label ?? `${String(index + 1).padStart(2, "0")} / PROJECT VIEW`}</span><span>{String(index + 1).padStart(2, "0")}</span></figcaption>
              </figure>
            )) : <div className="project-case-art-fallback"><ProjectArtwork project={project} detail /></div>}
          </div>
          {project.url ? <div className="project-case-visit-dock"><a className="project-visit-button cursor-target" href={project.url} target="_blank" rel="noreferrer">去访问 <span aria-hidden="true">↗</span></a></div> : <div className="project-case-link-note">项目链接暂未公开</div>}
        </aside>
      </div>
    </section>
  );
}

export function ProjectsPage() {
  const [view, setView] = useState(readLocation);
  const [directoryWidth, setDirectoryWidth] = useState(initialNotesDirectoryWidth);
  const resizeStart = useRef<{ x: number; width: number } | null>(null);
  useEffect(() => {
    const sync = () => setView(readLocation());
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  useEffect(() => {
    const fitDirectory = () => {
      setDirectoryWidth((width) => Math.min(width, maxNotesDirectoryWidth()));
    };
    window.addEventListener("resize", fitDirectory);
    return () => window.removeEventListener("resize", fitDirectory);
  }, []);

  const selected = timelineProjects.find((project) => project.id === view.id);
  const changeMode = (mode: Mode) => { window.location.hash = mode.toLowerCase(); };
  const openProject = (projectId: string) => { window.location.hash = `projects/${projectId}`; };
  const backToProjects = () => { window.location.hash = "projects"; };
  const beginPanelResize = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    resizeStart.current = { x: event.clientX, width: directoryWidth };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const movePanelResize = (event: PointerEvent<HTMLDivElement>) => {
    if (!resizeStart.current) return;
    const width = Math.min(maxNotesDirectoryWidth(), Math.max(260, resizeStart.current.width + event.clientX - resizeStart.current.x));
    setDirectoryWidth(width);
    localStorage.setItem("notes-directory-width", String(width));
  };
  const endPanelResize = () => { resizeStart.current = null; };

  return (
    <>
      <TargetCursor spinDuration={2} hideDefaultCursor={false} parallaxOn hoverDuration={0.2} />
      <main className={`portfolio-shell${view.mode === "Notes" ? " notes-layout" : ""}${view.mode === "Projects" ? selected ? " project-case-layout" : " project-overview-layout" : ""}`} style={view.mode === "Notes" ? { "--notes-directory-width": `${directoryWidth}px` } as CSSProperties : undefined}>
        <aside className="nav-rail">
          <div className="brand-block">
            <button className="brand-mark cursor-target" onClick={() => changeMode("Projects")}>Hsin</button>
            <span className="brand-year">AI PM / PORTFOLIO 2026</span>
          </div>
          <nav className="nav-links" aria-label="主导航">
            {modes.map((mode, index) => <button key={mode}
              className={`nav-item cursor-target${view.mode === mode ? " active" : ""}`}
              onClick={() => changeMode(mode)} aria-current={view.mode === mode ? "page" : undefined}>
              <span className="nav-icon">0{index + 1}</span><span>{labels[mode]}</span>
            </button>)}
          </nav>
        </aside>

        {view.mode === "Projects" ? selected ? <ProjectCase project={selected} onBack={backToProjects} /> : <ProjectTimeline onOpen={openProject} /> : <>
          <section className="content-panel">
            <div className="panel-toolbar"><span>// {labels[view.mode]}</span><span>0{modes.indexOf(view.mode) + 1} / INDEX</span></div>
            <div className="work-index">
              {view.mode === "Notes" ? <KnowledgeDirectory
                activeId={view.knowledgeId}
                onSelect={(id) => { window.location.hash = `notes?item=${encodeURIComponent(id)}`; }}
              /> : <Contact />}
            </div>
            <div className="status-bar"><span>ZHANG XINYU / {view.mode.toUpperCase()}</span><span>{labels[view.mode]}</span></div>
          </section>
          {view.mode === "Notes" ? <>
            <div className="notes-panel-resizer" role="separator" aria-label="拖动调整目录与阅读区宽度" aria-orientation="vertical" aria-valuemin={260} aria-valuemax={maxNotesDirectoryWidth()} aria-valuenow={directoryWidth} tabIndex={0}
              onPointerDown={beginPanelResize} onPointerMove={movePanelResize} onPointerUp={endPanelResize} onPointerCancel={endPanelResize}
              onKeyDown={(event) => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); setDirectoryWidth((width) => { const nextWidth = Math.max(260, Math.min(maxNotesDirectoryWidth(), width + (event.key === "ArrowRight" ? 24 : -24))); localStorage.setItem("notes-directory-width", String(nextWidth)); return nextWidth; }); } }} />
            <section className={`preview-panel notes-preview-panel${view.knowledgeId.startsWith("ppt-") ? "" : " notes-article-panel"}`}>
            <div className="panel-toolbar"><span>// {view.knowledgeId.startsWith("ppt-") ? "AI PPT 系统原理" : view.knowledgeId.startsWith("editor-") ? "编辑器产品与技术" : view.knowledgeId.startsWith("uiux-") || view.knowledgeId.startsWith("motion-") ? "UI/UX 与前端体验" : "AI Agent 实战难点"}</span><span>KNOWLEDGE / 02</span></div>
            <KnowledgeReader activeId={view.knowledgeId} />
            </section>
          </> : <section className="preview-panel lucky-snake-panel">
            <div className="panel-toolbar"><span>// 好运游戏</span><span>PLAY / 01</span></div>
            <div className="lucky-snake-scroll"><LuckySnake /></div>
          </section>}
        </>}
      </main>
    </>
  );
}
