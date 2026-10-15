import { useEffect, useRef, useState } from "react";
import TargetCursor from "../components/Target_cursor";
import { Contact, coursewareDirectory, projects, type Project } from "./HomePage";

type Mode = "Projects" | "Notes" | "Contact";
const modes: Mode[] = ["Projects", "Notes", "Contact"];
const labels: Record<Mode, string> = { Projects: "项目实践", Notes: "知识沉淀", Contact: "联系我" };
const timelineOrder = ["ai-ppt-lab", "baoda", "heara", "meeting-workflow", "avora", "ai-ppt", "ai-design"];
const timelineProjects = timelineOrder.map((id) => projects.find((project) => project.id === id)).filter((project): project is Project => Boolean(project));

function readLocation() {
  const [route, query] = window.location.hash.slice(1).split("?");
  const [slug, routeProjectId] = route.split("/");
  const mode: Mode = slug === "notes" ? "Notes" : slug === "contact" ? "Contact" : "Projects";
  const selectedId = routeProjectId ?? new URLSearchParams(query).get("selected");
  const selected = timelineProjects.find((project) => project.id === selectedId);
  return { mode, id: selected?.id ?? "heara" };
}

function titleText(project: Project) {
  return project.title.split(/(\s+\/\s+|\s+·\s+)/).map((part, index) => (
    <span key={`${part}-${index}`}>{part}</span>
  ));
}

export function ProjectsPage() {
  const [view, setView] = useState(readLocation);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const previewScrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sync = () => setView(readLocation());
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const selected = timelineProjects.find((project) => project.id === view.id) ?? timelineProjects[0];
  useEffect(() => {
    if (previewScrollRef.current) previewScrollRef.current.scrollTop = 0;
  }, [selected.id, view.mode]);
  const changeMode = (mode: Mode) => {
    window.location.hash = mode.toLowerCase();
    if (mainScrollRef.current) mainScrollRef.current.scrollTop = 0;
  };
  const selectProject = (projectId: string) => {
    window.location.hash = `projects?selected=${projectId}`;
  };

  return (
    <>
      <TargetCursor spinDuration={2} hideDefaultCursor={false} parallaxOn hoverDuration={0.2} />
      <main className={`portfolio-shell${view.mode === "Notes" ? " notes-layout" : ""}`}>
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

        <section className="content-panel">
          <div className="panel-toolbar"><span>// {labels[view.mode]}</span><span>0{modes.indexOf(view.mode) + 1} / INDEX</span></div>
          <div className="work-index" ref={mainScrollRef}>
            {view.mode === "Projects" ? <>
              <header className="project-timeline-intro">
                <span className="eyebrow">AI PRODUCT MANAGER / SELECTED WORK</span>
                <h1>项目实践</h1>
                <p>按项目年份倒序，记录企业产品实践与个人独立探索。展开时间轴节点，查看背景、决策、难点与交付结果。</p>
                <div className="project-origin-legend" aria-label="项目来源图例">
                  <span><sup>1</sup> 公司项目</span><span><sup>2</sup> 个人实战</span>
                </div>
              </header>
              <div className="project-timeline">
                {timelineProjects.map((project, index) => <article className={`timeline-entry${selected.id === project.id ? " active" : ""}`} key={project.id}>
                  <button className="timeline-entry-trigger cursor-target" onClick={() => selectProject(project.id)} aria-expanded={selected.id === project.id}>
                    <span className="timeline-entry-point" aria-hidden="true" />
                    <span className="timeline-entry-meta"><time>{project.period}</time><sup>{project.source === "company" ? "1" : "2"}</sup><em>{project.status}</em></span>
                    <span className="timeline-entry-copy">
                      <strong>{titleText(project)}</strong>
                      <small>{project.short}</small>
                    </span>
                    <span className="timeline-entry-index">{String(index + 1).padStart(2, "0")} ↗</span>
                  </button>
                  {selected.id === project.id ? <div className="timeline-entry-detail">
                    <div className="timeline-project-facts">
                      <div><span>本人职责</span><p>{project.role}</p></div>
                      <div><span>代表结果</span><p>{project.result}</p></div>
                    </div>
                    {project.sections.map((section, sectionIndex) => <section className="case-section" key={section.label}>
                      <span>{String(sectionIndex + 1).padStart(2, "0")} / {section.label}</span><p>{section.text}</p>
                    </section>)}
                    {project.url ? <a className="timeline-visit-link cursor-target" href={project.url} target="_blank" rel="noreferrer">访问项目 ↗</a> : null}
                  </div> : null}
                </article>)}
              </div>
            </> : view.mode === "Notes" ? (
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
        </section> : view.mode === "Projects" ? <section className="preview-panel project-detail-panel">
          <div className="panel-toolbar"><span>// {selected.source === "company" ? "公司项目" : "个人实战"} · {selected.period}</span><span>PROJECTS / 01</span></div>
          <div className="project-detail-scroll" ref={previewScrollRef}>
            <div className="project-detail-showcase" key={`Projects-${selected.id}`}>
              {selected.gallery?.length ? <div className={`project-detail-gallery${selected.id === "heara" ? " heara-detail-gallery" : ""}`}>
                {selected.gallery.map((image) => <figure key={image.src}><img src={image.src} alt={image.alt} />{image.label ? <figcaption>{image.label}</figcaption> : null}</figure>)}
              </div> : selected.cover ? <img className="project-detail-cover" src={selected.cover} alt={`${selected.title}项目画面`} /> : <div className="project-visual-empty">该项目视觉素材整理中</div>}
              <div className="project-detail-facts">
                <div><span>项目来源</span><p>{selected.source === "company" ? "公司项目" : "个人实战"}</p></div>
                <div><span>项目时间</span><p>{selected.period} · {selected.status}</p></div>
                <div><span>本人职责</span><p>{selected.role}</p></div>
                <div><span>代表结果</span><p>{selected.result}</p></div>
              </div>
            </div>
          </div>
          {selected.url ? <div className="project-detail-dock"><a className="project-visit-button cursor-target" href={selected.url} target="_blank" rel="noreferrer">去访问 <span aria-hidden="true">↗</span></a></div> : null}
        </section> : null}
      </main>
    </>
  );
}
