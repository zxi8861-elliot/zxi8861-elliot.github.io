import { useEffect, useRef, useState } from "react";
import Shuffle from "../components/Shuffle";
import TargetCursor from "../components/Target_cursor";

type Mode = "Work" | "Lab" | "Notes" | "Contact";
type ProjectCard = { title: string; text?: string; problem?: string; solution?: string; check?: string };
type Section = {
  label: string; text?: string; cards?: ProjectCard[]; flow?: string[];
  rows?: Array<{ method: string; goal: string; presentation: string }>;
  process?: Array<{ title: string; detail: string }>;
  mappings?: Array<{ title: string; input: string; output: string }>;
};
export type Project = {
  id: string; title: string; short: string; category: "Work" | "Lab"; source: "company" | "personal"; period: string; status: string;
  tags: string[]; role: string; result: string; resultPoints?: string[]; sections: Section[]; cover?: string;
  gallery?: Array<{ src: string; alt: string; label?: string }>; url?: string;
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
    id: "muldo", title: "MulDo / 协作与项目管理 Agent", short: "多角色项目管理 × Agent Runtime × Function Calling × 多人协同 Agent",
    category: "Lab", source: "personal", period: "2026", status: "搭建中", role: "个人产品探索 / Agent 协作流程 / 项目管理体验",
    result: "围绕多人、多 Agent 与项目协同持续验证产品形态",
    tags: ["多角色项目管理", "Function Calling", "多人协同 Agent"],
    sections: [
      { label: "项目概览", text: "MulDo 是一个探索多人协作 Agent、在线协同与项目管理如何结合的个人项目。" },
      { label: "探索问题", text: "当 Agent 参与多人项目时，任务、上下文、进度与产出如何在团队成员之间保持可见并持续协同，是 MulDo 正在探索的核心问题。" },
      { label: "产品方向", text: "围绕“多人 × 多 Agent × 项目”组织协作：让团队成员在线协同推进项目，并在同一工作上下文中协调 Agent 任务与项目进度。" },
      { label: "当前阶段", text: "项目仍在推进中。当前作品集仅呈现已明确的产品方向；具体功能、交互方案、技术实现与验证结果将在完成实际设计和开发后补充。" },
    ],
  },
  {
    id: "ai-ppt", title: "觅知网 AI PPT", short: "项目负责人 / AI 产品经理｜把生成能力接入觅知网 PPT 业务",
    category: "Work", source: "company", period: "2024.03–2024.12", status: "线上运行", role: "项目负责人 / AI 产品经理",
    result: "约 1.5 个月完成功能上线；累计实现千万级营收；推动注册充值率翻倍提升",
    resultPoints: [
      "约 1.5 个月完成功能上线，实现“需求输入 → 内容生成 → 编辑导出 → 付费转化”闭环，累计实现千万级营收。",
      "推动注册充值率翻倍提升。",
    ],
    url: "https://www.51miz.com/ai/ppt", tags: ["AI PPT", "主题 / 文档生成", "在线编辑"],
    gallery: [
      { src: "/assets/portfolio/ai-ppt-company/01-home.png", alt: "觅知网 AI PPT 首页，展示主题生成、文档生成和上传 PPT 自动美化入口", label: "01 / 首页：三种 PPT 创作入口" },
      { src: "/assets/portfolio/ai-ppt-company/02-generation-entry.png", alt: "AI PPT 工作台，支持输入主题、上传文档和上传 PPT 自动美化", label: "02 / 工作台：选择生成方式" },
      { src: "/assets/portfolio/ai-ppt-company/03-outline.png", alt: "AI 根据输入内容生成 PPT 大纲，支持重新生成或继续选择模板", label: "03 / 大纲：先确认内容结构" },
      { src: "/assets/portfolio/ai-ppt-company/04-template-picker.png", alt: "AI PPT 模板选择器，可按风格、颜色筛选演示文稿模板", label: "04 / 模板：按风格与颜色筛选" },
      { src: "/assets/portfolio/ai-ppt-company/05-editor.png", alt: "生成后的 PPT 在线编辑界面，可查看页面并使用 AI 更换模板", label: "05 / 编辑：生成后继续调整" },
      { src: "/assets/portfolio/ai-ppt-company/06-presentation-result.png", alt: "AI 生成的年度工作总结 PPT 及在线编辑工作台", label: "06 / 结果：演示文稿与编辑工作台" },
      { src: "/assets/portfolio/ai-ppt-company/07-layout-change.png", alt: "在线编辑 PPT 时打开的页面版式更换面板", label: "07 / 版式：在编辑中更换页面结构" },
    ],
    sections: [
      { label: "项目背景", cards: [
        { title: "市场｜AI 生成 PPT 进入早期发展阶段", text: "2024 年初市场升温，竞品尚未形成绝对壁垒。传统 PPT 制作要经历找资料、整理内容、挑模板和逐页排版；早期 AI 产品虽开始自动生成大纲并套用模板，结果离可直接交付仍有内容与版式调整工作。" },
        { title: "业务｜觅知网已有用户与版式资源", text: "觅知网长期服务 PPT 用户，积累了模板和设计资源，也有在线编辑能力。这些积累为把 AI 生成接入现有 PPT 制作链路提供了基础。" },
      ] },
      { label: "项目目标", text: "让用户从自己的主题或材料出发，得到内容贴合、版式合适且能继续编辑的 PPT；把觅知网的素材、模板和在线编辑能力接入一条完整的 AI 制作链路。", flow: ["用户主题 / 材料", "生成内容与大纲", "匹配模板与版式", "在线编辑与导出"] },
      { label: "本人职责", cards: [
        { title: "产品方案与项目推进", text: "作为项目负责人和 AI 产品经理，负责从需求梳理、核心流程设计到跨团队推进，覆盖输入、生成、编辑、导出与付费链路。" },
        { title: "生成策略与模板能力", text: "围绕内容质量和页面表现设计模型、Prompt、RAG 与生成格式策略；推动模板数字化、主题和内容结构匹配，以及生成后的版式调整能力。" },
        { title: "体验迭代与业务验证", text: "结合用户生成、编辑和导出等使用环节完善产品方案，并与算法、设计和研发协作落地，通过数据分析与 A/B 测试迭代转化路径。" },
      ] },
      { label: "用户痛点与觅知网的解法", text: "用户不仅要“生成一份 PPT”，还要让资料找得到、内容放得下、页面看起来合适。觅知网的素材和模板积累，加上在线编辑能力，可以分别处理内容来源与版式适配。", cards: [
        { title: "资料难找｜补足内容与素材来源", text: "用 AI 帮助查找和组织素材；支持上传文档或已有 PPT，让生成过程能参考用户自己的材料，减少主题输入过少、背景不明带来的内容偏差。" },
        { title: "模板不合适｜按主题和内容结构匹配", text: "对 PPT 模板做数字化清洗和打标。生成时结合用户主题、章节结构和每页分点数量，从库内匹配相应风格与内容容量的页面，而不只按标题套一套固定模板。" },
        { title: "页面不满意｜保留调整空间", text: "为相近内容量准备不同版式，用户可在生成后替换页面布局；整体配色也可单独调整。这样内容不必为了迁就某一张模板而被迫删改。" },
      ] },
      { label: "关键难点与解决方案", cards: [
        { title: "主题太宽泛｜补上行业语境", problem: "只给一个宽泛主题时，AI 容易生成通用、空洞的内容，缺少具体行业中的结构和表达方式。", solution: "利用觅知网积累的 PPT 与行业 Know-how 建立轻量 RAG；先对主题做 query 改写和路由拆解，命中相关主题资料后，再把检索到的内容用于大纲与页面生成。", check: "检查改写后的主题是否保留用户意图、检索内容是否相关，以及生成结果是否体现行业语境。" },
        { title: "页面容易长得一样｜控制内容与版式变化", problem: "相似的生成格式容易让不同章节都套用相同结构；每页分点数量也可能与所选版式容量不匹配。", solution: "一方面通过 Prompt 和生成格式约束页面结构；另一方面用代码按行业和版式调整章节分点数量的随机范围，控制页面内容颗粒度，避免所有页面生成成同一种段落结构。", check: "对照不同章节和版式，检查内容量是否适配页面、章节之间是否有足够的结构变化。" },
        { title: "生成质量｜多模型与多维评估", text: "按任务选取多个模型，结合模型选型、Prompt 策略、RAG 文档解析和 Workflow 设计持续调优；评估覆盖内容准确性、逻辑结构与页面布局，不以“生成成功”代替质量验收。" },
      ] },
      { label: "生成入口｜从用户已有材料开始", cards: [
        { title: "输入主题", text: "从一个主题开始，生成内容结构并继续制作 PPT。" },
        { title: "上传文档", text: "以用户现有文档为内容依据，减少重新整理资料的步骤。" },
        { title: "上传 PPT 美化", text: "从已有演示稿开始，进入自动美化和后续编辑流程。" },
        { title: "选模板并上传材料", text: "用户先选定 PPT 模板，再上传材料套用，保留对整体风格的主动选择。" },
      ] },
      { label: "商业化", text: "结合用户生成、编辑和导出行为，设计会员权益、生成额度与付费路径；再用数据分析和 A/B 测试优化转化策略。" },
      { label: "项目沉淀", text: "沉淀 PPT 内容组织、结构规划、版式设计和编辑交付等行业 Know-how，并将传统专业制作方法转化为可复用的生成流程、规则与质量标准。" },
    ],
  },
  {
    id: "ai-design", title: "觅知网 AI 素材生成中台与前台", short: "从 AI 素材创作分发中台，到 Web、APP 与编辑器端产品",
    category: "Work", source: "company", period: "2025", status: "线上运行", role: "产品经理 / 项目负责人",
    result: "中台累计节约外部设计师相关存储及带宽成本约 200 万元；前台产品累计实现百万级营收",
    resultPoints: [
      "提升素材生产与分发效率：除复杂设计场景外，其余场景生产效率提高 10 倍以上；累计节约外部设计师与审核师的招募、投稿成本，以及平台存储和带宽成本约 200 万元。",
      "将中台能力产品化至网站、APP 与编辑器端，前台累计实现百万级营收。",
    ],
    url: "https://www.51miz.com/ai/image", tags: ["AI 素材创作分发中台", "AI 生图应用", "Web"],
    gallery: [
      { src: "/assets/portfolio/ai-design/07-review.png", alt: "AI 素材审核工作台：批量筛选、查看生成信息并处理素材入库", label: "01 / 后台审核工作台：批量快筛与素材入库" },
      { src: "/assets/portfolio/ai-design/01-home.jpg", alt: "觅知网 AI 生图首页与素材创作入口", label: "02 / 前台首页：AI 生图入口与创作引导" },
      { src: "/assets/portfolio/ai-design/02-tools.jpg", alt: "AI 图片处理工具入口与功能卡片", label: "03 / AI 图片处理：智能抠图、消除、变清晰与扩图" },
      { src: "/assets/portfolio/ai-design/03-handcopy.jpg", alt: "AI 手抄报生图与自然语言编辑界面", label: "04 / AI 生图：生成结果与自然语言修改" },
      { src: "/assets/portfolio/ai-design/04-poster.jpg", alt: "AI 海报设计与提示词编辑界面", label: "05 / AI 海报：主题生图与快速修改" },
      { src: "/assets/portfolio/ai-design/05-editor.jpg", alt: "在线设计编辑器中的 AI 生成海报", label: "06 / 在线编辑：生成素材的二次设计" },
      { src: "/assets/portfolio/ai-design/06-generation.jpg", alt: "AI 生成结果页面与重新编辑、再次生成操作", label: "07 / 生成结果：编辑、再生成与连续创作" },
    ],
    sections: [
      { label: "项目背景 / 两端问题", cards: [
        { title: "后台｜供给规模与成本", text: "素材需求定制化、长尾且高频。过去依赖外部设计师逐单制作，再人工审核、打标并跨多个平台分发；供给成本、重复存储和审核效率逐渐成为规模化瓶颈。" },
        { title: "前台｜找图、用图与编辑闭环", text: "把后台生图能力产品化，并结合公司已有的在线编辑、AI 抠图和超清能力，形成设计师找图、用图、加工的一体化前台路径。" },
      ] },
      { label: "关键决策 / 先搭中台，再做前台产品化", text: "从内部高频、重复的素材需求切入：先把创作、审核、素材治理与分发组织成可复用链路，再将成熟能力开放给前台产品。", flow: ["AI 素材创作分发中台", "Web", "APP", "编辑器端"] },
      { label: "关键难点与解决方案", cards: [
        { title: "需求解析｜先弄清用户想要什么", text: "将需求拆成主题、用途、风格与画面要素。描述含糊时先改写 query；需要时联网补充最新知识，再进入生成，减少因需求缺项导致的反复试错。" },
        { title: "模型路由｜按任务选擅长的模型", text: "不同任务走不同模型：例如 Nano Banana 更适合手抄报，即梦 4.0 更适合艺术字。系统按需求特征匹配模型与生成方式，不用同一模型硬套所有场景。" },
        { title: "多轮生成｜每次结果都能追溯", text: "把需求解析、模型选择、批量生图和结果检查编排成连续流程；Agent 可判断结果是否需要重试。每次生成保留全链路细节，便于定位问题、调整后续生成。" },
        { title: "简化人工审核｜AI 补齐素材信息", text: "SEO 标题、关键词和检索标签均由 AI 生成。审核工作台把素材集中呈现，支持每页约 50 张批量快筛；通过后进入中台素材池，减少逐张查看与手工补录。" },
        { title: "素材复用｜加工入库并多端分发", text: "审核通过后自动超清放大、入库并供下游平台调用；同时把生成和编辑能力延伸到网站、APP 与编辑器端。" },
      ] },
      { label: "前台产品化与反馈闭环", text: "按海报、手抄报等细分类目拆分创作入口，把在线编辑、抠图和超清等已有能力接入对应场景。用户的使用与编辑反馈回到后台，用于调整需求理解、模型路由和素材生产。", flow: ["后台：生成、审核、入库", "前台：按类目创作与编辑", "反馈：问题与使用信号回流"] },
    ],
  },
  {
    id: "ai-speed", title: "AI Speed", short: "面向海外与国内用户的 AI 视频创作功能",
    category: "Work", source: "company", period: "2026", status: "工作项目", role: "复合型产品中的 AI 视频生成模块负责人",
    result: "负责多个 AI 视频生成场景的功能规划与落地", url: "https://apps.apple.com/us/app/ai-speed-%E5%8A%A0%E9%80%9F%E5%88%9B%E4%BD%9C-%E7%88%86%E5%8F%91%E7%81%B5%E6%84%9F/id6744090915",
    tags: ["AI带货视频", "说唱带货视频", "出海"],
    gallery: [
      { src: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/73/16/1a/73161af1-a194-9acf-52ce-0195a726f98a/_U9996_U9875.png/1242x2688bb.jpg", alt: "AI Speed 应用商店产品介绍截图", label: "01 / AI Speed 产品入口" },
      { src: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/f8/28/50/f8285003-840e-8339-d140-b0b98c7f9dd2/2688-3@1x.png/1242x2688bb.jpg", alt: "AI Speed 视频创作功能截图", label: "02 / AI 视频创作" },
      { src: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/f9/34/33/f934338e-1c7b-7537-d150-d85c309319fd/ai_U9020_U661f.png/1242x2688bb.jpg", alt: "AI Speed 生成式创作功能截图", label: "03 / AI 生成能力" },
      { src: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/ed/7d/b3/ed7db3a8-08b0-8a66-fa7e-c62306c9dc1b/2688-5@1x.png/1242x2688bb.jpg", alt: "AI Speed 创作场景截图", label: "04 / 视频创作场景" },
      { src: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/c4/09/26/c4092606-dae5-c22f-eb89-e23a1854e038/2688-6@1x.png/1242x2688bb.jpg", alt: "AI Speed 应用界面截图", label: "05 / 应用体验" },
    ],
    sections: [
      { label: "项目概览", text: "AI Speed 是面向海外与国内市场的复合型 AI 创作产品。本案例聚焦我负责的 AI 视频生成模块，不代表我负责整款产品。" },
      { label: "个人职责", text: "负责 AI 视频生成相关应用功能的需求梳理、产品方案与功能落地，围绕不同用户创作场景设计产品流程，并协同设计、算法和研发团队推进交付。" },
      { label: "负责的功能场景", cards: [
        { title: "AI 带货与短剧带货", text: "围绕商品推广内容，规划 AI 口播带货与短剧情境化带货视频功能，支持用户将商品信息转成可发布的视频内容。" },
        { title: "AI 萌宠与舞蹈", text: "规划宠物形象驱动的视频生成体验，包括萌宠跳舞等轻量娱乐创作场景。" },
        { title: "AI 探店", text: "围绕门店与消费场景，设计探店类视频生成应用功能，帮助用户组织素材并生成内容。" },
      ] },
      { label: "产品协作", text: "在既有复合型产品框架中负责视频生成模块，与团队共同完成需求拆解、生成流程设计和版本迭代；作品集范围限定为本人负责的功能模块。" },
    ],
  },
  {
    id: "avora", title: "声映 Avora", short: "从 AI 写歌到个性化音乐 MV，设计完整创作与视频生成链路",
    category: "Work", source: "company", period: "2026", status: "工作项目", role: "产品负责人 / App 0 到 1 / AI 生成工作流与素材供给",
    result: "完成 AI 写歌与个性化音乐 MV 创作链路；协同算法将视频生成 RTF 从 42 降至约 8", url: "https://apps.apple.com/cn/app/%E5%A3%B0%E6%98%A0-ai%E5%86%99%E6%AD%8C-ai%E9%9F%B3%E4%B9%90mv%E5%88%9B%E4%BD%9C-ai%E4%BD%9C%E6%9B%B2-%E5%8E%9F%E5%88%9B%E7%BC%96%E6%9B%B2%E4%BC%B4%E5%A5%8F/id6780820901",
    tags: ["AI写歌", "AI音乐MV"],
    gallery: [
      { src: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/d7/7f/84/d77f84aa-349e-bbb3-0c2b-f9a75c5f8bf4/1242_2688_U2014_U201401.png/1242x2688bb.jpg", alt: "声映 Avora 应用商店产品介绍截图", label: "01 / 声映 Avora 产品入口" },
      { src: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/82/aa/91/82aa9119-be32-7407-731c-86d5969c8c60/1242_2688_U2014_U201402.png/1242x2688bb.jpg", alt: "声映 Avora AI 音乐创作截图", label: "02 / AI 音乐创作" },
      { src: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/3f/ec/8a/3fec8a50-d176-8d9a-f217-547879f8a6cf/1242_2688_U2014_U201403.png/1242x2688bb.jpg", alt: "声映 Avora AI 写歌功能截图", label: "03 / AI 写歌" },
      { src: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/32/a2/87/32a28738-a0fe-7ba1-15b3-f1f672a07c36/1242_2688_U2014_U201404.png/1242x2688bb.jpg", alt: "声映 Avora 音乐 MV 生成功能截图", label: "04 / AI 音乐 MV" },
      { src: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/13/a8/59/13a85963-2125-35d9-3442-9a94680be77b/1242_2688_U2014_U201405.png/1242x2688bb.jpg", alt: "声映 Avora 创作结果截图", label: "05 / 创作与结果预览" },
    ],
    sections: [
      { label: "项目背景｜让用户做出值得分享的作品", cards: [
        { title: "市场机会｜AI 音视频进入大众创作", text: "AI 写歌和视频生成降低了音乐创作门槛。项目希望把两种能力放进同一款 App，让用户从一句想法或几句话开始，完成一首歌和一支自己的音乐 MV。" },
        { title: "产品与商业思路｜先让用户有作品", text: "产品采用 IAP 付费模式，并面向海外市场探索 IAA。商业思路不是先推付费点，而是先让用户快速得到有个人特色、可以分享的作品；用户能把歌曲或 MV 发到社交媒体、经营自己的达人账号或分享给私域，获得表达、认可或实际收益的机会，再建立持续使用和付费意愿。" },
      ] },
      { label: "产品模块与本人职责", cards: [
        { title: "AI 写歌与音乐创作", text: "负责从零到一规划 App 与核心创作流程，包括产品 PRD、功能结构和体验方案，让用户可以从主题、歌词或简短描述开始创作歌曲。" },
        { title: "AI 音乐 MV", text: "负责将用户形象、歌曲和动作模板组织成完整的个性化 MV 生成体验，并与算法一起搭建、优化视频生成工作流。" },
        { title: "AI 完成设计与素材供给", text: "项目没有专职 UI。由我借助 AI 完成 Logo、App 界面设计稿、视觉规范和设计验收；前期 AI 形象、音色、歌曲及视频 MV 模板也由我负责准备与供给。" },
      ] },
      { label: "个性化 MV｜从用户照片到动作分镜", text: "模板先被拆成可复用的分镜单元：每个单元包含动作骨骼、场景提示词和服饰提示词。用户上传照片后，系统结合用户形象与场景、服饰要求生成多角度肖像，再绑定动作骨骼，逐镜生成演出视频。", process: [
        { title: "准备分镜模板", detail: "把预制视频模板拆成镜头单元，标注动作骨骼与动作节奏，并分别整理场景和服饰提示词。" },
        { title: "生成用户多角度形象", detail: "以用户上传照片为身份依据，结合目标场景和服饰提示词，生成正面、侧面等多角度肖像，为后续动作生成提供一致的角色素材。" },
        { title: "检查形象一致性", detail: "审核 Agent 检查多角度肖像中的身份、服饰和画面一致性；发现服装或形象不一致时，将问题结果退回重新生成。" },
        { title: "绑定骨骼生成分镜", detail: "将通过检查的多角度形象绑定到动作骨骼，按模板中的镜头动作生成用户在不同场景下的演出片段。" },
        { title: "音频对齐歌词时间戳", detail: "AI 歌曲原始歌词没有逐句时间信息。我设计并部署歌词与音频对齐流程，生成带时间戳的字幕，再按时间点切分音频片段。" },
        { title: "匹配镜头并合成 MV", detail: "把切分后的音乐片段作为分镜节奏点，与对应动作视频匹配、排序并合成，输出与歌曲节奏和歌词段落相对应的音乐 MV。" },
      ] },
      { label: "关键难点与处理", cards: [
        { title: "多角度肖像容易出现形象漂移", problem: "同一个用户在正面、侧面或不同镜头中，可能出现脸部特征、发型或服饰不一致，后续绑定动作后会更明显。", solution: "将身份参考、场景提示词和服饰提示词纳入多角度形象生成，并增加审核 Agent 检查；不合格结果退回重生成，再进入骨骼绑定。", check: "对照多角度肖像及相邻分镜，检查身份特征、服装和场景连续性。" },
        { title: "歌词没有时间戳，音画难以对齐", problem: "歌曲生成结果有歌词文本和音频，但没有能直接用于剪辑的逐句时间信息；仅按整首歌匹配视频，镜头容易错过歌词和节奏变化。", solution: "部署歌词—音频对齐模型生成带时间戳字幕，再按时间段拆音频，以片段作为镜头匹配与排序的依据。", check: "抽查歌词时间点、音频切片边界和视频分镜切换，确认三者顺序一致。" },
        { title: "视频生成等待时间过长", problem: "多镜头生成会累积推理耗时，用户等待时间影响创作体验。", solution: "与算法一起调整外部模型选型及推理规格，并优化生成帧数、帧率和清晰度等设置，在速度与成片观感间取平衡；视频生成 RTF 从 42 降至约 8。", check: "对比优化前后的生成耗时与成片可用性；RTF 的统计口径以项目实际记录为准。" },
      ] },
      { label: "AI 辅助设计｜从 Logo 到整套 App", process: [
        { title: "先确定产品和视觉方向", detail: "由 PRD 与核心用户任务确定页面范围，从 Logo 和 App 首页开始，让 AI 产出可讨论的第一版视觉稿。" },
        { title: "用 Figma MCP 延展页面", detail: "通过 AI 调用 Figma MCP 生成和调整界面，将确认的视觉方向延展到主要页面与关键状态，而不是逐屏从空白开始。" },
        { title: "整理可复用的设计规范", detail: "把确认后的颜色、字体、组件、间距和页面规则整理成统一规范，作为后续页面生成和修改的约束。" },
        { title: "按规范验收与返修", detail: "逐页检查信息层级、组件一致性、关键流程和状态覆盖；把问题反馈给 AI 修改，直到整套设计满足产品方案。" },
      ] },
      { label: "项目沉淀", cards: [
        { title: "AI 视频工作流要先把素材变成结构", text: "把模板拆成动作、场景、服饰和分镜，再组织用户形象生成、质量检查、歌词时间对齐、音频切片与镜头合成。问题因此能定位到具体环节，而不只是反复重跑整支视频。" },
        { title: "AI 参与 UI 设计仍需要产品规范和验收", text: "从 Logo 与首页建立视觉基线，经 Figma MCP 扩展页面，再沉淀设计规范并逐页验收。AI 可以加快初稿和迭代，但页面覆盖、交互正确性与整体一致性仍需要产品负责人把关。" },
      ] },
      { label: "项目范围", text: "案例聚焦我负责的 App 0 到 1 产品设计、AI 辅助 UI 设计、创作素材供给与音乐 MV 生成工作流；视频推理性能由我与算法协同优化。" },
    ],
  },
  {
    id: "meeting-workflow", title: "倾耳 / AI 会议记录产品", short: "把会议录音整理成共识、行动项，并延展为 PPT、信息图与 H5",
    category: "Work", source: "company", period: "2026", status: "工作项目", role: "Skill 生成链路与模板体系 / 后台推荐、审核与分发",
    result: "搭建多产物 Skill 工作流及模板管理、推荐与审核分发后台",
    url: "https://apps.apple.com/cn/app/%E5%80%BE%E8%80%B3-ai%E4%BC%9A%E8%AE%AE%E7%BA%AA%E8%A6%81%E7%A5%9E%E5%99%A8-%E4%BC%9A%E8%AE%AE%E8%AE%B0%E5%BD%95%E5%8A%A9%E6%89%8B-%E5%BD%95%E9%9F%B3%E8%BD%AC%E6%96%87%E5%AD%97%E6%80%BB%E7%BB%93/id6759899164",
    tags: ["Skill工作流", "管理后台搭建", "会议转PPT", "信息图", "H5"],
    gallery: [
      { src: "/images/portfolio/meeting-workflow-template-library-redacted.png", alt: "PPT 生产模板库后台截图，已遮挡账户名和模板 ID", label: "01 / PPT 生产模板库" },
      { src: "/images/portfolio/meeting-workflow-explore-management-redacted.png", alt: "探索页资源管理后台截图，已遮挡账户名、资源 ID 和入库时间", label: "02 / 探索页资源管理" },
      { src: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/63/bd/c6/63bdc6b0-e25e-52ce-da3c-ef28d0da5ceb/1-_U5f55_U97f3_U5b9e_U65f6_U8f6c_U6587_U5b57-_U6d45_U8272AI-_U539f_U5c3a_U5bf8.png/1242x2208bb.jpg", alt: "倾耳应用录音实时转写截图", label: "03 / 录音与实时转写" },
      { src: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/03/42/e5/0342e530-5026-9b23-2398-002d0e2ac19b/68AEBA2A-EE2D-4D56-BFE1-94A977C072FF.png/1242x2208bb.jpg", alt: "倾耳应用会议内容处理截图", label: "04 / 会议内容处理" },
      { src: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/c0/22/40/c02240c6-520a-6752-9a88-80d6580d3946/3.png/1242x2208bb.jpg", alt: "倾耳应用 AI 会议纪要截图", label: "05 / AI 会议纪要" },
      { src: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/50/99/b7/5099b7a6-29df-c939-502f-de859bcfc276/4.png/1242x2208bb.jpg", alt: "倾耳应用会议总结截图", label: "06 / 会议总结" },
      { src: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/52/d9/80/52d9802e-2a35-03f6-de9c-6c1d07914e7a/5.png/1242x2208bb.jpg", alt: "倾耳应用会议内容导出截图", label: "07 / 内容导出" },
    ],
    sections: [
      { label: "项目概览", text: "办公人群每周要处理大量会议。只靠手写记录或基础录音转写，往往还要会后重新判断：哪些已经确定、哪些仍有分歧、谁要继续跟进、什么时候完成。倾耳将会议录音整理成可继续使用的会议内容，并按不同场景生成 H5、PPT、信息图等产物。" },
      { label: "会议内容如何形成共同底稿", text: "先把录音中的发言角色、讨论主题和关键内容整理成一份共享的会议内容导演；再从同一份底稿中拆出确定项、不确定项、待解决项、行动与截止时间。下游不同产物都以这份共识为内容依据，避免各自生成后重点不一致。", flow: ["会议录音与转写", "识别角色、主题与讨论要点", "整理共识与待解决项", "形成共享内容导演", "供 PPT / 信息图 / H5 使用"] },
      { label: "Skill 工作流｜统一内容，再按产物生成", process: [
        { title: "先理解会议在讨论什么", detail: "结合会议主题与转写内容，整理参与角色、事实、判断、决定和行动；缺少依据的信息保留为不确定项，不补写成结论。" },
        { title: "形成跨产物共用的内容导演", detail: "将会议主题、核心共识、确定项、不确定项、待解决事项、责任与截止时间组织成统一内容底稿，作为不同生成任务的共同输入。" },
        { title: "确定产物与参考方向", detail: "根据使用场景选择 PPT、信息图或 H5。PPT 与信息图可使用用户选择的参考图，或从内部图库匹配；参考图只提供视觉参考，不替代会议内容。" },
        { title: "拆解视觉要求并适配表达", detail: "分析参考图中的色彩、间距、字体、插画和版式关系，再结合产物特点、行业知识及中区、美区、日区的表达重点调整。PPT 按页生成指令，并保持整套页面的视觉一致；信息图独立组织一张图中的关系与重点，不把 PPT 页面缩成一张图。" },
        { title: "生成后由审核 Agent 检查", detail: "PPT 与信息图生成后经过 1–2 轮 AI 审核，检查内容是否偏离会议共识、重点是否遗漏、视觉表达是否符合要求；通过后输出。H5 同样使用共享内容底稿，但按交互页面的产物形态组织。" },
      ] },
      { label: "不同产物，各自承担不同任务", mappings: [
        { title: "PPT｜分页面讲清楚", input: "会议共识、讨论脉络、决定与行动", output: "按页编排内容与图像指令；整套页面沿用统一的视觉系统。" },
        { title: "信息图｜一张图看懂关系", input: "关键判断、证据、风险、决定和后续行动", output: "根据内容关系安排阅读顺序与信息模块，形成独立的信息图，而非缩小版 PPT。" },
        { title: "H5｜承接阅读与互动", input: "同一份会议内容导演及对应使用场景", output: "按 H5 的页面和交互形态组织信息；与 PPT、信息图共享内容基线。" },
      ] },
      { label: "模板后台｜让工作流可以配置和复用", cards: [
        { title: "Skill 转成可调用的后台工作流", text: "把会议理解、内容整理、产物生成和审核等步骤配置为后台可调用的工作流，并为 PPT、信息图与 H5 管理对应模板。" },
        { title: "生成模板标签与推荐信息", text: "模板入库时补充标题、关键词、色彩、排版、行业、适合职业与使用场景等信息，并提供综合评分字段，供前台匹配和推荐使用。" },
        { title: "AI 辅助搭建审核与排序后台", text: "借助 AI 搭建模板审核管理和排序管理后台，帮助内部审核人员处理模板、维护分发顺序，提升审核与内容分发的操作效率。" },
      ] },
      { label: "本人负责范围", text: "我主要负责会议内容转成 PPT、信息图与 H5 的 Skill 生成链路及模板设计，并参与模板上传、推荐规则、标签和分发机制；同时借助 AI 搭建供内部使用的模板管理、审核与排序后台。应用商店截图用于展示倾耳的公开产品体验，案例重点是我负责的生成工作流与后台工具。" },
    ],
  },
  {
    id: "ai-ppt-lab", title: "课映 / AI互动教学课件", short: "面向教辅场景，把课件从“生成页面”推进到可互动的教学体验",
    category: "Lab", source: "personal", period: "2026", status: "持续迭代", role: "AI Native 产品主导 / 教学场景设计 / 互动课件生成策略",
    result: "形成从教学目标、大纲到多类型互动课件的生成链路，并完成预览与编辑体验",
    url: "https://keying.vercel.app", tags: ["教学行业", "AI课件", "HTML转PPT"],
    gallery: [
      { src: "/images/portfolio/ai-ppt-lab/01-course-builder-entry-redacted.png", alt: "课映 AI 课件生成首页：课程需求输入与课件入口，账户邮箱已隐藏", label: "01 / 课程需求输入与生成入口" },
      { src: "/images/portfolio/ai-ppt-lab/02-requirement-analysis.png", alt: "课映 AI 正在分析课程需求的生成准备界面", label: "02 / Agent 分析课程需求" },
    ],
    sections: [
      { label: "项目背景", cards: [
        { title: "通用 AI PPT：大纲＋模板", text: "常见做法是输入主题、生成大纲，再为页面匹配模板。这条路径适合常规演示稿，但默认内容可以放进静态页面，难以表达教学过程中的操作与反馈。" },
        { title: "教辅场景：讲清知识，也要能互动", text: "公式推演、现象观察和空间关系等内容，常需要分步讲解、操作验证或即时练习。单一套模板难适应不同课堂活动；静态页面也不总能直观解释抽象知识。" },
      ] },
      { label: "核心问题", text: "如何把课程目标和知识内容，转成适合讲解、练习、探究与协作的课件？不同页面又该采用什么生成方式、呈现形式和反馈机制？" },
      { label: "教学方式与课件表达", text: "先按课堂要完成的事情选页面，再决定页面结构和交互。", rows: [
        { method: "讲解", goal: "理解概念、公式与步骤", presentation: "讲解页：分步推导、图解、例题" },
        { method: "测验", goal: "检查掌握情况，发现误区", presentation: "测验页：题目、作答、答案与反馈" },
        { method: "互动探究", goal: "观察变量关系、验证假设", presentation: "互动页：模拟、图解与可操作控件" },
        { method: "项目任务（PBL）", goal: "把知识用于真实任务", presentation: "任务页：角色、里程碑、任务与交付物" },
        { method: "讨论活动", goal: "表达观点、比较不同方案", presentation: "讨论页：问题提示、分组交流与记录" },
      ] },
      { label: "整体生成流程", text: "从教学输入开始，先定目标和结构，再按页面类型生成；生成后进入预览、校验与修改。", process: [
        { title: "收集教学输入", detail: "主题、教材或已有材料；信息不足时先补充关键条件" },
        { title: "明确学习目标", detail: "说明学生需要理解什么、能够完成什么" },
        { title: "组织课程大纲", detail: "按章节和教学节点排序，并标记讲解、练习、探究或应用" },
        { title: "选择页面类型", detail: "为每个节点确定讲解、测验、互动、项目任务或讨论形式" },
        { title: "逐页生成与校验", detail: "按页面规格生成内容和所需素材，检查结构与交互配置" },
        { title: "预览、编辑与导出", detail: "检查知识表达和操作反馈，再由教师调整并继续使用" },
      ] },
      { label: "不同课件如何生成与呈现", text: "页面类型不同，生成结果也不同：普通内容页用结构化页面数据渲染；需要操作的内容再生成对应的互动场景。", mappings: [
        { title: "讲解与测验", input: "知识点、讲解顺序或题目与答案", output: "按页面组件呈现；测验在作答后显示结果与反馈" },
        { title: "互动探究", input: "Widget 类型、场景说明和参数（outline）", output: "生成对应 HTML 场景，在隔离的 iframe 中运行并响应操作" },
        { title: "项目任务（PBL）", input: "情境、角色、阶段、任务和交付要求", output: "按任务顺序展示阶段进度与待完成事项" },
        { title: "讨论活动", input: "讨论问题、分组方式和记录字段", output: "呈现讨论提示与记录区域，便于课堂表达和汇总" },
      ] },
      { label: "关键问题与处理", cards: [
        { title: "通用模板装不下学科差异", problem: "同一主题下，有的知识要解释概念，有的要推导公式，还有的需要学生亲手验证。全部套成相同页面，教学步骤容易被压平。", solution: "在课程大纲节点上标明教学目的和页面类型，再分别生成讲解、练习或探究页面；教师可以预览并修改。", check: "检查页面是否对应学习目标，例题、练习与知识点是否衔接。" },
        { title: "互动代码与页面配置可能对不上", problem: "自由生成的 HTML/脚本可能缺少页面需要的参数，或控件能操作却没有正确反馈。", solution: "先约定 widget 类型、outline 和配置字段，再生成场景内容；独立校验脚本语法，并将页面放在 sandbox iframe 中运行。课堂动作使用单独的数据协议。", check: "逐项试操作控件，确认状态变化、反馈和页面通信符合预期。" },
        { title: "PBL 规划容易缺角色或任务顺序", problem: "任务链较长时，生成结果可能漏掉角色、里程碑，或前后顺序不一致。", solution: "先输出一份结构化规划，再由程序校验并补齐角色、里程碑、任务状态和顺序，避免依赖多轮工具调用逐段拼接。", check: "核对每个阶段都有负责人、任务和交付要求，且可以按顺序推进。" },
      ] },
      { label: "可复用经验", cards: [
        { title: "哪些场景适合互动课件", text: "当知识需要分步推导、观察变量变化、模拟实验、即时测验或团队完成项目时，互动课件比单纯换模板更能承载过程。纯信息传达、无需操作的内容，仍可使用普通讲解页。" },
        { title: "如何设计一份可互动课件", text: "先写清学习目标，再把课程拆成教学节点；逐节点选择页面类型，定义所需数据、操作和反馈；最后分别校验知识内容、交互行为与课堂流程。互动不是装饰动画，而是围绕学习任务设计的操作和反馈。" },
      ] },
    ],
  },
  {
    id: "heara", title: "Heara / 地球声音地图", short: "从地图上的一个地点出发，听见真实世界正在发生的声音。",
    category: "Lab", source: "personal", period: "2026", status: "已完成", role: "AI Native 产品主导 / 体验架构 / AI 协作交付",
    result: "21 条来源可核验录音 / 7 大洲 / 中英日完整体验",
    tags: ["地图 × 音频交互", "Three.js", "ASMR"],
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
    tags: ["像素桌宠", "客户端", "多平台客户端"], cover: "/assets/baoda-office.webp",
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
    tags: ["实时字幕", "本地模型", "客户端"],
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
