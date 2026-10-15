import { useEffect, useRef, useState } from "react";
import Shuffle from "../components/Shuffle";
import TargetCursor from "../components/Target_cursor";

type Mode = "Work" | "Lab" | "Notes" | "Contact";
type Section = { label: string; text: string };
type Project = {
  id: string; title: string; short: string; category: "Work" | "Lab"; status: string;
  tags: string[]; role: string; result: string; sections: Section[]; cover?: string;
  gallery?: Array<{ src: string; alt: string; label?: string }>; url?: string;
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
    gallery: [
      { src: "/assets/portfolio/ai-ppt/01-topic.jpg", alt: "AI PPT 输入主题并生成演示文稿", label: "01 / 输入主题生成 PPT" },
      { src: "/assets/portfolio/ai-ppt/02-upload.jpg", alt: "AI PPT 上传文档后生成演示文稿", label: "02 / 上传文档生成 PPT" },
      { src: "/assets/portfolio/ai-ppt/03-beautify.jpg", alt: "AI PPT 上传现有演示稿并自动美化", label: "03 / 上传 PPT 自动美化" },
    ],
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
    gallery: [
      { src: "/assets/portfolio/ai-design/01-create.jpg", alt: "AI 一键生图创作界面与设计模板示例", label: "01 / 一句话描述，浏览多品类生成素材" },
      { src: "/assets/portfolio/ai-design/02-poster.jpg", alt: "觅知 AI 海报设计与模板素材页面", label: "02 / AI 海报：灵感模板与按需生成" },
      { src: "/assets/portfolio/ai-design/03-handcopy.jpg", alt: "觅知 AI 手抄报生成页面及彩稿线稿示例", label: "03 / AI 手抄报：彩稿与线稿输出" },
    ],
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
    id: "heara", title: "Heara / 地球声音地图", short: "从地图上的一个地点出发，听见真实世界正在发生的声音。",
    category: "Lab", status: "已完成", role: "AI Native 产品主导 / 体验架构 / AI 协作交付",
    result: "21 条来源可核验录音 / 7 大洲 / 中英日完整体验",
    tags: ["地点驱动探索", "真实现场录音", "地图 × 音频交互", "AI 协作构建"],
    url: "https://heara-earth.vercel.app/",
    gallery: [
      { src: "/assets/heara/screens/heara-map-16x9.jpg", alt: "Heara 地球地图与卡伦堡海浪地点播放界面", label: "01 / 地球探索与地点聆听" },
      { src: "/assets/heara/screens/heara-live-16x9.jpg", alt: "Heara 实时声音目录、地区与声音类型筛选界面", label: "02 / 实时声音与地点筛选" },
      { src: "/assets/heara/screens/heara-immersive-16x9.jpg", alt: "Heara 卡伦堡海浪沉浸式地点聆听界面", label: "03 / 沉浸式地点聆听" },
    ],
    sections: [
      { label: "S / 背景与问题", text: "环境声往往被当作睡眠或专注的背景素材，用户听见了声音，却未必知道它发生在哪里、由谁记录、与现场有什么关系。我希望验证另一种体验：能不能先从一个真实地点出发，让声音成为探索世界的入口？" },
      { label: "T / 我的目标与职责", text: "我以 AI Native 产品经理的方式独立推进 Heara：把分散的现场录音组织成可信、可探索、可持续聆听的产品；负责产品定义、核心体验与信息架构、内容可信规则和体验验收，并与 AI coding agent 协作完成可运行产品。" },
      { label: "A / 核心产品决策", text: "选择“地球地图 → 地点档案 → 沉浸聆听”作为主路径，而不是先做声音列表：地图负责发现，地点故事解释声音的来处，沉浸页承接连续聆听。并行设计“推荐”与“实时”两种入口，再以地区和声音类型筛选，兼顾有目的的探索与偶遇。" },
      { label: "A / 特色交互设计", text: "把地图光点、地点卡片、地点叙事和播放器设计为同一地点上下文：切换地点时同步地图视角、现场背景、故事与音轨；进入沉浸页后仍可切换上一站 / 下一站。地点选中与开始播放分开，避免仅浏览地图就突然出声；全站共用一个播放状态，减少界面切换时的状态错乱。声纹则由 Web Audio 实时分析当前音频生成。" },
      { label: "A / 难点与解决方案", text: "难点一是录音来源、授权和地理信息并不整齐：我把来源、作者、许可链接、定位精度设为内容准入规则，只让可核验的录音进入正式地图；位置不确定就降低精度或不标具体坐标，不用猜测补齐。难点二是地图、地点内容与音频容易各自变化：用统一地点数据和共享播放器状态串起各界面，并把“选中地点”与“用户主动播放”拆开，兼顾一致性与播放控制。" },
      { label: "R / 结果与技术实现", text: "交付中英日多语言网站，首批收录 21 条可追溯录音、覆盖七大洲，形成地图发现、推荐 / 实时筛选、地点叙事与沉浸播放的完整闭环。Astro、React、TypeScript 搭建体验；react-globe.gl / Three.js 实现交互地球，Howler 与 Zustand 管理播放，Web Audio AnalyserNode 驱动实时声纹。当前展示的是已交付产品能力，不以未经验证的用户增长或留存数据包装结果。" },
    ],
  },
  {
    id: "baoda", title: "暴打老板", short: "把工作里的烦闷，变成桌面上一记像素反馈。",
    category: "Lab", status: "可体验", role: "独立产品定义 / 交互设计 / AI 协作交付",
    result: "macOS 可下载体验 / 键盘与鼠标交互 / 本地优先",
    tags: ["像素桌宠", "macOS", "情绪价值"], cover: "/assets/baoda-office.webp",
    url: "https://baoda-boss-website.vercel.app/",
    gallery: [
      { src: "/assets/portfolio/baoda/01-home.jpg", alt: "暴打老板像素桌宠产品介绍首页", label: "01 / 产品定位与桌面陪伴" },
      { src: "/assets/portfolio/baoda/02-play.jpg", alt: "暴打老板键盘与鼠标互动玩法介绍", label: "02 / 键盘触发与像素互动" },
      { src: "/assets/portfolio/baoda/03-install.jpg", alt: "暴打老板桌面宠物安装与权限说明页面", label: "03 / 安装体验与权限边界" },
    ],
    sections: [
      { label: "S / 背景与问题", text: "工作中的烦闷常常很轻，却会反复累积；专门打开一个解压应用又会打断手头任务。桌面宠物通常提供陪伴，但我想继续追问：能不能把用户正在做的事本身，转化成即时、轻量、带一点幽默感的反馈？" },
      { label: "T / 目标与职责", text: "目标是在不切换工作流的前提下，让敲键盘、点击或拖动都能触发短促而有反馈的互动。我独立完成产品定义、核心交互和体验取舍，并通过 AI coding agent 协作实现与打包验证。" },
      { label: "A / 核心产品决策", text: "让“输入”成为玩法入口：像素老板常驻桌面，键帽随敲击弹出并击中角色；连续输入形成连击，特定时机触发暴击。保留戳、拖动等鼠标互动，降低对全局键盘权限的依赖；角色、动画与偏好在本机运行，让反馈够近、够快，也不要求用户把工作内容交给产品。" },
      { label: "A / 难点与解决方案", text: "关键难点是像素动画在真实桌面窗口里是否清晰。首版 128×128 帧虽然流程可运行，但放进实际尺寸的打包应用后显得模糊；我据真实观感否决首版，将角色帧重制为 384×384 RGBA，并拆分角色、键帽、粒子三层，最终在 macOS 打包应用中检查 72 帧效果。另一处取舍是快速连续输入会堆积动画：保留单个角色实例、限制同时出现的键帽数量并轮换受击方向，避免反馈排队和窗口被特效淹没。" },
      { label: "A / 隐私与权限边界", text: "跨应用键盘反馈依赖 macOS 辅助功能授权，因此把权限状态明确呈现；用户拒绝授权时仍可通过鼠标互动体验，不绕过系统权限。产品不采集、保存或上传具体按键内容；若开启输入统计，仅在本机保存按日聚合的估算量，并允许关闭和清除。" },
      { label: "R / 结果与当前阶段", text: "已交付可下载的 macOS arm64 / Intel 版本、产品介绍与网页互动演示，核心体验包含键盘触发、连击 / 暴击和桌面角色互动；Windows x64 安装包也已提供，但尚未完成实体 Windows 设备验收。现阶段没有可引用的用户规模或留存数据，因此以已实现功能和可体验交付作为结果，不虚构效果指标。" },
    ],
  },
];

function readLocation() {
  const [route, query] = window.location.hash.slice(1).split("?");
  const [slug, detailId] = route.split("/");
  const mode = modes.find((item) => item.toLowerCase() === slug) ?? "Work";
  const selectedId = detailId ?? new URLSearchParams(query).get("selected");
  const selected = projects.find((project) => project.id === selectedId && project.category === mode);
  const first = mode === "Lab" ? "heara" : projects.find((project) => project.category === mode)?.id ?? "ai-ppt";
  return { mode, id: selected?.id ?? first, detail: mode !== "Lab" && Boolean(detailId && selected) };
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
  const selectLabProject = (projectId: string) => {
    window.location.hash = `lab?selected=${projectId}`;
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  return (
    <>
      <TargetCursor spinDuration={2} hideDefaultCursor={false} parallaxOn hoverDuration={0.2} />
      <main className={`portfolio-shell${view.mode === "Notes" ? " notes-layout" : ""}`}>
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
          <div className={`work-index${view.mode === "Lab" ? " lab-index" : ""}`} ref={scrollRef}>
            {view.mode === "Lab" ? <article className="lab-project-view">
              <nav className="lab-project-tabs" role="tablist" aria-label="个人实验项目">
                {collection.map((project, index) => <button
                  key={project.id}
                  id={`lab-tab-${project.id}`}
                  className={`lab-project-tab cursor-target${selected.id === project.id ? " active" : ""}`}
                  role="tab"
                  aria-selected={selected.id === project.id}
                  aria-controls="lab-case-panel"
                  onClick={() => selectLabProject(project.id)}
                >
                  <span>0{index + 1}</span><strong>{project.title}</strong><em>{project.status}</em>
                </button>)}
              </nav>
              <section className="lab-case-detail" id="lab-case-panel" role="tabpanel" aria-labelledby={`lab-tab-${selected.id}`}>
                <span className="eyebrow">PERSONAL PROJECT / {selected.status}</span>
                <h1 className={hasMixedCjkLatin(selected.title) ? "mixed-script-title" : undefined}>{renderTitleText(selected.title)}</h1>
                <p className="case-lede">{selected.short}</p>
                {selected.sections.map((section, index) => <section className="case-section" key={section.label}>
                  <span>0{index + 1} / {section.label}</span><p>{section.text}</p>
                </section>)}
              </section>
            </article> : view.detail ? (
              <article className="case-detail">
                <button className="back-link cursor-target" onClick={back}>← 返回{labels[view.mode]}</button>
                <span className="eyebrow">CASE / {selected.status}</span>
                <h1 className={hasMixedCjkLatin(selected.title) ? "mixed-script-title" : undefined}>{renderTitleText(selected.title)}</h1><p className="case-lede">{selected.short}</p>
                {selected.sections.map((section, index) => (
                  <section className="case-section" key={section.label}>
                    <span>0{index + 1} / {section.label}</span><p>{section.text}</p>
                  </section>
                ))}
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
        </section> : view.mode === "Lab" ? <section className="preview-panel project-detail-panel">
          <div className="panel-toolbar"><span>// 项目视觉</span><span>PORTFOLIO / 2026</span></div>
          <div className="project-detail-scroll">
            <div className="project-detail-showcase" key={`Lab-${selected.id}`}>
              {selected.gallery?.length ? <div className={`project-detail-gallery${selected.id === "heara" ? " heara-detail-gallery" : ""}`}>
                {selected.gallery.map((image) => <figure key={image.src}>
                  <img src={image.src} alt={image.alt} />
                  {image.label ? <figcaption>{image.label}</figcaption> : null}
                </figure>)}
              </div> : selected.cover ? <img className="project-detail-cover" src={selected.cover} alt={`${selected.title}项目画面`} /> : <div className="project-visual-empty">尚无项目视觉素材</div>}
              <div className="project-detail-facts">
                <div><span>个人职责</span><p>{selected.role}</p></div>
                <div><span>代表成果</span><p>{selected.result}</p></div>
              </div>
            </div>
          </div>
          {selected.url ? <div className="project-detail-dock"><a className="project-visit-button cursor-target" href={selected.url} target="_blank" rel="noreferrer">去访问 <span aria-hidden="true">↗</span></a></div> : null}
        </section> : view.mode === "Work" ? <section className={`preview-panel${view.detail ? " project-detail-panel" : ""}`}>
          <div className="panel-toolbar"><span>// {view.detail ? "项目视觉" : "项目预览"}</span><span>PORTFOLIO / 2026</span></div>
          {view.detail ? <>
            <div className="project-detail-scroll">
              <div className="project-detail-showcase" key={`${view.mode}-${selected.id}`}>
                {selected.gallery?.length ? <div className="project-detail-gallery">
                  {selected.gallery.map((image) => <figure key={image.src}><img src={image.src} alt={image.alt} />{image.label ? <figcaption>{image.label}</figcaption> : null}</figure>)}
                </div> : selected.cover ? <img className="project-detail-cover" src={selected.cover} alt={`${selected.title}项目画面`} /> : <div className="project-visual-empty">尚无项目视觉素材</div>}
                <div className="project-detail-facts"><div><span>个人职责</span><p>{selected.role}</p></div><div><span>代表成果</span><p>{selected.result}</p></div></div>
              </div>
            </div>
            {selected.url ? <div className="project-detail-dock"><a className="project-visit-button cursor-target" href={selected.url} target="_blank" rel="noreferrer">去访问 <span aria-hidden="true">↗</span></a></div> : null}
          </> : <>
            <div className="preview-canvas editorial-canvas" key={`${view.mode}-${selected.id}`}>
              {selected.gallery?.length ? <div className="project-preview-gallery">
                {selected.gallery.slice(0, 3).map((image) => <img key={image.src} src={image.src} alt={image.alt} />)}
              </div> : selected.cover ? <img className="product-preview-image" src={selected.cover} alt={`${selected.title}产品画面`} /> : <div className="project-visual-empty">尚无项目视觉素材</div>}
            </div>
            {selected.url ? <div className="project-preview-actions"><a className="project-visit-button cursor-target" href={selected.url} target="_blank" rel="noreferrer">去访问 <span aria-hidden="true">↗</span></a></div> : null}
          </>}
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
