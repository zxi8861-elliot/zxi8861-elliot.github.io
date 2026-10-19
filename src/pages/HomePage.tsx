import { useEffect, useRef, useState } from "react";
import Shuffle from "../components/Shuffle";
import TargetCursor from "../components/Target_cursor";

type Mode = "Work" | "Lab" | "Notes" | "Contact";
type Section = { label: string; text?: string; cards?: Array<{ title: string; text: string }> };
export type Project = {
  id: string; title: string; short: string; category: "Work" | "Lab"; source: "company" | "personal"; period: string; status: string;
  tags: string[]; role: string; result: string; sections: Section[]; cover?: string;
  gallery?: Array<{ src: string; alt: string; label?: string }>; url?: string; demoUrl?: string;
};
const modes: Mode[] = ["Work", "Lab", "Notes", "Contact"];
const labels: Record<Mode, string> = { Work: "工作作品", Lab: "个人实验", Notes: "知识沉淀", Contact: "联系我" };
export const coursewareDirectory = [
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

export const projects: Project[] = [
  {
    id: "muldo", title: "MULDO", short: "多人协作 Agent × 在线协同 × 项目管理",
    category: "Lab", source: "personal", period: "2026", status: "进行中", role: "个人产品探索 / Agent 协作流程 / 项目管理体验",
    result: "围绕多人、多 Agent 与项目协同持续验证产品形态",
    tags: ["Multi-Agent", "在线协同", "项目管理"],
    sections: [
      { label: "项目概览", text: "MULDO 是一个探索多人协作 Agent、在线协同与项目管理如何结合的个人项目。" },
      { label: "探索问题", text: "当 Agent 参与多人项目时，任务、上下文、进度与产出如何在团队成员之间保持可见并持续协同，是 MULDO 正在探索的核心问题。" },
      { label: "产品方向", text: "围绕“多人 × 多 Agent × 项目”组织协作：让团队成员在线协同推进项目，并在同一工作上下文中协调 Agent 任务与项目进度。" },
      { label: "当前阶段", text: "项目仍在推进中。当前作品集仅呈现已明确的产品方向；具体功能、交互方案、技术实现与验证结果将在完成实际设计和开发后补充。" },
    ],
  },
  {
    id: "ai-ppt", title: "AI PPT", short: "觅知网线上产品｜从主题或文档生成演示文稿",
    category: "Work", source: "company", period: "2024", status: "线上运行", role: "产品规划 / 生成链路 / 编辑体验",
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
    id: "ai-design", title: "觅知网 AI 素材创作与分发中台", short: "搭建 AI 素材生产中台，并将生成能力产品化为网站与 APP",
    category: "Work", source: "company", period: "2025", status: "线上运行", role: "产品经理 / 整体方案策划 / 中后台框架与流程设计",
    result: "1. 搭建创作与分发中台，年节省供稿成本约 80 万元、存储及带宽成本约 200 万元。\n2. 中台能力产品化至网站和 APP，前台实现百万级营收。",
    url: "https://www.51miz.com/ai/image", demoUrl: "/demos/ai-content-platform-demo.html", tags: ["AI 素材中台", "AIGC 内容生成", "AI 生图", "人机协同审核与分发"],
    gallery: [
      { src: "/assets/portfolio/ai-design/01-home.jpg", alt: "觅知网 AI 生图首页与素材创作入口", label: "01 / 官网首页：AI 生图入口与创作引导" },
      { src: "/assets/portfolio/ai-design/02-tools.jpg", alt: "AI 图片处理工具入口与功能卡片", label: "02 / AI 图片处理：智能抠图、消除、变清晰与扩图" },
      { src: "/assets/portfolio/ai-design/03-handcopy.jpg", alt: "AI 手抄报生图与自然语言编辑界面", label: "03 / AI 生图：生成结果与自然语言修改" },
      { src: "/assets/portfolio/ai-design/04-poster.jpg", alt: "AI 海报设计与提示词编辑界面", label: "04 / AI 海报：主题生图与快速修改" },
      { src: "/assets/portfolio/ai-design/05-editor.jpg", alt: "在线设计编辑器中的 AI 生成海报", label: "05 / 在线编辑：生成素材的二次设计" },
      { src: "/assets/portfolio/ai-design/06-generation.jpg", alt: "AI 生成结果页面与重新编辑、再次生成操作", label: "06 / 生成结果：编辑、再生成与连续创作" },
    ],
    sections: [
      { label: "项目背景", text: "平台设计师用户的素材需求具有明显的定制化、长尾和高频特征。过去主要依赖外部素材供给方或设计师逐单制作，再经过多轮人工审核、打标，并手动在不同平台间流转；供给成本、格式治理、审核与重复存储逐渐成为规模化供给的瓶颈。项目从内部高频、重复的素材需求切入，规划建设 AI 创作与分发中台，并逐步将成熟能力开放为前台产品。" },
      { label: "个人职责", text: "担任产品经理，负责项目整体方案策划，规划中后台框架、核心业务流程与产品边界；梳理从需求进入、AI 生产和审核到素材分发的端到端链路，并推动中台能力向前台网站及 APP 延伸。" },
      { label: "项目成果一｜搭建创作与分发中台", text: "策划并推动搭建面向 C 端业务的 AI 素材创作分发工作流，覆盖需求解析、模型调度、生图迭代、审核打标、素材入库与多平台调用。中台减少各平台重复存储和带宽开销，并降低设计师供稿及审核成本；按项目复盘口径，年节省供稿成本约 80 万元、存储及带宽成本约 200 万元。" },
      { label: "项目成果二｜中台能力产品化", text: "将中台生图链路复用到前台，迭代用户可直接使用的 AI 生图网站和 APP，打通从内部生产能力到用户创作服务的产品化路径，前台产品实现百万级营收。" },
      { label: "关键工作｜需求解析与模型路由", text: "将原始设计需求结构化，根据需求特征匹配适合的模型和生成流程，组合使用即梦、千问及 GPT、Gemini 等模型。" },
      { label: "关键工作｜生成、审核与迭代", text: "编排多模型生图流程，引入 Agent 对结果进行质量判断、打回与迭代；记录生成链路数据，为后续模型路径和生成效果优化提供依据。" },
      { label: "关键工作｜AI 打标与人工快筛", text: "根据原始需求为图片生成 SEO 标题、关键词及内部检索标签；建设人工预审平台，将逐张查看优化为一页约 50 张的批量快筛，审核通过后进入中台素材池。" },
      { label: "关键工作｜素材加工与多平台分发", text: "审核通过的素材自动进行超清放大并入库，供下游业务平台统一调用；针对局部细节修改，提供自然语言驱动的局部编辑、智能高清、等比扩图、背景抠图、智能调色及在线二次编辑能力。" },
      { label: "项目沉淀", text: "沉淀从需求结构化、模型编排、生成质检、人机协同审核到素材治理和多端分发的模块化工作流。中台既能承接内部重复供给需求，也能作为前台 AI 创作产品的可复用底座。" },
    ],
  },
  {
    id: "avora", title: "Avora / 声映", short: "把形象、歌曲与分镜组合成音乐视频",
    category: "Work", source: "company", period: "2026", status: "工作项目", role: "移动端产品 / 生成流程 / 创作体验",
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
    id: "meeting-workflow", title: "杭州百零 / AI 会议工作流", short: "将会议内容转为 PPT、信息图与 H5 等交付物",
    category: "Work", source: "company", period: "2026", status: "工作项目", role: "Skill 体系 / 生成规范 / Workflow 生产链路",
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
    id: "ai-ppt-lab", title: "课映 / AI PPT 自研版", short: "面向教辅场景，把课件从“生成页面”推进到可互动的教学体验",
    category: "Lab", source: "personal", period: "2026", status: "持续迭代", role: "AI Native 产品主导 / 教学生成策略 / Agent 工作流设计",
    result: "已形成大纲到多类型课件的生成链路，并实现互动课件与可恢复 Agent 工作台",
    url: "https://keying.vercel.app", tags: ["AI 课件", "教辅行业", "PBL", "互动生成", "Agent Runtime"],
    // Current product screenshots will be added after the owner captures them.
    // Do not reuse archived GIFs/screens from the previous interface.
    gallery: [],
    sections: [
      { label: "S / 背景与问题", text: "通用 AI PPT 常见路径是输入主题、生成大纲、套用模板；这能加快通用演示稿制作，但对细分行业里的知识结构、教学过程和课堂活动未必贴合。课映选择教辅行业作为切入口：课件使用频繁，而静态页面不总能直观解释抽象知识，也难让学生在课堂中动手验证。" },
      { label: "T / 我的职责", text: "我以 AI Native 产品经理的方式推进个人项目：聚焦教辅场景，梳理教学目标与课堂方法，定义大纲和场景生成策略，设计可互动课件的表达方式，并把 Agent Runtime、工具调用与生成校验纳入完整工作流。" },
      { label: "A / 教学方法如何变成生成方式", cards: [
        { title: "讲授与概念建构 → 讲解页", text: "按概念、原理、例子组织内容；优先用结构图、步骤图和对比例子呈现，不把每页都生成成标题加段落。" },
        { title: "形成性评价 → 测验页", text: "用选择、判断等题型检查阶段理解，并把反馈放在作答之后，让课件不只负责讲，也能暴露理解断点。" },
        { title: "探究与体验 → 互动页", text: "把适合观察和试验的知识转成模拟、图解、代码或小游戏等可操作场景，让学生通过调整和观察理解关系。" },
        { title: "项目式学习（PBL）→ 项目任务", text: "围绕真实情境组织角色、里程碑、任务与交付物，帮助教师把知识应用串成一段有阶段成果的学习活动。" },
        { title: "讨论与课堂参与 → 讨论活动", text: "提供讨论、问答与白板等课堂活动形态，支持教师把讲解延展为师生互动；这些是课件能力选项，不等同于已验证的学习效果。" },
      ] },
      { label: "A / 生成逻辑", cards: [
        { title: "01 · 明确学习任务", text: "从主题或学习材料出发，先确定课程对象、目标与已有信息；输入不足时补问，避免直接把宽泛主题扩写成一套看似完整的课。" },
        { title: "02 · 先搭教学大纲", text: "把课程拆成有顺序的教学段落，并给每段标注要讲解、练习、探究还是应用；大纲是后续逐页生成的结构约束。" },
        { title: "03 · 按页生成场景", text: "每个大纲节点形成明确页面 brief，再选择讲解页、测验页、互动页或 PBL 等场景类型，逐页生成而非一次性吐出整份大文档。" },
        { title: "04 · 校验、补全、可编辑", text: "对结构化页面内容做类型与字段校验；需要时再生成图片、课堂动作或语音等资源，生成结果回写到课件中供教师检查和继续编辑。" },
      ] },
      { label: "A / 可互动课件怎么构建", text: "互动不是给普通幻灯片加一段动画，而是把学习目标映射到可操作的页面类型：先定义 widget 类型和结构化描述，再生成对应场景内容，渲染后由课堂操作触发状态变化。普通讲解页、测验页与互动场景共用课程和页面结构，但交互能力各自有明确的数据约束。", cards: [
        { title: "场景规格", text: "互动页声明模拟、图解、代码、游戏或 3D 可视化等 widget 类型，并提供匹配该类型的结构化 outline。" },
        { title: "内容与交互", text: "生成场景代码/内容后，再配置页面动作；图片等媒体先生成或复用，再作为素材传给页面生成，不让素材工具暗中改写页面。" },
        { title: "运行与检查", text: "页面在互动运行时中呈现，教师可在预览中检查操作、反馈和课堂流程，再调整内容。课件生成与 Agent 工作台是两条相关但不同的产品链路。" },
      ] },
      { label: "A / Agent Runtime 与工具调用", text: "代码库中确有独立的 Agent Workbench / Runtime，但它是可选的课程构建工作台，不应和普通课件生成流程混为一谈。", cards: [
        { title: "Runtime：可恢复的会话执行", text: "服务端维护 Agent 会话与运行状态，使用 PostgreSQL 持久化；支持 runner 领取/续租、暂停、恢复与中断控制，让长任务不只依赖一个前端请求持续挂着。" },
        { title: "Function calling：模型提出，服务端执行", text: "模型按工具名和参数提出调用；服务端通过 schema、allowlist、权限及超时检查后执行，再把工具结果交回模型决定下一步。模型本身不直接写数据库。" },
        { title: "工具分工与检查点", text: "工具按职责拆分：read_stage / patch_stage 读写课程阶段，generate_scene 逐页生成，generate_actions 配置课堂动作，generate_image 产出媒体素材。文档写入按需要串行化；每次成功生成页面都会持久化为检查点，便于继续查看和修订。" },
      ] },
      { label: "A / 关键取舍与难点", cards: [
        { title: "难点：一套通用模板很难覆盖学科差异", text: "解决方向不是堆更多模板，而是把课程目标、知识点、例子、练习和误解检查放进大纲与页面 brief；行业知识不足时要显式暴露假设和来源边界，不能把生成内容包装成权威教材结论。" },
        { title: "难点：互动内容容易变成不可控的自由代码", text: "通过 widget 类型、结构化 outline、参数校验和页面动作约束互动输入；把生成内容与执行能力分开，降低页面类型错配和工具越权风险。" },
        { title: "难点：PBL 规划链路可能过长", text: "PBL V2 使用一次结构化规划输出，再由代码校验并补齐角色、里程碑、任务状态和顺序；这是针对大量依赖前序结果的工具调用容易失败而做的实现取舍。" },
      ] },
      { label: "R / 阶段结果与边界", text: "课映已形成从教学大纲到讲解、测验、互动和 PBL 场景的课件生成体验，也在代码中实现独立的 Agent Runtime 与 Function calling 工具链。项目仍持续迭代；目前没有可引用的学习成效、教师留存或商业化数据，因此以已实现的产品闭环和技术能力作为阶段结果，不把功能覆盖误写成教学效果证明。" },
    ],
  },
  {
    id: "heara", title: "Heara / 地球声音地图", short: "从地图上的一个地点出发，听见真实世界正在发生的声音。",
    category: "Lab", source: "personal", period: "2026", status: "已完成", role: "AI Native 产品主导 / 体验架构 / AI 协作交付",
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
    category: "Lab", source: "personal", period: "2026", status: "可体验", role: "独立产品定义 / 交互设计 / AI 协作交付",
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
  {
    id: "lingua-float", title: "LinguaFloat / 本地实时字幕", short: "把 Mac 系统音频转成可阅读、可回看的双语悬浮字幕",
    category: "Lab", source: "personal", period: "2026", status: "macOS 本机版本", role: "个人产品定义 / 交互与流程改造 / AI 协作开发",
    result: "实现本地识别、翻译与悬浮字幕链路；端到端延迟和离线稳定性待专项实测",
    tags: ["本地 AI", "实时字幕", "Whisper", "macOS"],
    sections: [
      { label: "S / 背景与问题", text: "看外语视频、参加跨语言会议时，用户往往要在原声、翻译工具和字幕窗口之间来回切换。我的目标是让系统正在播放的声音直接变成屏幕上的原文与中文译文，同时尽量不把音频和字幕内容送到云端。" },
      { label: "T / 我的职责", text: "我负责产品目标、使用流程和交互方案，并与 AI coding agent 协作完成 macOS 应用改造、安装与运行验证。需要说明的是：LinguaFloat 基于 KazKozDev/live-translation 的 MIT 开源项目二次开发，不是从零编写；上游许可与来源声明保留在项目仓库中。" },
      { label: "A / 核心产品决策", cards: [
        { title: "优先本地处理", text: "系统音频经 BlackHole 输入，MLX Whisper 负责语音识别，本机 Ollama / Gemma 负责翻译。选本地模型而不是云 API，优先回应隐私和断网使用诉求；首次安装与下载模型仍需要网络。" },
        { title: "同一份字幕，两种阅读方式", text: "双栏模式便于对照原文和译文；字幕模式突出当前译文，也可打开原文。用户可以按场景切换，不必在“学习对照”和“看视频”之间接受同一种排版。" },
        { title: "历史要能回看和带走", text: "字幕按会话保存，可继续查看、恢复会话并导出文本或字幕文件；直播阅读与事后整理不再是两条互不相干的路径。" },
      ] },
      { label: "A / 难点与解决方案", cards: [
        { title: "系统音频怎么进入应用", text: "macOS 不直接把其他应用的播放音频交给普通应用。通过 BlackHole 虚拟声卡和多输出设备把声音同时送给耳机/扬声器与识别程序，并在界面中说明麦克风权限的用途，避免用户把路由或授权问题误认为识别故障。" },
        { title: "字幕窗口既要能拖，也要能滚", text: "把文字区域完全排除在拖动之外会导致窗口难以移动；让所有鼠标动作都拖窗又会破坏历史阅读。最终让字幕文字区域可拖动窗口，滚轮/触控板继续浏览字幕，滚动条仍独立操作；新字幕到来时回到最新内容。" },
        { title: "实时分段容易丢字、重复或断句", text: "识别采用短语音片段并结合语音活动检测；文本管线再处理相邻片段的重叠、重复和标点，尽量恢复完整句子后再翻译。公开的目标是减少这些问题，不代表所有口音、混合语言和负载下都已通过基准测试。" },
      ] },
      { label: "A / 实现范围与验证边界", text: "应用使用 Python / PyObjC 构建 macOS 悬浮窗，语音识别采用 MLX Whisper，翻译接本机 Ollama / Gemma，并提供安装脚本与模型预下载流程。已在本机检查应用启动、字幕布局切换、设置、历史和导出入口等交互；不同语言的识别准确率、真实播放时的端到端延迟及断网稳定性仍需补齐测试记录。" },
      { label: "R / 阶段结果", text: "形成了带双语与字幕阅读模式、模型与目标语言配置、历史回看和导出能力的 macOS 本地应用，并将项目命名、安装流程和说明文档统一为 LinguaFloat。代码仓库目前为私有，暂不提供公开演示或访问入口；作品集不展示上游旧截图，也不把尚未完成的性能验证包装成结果。" },
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
                <div className="project-tags" aria-label="项目标签">{selected.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                {selected.demoUrl ? <a className="project-demo-link cursor-target" href={selected.demoUrl} target="_blank" rel="noreferrer">打开中后台流程 Demo <span>概念演示 ↗</span></a> : null}
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

export function Contact() {
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
        <div className="contact-row"><button className="contact-copy cursor-target" onClick={() => copy("ZHANG XINYU")}><span>姓名</span><strong>ZHANG XINYU</strong><span>复制 →</span></button></div>
        <div className="contact-row"><button className="contact-copy cursor-target" onClick={() => copy("zxi8861@gmail.com")}><span>EMAIL</span><strong>zxi8861@gmail.com</strong><span>复制 →</span></button><a href="mailto:zxi8861@gmail.com" aria-label="写邮件">写邮件 ↗</a></div>
        <div className="contact-row"><button className="contact-copy cursor-target" onClick={() => copy("zxi8861-elliot")}><span>GITHUB</span><strong>zxi8861-elliot</strong><span>复制 →</span></button><a href="https://github.com/zxi8861-elliot" target="_blank" rel="noreferrer" aria-label="打开 GitHub">打开 ↗</a></div>
        <div className="contact-row"><button className="contact-copy cursor-target" onClick={() => copy("13273355712")}><span>手机号</span><strong>132-7335-5712</strong><span>复制 →</span></button></div>
        <div className="contact-row"><button className="contact-copy cursor-target" onClick={() => copy("zhangxissr")}><span>微信号</span><strong>zhangxissr</strong><span>复制 →</span></button></div>
      </div>
      {notice ? <div className="system-toast" role="status" aria-live="polite"><span aria-hidden="true">✓</span>{notice}</div> : null}
    </div>
  );
}
