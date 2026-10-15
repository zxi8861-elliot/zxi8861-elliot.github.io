import { useEffect, useState } from "react";
import TargetCursor from "../components/Target_cursor";
import LuckySnake from "../components/LuckySnake";
import { Contact, coursewareDirectory, projects, type Project } from "./HomePage";

type Mode = "Projects" | "Notes" | "Contact";
const modes: Mode[] = ["Projects", "Notes", "Contact"];
const labels: Record<Mode, string> = { Projects: "项目实践", Notes: "知识沉淀", Contact: "联系我" };
const timelineOrder = ["muldo", "ai-ppt-lab", "ai-ppt", "ai-design", "meeting-workflow", "avora", "heara", "baoda"];
const timelineProjects = timelineOrder.map((id) => projects.find((project) => project.id === id)).filter((project): project is Project => Boolean(project));

function readLocation() {
  const [route, query] = window.location.hash.slice(1).split("?");
  const [slug, routeProjectId] = route.split("/");
  const mode: Mode = slug === "notes" ? "Notes" : slug === "contact" ? "Contact" : "Projects";
  const selectedId = routeProjectId ?? new URLSearchParams(query).get("selected");
  const selected = timelineProjects.find((project) => project.id === selectedId);
  return { mode, id: selected?.id ?? null };
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
  const image = projectImage(project);
  if (image) return <img className="project-art-image" src={image} alt={`${project.title}项目展示`} />;
  return (
    <div className={`project-artwork project-artwork--${project.id}${detail ? " is-detail" : ""}`} aria-label={`${project.title}项目视觉封面`}>
      <span className="project-artwork-kicker">{project.source === "company" ? "COMPANY PROJECT" : "PERSONAL PROJECT"}</span>
      <strong>{project.id === "avora" ? "AVORA" : project.id === "meeting-workflow" ? "MEETING → MAKING" : project.id === "muldo" ? "MULDO" : "PPT / REIMAGINED"}</strong>
      <span className="project-artwork-caption">{project.id === "avora" ? "IMAGE · MUSIC · STORY" : project.id === "meeting-workflow" ? "AGENT SKILLS · CONTENT WORKFLOW" : project.id === "muldo" ? "PEOPLE · AGENTS · PROJECTS" : "A NEW GENERATION EXPERIENCE"}</span>
      <i aria-hidden="true" />
    </div>
  );
}

function ProjectTimeline({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <section className="project-overview-panel">
      <div className="panel-toolbar"><span>// 项目实践</span><span>{String(timelineProjects.length).padStart(2, "0")} PROJECTS / CURATED ORDER</span></div>
      <div className="project-overview-scroll">
        <div className="project-timeline-board">
          <svg className="project-timeline-track" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
            <path d="M 125 160 H 875 C 900 160 910 175 910 200 V 400 C 910 425 900 440 875 440 H 125" />
          </svg>
          <div className="project-timeline-grid">
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
      <div className="panel-toolbar"><button className="project-case-back cursor-target" onClick={onBack}>← 全部项目</button><span>{project.period} / {project.source === "company" ? "公司项目" : "个人项目"}</span></div>
      <div className="project-case-columns">
        <article className="project-case-story">
          <div className="project-case-story-scroll">
            <span className="eyebrow">{project.source === "company" ? "COMPANY PROJECT" : "PERSONAL PROJECT"} / {project.period}</span>
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
                <p>{section.text}</p>
              </section>
            ))}
          </div>
        </article>
        <aside className="project-case-visuals">
          <div className="project-case-gallery">
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
      <div className="status-bar"><span>ZHANG XINYU / PROJECTS</span><span>{project.title}</span></div>
    </section>
  );
}

export function ProjectsPage() {
  const [view, setView] = useState(readLocation);
  useEffect(() => {
    const sync = () => setView(readLocation());
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const selected = timelineProjects.find((project) => project.id === view.id);
  const changeMode = (mode: Mode) => { window.location.hash = mode.toLowerCase(); };
  const openProject = (projectId: string) => { window.location.hash = `projects/${projectId}`; };
  const backToProjects = () => { window.location.hash = "projects"; };

  return (
    <>
      <TargetCursor spinDuration={2} hideDefaultCursor={false} parallaxOn hoverDuration={0.2} />
      <main className={`portfolio-shell${view.mode === "Notes" ? " notes-layout" : ""}${view.mode === "Projects" ? selected ? " project-case-layout" : " project-overview-layout" : ""}`}>
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
              {view.mode === "Notes" ? (
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
            <div className="status-bar"><span>ZHANG XINYU / {view.mode.toUpperCase()}</span><span>{labels[view.mode]}</span></div>
          </section>
          {view.mode === "Notes" ? <section className="preview-panel notes-preview-panel">
            <div className="panel-toolbar"><span>// 课映系统原理</span><span>NOTES / 02</span></div>
            <div className="preview-canvas notes-preview-canvas">
              <iframe className="knowledge-map-frame" name="courseware-map" src="/knowledge/courseware-system-map.html" title="课映 AI PPT 系统原理地图" />
            </div>
          </section> : <section className="preview-panel lucky-snake-panel">
            <div className="panel-toolbar"><span>// 好运游戏</span><span>PLAY / 01</span></div>
            <div className="lucky-snake-scroll"><LuckySnake /></div>
          </section>}
        </>}
      </main>
    </>
  );
}
