import { useEffect, useRef, useState, type ReactNode } from "react";
import { coursewareDirectory } from "../pages/HomePage";

type FolderId = "agent" | "experience" | "ppt" | "editor";
type KnowledgeSelection = string;

type ExperienceArticleData = {
  kicker: string;
  title: string;
  summary: string;
  tags: string[];
  sections: Array<{
    title: string;
    body?: string;
    problem?: string;
    demo?: "priority" | "noise" | "scope" | "viewport" | "transform";
    cards?: Array<{ label: string; body: string }>;
    table?: { headers: string[]; rows: string[][] };
    checks?: string[];
  }>;
  illustration?: "smart-guides" | "history-stack" | "editor-blueprint";
  glossary?: Array<{ term: string; visual: string; purpose: string; persistence: string }>;
  comparison?: Array<{ approach: string; model: string; strengths: string; tradeoffs: string }>;
  sources?: Array<{ label: string; href: string }>;
  resources?: Array<{ category: string; name: string; description: string; href: string }>;
};

type AgentArticleData = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  sections: Array<{ title: string; body: string; code?: string }>;
  sources: Array<{ label: string; href: string }>;
};

const folders: Array<{ id: FolderId; index: string; title: string }> = [
  { id: "agent", index: "01", title: "AI Agent 难点手记" },
  { id: "experience", index: "02", title: "UI/UX 与前端体验" },
  { id: "ppt", index: "03", title: "AI PPT 自研版" },
  { id: "editor", index: "04", title: "编辑器产品与技术" },
];

const agentArticles: AgentArticleData[] = [
  {
    id: "agent-edit-message",
    title: "编辑已发送消息后，AI 如何重新回答？",
    summary: "通用 Agent 如何处理消息修订、历史分支、上下文重建与工具重跑。",
    tags: ["通用 Agent 架构", "上下文管理", "运行状态", "工具调用"],
    sections: [],
    sources: [],
  },
  {
    id: "agent-side-chat",
    title: "侧边临时聊天：共享背景，但不抢主任务",
    summary: "在主 Agent 正执行任务时，如何开一条轻量的旁路提问，并避免旁路答案或操作污染主流程。",
    tags: ["上下文引用", "隔离执行", "主从会话", "显式回流"],
    sections: [
      { title: "从用户感知看：它不是把主对话再复制一份", body: "Codex 公开说明把 side chat 定义为连接当前主聊天的轻量对话；还可以从主 transcript 选中文字后发起，所选片段成为侧聊起点。主聊天负责推进工作，侧聊负责解释、调查和澄清。公开资料能证明的是产品行为与上下文关系，并没有披露 Codex 的私有存储 schema。通用实现更合理的模型是：新建独立 sideThread，附上 parentThreadId、引用的消息/选区锚点和必要的项目摘要，而不是复制整条主会话并让两边继续写同一个 transcript。" },
      { title: "推荐的数据关系：独立消息流 + 只读上下文引用", body: "侧聊应拥有自己的 threadId、消息序列、运行 ID 和取消状态；主会话被引用的片段则作为 context reference（来源消息 ID、选区文本/版本、创建时间）附加。发起时只注入当前问题需要的最小上下文，不必把全部历史塞进 prompt。引用内容在发起时最好冻结为快照，另保留来源链接；否则主对话后续变化会让侧聊“同一问题、不同输入”。", code: `SideThread { id, parentThreadId, status, createdAt }\nContextRef { sourceThreadId, messageId, revisionId, excerpt }\nSideRun { id, sideThreadId, inputSnapshotId, toolsPolicy, status }` },
      { title: "怎样避免与主对话冲突：隔离的不只是文字", body: "只拆开 UI transcript 不够。如果两条会话都能改同一工作区、调用同一外部工具，仍会发生文件覆盖、重复发消息、旧答案迟到、审批串线等冲突。建议默认把侧聊定位为只读分析：可读当前文件/日志和解释问题，但不默认写文件、不提交、不触发外部副作用；若产品允许侧聊执行变更，就要单独标记 run、权限、目标分支/工作树与审批，并在主界面显示它对共享资源的影响。每个流式事件按 threadId + runId 路由，取消一个 run 不应取消另一条会话。" },
      { title: "常见痛点与处理", body: "上下文太少会让用户重复解释；上下文太多则增加成本、泄露无关内容并让问题跑偏。以选区或摘要为锚点、提供“查看引用来源/补充主聊天上下文”可以两边兼顾。侧聊结束后不要自动把整段聊天灌回主线程；提供“复制结论到主对话”或“带结论继续主任务”，由用户选择性回流，并标明它是结论还是未经验证的假设。" },
      { title: "MULDO 可借鉴的产品规则", body: "如果 MULDO 的 Agent 项目空间需要临时讨论，可以让每条 sideThread 绑定主 thread 与项目 ID，但把消息流、运行和权限分开；侧聊优先提供只读工具集。回流时生成一个带来源的摘要卡片，由用户确认后加入主对话。这样既能借用项目背景，又不会悄悄改变主 Agent 的任务状态。这里是基于公开模式的设计建议，不代表对 MULDO 现有实现的检查结论。" },
    ],
    sources: [
      { label: "OpenAI Developers · Side chats 与 fork 的产品心智模型", href: "https://developers.openai.com/blog/mastering-codex-remote-for-engineering" },
      { label: "GitHub Docs · Copilot Chat 的会话上下文与工作区引用", href: "https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/chat-with-copilot/get-started-with-chat-in-your-ide" },
    ],
  },
  {
    id: "agent-fork",
    title: "分叉：从共同历史走向两条独立路径",
    summary: "Fork 不只是复制一段聊天：要明确历史继承边界、执行状态，以及代码工作区是否真正隔离。",
    tags: ["Thread / Branch", "共享前缀", "工作树隔离", "并行探索"],
    sections: [
      { title: "分叉的核心语义：继承过去，不共享未来", body: "分叉通常从某条会话的一个历史位置创建新 thread：分叉点之前的消息可作为共同前缀，之后两边各自追加消息和 Agent 运行。Codex 的公开说明将 fork 描述为“带着原历史开启新的主聊天”，与用于临时提问的 side chat 区分。实现可以物理复制历史，也可以让新 thread 引用不可变的父历史节点、只保存自己的后缀；后者更省存储，但读取时需要正确拼接祖先路径。" },
      { title: "对话隔离与工作区隔离是两回事", body: "新 thread 只保证会话记录/运行标识分开，不自动保证文件系统分开。若两个 thread 指向同一目录，它们仍可能读到彼此尚未提交的改动，甚至同时覆盖同一文件。Git worktree 是常见隔离手段：每个工作树有独立目录、HEAD 和 index，可在同一仓库并行检出不同分支；部分仓库元数据仍共享，所以它也不是完整的安全沙箱。还要额外隔离进程、端口、临时文件、凭据和外部服务副作用。" },
      { title: "一套清晰的分叉对象关系", body: "把会话路径与代码状态分别建模。Conversation/Thread 记录对话；Branch/Fork 记录 parentThreadId、forkedAfterMessageId 与新路径；Run 绑定当前 thread、输入版本和工具调用；WorkspaceRef 记录仓库、目录、基线 commit、分支或 worktree。恢复、比较与合并时都能回答：这个答案基于哪段历史？这次改动来自哪个工作区？有没有共享未提交状态？", code: `Fork { id, parentThreadId, forkedAfterMessageId }\nThread { id, forkId, messageHeadId, workspaceRefId }\nWorkspaceRef { repoId, path, baseCommit, branch, isolationMode }\nRun { id, threadId, inputRevisionId, workspaceRefId, status }` },
      { title: "常见冲突：历史分歧、资源竞争与结果合流", body: "第一，用户误以为 fork 自动复制了全部上下文；应展示分叉点和继承范围，且对压缩摘要/截断给出提示。第二，共享目录里的并行写冲突；高风险改动用独立 worktree/container，低风险只读探索可复用目录但禁写。第三，两个分支都完成后不知道如何合并；给出文件差异、冲突和来源 run，而不是把新分支的所有文件静默覆盖到主工作区。第四，工具副作用无法随对话分叉回滚；发送、发布、付款等需要沙箱、审批或补偿机制。" },
      { title: "什么时候用 side chat，什么时候 fork", body: "问题是“解释一下这个报错/为什么这样设计”，目标不变，使用 side chat；要尝试另一套实现、改变目标或并行做一个主任务，使用 fork；需要互不影响地改代码，fork 之外还要配置隔离工作区。这个三段式决策能避免把“对话看起来分开”误当成“代码已经隔离”。MULDO 可把‘新建分支会话’和‘新建隔离执行空间’做成两个明确选项，并显示共享/隔离范围。" },
    ],
    sources: [
      { label: "OpenAI Developers · /fork 与 /side 的区别", href: "https://developers.openai.com/blog/mastering-codex-remote-for-engineering" },
      { label: "Git 官方文档 · git worktree：多个工作树与每树独立状态", href: "https://git-scm.com/docs/git-worktree" },
      { label: "Git 官方文档 · 仓库布局与 linked worktree 元数据", href: "https://git-scm.com/docs/gitrepository-layout" },
    ],
  },
  {
    id: "agent-annotation",
    title: "页面注释：把视觉指向变成 Agent 可定位的对象",
    summary: "用户在网页里点选元素或框选区域，如何把‘这里改一下’转成可追踪、可验证的修改请求。",
    tags: ["DOM 锚点", "视觉定位", "设计反馈", "目标失效"],
    sections: [
      { title: "交互入口不是实现原理", body: "Codex 内置浏览器公开的操作是：打开页面、进入 Annotation 模式、点击元素或拖选区域、描述修改、保存注释并发送，用户再检查结果。它说明注释将自然语言与页面上的视觉目标关联起来；公开说明没有披露其私有定位器格式。因此，以下 DOM 锚点、截图和解析流程是可复用的通用设计，而不是声称 Codex 内部必然按某一套 selector 实现。" },
      { title: "通用定位链路：捕获、锚定、解析、改动、复核", body: "浏览器端监听用户点选/框选，捕获页面 URL、元素语义（role、可访问名称、文本摘要、稳定属性）、DOM 路径/候选 selector、视口矩形与必要截图；框选非 DOM 区域时以截图裁片和坐标作为补充。发送时将 annotationId、目标锚点、用户意图与页面状态快照作为结构化上下文。执行前重新解析目标并确认仍唯一、仍在视口/仍符合页面版本，然后让 Agent 对相关组件或源码提出变更；完成后回到相同页面复核。", code: `Annotation { id, pageUrl, targetAnchor, quote, rect, screenshotRef, pageVersion }\nTargetAnchor { role, accessibleName, textHash, stableAttrs, selectorCandidates }\nResolution: anchor -> verify uniqueness -> resolve source/component -> preview diff` },
      { title: "为什么只靠坐标或 CSS selector 都不够", body: "屏幕坐标在滚动、缩放、响应式布局或页面重排后会指向别处；CSS selector 可能随构建类名变化，也可能匹配多个重复按钮。文本锚点可能重复、被本地化或动态更新；Canvas/WebGL 内的对象没有普通 DOM 节点；跨域 iframe 又受浏览器安全边界限制。稳健方案是多锚点冗余：语义信息 + 稳定属性/候选 selector + 文本片段 + 截图/矩形，并设置置信度和唯一性检查。低置信度时要求用户重新点选，不应猜测后直接改。" },
      { title: "把注释变成可审查的任务，而不是直接改页面", body: "注释需要显式状态：draft、submitted、resolved、stale；目标解析结果和关联代码位置也应可见。生成阶段默认先展示建议 diff 或页面预览，再由用户确认应用。若页面已热更新、目标节点消失或重复，标为 stale 并提示重新定位。多个注释应各自有 ID，用户能逐条处理、关闭或补充；批量改动要说明会影响哪些组件，避免一个局部视觉意见扩大成全站重构。" },
      { title: "MULDO 可借鉴的落地方式", body: "若 MULDO 支持对 Agent 产物或项目预览做批注，可采用‘选区锚点 + 注释卡片 + 变更预览’闭环：点击/框选只创建反馈，不立即运行；每条反馈记录来源页面、目标、版本与状态；Agent 先回报拟修改组件和影响范围，再生成 diff/预览供确认。无法稳定定位的对象就降级到截图框选并要求二次确认。" },
    ],
    sources: [
      { label: "OpenAI Help · 内置浏览器的 Annotation mode 操作与预览边界", href: "https://help.openai.com/en/articles/20001277-using-the-built-in-browser-in-the-chatgpt-desktop-app" },
      { label: "OpenAI · Codex 中针对网页与产物的精确注释工作流", href: "https://openai.com/index/codex-for-almost-everything/" },
    ],
  },
  {
    id: "agent-add-to-chat",
    title: "添加到对话：选中的一段内容如何成为可靠上下文？",
    summary: "从代码、对话 transcript 或网页选区发起提问，重点是传递准确来源与范围，而不是只复制一串失去出处的文本。",
    tags: ["Selection Context", "来源锚点", "快照与引用", "侧聊入口"],
    sections: [
      { title: "一次选择，至少包含三类信息", body: "选中的文本本身回答‘看什么’，来源定位回答‘从哪里来’，周边上下文回答‘这段是什么意思’。因此提交给 Agent 的上下文可包含：选区内容/范围、来源对象（thread/message、文件路径与行号、DOM 节点或页面 URL）、来源版本/时间，以及按需扩展的相邻段落、父组件或周边代码。UI 上用可移除的引用 chip 显示这些来源，避免用户误把它当作普通提示词。" },
      { title: "快照引用与实时引用的取舍", body: "快照引用在用户选中时冻结文本，结果可复现，适合对话消息、网页意见和一次性提问；代价是源内容后来改变时可能过期。实时引用只保存稳定 ID/range，发送时再读取最新内容，适合 IDE 当前选区或协作文档；代价是选区可能移动、对象被删除或内容改变。产品应标明使用哪种语义；发送前若引用已变化，可展示差异并让用户刷新或沿用旧快照。" },
      { title: "从选区进入主对话，还是侧边聊天？", body: "Cursor 提供把编辑器选区添加到 Chat、Edit 或新 Chat 的快捷入口；GitHub Copilot Chat 也支持把 #selection 等变量显式放进提示。Codex 公开支持从 transcript 选中文字后 Ask in side chat，让选中片段成为新侧聊起点。它们共同体现的产品模式是：选择对象后，用户决定把上下文附到哪个目的地，而不是系统悄悄改变正在进行的主任务。" },
      { title: "常见失效与防错", body: "选区为空、太长、跨多个节点、重复文本、源内容已更新、隐藏内容或权限不足，都会让引用不准。应设置大小限制和摘要策略，同时保留原始引用链接；跨节点选择保留顺序与边界；源已变化时标记旧版本；用户没有权限的内容不能因为被选中就绕过权限检查。还应避免把选区文本与用户指令混为一谈：引用内容是待分析的数据，不能自动获得指令优先级。" },
      { title: "MULDO 可借鉴的交互契约", body: "在 MULDO 的多 Agent 协作里，选中文本后可出现‘加到当前对话’与‘在临时聊天中提问’两个动作。提交前展示引用卡片（来源 Agent/消息/项目、片段预览、版本），允许删掉或补充上下文；侧聊中的答案不自动改变主 Agent 计划，用户选择‘采纳到主任务’时再附带结论和来源回流。" },
    ],
    sources: [
      { label: "Cursor Docs · 将代码选区添加到 Chat / 新 Chat", href: "https://docs.cursor.com/advanced/keyboard-shortcuts" },
      { label: "GitHub Docs · #selection、#file 与工作区上下文", href: "https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/chat-with-copilot/get-started-with-chat-in-your-ide" },
      { label: "OpenAI Developers · 从 transcript 选区启动 side chat", href: "https://developers.openai.com/blog/mastering-codex-remote-for-engineering" },
    ],
  },
];
const agentArticleOrder = ["agent-edit-message", "agent-side-chat", "agent-add-to-chat", "agent-fork", "agent-annotation"];

const experienceArticles: Record<string, ExperienceArticleData> = {
  "uiux-libraries": {
    kicker: "UI / FRONTEND / COMPONENT LIBRARIES",
    title: "前端组件与效果参考库",
    summary: "",
    tags: ["UI 组件", "AI 界面", "动效", "Three.js"],
    resources: [
      { category: "UI 组件", name: "shadcn/ui", description: "可把组件源码加入自己的项目再修改；适合需要掌控视觉与代码的产品。", href: "https://ui.shadcn.com/docs" },
      { category: "UI 组件", name: "Radix Primitives", description: "无样式的交互原语，重点是键盘、焦点与无障碍行为；适合作为设计系统底层。", href: "https://www.radix-ui.com/primitives/docs/overview/introduction" },
      { category: "视觉组件 / 动效", name: "Magic UI", description: "偏视觉表现的 React 动效组件与背景效果，适合营销页、作品集和产品首屏；落地前检查动效强度、依赖与 reduced-motion。", href: "https://magicui.design/docs/components" },
      { category: "视觉组件 / 动效", name: "Aceternity UI", description: "可复制到项目里的 React / Tailwind 组件和区块，常见卡片、背景与微交互较完整；需把颜色、字体和动效收回到自己的设计 token。", href: "https://ui.aceternity.com/components" },
      { category: "AI 界面", name: "AI Elements", description: "面向 AI 产品的消息、对话、推理和工具调用组件；基于 shadcn/ui，接入前确认 Next.js、AI SDK 与 Tailwind 配置要求。", href: "https://elements.ai-sdk.dev/docs" },
      { category: "AI 界面", name: "assistant-ui", description: "聊天线程、流式消息、分支、附件与工具调用等 React 组件和运行时适配。", href: "https://www.assistant-ui.com/components" },
      { category: "前端动效", name: "Motion for React", description: "适合状态过渡、布局变化、手势与滚动触发；先看 reduced motion 和性能章节。", href: "https://motion.dev/docs/react" },
      { category: "前端动效", name: "GSAP", description: "时间轴编排与复杂序列控制能力强；交互复杂时注意清理动画上下文。", href: "https://gsap.com/docs/v3/" },
      { category: "Three.js / 3D", name: "Three.js 文档", description: "从场景、相机、几何体、材质、光源和加载器理解 WebGL 3D 的基础对象模型。", href: "https://threejs.org/docs/" },
      { category: "Three.js / 3D", name: "Three.js 示例", description: "官方 API 与可运行示例，适合从真实渲染能力、材质和后处理效果入手。", href: "https://threejs.org/examples/" },
      { category: "Three.js / 3D", name: "React Three Fiber", description: "React renderer for Three.js；React 版本与 R3F 主版本需要匹配。", href: "https://r3f.docs.pmnd.rs/" },
      { category: "Three.js / 3D", name: "Drei", description: "R3F 常用 helper 与现成抽象集合，适合快速搭建相机、控制器、环境和加载流程。", href: "https://drei.docs.pmnd.rs/" },
      { category: "Three.js / 3D", name: "Theatre.js", description: "为 Three.js、R3F 与 HTML/SVG 场景提供可视化时间轴动画编排；它补动画 authoring，不替代 Three.js 渲染本身。", href: "https://www.theatrejs.com/docs/latest" },
    ],
    sections: [
      { title: "怎么挑，不要只看截图", cards: [
        { label: "先看交互底座", body: "确认键盘、焦点、弹层、拖拽和无障碍由谁负责。漂亮的静态样例不等于生产可用。" },
        { label: "再看代码归属", body: "源码复制、运行时依赖和主题覆盖的维护成本不同；先确认团队是否愿意长期维护这层代码。" },
        { label: "最后看场景边界", body: "AI 聊天、复杂时间轴和 3D 场景不是同一种组件问题；按交互模型挑工具，不要把库名当方案。" },
        { label: "上线前做一次适配", body: "逐项核对许可证、依赖体积、主题 token、键盘与触屏行为、动效偏好和低端设备表现；示例能跑不代表可直接进生产。" },
      ] },
    ],
  },
  "motion-earth-rendering": {
    kicker: "FRONTEND MOTION & 3D / CASE 001",
    title: "真实交互地球，如何做出有方向的材质层次？",
    summary: "Heara 地球渲染复盘：保留可交互 3D 球体，用多层材质与 Shader 逐步逼近设计目标。",
    tags: ["Three.js", "WebGL Shader", "材质分层", "性能治理"],
    sections: [
      { title: "目标与约束", body: "产品需要一颗可拖拽、可定位真实录音地点的地球，同时呈现夜侧灯光、地形起伏、云层、大气边缘和太空氛围。约束是不把交互地球替换成静态合成图，也不让光效变成盖住地表细节的特效堆叠。" },
      { title: "渲染方案", body: "以 react-globe.gl / Three.js 的球体为基础，组合高分辨率日间地表贴图、地形 bump、水面高光、夜间城市灯光纹理和透明云层；通过 MeshPhongMaterial.onBeforeCompile 注入昼夜分界、城市灯光与云层混合逻辑。球体之外再独立绘制大气壳 Shader，以视线与球心射线的最近距离估算边缘高度，控制蓝色散射与右上暖金日照，而不是给整个球统一加一圈模糊光晕。" },
      { title: "轨道与光源", body: "轨道由 TubeGeometry 构成，再用 ShaderMaterial 做虚线、亮点与沿轨迹的明暗变化；不同倾角的轨道按相机姿态对齐。屏幕太阳方向随相机四元数同步，使用户旋转地球时，构图中的冷暖边缘光仍保持预期方向。" },
      { title: "主要难点与取舍", body: "多层纹理很容易产生灰膜感、云层发白和过宽的蓝色外晕；Shader 参数又会随视角和视口比例改变观感。处理方式是以同一参考画幅反复截图对照，记录球体直径、内容栏起点和边缘参数，再逐轮收窄云层阈值、大气 cutoff 与投影范围。回归时还发现路由往返会留下旧 WebGL 对象，因此补上轨道/材质释放和重建，避免返回地图后大气或轨道消失。" },
      { title: "性能与结果", body: "地球静止后暂停 Globe 的持续渲染，交互时恢复，约 0.9 秒无操作后再次暂停；页面隐藏时也暂停，并让太阳只在相机变化时同步。最终形成可交互的多层地球与地点脉冲/轨道效果，构建和往返检查通过。诚实的验收结论是：方案落地，但星云锐度、云纹和外晕与艺术化参考图仍有差异，没有宣称逐像素复刻。" },
    ],
    sources: [
      { label: "react-globe.gl · Three.js 地球组件与自定义对象", href: "https://github.com/vasturiano/react-globe.gl" },
      { label: "Three.js · ShaderMaterial", href: "https://threejs.org/docs/pages/ShaderMaterial.html" },
      { label: "Three.js · MeshPhongMaterial", href: "https://threejs.org/docs/pages/MeshPhongMaterial.html" },
      { label: "Three.js · WebGLRenderer.setAnimationLoop", href: "https://threejs.org/docs/pages/WebGLRenderer.html" },
    ],
  },
  "motion-audio-waveform": {
    kicker: "FRONTEND MOTION & 3D / CASE 002",
    title: "如何让声纹响应真实声音，而不是装饰性波浪？",
    summary: "从正弦动画改为读取网页实际播放音频，让声线、粒子和播放状态形成可感知的联动。",
    tags: ["Web Audio API", "AnalyserNode", "Canvas", "动效平滑"],
    sections: [
      { title: "背景与问题", body: "声纹是 Heara 地图与沉浸聆听体验中的核心反馈。初版虽然接入了 AnalyserNode，但主体曲线仍主要按时间做正弦运动，音量只轻微影响振幅；用户听到的声音与看到的波形联系不强。逐点直采又会让线束抖动、挤在一起，多层发光叠加还会让中心过曝。" },
      { title: "技术方案", body: "从 Howler 的 masterGain 接出 Web Audio AnalyserNode，同时读取时域采样和频谱。时域数据计算 RMS，作为整体能量包络驱动主振幅；FFT 则按频段聚合能量，用来改变局部曲线和粒子的强度/漂移。这里读到的是网页内 Howler 混音信号，不是操作系统硬件音量。" },
      { title: "平滑与视觉控制", body: "对能量包络和各频带使用不同的 attack / release 时间：声音变强时响应更快，衰减时更慢，抑制瞬态尖峰。移除过粗的叠光、控制线束数量与粒子密度，避免中心糊成一团。音频分析约按 30Hz 更新，Canvas 绘制则跟随 requestAnimationFrame；取消固定 30fps 绘制上限，解决 60Hz 屏幕上的帧间跳跃。" },
      { title: "状态、布局与结果", body: "播放时声纹跟随实际混音能量变化；暂停时回落到静态状态，并尊重减少动态效果偏好。实测还发现波形会侵入地点故事正文，于是调整故事区间距和最小高度，让叙事与动效互不遮挡。最终声纹从“会动的装饰”变成播放反馈；仍可继续调校线束疏密和亮度，视觉复核记录没有把未完全匹配参考的部分说成已解决。" },
    ],
    sources: [
      { label: "MDN · AnalyserNode", href: "https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode" },
      { label: "MDN · Web Audio API 可视化", href: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API" },
      { label: "Howler.js · Web Audio context 与 masterGain", href: "https://github.com/goldfire/howler.js#documentation" },
    ],
  },
};

const editorArticles: Array<{ id: string; title: string; article: ExperienceArticleData }> = [
  {
    id: "editor-canvas",
    title: "Canvas 与其他 2D 编辑技术的区别",
    article: {
      kicker: "EDITOR SYSTEMS / FIELD NOTE 001",
      title: "Canvas 是画布，不是现成的编辑器",
      summary: "先分清渲染表面、对象模型和文档模型，再决定 PPT、海报、H5 或富文本编辑器该用什么。",
      tags: ["Canvas 2D", "SVG", "DOM", "WebGL", "富文本模型"],
      sections: [
        { title: "Canvas 2D 能做什么", body: "Canvas 提供一块位图绘制表面和绘图上下文，可画路径、文字、图片和形状，做变换、裁切、透明混合、像素读写与逐帧动画，并把结果导出为位图。它很适合高频重绘、复杂场景合成和大量视觉对象；但绘制后的形状不会自动成为可独立查询的 DOM 节点。选择、拖拽、命中检测、对象树、文本编辑、撤销重做、无障碍与序列化，通常需要应用或上层库自己建立。" },
        { title: "几种路线怎么区分", body: "下面比较的是浏览器里的主要 2D 表达路线。Fabric / Konva 并不是另一种浏览器画布：它们是在 Canvas 之上提供对象、事件、命中检测和序列化等能力。富文本编辑器也不等同于 DOM 渲染，它的核心是有 schema 的文档模型，常由 DOM 负责可编辑呈现。", },
        { title: "Figma 的公开复盘：技术选型要回到产品质量目标", body: "Figma 联合创始人 2015 年的工程文章回顾了团队为什么没有直接依赖 HTML、SVG 或原生 Canvas：当时的目标是跨平台、高保真、支持无限画布和复杂图层效果；文章指出 DOM/SVG 的缩放与重绘成本、Canvas 即时绘制模型下每帧重传几何、文本跨平台差异等限制，因而团队自建 WebGL、tile-based 渲染引擎。2025 年的更新又讲了 WebGPU 如何在保留 WebGL 兼容路径下渐进迁移，并对不同设备做基准测试。正确的借鉴不是“专业编辑器必须自研渲染器”，而是先明确用户的画布规模、缩放/渲染质量和一致性目标，再看平台 API 是否足够；自研引擎本身也是长期成本。", },
        { title: "画布编辑器常见的混合架构", body: "PPT、海报和 H5 编辑器往往不必把所有界面都塞进 Canvas：舞台用 Canvas 或 WebGL 渲染页面对象；工具栏、属性面板、快捷菜单和可访问控件用 DOM；正在输入的文字可临时使用 DOM 文本框覆盖在舞台上；应用内部仍维护独立、可序列化的文档对象模型。这样既能获得高效舞台渲染，也保留 HTML 控件的布局、文本和无障碍能力。" },
        { title: "选型结论", body: "对象少、需要原生文本排版与可访问性的界面优先考虑 DOM；矢量图形、路径和缩放清晰度重要时考虑 SVG；大面积、高频、位图合成或大量场景对象更适合 Canvas，并搭配对象模型/渲染库；复杂 GPU 特效或 2D/3D 混合可评估 WebGL。富文本应优先定义语义文档结构，再选择编辑视图。真实编辑器常是混合方案，而不是一次性押注单一技术。" },
      ],
      comparison: [
        { approach: "DOM / CSS", model: "每个控件是 DOM 元素", strengths: "布局、文本、键盘、无障碍与样式成熟", tradeoffs: "海量元素和高频场景重绘成本高", },
        { approach: "SVG", model: "保留式矢量节点树", strengths: "路径、缩放、单对象事件与样式直观", tradeoffs: "极大量复杂节点时 DOM 与绘制维护压力上升", },
        { approach: "Canvas 2D", model: "即时绘制到位图表面", strengths: "合成、像素操作、动画和复杂画布灵活", tradeoffs: "命中检测、对象树、编辑与可访问性需另建", },
        { approach: "WebGL", model: "GPU 图形管线与着色器", strengths: "高吞吐、滤镜和复杂视觉效果", tradeoffs: "实现/调试门槛高，文本和普通控件需混合 DOM", },
        { approach: "富文本模型 + DOM", model: "有 schema 的语义文档 + 编辑视图", strengths: "结构化内容、光标、选区、粘贴和编辑规则", tradeoffs: "分页、自由定位和复杂画布对象不是开箱能力", },
      ],
      sources: [
        { label: "MDN · Canvas 2D 教程", href: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial" },
        { label: "MDN · SVG 与 DOM 矢量图形", href: "https://developer.mozilla.org/en-US/docs/Web/SVG" },
        { label: "Fabric.js · Canvas 对象、交互与序列化", href: "https://www.fabricjs.com/docs/core-concepts/" },
        { label: "Konva · Stage / Layer / Shape 架构", href: "https://konvajs.org/docs/overview.html" },
        { label: "Figma Engineering · 为什么专业设计工具需要自己的渲染引擎（2015）", href: "https://www.figma.com/blog/building-a-professional-design-tool-on-the-web/" },
        { label: "Figma Engineering · 从 WebGL 迁移并支持 WebGPU 的真实工程取舍（2025）", href: "https://www.figma.com/blog/figma-rendering-powered-by-webgpu/" },
      ],
    },
  },
  {
    id: "editor-smart-guides",
    title: "参考线、吸附线与网格线怎么设计",
    article: {
      kicker: "",
      title: "参考线、吸附线与网格线怎么设计",
      summary: "从三种线的职责出发，拆解吸附候选、优先级、层级作用域与视口边界，再落到编辑器可验证的交互规则。",
      tags: [],
      illustration: "smart-guides",
      glossary: [
        { term: "参考线\nGuide", visual: "用户创建的水平 / 垂直标尺线", purpose: "给对象提供持久的人工对齐基准；拖到线上时可触发吸附", persistence: "文档级或画板级对象，可编辑、隐藏、删除" },
        { term: "吸附线\nSmart Guide", visual: "对象边 / 中心对齐时短暂出现的虚线", purpose: "反馈当前对象与目标对象之间命中的几何关系，并可提供位置修正", persistence: "交互态 overlay；松开、取消或失焦后清除" },
        { term: "网格线\nGrid", visual: "按固定间距重复的行列刻度", purpose: "提供重复定位与节奏约束；吸附到网格时按步长量化坐标", persistence: "画板 / 文档布局配置；通常不作为独立内容对象" },
      ],
      sections: [
        { title: "真实任务：海报卡片对齐", problem: "拖入一张新卡片时，用户要能靠齐已有卡片、画板边缘和中心线，但不能被不相关的对象突然拉走。", cards: [
          { label: "要对齐什么", body: "卡片的左边、中心、右边；画板边缘与中心；用户自己创建的参考线。" },
          { label: "要看懂什么", body: "当前吸到哪个目标、为什么吸上去，以及怎么临时摆脱吸附。" },
          { label: "怎么验收", body: "不同尺寸、多个目标同时靠近、画板边缘、关闭吸附、松手后 Undo。" },
        ] },
        { title: "通用计算链：先建候选，再筛选，再反馈", cards: [
          { label: "01 配对", body: "拖动对象与目标对象的边、中心组成候选锚点对。" },
          { label: "02 筛选", body: "坐标差乘当前缩放比，换成屏幕像素；超出阈值的候选丢弃。" },
          { label: "03 选中", body: "X、Y 分开选最合适的目标，合并重复线并处理冲突。" },
          { label: "04 修正", body: "对象位置与辅助线共用同一命中结果，避免画出来却没吸上。" },
        ] },
        { title: "进阶难点一：多个方向同时命中", problem: "拖动对象同时靠近多个目标的边和中心时，如果各自独立吸附，位置会来回跳；只按“最近”选，也可能在两条线之间反复切换。", demo: "priority", cards: [
          { label: "先判定是否够近", body: "按屏幕距离设硬阈值；例如进入 6px、退出 9px。两条阈值形成滞回，避免贴着边界时抖动。" },
          { label: "再决定谁优先", body: "X / Y 分轴选；优先更近候选，接近并列时沿用上一帧目标，再比较 Guide、画板、普通对象等语义等级。" },
          { label: "最后处理冲突", body: "两轴可同时命中；若一轴违反锁定、越过约束或造成突跳，只保留另一轴。阈值需用鼠标、触控板和不同缩放校准。" },
        ] },
        { title: "进阶难点二：候选太多，哪些线值得出现", problem: "画布对象一多，逐个比较所有边和中心会拖慢拖动；把所有命中线都画出来，又会遮住内容，让人看不清到底吸到哪里。", demo: "noise", cards: [
          { label: "① 语义筛选", body: "排除自己、被拖组的后代、隐藏 / 锁定对象和明确不参与吸附的图层。" },
          { label: "② 几何筛选", body: "只查相关轴、阈值内的边 / 中心锚点；合并重合线，再按距离与目标类别取少量赢家。" },
          { label: "③ 限定查询", body: "对象多时用空间索引查拖动区域附近目标；不要每帧扫描整份文档。" },
          { label: "④ 克制绘制", body: "只显示赢家线和必要的间距标注，不把所有潜在匹配同时画出来。" },
        ] },
        { title: "进阶难点三：组、画板与吸附作用域", problem: "拖组时若又吸到组内子对象，会出现对象追着自己跑；编辑组内元素时若误吸到组外，也会破坏组内排版。", demo: "scope", cards: [
          { label: "拖单个子对象", body: "默认不吸同组兄弟，避免组内排版被意外拉动；需要时提供显式的组内对齐模式。" },
          { label: "拖整个组", body: "以组包围盒 / 中心作为目标参与外部吸附，并排除组内所有子对象，避免吸到自己。" },
          { label: "跨组 / 跨 Frame", body: "自由排版可允许同画板跨组；模板编辑默认限制在当前 Frame。坐标统一到 world space，结果仍遵守裁剪与父级约束。" },
        ] },
        { title: "进阶难点四：视口外对象要不要成为目标", problem: "用户看不到的对象如果仍能强力吸附，拖动结果会像被看不见的磁铁拉走；但完全忽略视口外目标，又可能让同一画板上的连续排版失去对齐。", demo: "viewport", table: {
          headers: ["范围", "是否参与", "产品规则"],
          rows: [
            ["当前可见对象", "参与", "按本地编辑上下文与正常阈值匹配"],
            ["视口外、同画板", "有条件参与", "目标足够近且上下文一致；限制修正距离，避免看不见的目标拖走对象"],
            ["画板外对象", "默认不参与", "除非产品明确支持跨画板排版，否则不作为画板内吸附目标"],
          ],
        }, body: "视口裁剪影响显示和查询效率；画板边界才是版式语义。缩放时感知阈值保持屏幕像素稳定。" },
        { title: "进阶边界：旋转、缩放、多人协同", problem: "轴对齐矩形、缩放控制点和远端协同更新会改变吸附参照。若仍把普通未旋转矩形当作唯一几何，吸附线可能看起来对齐、实际却偏离对象边缘。", demo: "transform", cards: [
          { label: "旋转对象 / 选哪种几何", body: "轴对齐包围盒实现简单，但会出现视觉上的“空中对齐”；旋转边或局部锚点更精确，需要处理角度与投影。" },
          { label: "缩放对象 / 吸哪个点", body: "吸附用户正在拖的控制点，并遵守对边、中心或比例约束；不能只修正左上角坐标。" },
          { label: "多人更新 / 目标会变化", body: "一次手势内固定候选快照，或只在未锁定时节流更新远端目标；提交为一个原子操作，取消只清预览。" },
        ] },
        { title: "不同编辑器，吸附规则也不同", table: {
          headers: ["产品场景", "优先规则", "给用户的控制"],
          rows: [
            ["海报 / PPT 自由排版", "边、中心、间距；同画板跨组", "临时关闭吸附；解释吸附对象"],
            ["表单 / 低代码画布", "网格、容器边界、父级约束", "少量默认规则；降低自由吸附"],
            ["像素级设计工具", "对象吸附与像素网格分开", "分别命名、分别开关"],
            ["专业工具 vs 轻量工具", "前者支持可配置策略；后者精选默认值", "规则可预测，不暴露无关模式"],
          ],
        } },
        { title: "Figma、Konva、Fabric：公开资料怎么用", table: {
          headers: ["平台 / 资料", "可借鉴", "不要据此推断"],
          rows: [
            ["Figma 产品与帮助文档", "对象边 / 中心吸附、像素网格、Guide 作用域、临时关闭；Multi-Edit 的父 Frame 相对对齐", "生产候选索引、触发阈值、冲突优先级"],
            ["Konva 官方示例", "Stage 与对象锚点、距离筛选、画线、位置修正的算法骨架", "复杂编辑器的完整生产策略"],
            ["Fabric AligningGuidelines", "在 Fabric 对象模型上接入辅助线的实现入口", "适用于所有场景的默认规则"],
          ],
        } },
        { title: "验收清单：用任务验证规则", checks: [
          "缩放 50% / 100% / 200%：屏幕触发距离保持一致",
          "多候选：左右 / 上下及边、中心竞争时结果稳定",
          "去噪：重合候选合并，只显示少量赢家线",
          "层级：组内、跨组、跨 Frame、整组移动符合预期",
          "边界：视口外与画板外目标按不同规则处理",
          "对象：旋转、多选、锁定、隐藏、缩放均有明确结果",
          "中断：快速拖动、失焦、取消、Undo 与远端更新能正确收尾",
          "可理解：用户能知道吸到谁、为什么，也能轻松摆脱",
        ] },
        { title: "总结：三种线，各有职责", cards: [
          { label: "定义清楚", body: "Guide 持久；Grid 提供步长；Smart Guide 只在操作时反馈命中。" },
          { label: "计算可解释", body: "世界坐标算几何，屏幕像素定阈值，候选过滤与排序决定赢家。" },
          { label: "交互可控", body: "标明吸附目标与作用域；支持关闭、取消和可靠 Undo。" },
        ] },
      ],
      sources: [
        { label: "Figma Help · Snap to objects、pixel grid 与关闭吸附", href: "https://help.figma.com/hc/en-us/articles/360039956914-Adjust-alignment-rotation-position-and-dimensions" },
        { label: "Figma Help · 画布与 Frame 级 Guides", href: "https://help.figma.com/hc/en-us/articles/360040449713-Add-guides-to-the-canvas-or-frames" },
        { label: "Figma Blog · Guides 功能的需求背景、作用域与交互细节", href: "https://www.figma.com/blog/figma-now-has-guides/" },
        { label: "Figma Blog · Smart Selection / Tidy Up 如何降低重复排版操作", href: "https://www.figma.com/blog/introducing-smart-selection/" },
        { label: "Figma Blog · Multi-Edit：跨 Frame 相对对齐的产品决策", href: "https://www.figma.com/blog/behind-the-feature-the-multiple-lives-of-multi-edit/" },
        { label: "Figma Help · Layout Guides：网格、列与行", href: "https://help.figma.com/hc/en-us/articles/360040450513-Create-layout-guides" },
        { label: "掘金 · 可视化拖拽编辑器复盘：实时参考线、吸附与标尺", href: "https://juejin.cn/post/6941657971650887716" },
        { label: "Fabric.js · 官方扩展入口与 AligningGuidelines 源码", href: "https://github.com/fabricjs/fabric.js" },
        { label: "Konva · Snapping and Alignment Guides 示例", href: "https://konvajs.org/docs/sandbox/Objects_Snapping.html" },
        { label: "Konva · Resize snapping 与锚点约束", href: "https://konvajs.org/docs/select_and_transform/Resize_Snaps.html" },
      ],
    },
  },
  {
    id: "editor-undo-redo",
    title: "编辑器的撤销与重做如何设计",
    article: {
      kicker: "EDITOR SYSTEMS / FIELD NOTE 003",
      title: "Undo / Redo：把编辑器变成可以放心试错的系统",
      summary: "撤销不是把页面倒回上一张截图，而是定义哪些用户意图可逆、如何分组、如何恢复上下文，以及并发与副作用如何处理。",
      tags: ["命令与逆操作", "History grouping", "Redo branch", "协同选择性撤销"],
      illustration: "history-stack",
      sections: [
        { title: "先定义用户承诺：撤销的是什么", body: "用户按下 ⌘Z / Ctrl+Z，预期的是“撤回我刚才的一步有意义的编辑”，不是撤回任意一次状态刷新。移动对象、输入一段文字、批量改主题、AI 应用一页草稿，可能都是一个用户意图；光标闪烁、hover、自动保存状态、远端同事的改动通常不应混入本人的本地撤销。撤销功能的第一份设计产物应是可逆操作范围表，而不是先选一个数组或库。" },
        { title: "区分文档状态、编辑器状态与外部副作用", body: "文档状态包括页面、对象、文本、样式和顺序；编辑器状态包括选区、光标、活动工具、视口与面板；外部副作用包括发布、发邮件、扣费、写入第三方系统。前两类可以在明确策略下恢复；第三类不一定能通过反向操作安全撤回，往往需要补偿动作、再次确认或审计记录。把三者混成一个全量快照，会出现“撤销了 UI 却没撤销服务端动作”或“Undo 让光标跳到无关位置”的错觉。" },
        { title: "四种实现路线：根据文档复杂度选，不按流行度选", body: "快照历史保存每次提交后的完整文档，逻辑直观，适合小型对象图或早期 MVP；代价是大文档复制、序列化与内存开销。命令历史保存可执行操作及参数；正向命令易重放，但必须设计可靠的逆命令。Patch / 反向事务记录变更前后的局部数据，通常节省空间并支持精细撤销，但需要处理引用、嵌套和结构变更。CRDT/协同历史则按本地操作来源做选择性撤销，适用于并发编辑，却不是“恢复某一整份旧 JSON”。实际产品可组合：短周期本地 Undo 用命令/CRDT undo manager，跨会话版本回退用快照，两者目标不同。" },
        { title: "用一张图理解 Undo 与 Redo 的分支", body: "Undo 把当前动作反向应用，并将该动作移到 redo 栈；此后若用户继续编辑，旧 redo 分支就失效。" },
        { title: "一条历史记录必须足以安全地反向执行", body: "以“把卡片从 x=120 拖到 x=260”为例，历史记录至少需要稳定 objectId、前后 transform、所属 page/frame、文档版本/事务边界和触发来源。Undo 不是把 x 改回 120 就结束：如果对象已被删除、被远端移动、父级变换变化，或当前权限已不允许修改，逆操作需要被映射、拒绝或转成可解释冲突。批量操作要么作为原子事务整体回退，要么明确允许部分失败，不能静默只撤掉一半。" },
        { title: "输入分组决定用户觉得 Undo 是否‘聪明’", body: "逐字符记录会让用户按几十次 Undo 才撤掉一句话；把所有短时间改动合成一步，又会把两件无关动作合并。常见策略会同时看时间间隔、编辑位置相邻性、输入类型和显式事务边界。连续输入同一段可合并；光标跳到另一段、执行格式命令、粘贴、切换对象或开始一次拖动，应建立新边界。ProseMirror 用相邻变更范围和时间窗分组；Tiptap 暴露 newGroupDelay；Yjs UndoManager 提供 captureTimeout 与 stopCapturing。参数只是起点，最终分组规则要通过真实编辑任务验证。" },
        { title: "重做栈不是永久保存：新编辑会改写未来分支", body: "历史可以抽象成 past / present / future。用户先做 A、B、C，撤销 C 后 future 中有 C；若此时新做 D，原来的 C 已不再是当前路径的可重做结果，必须清空 redo future。否则用户重做会让旧分支覆盖新分支。撤销本身不能作为新的普通编辑又压回 undo 栈；实现需要标注 undo/redo 事务，避免历史插件把逆操作再次当作新用户动作记录。" },
        { title: "协同编辑：撤销自己的贡献，不回滚全房间", body: "共享文档里，用户 A 修改标题后，用户 B 同时调整了字号。若 A 按 Undo 直接恢复整个旧快照，B 的字号也会被一起抹掉。协同撤销应选择性反转当前用户所做的本地操作，并在必要时把逆操作映射到已更新状态；远端操作默认不进入 A 的本地 undo 栈。ProseMirror 的 history 以事务映射保留后续变更，Yjs UndoManager 可按 trackedOrigins 追踪来源；Tiptap Collaboration 使用自己的协同历史，避免撤销他人修改。Figma 的公开方案提供了一个重要的产品不变量：用户连续 Undo、复制内容，再 Redo 回到当前时，文档不应因此改变；为此它在 Undo 时同步调整 Redo 历史，Redo 时也调整 Undo 历史，避免简单“重放我的旧值”覆盖协作者后来写入的值。这个语义比单人编辑器的两栈实现更复杂，必须用多人交错操作用例验证。" },
        { title: "恢复光标、选区与视口，但别把所有界面都冻住", body: "文本编辑 Undo 后，光标通常应回到被修改位置；画布对象 Undo 后，合理的选中对象和视口上下文也应恢复。可为历史项附带 selection bookmark、对象 ID、焦点域和必要的 viewport 元数据，但恢复时必须校验对象仍存在、节点结构仍合法。工具栏展开状态、侧边面板临时滚动位置是否随历史恢复，应由用户预期决定，不宜把整个应用 store 原封不动拍快照。" },
        { title: "常见故障与解法", body: "一次拖动生成数百条历史：pointermove 只更新预览，pointerup 才提交一个事务。Undo 后再编辑仍能 redo 出旧结果：新提交时清空 future。加载图片或自动布局导致 Undo 误撤：给异步派生更新打上非用户事务来源，或并入原操作边界。协作 Undo 删除别人新建的对象：按 actor/origin 选择性撤销，不全量恢复文档。重做结果与原操作不同：记录确定性输入/资源引用，或对非确定操作（AI、随机布局、外部数据）保存实际生成的变更，而不是重跑算法。" },
        { title: "验证标准：测试‘用户动作’，不只测栈长度", body: "验收应覆盖：连续输入分组、跨段编辑、格式与粘贴边界、拖动一次撤一次、批量应用原子性、撤销后新编辑清空重做、撤销到文档初始态、快捷键与菜单一致、焦点在输入框时快捷键不误拦截、保存后 Undo 策略明确、资源异步加载、远端并发修改、权限被回收和历史深度上限。每个 case 都要断言最终文档、选区、undoDepth/redoDepth 与协作副作用，而不只是按钮是否变灰。" },
        { title: "产品壁垒：让每一步都可预期、可解释、可恢复", body: "历史引擎本身往往不是护城河；真正的差异来自操作边界是否符合创作意图、组合操作是否完整、协作时是否不破坏他人贡献，以及用户能否在 AI、拖拽、自动布局和异步资源之间放心试错。高质量编辑器会把 Undo 当作每项编辑能力的设计约束：新功能上线前就回答它能否撤销、是否合并、如何重做、对远端是否可见、失败时怎么恢复。" },
      ],
      sources: [
        { label: "ProseMirror Guide · history、反向事务与 addToHistory", href: "https://prosemirror.net/docs/guide/" },
        { label: "Yjs · UndoManager、trackedOrigins 与 captureTimeout", href: "https://docs.yjs.dev/api/undo-manager" },
        { label: "Tiptap · Undo/Redo 分组与协同历史边界", href: "https://tiptap.dev/docs/editor/extensions/functionality/undo-redo" },
        { label: "Konva · Canvas 文档模型快照与单次动作提交", href: "https://konvajs.org/docs/posts/canvas-undo-redo.html" },
        { label: "Figma Engineering · 多人协同时 Undo 如何保护他人后续编辑", href: "https://www.figma.com/blog/how-figmas-multiplayer-technology-works/" },
        { label: "Figma · Multiplayer Editing：早期协同冲突与 Undo/Redo 设计复盘", href: "https://www.figma.com/blog/multiplayer-editing-in-figma/" },
      ],
    },
  },
  {
    id: "editor-from-zero",
    title: "从零到一设计一款编辑器",
    article: {
      kicker: "EDITOR SYSTEMS / FIELD NOTE 004",
      title: "从零到一设计编辑器：先定义创作系统，再造画布",
      summary: "以 PPT / 海报 / H5 / 富文本为例，从用户任务、文档语义、交互状态、数据闭环到协作与 AI，搭出可迭代的编辑器产品骨架。",
      tags: ["产品策略", "文档内核", "编辑工作流", "架构与发布"],
      illustration: "editor-blueprint",
      sections: [
        { title: "第一步不是画工具栏：选定用户、产物和高价值任务", body: "先明确服务谁、替代什么工作、产物最终在哪里使用。演示文稿作者可能从大纲到可讲述的 Deck；运营同学要快速产出符合品牌规范的多尺寸海报；H5 制作者要做带交互、可预览可发布的页面；知识工作者需要结构化文字和稳定协作。把“做一份作品”拆成导入/创建、起稿、组织结构、精修、审核、交付、复用等任务，观察当前最耗时、最易错或最难协作的步骤。没有清晰的高频任务，功能清单就只会堆成熟产品的按钮。" },
        { title: "划定编辑器边界与成功标准", body: "写清楚编辑器做什么、明确暂不做什么：是专注单页创作还是多页叙事？交付是 PNG/PDF/PPTX/网页，还是可复用的在线文档？用户是否需要模板、素材市场、品牌资产、评论审批和多人协同？将价值目标转成指标，例如从空白到首个可用稿的时间、首次导出成功率、重复编辑耗时、二次打开后的保真率、发布失败率。把“体验很顺”拆成可观察的任务结果和质量门槛。" },
        { title: "Figma Auto Layout 案例：从重复劳动到可理解的能力模型", body: "Figma 对 Auto Layout 的公开复盘可以当作一条完整的产品决策链：先观察到改一个按钮文案就要手工调整按钮、兄弟元素和容器尺寸的重复劳动；团队用“flexbox 的有用子集”作为原则，在表达力和易学性之间设边界；当用户需要 stretch 后，原来“先排子项、再计算容器”的单向布局假设失效，因为子项尺寸开始依赖容器，布局引擎必须处理双向约束；UI 又要避免 Auto Layout 与 Constraints 面板重复、互相矛盾，于是最终合并相关控制，并为既有文件设计迁移以保留旧行为。这里的启发是：编辑器能力要从反复发生的用户任务抽象模型；每加一个高级能力，都要重新检视数据依赖、交互表达和历史文档兼容，而不是只给属性面板增加一个开关。", },
        { title: "为不同编辑器选择正确的文档语义", body: "PPT 的核心不仅是画布对象，还包含页序、演讲结构、主题和母版；海报偏自由定位、字体、图片裁切与固定尺寸导出；H5 还要保存组件树、响应式约束、事件和路由；富文本则以段落、标题、列表、表格等 schema 以及光标/选区语义为核心。先画实体关系和生命周期，再决定字段：document、page/frame、node/block、asset、style/token、interaction、version。稳定 ID、父子关系、约束、资源引用、schema 版本和迁移策略应在 MVP 就纳入，不要依赖 Canvas 节点树作为唯一真相。" },
        { title: "架构图：一份语义文档，多个消费系统", body: "产品核心应围绕可校验的文档模型与编辑事务组织；Canvas/DOM 是呈现方式，不是业务数据的唯一来源。" },
        { title: "设计内核：命令、状态、约束与渲染分离", body: "推荐把编辑动作建模为命令/事务（InsertNode、MoveNodes、UpdateText、ApplyTheme 等），统一负责校验、应用、逆操作、历史记录、自动保存和协同同步。命令读取 document state 并产出 next state；渲染层订阅变化做局部更新；属性面板、快捷键、菜单、AI 工具调用同一命令接口，避免每条入口写一套规则。临时交互状态（框选、拖拽预览、光标、缩放）不必每帧写进持久文档。" },
        { title: "交互系统不止画布：定义模式与冲突规则", body: "先建立选择、文本编辑、绘图、缩放平移、框选、多选和演示/预览等模式状态图；说明 Esc、Enter、双击、快捷键、空白点击如何改变模式。随后定义对象命中顺序、锁定/隐藏对象、父子选取、组合、图层、吸附与参考线、剪贴板、键盘微移、焦点与 IME。常见事故是快捷键在输入框里误触发全局命令，或双击文字后框选仍抢事件；需要以焦点域和事件冒泡策略作统一约束。" },
        { title: "编辑能力要形成完整闭环，而不是孤立按钮", body: "围绕目标任务逐条画端到端流程：创建/导入 → 编辑 → 暂存/自动保存 → 再次打开 → 协作审阅 → 导出/发布 → 复用/版本回退。每条流程标出空态、加载、失败、冲突、权限不足、字体或素材缺失、浏览器刷新、网络断开等异常态。定义导入支持矩阵和导出保真度；必要时将“可编辑工程文件”和“最终导出物”作为不同交付合同。" },
        { title: "保存、历史与版本是三套相连但不同的机制", body: "Undo/Redo 是当前编辑会话中短周期回退；自动保存负责把当前文档状态可靠落盘；版本历史用于跨会话审计、比较和恢复。需要定义本地草稿、服务端持久化、冲突检测、重试与幂等、恢复点和迁移。离线恢复不能只保住 JSON，还要处理上传中的资源、字体引用和 schema 升级。撤销文章中展开了操作分组、逆操作、协同 Undo 等细节，产品范围应在这里统一决定。" },
        { title: "协作与权限要从资源模型开始规划", body: "先确定团队/项目/文档/页面/素材等资源边界，再定义查看、评论、编辑、分享、导出、发布、管理成员等动作。随后才选 OT/CRDT 或服务端操作流，决定权限校验、Presence、邀请与撤权、离线重连、并发冲突、版本归属和审计。单人 MVP 也要避免把 actor、owner、resourceId、operation 这些未来必需信息写死成不可扩展结构，但不一定首版就上线实时协同。" },
        { title: "导入导出、资源与字体常是隐形主工程", body: "每个格式都要有能力支持矩阵：哪些节点可导入、哪些属性可映射、哪些需要降级、如何报告损失；导出则覆盖字体替换、透明度、裁切、图表、分页、尺寸、色彩空间与大文件。图片/视频/字体应进入资源服务与生命周期管理，处理上传中断、重复上传、授权、引用计数、预览尺寸和失效资源。不要用“导出按钮成功触发”代替文件可打开、版式符合预期的验证。" },
        { title: "性能、安全与无障碍属于产品底座", body: "定义代表性大文档和目标设备，测加载、输入延迟、拖动帧时间、选取/命中、自动保存、导出和长时内存；对渲染、资源解码、Worker、空间索引做按数据驱动的优化。安全方面校验导入文件、图片 URL、SVG、富文本、插件和 AI 生成内容，防止脚本注入与越权资源读取。键盘可操作、屏幕阅读器语义、对比度、减少动态效果也要进入验收，尤其当舞台由 Canvas 绘制时需要同步的可访问对象/替代导航。" },
        { title: "AI 是新操作入口，不是另一套编辑器", body: "AI 应调用同一文档读取和命令接口：先拿到受权限约束的上下文，再产生 schema 合法的草稿/操作差异，预览、校验后原子应用。保留来源与模型版本，支持逐项采纳、拒绝和 Undo；运行期间文档版本变化时做冲突检测。先从标题改写、选区润色、页面大纲、布局建议等边界清晰的动作起步，再评估整稿生成与 Agent 多步任务。不能让模型返回的 HTML/Canvas 像素绕开文档模型、权限、历史和安全校验。" },
        { title: "MVP 路线：先做能交付的窄闭环，再扩展平台能力", body: "第一阶段挑一个核心 persona、一种文档和一条高频任务，只实现能创建、编辑、保存、重新打开、导出并恢复误操作的最小闭环。第二阶段补齐团队模板、资源管理、协作审阅或多格式导入中最能改善任务指标的一项。第三阶段再扩展插件/Agent、复杂权限和企业治理。每阶段都有进入条件、体验指标、技术预算和退出标准；把“未来可能需要”与“当前用户验证过”分开，避免基础架构过早平台化，也避免原型式实现无法升级。" },
        { title: "如何知道它真的从 0 到 1 了", body: "用一份真实任务验收：目标用户从空白/导入开始完成作品，知道下一步做什么；对象可准确选择和修改；保存后刷新/换设备仍可恢复；导出与目标格式一致；出现失败可理解并恢复；高频操作有一致撤销；无权限用户无法读取或修改；真实文档规模下仍满足响应预算。再看留存、首次价值时间、任务完成率、返工/撤销率和支持工单。编辑器的 0→1 不是把 Canvas 画出来，而是让创作资产可以持续生产、编辑、协作、交付和复用。" },
      ],
      sources: [
        { label: "ProseMirror · schema、state、transaction 与编辑器插件", href: "https://prosemirror.net/docs/guide/" },
        { label: "Konva · Canvas Editor：从对象模型到可运行编辑器", href: "https://konvajs.org/docs/sandbox/Canvas_Editor.html" },
        { label: "Konva · 文档模型与 Canvas 序列化边界", href: "https://konvajs.org/docs/data_and_serialization/Best_Practices.html" },
        { label: "Figma Help · 对齐、尺寸、图层与网格行为", href: "https://help.figma.com/hc/en-us/articles/360039956914-Adjust-alignment-rotation-position-and-dimensions" },
        { label: "Figma Engineering · 专业级 Web 设计工具的渲染与文本布局取舍（2015）", href: "https://www.figma.com/blog/building-a-professional-design-tool-on-the-web/" },
        { label: "Figma Product / Engineering · Auto Layout 从用户痛点到布局引擎的演进", href: "https://www.figma.com/blog/behind-the-feature-the-making-of-the-new-auto-layout/" },
        { label: "Figma Engineering · 多人协同、对象树与并发 Undo 的生产实践", href: "https://www.figma.com/blog/how-figmas-multiplayer-technology-works/" },
        { label: "Figma Engineering · 增量日志、检查点与协同文件可靠性", href: "https://www.figma.com/blog/making-multiplayer-more-reliable/" },
      ],
    },
  },
  {
    id: "editor-collaboration",
    title: "编辑器在线协同与权限设计",
    article: {
      kicker: "EDITOR SYSTEMS / FIELD NOTE 005",
      title: "在线协同不只是把文档广播给所有人",
      summary: "协同需要同时设计共享数据、并发合并、在线状态和授权边界；四者不是同一个机制。",
      tags: ["OT / CRDT", "Presence", "RBAC / ABAC", "权限服务端校验"],
      sections: [
        { title: "先定义协作粒度", body: "富文本需要处理字符插入、删除、格式和选区；画布还要同步对象创建、属性变更、重排、组合和删除。先明确“共享文档”里哪些状态是持久内容、哪些只是临时界面状态，再决定操作粒度。把整份 JSON 每次覆盖广播，看似简单，却很容易在并发编辑时丢失他人更新。" },
        { title: "并发合并：OT 与 CRDT 是方案，不是产品功能", body: "Operational Transformation（OT）通常围绕中心协调序列化/变换操作；CRDT 通过数据结构和合并规则，让不同副本收到更新后收敛。具体取舍取决于文档结构、离线能力、服务端控制、历史与编辑器绑定。字符级富文本和自由布局对象并非同一种冲突问题；对同一对象的宽高、文本和删除同时发生时，产品仍要定义冲突策略，不能假设算法替产品做完所有决策。" },
        { title: "内容同步与 Presence 分离", body: "文档内容和操作历史需要持久化；在线成员、光标、选区、正在编辑哪个对象等 Presence 通常是短生命周期状态，不应混进文档版本。可以按房间同步文档更新，另用 presence 通道显示协作者；用户离线、重连、刷新或切换页面时，要清理过期状态并恢复需要的持久内容。" },
        { title: "Figma 的公开案例：协同算法与可靠性是两层问题", body: "Figma 2019 年公开的多人编辑文章描述了一种面向图层对象树的方案：服务端按对象属性协调并发写入；对象层级顺序用 fractional indexing 表达；同一属性冲突按服务端收到的最新值处理。文章也明确指出，这种取舍不适合需要多人逐字合并同一文本字段的场景。Undo/Redo 另有专门策略：撤销和重做会动态改写彼此的历史，避免用户撤销后复制内容、再重做回当前时把同事后续修改覆盖。2022 年可靠性文章则讲了另一层：WebSocket multiplayer 服务负责校验、排序、冲突处理，增量 journal 与周期 checkpoint 组合，用于故障恢复。它们是 Figma 在特定文档模型和规模下公开的决策，不是所有协同编辑器都应照搬的通用答案。" },
        { title: "权限必须落到服务端", body: "产品先定义资源范围（团队、项目、文档、页面、素材）和角色动作（查看、评论、编辑、分享、导出、删除、管理成员）。界面隐藏按钮只能改善体验，不能作为安全边界；服务端每次加入协作房间、读取/写入操作、导出和分享都要检查主体、资源与动作。还要设计邀请过期、链接访问、成员降权/移除后的连接撤销，以及素材的继承权限。" },
        { title: "协同体验验收", body: "至少覆盖同一对象并发拖动、不同属性并发修改、删除与编辑冲突、断网离线后重连、重复消息、撤销语义、权限被收回、跨团队访问和历史恢复。协作者光标不等于授权；收到合法同步包也不代表当前用户有权执行任何后续操作。先选一种数据模型与权限矩阵，再把冲突行为变成可验证规则。" },
      ],
      sources: [
        { label: "Yjs · 协同编辑器与网络 Provider", href: "https://docs.yjs.dev/getting-started/a-collaborative-editor" },
        { label: "Yjs · Awareness 与临时 Presence", href: "https://docs.yjs.dev/getting-started/adding-awareness" },
        { label: "ProseMirror · Collaboration 模块", href: "https://prosemirror.net/docs/guide/#collab" },
        { label: "Figma Engineering · 多人协同算法、对象树与并发撤销", href: "https://www.figma.com/blog/how-figmas-multiplayer-technology-works/" },
        { label: "Figma Engineering · Multiplayer 的 journal、checkpoint 与故障恢复", href: "https://www.figma.com/blog/making-multiplayer-more-reliable/" },
        { label: "Figma Engineering · 有序图层的 Realtime Editing / Fractional Indexing", href: "https://www.figma.com/blog/realtime-editing-of-ordered-sequences/" },
      ],
    },
  },
  {
    id: "editor-performance",
    title: "编辑器如何考虑性能问题",
    article: {
      kicker: "EDITOR SYSTEMS / FIELD NOTE 006",
      title: "编辑器性能要沿着一次操作完整测量",
      summary: "不要只盯着 Canvas 绘制耗时；输入延迟、命中检测、内存、自动保存与导出都属于编辑器性能。",
      tags: ["Frame time", "命中检测", "增量渲染", "内存预算"],
      sections: [
        { title: "先定义场景和指标", body: "选取真实代表文档：页面数、对象数、图片分辨率、滤镜、字体和典型编辑动作。测冷启动/打开时间、键入到画面响应的延迟、拖动帧时间、命中检测时延、保存/导出耗时和内存峰值，并在目标低配设备与高 DPR 屏幕验证。平均 FPS 不足以解释偶发卡顿，也不能反映长时间编辑后的内存增长。" },
        { title: "少算、少画、少创建", body: "把静态背景与活动对象分层，数据未变化时不重绘；视口外对象可以跳过渲染，命中检测使用空间索引而非每次线性扫描全部对象。复杂且稳定的对象可缓存成位图，但内容变化要正确失效缓存；大量图层或缓存同样消耗显存/内存，因此先测再加。拖拽时可把活动对象移到专用层，避免刷新整页。" },
        { title: "像素比和资源管理", body: "Canvas backing store 的像素量大致随宽 × 高 × DPR² 增长，盲目按 Retina 的完整 DPR 创建多个全屏图层会快速吃掉内存。按设备设像素比上限，并在质量、清晰度、内存之间验证。图片要解码、缩放和缓存；超大资源可生成多尺寸预览，关闭页面或替换资源时释放缓存与 GPU 纹理。" },
        { title: "主线程、Worker 与交互", body: "把纯计算、缩略图或可独立绘制任务移到 Worker 的前提是数据可传输、不会依赖 DOM，并且通信开销值得。OffscreenCanvas 可转移到 Worker 绘制，但并非所有编辑器 UI 都适合整体迁移。文本输入、IME、光标、选择框和菜单仍要确保主线程响应；对复杂编辑器而言，增量模型更新和避免 React 全量重渲染通常比“把全部东西放 Worker”更现实。" },
        { title: "用真实瓶颈指导优化", body: "先用性能面板和长任务/帧时间定位瓶颈，区分脚本计算、绘制、图片解码、布局、网络和垃圾回收。逐项优化后重放同一份文档、同一设备和同一操作轨迹。设置性能预算与回归用例，避免只在空白模板上流畅、真实大文档却不可用。" },
        { title: "Figma 的工程复盘：性能优化必须配套测量系统", body: "Figma 公开的性能工程文章显示，图形编辑器的瓶颈不只在 CPU：GPU、CPU-GPU 数据搬运和真实设备差异都会改变结果。其团队采用云端 GPU 浏览器测试捕捉明显回归，再用真实设备定位细微问题；测试包含本地编辑和模拟多人更新，并结合 CPU profile。WebGPU 迁移文章还记录了兼容 WebGL 的渐进发布、跨 Windows/Mac/ChromeOS 基准测试、识别回归场景后再优化，并按 GPU/OS/浏览器监控 rollout。可借鉴的是“先建稳定测量与回滚机制，再做渲染优化”，不是把 WebGPU 当作所有编辑器的默认答案。" },
      ],
      sources: [
        { label: "MDN · Canvas 性能优化", href: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas" },
        { label: "MDN · OffscreenCanvas 转移到 Worker", href: "https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvasRenderingContext2D" },
        { label: "Konva · 图层、命中检测与内存优化", href: "https://konvajs.org/docs/performance/All_Performance_Tips.html" },
        { label: "Figma Engineering · Keeping Figma Fast：性能测试基础设施与本地/多人场景", href: "https://www.figma.com/blog/keeping-figma-fast/" },
        { label: "Figma Engineering · WebGPU 渲染迁移、跨设备基准与分阶段发布", href: "https://www.figma.com/blog/figma-rendering-powered-by-webgpu/" },
        { label: "Figma Engineering · 大型文件的图层面板缓存与计算优化", href: "https://www.figma.com/blog/improving-performance-in-the-layers-panel/" },
      ],
    },
  },
  {
    id: "editor-ai",
    title: "新时代 AI 与编辑器结合的实践",
    article: {
      kicker: "EDITOR SYSTEMS / FIELD NOTE 007",
      title: "让 AI 生成可编辑的内容，而不是一张不可改的图",
      summary: "AI 与编辑器结合的关键，是把自然语言意图转成受约束、可预览、可撤销的原生文档操作。",
      tags: ["结构化输出", "编辑器命令", "Human-in-the-loop", "可撤销"],
      sections: [
        { title: "先选 AI 的介入层级", body: "常见入口包括整份内容生成、基于选区改写、当前对象的局部调整、版式建议、主题/模板匹配、素材生成和批量统一风格。先决定 AI 是给建议、产出草稿，还是能直接执行操作；不同风险对应不同授权、预览和确认机制。不要把“接上模型”本身当作产品价值。" },
        { title: "模型输出要映射到文档模型", body: "向模型提供必要上下文：用户意图、选中的页面/对象、主题约束、可用组件、字数与尺寸限制。输出使用受约束的 JSON / tool schema，再由应用校验类型、字段、资源引用和业务规则，映射成编辑器自己的节点与命令。不要让模型直接输出 Canvas 像素或任意脚本作为唯一产物，否则内容难以继续编辑、验证和协作。" },
        { title: "先预览差异，再安全应用", body: "把 AI 结果作为草稿或 operation diff 展示：新增、替换、移动、改样式分别可见；用户可逐条采纳、拒绝或撤销。应用时作为一个原子事务进入编辑器历史，记录来源与生成版本。如果用户生成期间继续手动修改文档，要基于新的版本重算或提示冲突，不能用旧快照静默覆盖新编辑。" },
        { title: "AI Agent 如何调用编辑器能力", body: "将有限、明确的编辑能力封装为工具，例如读取当前页面摘要、创建文本框、改写选中文本、统一标题样式、生成页面草稿。每个工具校验参数和权限，限制作用范围与批量规模；外部副作用（发布、分享、覆盖）要求明确确认。模型提出调用，应用负责执行、回传结果并决定是否继续，不能把模型返回的函数参数视为已执行结果。" },
        { title: "衡量是否真的帮到创作", body: "评估从用户意图到可用结果的时间、首次生成可用率、编辑后采纳比例、撤销率、结构校验失败率和不同类型文档的质量；同时检查事实来源、版权、隐私、提示注入和不支持能力。AI 的理想定位是缩短起稿与重复操作，而编辑器仍提供可控、可解释、可恢复的最终创作权。" },
      ],
      sources: [
        { label: "OpenAI API · Function calling 与工具 schema", href: "https://developers.openai.com/api/docs/guides/function-calling" },
        { label: "OpenAI API · Structured Outputs", href: "https://developers.openai.com/api/docs/guides/structured-outputs" },
        { label: "ProseMirror · 可检查并重放的文档 Transform", href: "https://prosemirror.net/docs/guide/" },
      ],
    },
  },
];

const articleSections = [
  {
    id: "observation",
    title: "先区分两件事：对话记录与 Agent 执行状态",
    body: "最简单的聊天只是把一组有序消息交给模型，再把模型返回的消息展示出来。Agent 则通常还有运行状态：当前执行到哪个步骤、调用过哪些工具、等待谁批准、有哪些可恢复的检查点。因此，编辑已发送消息不只是改 transcript（对话记录），还要确定哪些下游回答、工具结果和运行状态仍然有效。",
  },
  {
    id: "data-model",
    title: "常见数据模型：消息版本、分支与运行记录",
    body: "一个可追溯的 Agent 产品，常把对象拆开管理，而不是把整段聊天当成一条可覆盖的文本：Conversation/Thread 标识会话；Message 保存用户或助手内容；Revision 记录某条消息的修订版本；Branch 表示从哪个历史节点继续；Run 表示一次 Agent 执行；ToolCall 与 ToolResult 记录工具请求和返回；Checkpoint 保存可恢复的流程状态。字段名称因产品而异，关键是能回答“这条回答基于哪个输入版本、哪条历史路径、哪次运行”。",
    code: `// 简化的数据关系示意，不是特定框架的真实 schema\nMessageRevision { messageId, revision, content, attachments }\nBranch          { id, parentBranchId, forkedAfterMessageId }\nRun             { id, branchId, inputRevisionId, status, checkpointId }\nToolCall        { runId, callId, name, args, status, idempotencyKey }`,
  },
  {
    id: "edit-semantics",
    title: "编辑历史轮次：从编辑点分叉或让后缀失效",
    body: "假设第 4 轮被改写，第 5～8 轮可能都依赖旧的第 4 轮回答。通用做法有两类：线性模式把编辑点之后的消息标为失效/移出当前路径，再从新输入重算；分支模式保留旧路径，并从第 3 轮之后建立新 branch。前者界面简单，后者可回看和比较。无论哪种，模型的新请求都应使用编辑点之前仍有效的历史 + 新版本输入，而不能把旧回答及其下游内容误当作新路径的上下文。",
  },
  {
    id: "context-builder",
    title: "上下文构建：不是把所有历史原样塞回模型",
    body: "执行器通常先根据当前 branch 取有效历史，再组合 system/developer 指令、用户消息、必要的记忆和检索片段，并按上下文窗口预算做裁剪或摘要。检查点可以恢复流程状态，但发给模型的 prompt 是一次运行所需的上下文视图，两者不是同一份数据。若编辑发生在某个摘要覆盖的历史范围内，相关摘要或记忆也要重建/失效，否则新回答可能继续受到旧输入的影响。",
  },
  {
    id: "agent-loop",
    title: "Agent 循环：模型提出工具调用，编排层负责执行",
    body: "在常见 tool-calling 架构里，模型可以返回最终答复，也可以返回结构化工具调用（工具名与参数）。编排层负责校验参数、检查权限/审批、执行工具，再把 ToolResult 作为新上下文交回模型；模型可能继续调用工具，也可能结束并给出最终答复。工具调用本身不等于工具已经执行，工具结果也不等于最终答案。编辑后通常从受影响的执行点重新运行，而不是只替换屏幕上的最后一段文字。",
    code: `while (run.status === "running") {\n  const step = await model.generate(context, availableTools);\n  if (step.type === "final") return persistAnswer(step);\n\n  const call = validateAuthorize(step.toolCall);\n  const result = await toolExecutor.execute(call, { idempotencyKey });\n  persistToolCallAndResult(call, result);\n  context = appendToolResult(context, call, result);\n}`,
  },
  {
    id: "lifecycle",
    title: "运行生命周期：取消旧 run，避免迟到结果污染新分支",
    body: "运行状态常见为 queued → running → waiting_tool/approval → completed、failed 或 cancelled。编辑时，前端可以先乐观显示新版本；服务端应请求取消旧 run，并为新执行创建新的 runId/inputRevisionId。每个流式事件都带 runId 和 branch/version 标识，客户端只接收当前有效运行的事件。因为取消信号不一定能撤回已经发生的网络或工具副作用，工具端还需要幂等键、权限门禁、补偿动作或人工确认。",
  },
  {
    id: "tradeoffs",
    title: "产品取舍：线性聊天够用时，不必一开始就做复杂分支",
    body: "如果产品只有纯文本问答，可以用“保存修订版本 + 从该轮重建有序消息 + 替换后续回答”的轻量方案。若 Agent 会跨多步运行、读写外部系统、需要审批或长时间暂停恢复，就更需要 branch、run、tool-call、checkpoint 等显式状态。架构复杂度应由可恢复性、审计需求和副作用风险驱动，而不是为了“像 Agent”而堆对象。",
  },
  {
    id: "takeaway",
    title: "产品结论：编辑消息是在修订一次执行的因果链",
    body: "用户看到的是“改问题 → 得到新答案”，系统处理的是：确定有效历史边界、保存输入新版本、创建或切换执行路径、重新组装上下文、取消/隔离旧运行、按安全策略重放必要步骤，并把新结果关联回正确分支。产品体验的关键，是让用户理解旧答案是否保留；系统设计的关键，是确保答案、工具结果和副作用都能追溯到准确的输入版本。",
  },
];

function AgentExecutionFlow() {
  return <div className="knowledge-agent-flow" aria-label="编辑消息后通用 Agent 的执行流程">
    <div className="knowledge-flow-step"><span>01 / REVISION</span><strong>保存新消息版本</strong><small>保留旧版本，可撤销或比较</small></div>
    <i className="knowledge-flow-next" aria-hidden="true">→</i>
    <div className="knowledge-flow-step"><span>02 / CONTEXT</span><strong>确定历史边界</strong><small>有效历史 + 指令 + 记忆/检索</small></div>
    <i className="knowledge-flow-next" aria-hidden="true">→</i>
    <div className="knowledge-flow-step"><span>03 / AGENT RUN</span><strong>创建新运行</strong><small>runId 绑定输入版本与分支</small></div>
    <div className="knowledge-flow-tool"><span>若模型请求工具</span><b>校验 / 授权 → 执行 → 保存 ToolResult → 回到 Agent</b></div>
    <i className="knowledge-flow-down" aria-hidden="true">↓</i>
    <div className="knowledge-flow-step knowledge-flow-result"><span>04 / RESULT</span><strong>写入新路径并流式呈现</strong><small>旧 run 的迟到事件不得覆盖新结果</small></div>
  </div>;
}

function isPptSelection(selection: KnowledgeSelection) {
  return selection === "ppt-map" || selection.startsWith("ppt-chapter:");
}

function getPptChapter(selection: KnowledgeSelection) {
  return selection.startsWith("ppt-chapter:") ? selection.slice("ppt-chapter:".length) : "overview";
}

function folderForSelection(selection: KnowledgeSelection): FolderId {
  if (selection.startsWith("editor")) return "editor";
  if (selection.startsWith("ppt-")) return "ppt";
  if (selection === "experience" || selection.startsWith("uiux-") || selection.startsWith("motion-")) return "experience";
  return "agent";
}

export function KnowledgeDirectory({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  const [openFolders, setOpenFolders] = useState<FolderId[]>(["agent"]);
  const activeFolder = folderForSelection(activeId);

  useEffect(() => {
    setOpenFolders((current) => current.includes(activeFolder) ? current : [...current, activeFolder]);
  }, [activeFolder]);

  const toggleFolder = (folderId: FolderId) => {
    setOpenFolders((current) => current.includes(folderId)
      ? current.filter((id) => id !== folderId)
      : [...current, folderId]);
    if (folderId === "experience") onSelect("uiux-libraries");
    if (folderId === "agent") onSelect("agent-edit-message");
    if (folderId === "ppt") onSelect("ppt-map");
    if (folderId === "editor") onSelect("editor-canvas");
  };

  return (
    <div className="mode-panel knowledge-directory-panel">
      <span className="eyebrow">NOTES & THINKING / FIELD GUIDE</span>
      <div className="knowledge-directory-heading">
        <h1>项目实战经验</h1>
      </div>
      <nav className="knowledge-folder-list" aria-label="知识沉淀分类目录">
        {folders.map((folder) => {
          const isOpen = openFolders.includes(folder.id);
          const isActive = activeFolder === folder.id;
          return (
            <section className={`knowledge-folder${isActive ? " is-active" : ""}`} key={folder.id}>
              <button className="knowledge-folder-trigger cursor-target" onClick={() => toggleFolder(folder.id)} aria-expanded={isOpen}>
                <span className="knowledge-folder-index">{folder.index}</span>
                <span className="knowledge-folder-name"><strong>{folder.title}</strong></span>
                <span className="knowledge-folder-toggle" aria-hidden="true">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen ? <div className="knowledge-folder-entries">
                {folder.id === "agent" ? [...agentArticles].sort((a, b) => agentArticleOrder.indexOf(a.id) - agentArticleOrder.indexOf(b.id)).map((article, index) => <button className={`knowledge-entry cursor-target${activeId === article.id ? " is-selected" : ""}`} key={article.id} onClick={() => onSelect(article.id)}>
                  <span>{String(index + 1).padStart(2, "0")}</span><strong>{article.title}</strong><em>↗</em>
                </button>) : null}
                {folder.id === "experience" ? <>
                  <button className={`knowledge-entry cursor-target${activeId === "uiux-libraries" ? " is-selected" : ""}`} onClick={() => onSelect("uiux-libraries")}>
                    <span>01</span><strong>前端组件与效果参考库</strong><em>↗</em>
                  </button>
                  <button className={`knowledge-entry cursor-target${activeId === "motion-earth-rendering" ? " is-selected" : ""}`} onClick={() => onSelect("motion-earth-rendering")}>
                    <span>02</span><strong>真实交互地球的材质与光照</strong><em>↗</em>
                  </button>
                  <button className={`knowledge-entry cursor-target${activeId === "motion-audio-waveform" ? " is-selected" : ""}`} onClick={() => onSelect("motion-audio-waveform")}>
                    <span>03</span><strong>让声纹响应真实声音</strong><em>↗</em>
                  </button>
                </> : null}
                {folder.id === "ppt" ? <>
                  <button className={`knowledge-entry cursor-target${activeId === "ppt-map" ? " is-selected" : ""}`} onClick={() => onSelect("ppt-map")}>
                    <span>MAP</span><strong>AI PPT 系统原理地图</strong><em>↗</em>
                  </button>
                  <div className="knowledge-chapter-list" aria-label="AI PPT 原理地图章节">
                    {coursewareDirectory.map(([id, label], index) => <button className={`knowledge-chapter cursor-target${activeId === `ppt-chapter:${id}` ? " is-selected" : ""}`} key={id} onClick={() => onSelect(`ppt-chapter:${id}`)}>
                      <span>{String(index + 1).padStart(2, "0")}</span>{label}
                    </button>)}
                  </div>
                </> : null}
                {folder.id === "editor" ? editorArticles.map((entry, index) => <button className={`knowledge-entry cursor-target${activeId === entry.id ? " is-selected" : ""}`} key={entry.id} onClick={() => onSelect(entry.id)}>
                  <span>{String(index + 1).padStart(2, "0")}</span><strong>{entry.title}</strong><em>↗</em>
                </button>) : null}
              </div> : null}
            </section>
          );
        })}
      </nav>
    </div>
  );
}

function ProjectExperienceArticle({ article }: { article: ExperienceArticleData }) {
  return <article className="knowledge-article">
    <header className="knowledge-article-hero">
      {article.kicker ? <span className="knowledge-article-kicker">{article.kicker}</span> : null}
      <h1>{article.title}</h1>
      {article.tags.length ? <div className="knowledge-article-tags">{article.tags.map((tag) => <span key={tag}>{tag}</span>)}</div> : null}
    </header>
    <div className="knowledge-article-content">
      {article.glossary?.length ? <section className="knowledge-article-section knowledge-guide-glossary">
        <span>术语速查 / THREE DIFFERENT JOBS</span>
        <KnowledgeTableScroller label="术语对照表横向滚动条">
          <table>
            <thead><tr><th>名词 / English</th><th>示意</th><th>用途</th><th>生命周期</th></tr></thead>
            <tbody>{article.glossary.map((row) => <tr key={row.term}><th scope="row">{row.term.split("\n").map((line) => <span key={line}>{line}</span>)}</th><td>{row.visual}</td><td>{row.purpose}</td><td>{row.persistence}</td></tr>)}</tbody>
          </table>
        </KnowledgeTableScroller>
      </section> : null}
      {article.resources?.length ? <section className="knowledge-article-section knowledge-resource-catalog">
        <span>组件目录 / RESOURCE INDEX</span>
        <div className="knowledge-resource-groups">
          {[...new Set(article.resources.map((resource) => resource.category))].map((category) => <section key={category}>
            <h2>{category}</h2>
            <div className="knowledge-resource-grid">{article.resources?.filter((resource) => resource.category === category).map((resource) => <a href={resource.href} key={resource.href} target="_blank" rel="noreferrer" className="knowledge-resource-card">
              <strong>{resource.name}<span aria-hidden="true">↗</span></strong><p>{resource.description}</p>
            </a>)}</div>
          </section>)}
        </div>
      </section> : null}
      {article.sections.map((section, index) => <section className="knowledge-article-section" key={section.title}>
        <span>{String(index + 1).padStart(2, "0")} / {section.title}</span>
        {article.illustration === "smart-guides" && section.title.startsWith("通用计算链") ? <><SmartGuidesDiagram /><SmartGuideCalculationDiagram /></> : null}
        {article.illustration === "history-stack" && section.title.startsWith("用一张图理解") ? <UndoRedoDiagram /> : null}
        {article.illustration === "editor-blueprint" && section.title.startsWith("架构图") ? <EditorBlueprintDiagram /> : null}
        {section.problem ? <div className="knowledge-problem"><strong>问题</strong><p>{section.problem}</p></div> : null}
        {section.demo ? <SmartGuideDemo variant={section.demo} /> : null}
        {section.body ? <p>{section.body}</p> : null}
        {section.cards?.length ? <div className="knowledge-insight-grid">{section.cards.map((card) => <article className="knowledge-insight-card" key={card.label}><strong>{card.label}</strong><p>{card.body}</p></article>)}</div> : null}
        {section.table ? <KnowledgeTableScroller label={`${section.title}表格横向滚动条`}><table className="knowledge-section-table"><thead><tr>{section.table.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{section.table.rows.map((row, rowIndex) => <tr key={`${section.title}-${rowIndex}`}>{row.map((cell, cellIndex) => cellIndex === 0 ? <th scope="row" key={`${rowIndex}-${cellIndex}`}>{cell}</th> : <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>)}</tr>)}</tbody></table></KnowledgeTableScroller> : null}
        {section.checks?.length ? <ul className="knowledge-check-grid">{section.checks.map((check) => <li key={check}>{check}</li>)}</ul> : null}
      </section>)}
      {article.comparison ? <section className="knowledge-article-section knowledge-editor-comparison">
        <span>技术路线对照 / 2D EDITOR</span>
        <KnowledgeTableScroller label="编辑器技术路线表格横向滚动条">
          <table>
            <thead><tr><th>路线</th><th>核心模型</th><th>适合点</th><th>主要代价</th></tr></thead>
            <tbody>{article.comparison.map((row) => <tr key={row.approach}><th scope="row">{row.approach}</th><td>{row.model}</td><td>{row.strengths}</td><td>{row.tradeoffs}</td></tr>)}</tbody>
          </table>
        </KnowledgeTableScroller>
      </section> : null}
      {article.sources?.length ? <section className="knowledge-article-section knowledge-sources">
        <span>延伸阅读 / PRIMARY SOURCES</span>
        <div className="knowledge-source-links">{article.sources.map((source) => <a href={source.href} key={source.href} target="_blank" rel="noreferrer">{source.label} ↗</a>)}</div>
      </section> : null}
    </div>
  </article>;
}

function KnowledgeTableScroller({ children, label }: { children: ReactNode; label: string }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({ left: 0, max: 0 });

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const update = () => setScrollState({ left: viewport.scrollLeft, max: Math.max(0, viewport.scrollWidth - viewport.clientWidth) });
    update();
    viewport.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    if (viewport.firstElementChild) observer.observe(viewport.firstElementChild);
    return () => { viewport.removeEventListener("scroll", update); observer.disconnect(); };
  }, [children]);

  return <div className="knowledge-table-wrap">
    <div className="knowledge-comparison-scroll" ref={viewportRef}>{children}</div>
    {scrollState.max > 0 ? <label className="knowledge-table-handle"><span>拖动滑块横向查看</span><input type="range" min="0" max={scrollState.max} value={Math.min(scrollState.left, scrollState.max)} aria-label={label} onChange={(event) => { if (viewportRef.current) viewportRef.current.scrollLeft = Number(event.currentTarget.value); }} /></label> : null}
  </div>;
}

function SmartGuidesDiagram() {
  return <figure className="knowledge-smart-guides-figure">
    <svg viewBox="0 0 760 300" role="img" aria-labelledby="smart-guides-title smart-guides-desc">
      <title id="smart-guides-title">智能吸附线的几何匹配示意</title>
      <desc id="smart-guides-desc">左侧对象中心没有对齐；右侧拖动对象的中心吸附到目标对象中心，蓝色竖线表示临时对齐反馈。</desc>
      <rect x="12" y="12" width="352" height="250" className="sg-panel" />
      <rect x="396" y="12" width="352" height="250" className="sg-panel" />
      <text x="30" y="39" className="sg-kicker">01 / BEFORE · FREE DRAG</text>
      <text x="414" y="39" className="sg-kicker">02 / AFTER · CENTER SNAP</text>
      <rect x="40" y="65" width="296" height="160" className="sg-page" />
      <rect x="424" y="65" width="296" height="160" className="sg-page" />
      <rect x="92" y="82" width="86" height="44" rx="2" className="sg-target" />
      <text x="98" y="108" className="sg-label">目标对象</text>
      <rect x="239" y="158" width="66" height="40" rx="2" className="sg-moving" />
      <text x="236" y="218" className="sg-label">拖动中</text>
      <line x1="135" y1="70" x2="135" y2="138" className="sg-anchor-muted" />
      <line x1="272" y1="148" x2="272" y2="206" className="sg-anchor-muted" />
      <text x="46" y="246" className="sg-caption">中心点相差 137 个画布单位</text>
      <rect x="476" y="82" width="86" height="44" rx="2" className="sg-target" />
      <text x="482" y="108" className="sg-label">目标对象</text>
      <rect x="486" y="158" width="66" height="40" rx="2" className="sg-moving sg-moving-active" />
      <text x="486" y="218" className="sg-label">拖动对象</text>
      <line x1="519" y1="70" x2="519" y2="208" className="sg-guide" />
      <circle cx="519" cy="103" r="4" className="sg-snap-point" />
      <line x1="603" y1="150" x2="603" y2="206" className="sg-anchor-muted" />
      <line x1="603" y1="178" x2="519" y2="178" className="sg-delta" />
      <text x="425" y="246" className="sg-caption">中心点进入屏幕阈值 → 修正 X</text>
      <path d="M366 139 H390" className="sg-arrow" />
      <text x="15" y="286" className="sg-legend"><tspan className="sg-legend-target">■</tspan> 静态对象　<tspan className="sg-legend-moving">■</tspan> 拖动对象　<tspan className="sg-legend-guide">━</tspan> 临时智能辅助线</text>
    </svg>
    <figcaption>画布单位是文档坐标，不是屏幕像素。例如缩放 50% 时，137 个画布单位显示约 68.5 CSS px。吸附阈值按屏幕像素换算，因此缩放后手感仍应一致。</figcaption>
  </figure>;
}

function SmartGuideDemo({ variant }: { variant: NonNullable<ExperienceArticleData["sections"][number]["demo"]> }) {
  const [settled, setSettled] = useState(false);
  const copy = {
    priority: ["拖动对象同时接近边和中心", "X、Y 方向分开判断；距离接近时保持原目标，避免来回抖动。"],
    noise: ["附近有很多对象与对齐候选", "只查附近对象，最后只画出实际吸附的线。"],
    scope: ["组内元素可能吸到自己或外部对象", "拖组看组框，拖单个元素看单体；排除组内自身目标。"],
    viewport: ["画布边缘外仍有同画板对象", "视口外目标太远，不触发吸附，避免对象突然跳走。"],
    transform: ["旋转、缩放或远端更新改变参考几何", "按旋转后的实际边线匹配；缩放跟随当前控制点，协同更新等松手后提交。"],
  }[variant];
  const x = variant === "transform" ? (settled ? 143 : 474) : settled ? 354 : 474;

  return <div className="knowledge-demo">
    <div className="knowledge-demo-heading"><strong>交互示意</strong><span>{settled ? "处理后" : "问题状态"}</span></div>
    <svg viewBox="0 0 720 250" role="img" aria-label={`${copy[0]}；${copy[1]}`}>
      <rect x="12" y="12" width="696" height="226" className="demo-board" />
      {variant === "noise" ? <g className="demo-noise">{[0,1,2,3,4,5].map((i) => <rect key={i} x={80 + i * 90} y={48 + (i % 2) * 96} width="54" height="38" />)}</g> : null}
      {variant === "scope" ? <><rect x="74" y="55" width="270" height="136" className="demo-group" /><text x="84" y="48" className="demo-label">组 A</text><rect x="138" y="98" width="72" height="46" className="demo-target" /><rect x="248" y="98" width="72" height="46" className="demo-target" /><rect x="492" y="92" width="82" height="54" className="demo-target" /><text x="488" y="168" className="demo-label">组外对象</text></> : null}
      {variant === "viewport" ? <><rect x="54" y="48" width="600" height="160" className="demo-page" /><rect x="54" y="48" width="420" height="160" className="demo-viewport" /><rect x="520" y="75" width="110" height="74" className={settled ? "demo-outside is-muted" : "demo-outside"} /><text x="526" y="166" className="demo-label">同画板 · 视口外</text><rect x="104" y="82" width="74" height="48" className="demo-target" /></> : null}
      {variant === "priority" ? <><rect x="126" y="70" width="90" height="56" className="demo-target" /><rect x="364" y="54" width="88" height="54" className="demo-target-alt" /><line x1="171" y1="42" x2="171" y2="200" className="demo-guide-muted" /><line x1="408" y1="40" x2="408" y2="200" className={settled ? "demo-guide" : "demo-guide-muted"} /></> : null}
      {variant === "transform" ? <><rect x="132" y="72" width="116" height="66" transform="rotate(-22 190 105)" className="demo-target" /><line x1="133" y1="145" x2="252" y2="97" className="demo-guide-muted" /><circle cx="190" cy="105" r="3" className="demo-anchor" /></> : null}
      {variant !== "scope" && variant !== "viewport" ? <rect x={x} y="126" width="94" height="58" rx="2" className={settled ? "demo-moving is-snapped" : "demo-moving"} /> : null}
      {variant === "scope" ? <rect x={settled ? 496 : 388} y="98" width="74" height="46" className={settled ? "demo-moving is-snapped" : "demo-moving"} /> : null}
      {variant === "viewport" ? <rect x="326" y="146" width="74" height="48" className={settled ? "demo-moving is-safe" : "demo-moving"} /> : null}
      {settled && variant !== "viewport" ? <line x1={variant === "scope" ? 533 : variant === "transform" ? 190 : 401} y1="34" x2={variant === "scope" ? 533 : variant === "transform" ? 190 : 401} y2="210" className="demo-guide" /> : null}
      <text x="28" y="228" className="demo-label">{copy[settled ? 1 : 0]}</text>
    </svg>
    <div className="knowledge-demo-controls"><span>{copy[settled ? 1 : 0]}</span><button type="button" onClick={() => setSettled((value) => !value)}>{settled ? "重置示意" : "查看处理后"}</button></div>
  </div>;
}

function SmartGuideCalculationDiagram() {
  return <figure className="knowledge-smart-guides-figure">
    <svg viewBox="0 0 900 230" role="img" aria-labelledby="smart-calc-title smart-calc-desc">
      <title id="smart-calc-title">吸附候选从几何关系到位置修正</title>
      <desc id="smart-calc-desc">拖动对象边和中心与目标锚点配对，按 zoom 把世界坐标差换算成 CSS 像素，过滤和排序，最后只将获胜候选用于位置修正和绘制。</desc>
      <rect x="12" y="14" width="205" height="188" className="sg-panel" />
      <rect x="235" y="14" width="205" height="188" className="sg-panel" />
      <rect x="458" y="14" width="205" height="188" className="sg-panel" />
      <rect x="681" y="14" width="205" height="188" className="sg-panel" />
      <text x="28" y="42" className="sg-kicker">A / PAIR ANCHORS</text>
      <text x="251" y="42" className="sg-kicker">B / NORMALIZE</text>
      <text x="474" y="42" className="sg-kicker">C / PICK WINNERS</text>
      <text x="697" y="42" className="sg-kicker">D / APPLY + DRAW</text>
      <rect x="37" y="69" width="65" height="45" className="sg-target" />
      <rect x="131" y="127" width="65" height="45" className="sg-moving sg-moving-active" />
      <line x1="69" y1="60" x2="69" y2="124" className="sg-anchor-muted" />
      <line x1="163" y1="118" x2="163" y2="181" className="sg-anchor-muted" />
      <text x="33" y="192" className="sg-caption">边 / 中心坐标组成 Δx、Δy</text>
      <text x="260" y="83" className="sg-label">Δscreen = Δworld × zoom</text>
      <rect x="260" y="99" width="155" height="23" className="sg-rule" />
      <text x="270" y="116" className="sg-label">4.5px ≤ 6px → 保留</text>
      <rect x="260" y="132" width="155" height="23" className="sg-row-muted" />
      <text x="270" y="149" className="sg-label">8px ＞ 6px → 丢弃</text>
      <text x="480" y="82" className="sg-caption">每轴独立排序</text>
      <rect x="480" y="96" width="160" height="29" className="sg-row-winner" />
      <text x="490" y="116" className="sg-label">X：左边 ↔ 左边</text>
      <rect x="480" y="133" width="160" height="29" className="sg-row-winner" />
      <text x="490" y="153" className="sg-label">Y：中心 ↔ 中心</text>
      <rect x="708" y="76" width="105" height="67" className="sg-moving sg-moving-active" />
      <line x1="760" y1="62" x2="760" y2="158" className="sg-guide" />
      <line x1="697" y1="109" x2="825" y2="109" className="sg-guide" />
      <path d="M219 108 H231 M442 108 H454 M665 108 H677" className="sg-arrow" />
      <text x="695" y="177" className="sg-caption">修正仅作用于命中轴</text>
    </svg>
    <figcaption>每个候选都记录目标、锚点类型、轴向、屏幕距离和修正量；吸附解释、绘线与位置修正共用同一条命中结果。</figcaption>
  </figure>;
}

function UndoRedoDiagram() {
  return <figure className="knowledge-diagram-figure">
    <svg viewBox="0 0 800 280" role="img" aria-labelledby="undo-diagram-title undo-diagram-desc">
      <title id="undo-diagram-title">撤销、重做与新编辑清空未来分支</title>
      <desc id="undo-diagram-desc">从操作 A、B、C 开始；撤销 C 后它进入重做栈；若继续做 D，原先的 C 重做分支被清空。</desc>
      <rect x="10" y="10" width="245" height="224" className="ed-panel" />
      <rect x="277" y="10" width="245" height="224" className="ed-panel" />
      <rect x="544" y="10" width="245" height="224" className="ed-panel" />
      <text x="26" y="38" className="ed-kicker">01 / CURRENT</text>
      <text x="293" y="38" className="ed-kicker">02 / UNDO C</text>
      <text x="560" y="38" className="ed-kicker">03 / EDIT D</text>
      <text x="27" y="70" className="ed-caption">UNDO STACK</text>
      <rect x="27" y="82" width="60" height="35" className="ed-history" /><text x="52" y="105" className="ed-box-text">A</text>
      <rect x="94" y="82" width="60" height="35" className="ed-history" /><text x="119" y="105" className="ed-box-text">B</text>
      <rect x="161" y="82" width="60" height="35" className="ed-current" /><text x="186" y="105" className="ed-box-text">C</text>
      <text x="27" y="157" className="ed-caption">REDO STACK</text><text x="27" y="186" className="ed-empty">— empty —</text>
      <text x="294" y="70" className="ed-caption">UNDO STACK</text>
      <rect x="294" y="82" width="60" height="35" className="ed-history" /><text x="319" y="105" className="ed-box-text">A</text>
      <rect x="361" y="82" width="60" height="35" className="ed-current" /><text x="386" y="105" className="ed-box-text">B</text>
      <text x="294" y="157" className="ed-caption">REDO STACK</text>
      <rect x="294" y="169" width="60" height="35" className="ed-redo" /><text x="319" y="192" className="ed-box-text">C</text>
      <text x="561" y="70" className="ed-caption">UNDO STACK</text>
      <rect x="561" y="82" width="60" height="35" className="ed-history" /><text x="586" y="105" className="ed-box-text">A</text>
      <rect x="628" y="82" width="60" height="35" className="ed-history" /><text x="653" y="105" className="ed-box-text">B</text>
      <rect x="695" y="82" width="60" height="35" className="ed-current" /><text x="720" y="105" className="ed-box-text">D</text>
      <text x="561" y="157" className="ed-caption">REDO STACK</text><text x="561" y="186" className="ed-empty">C branch cleared</text>
      <path d="M258 120 H272 M525 120 H539" className="ed-arrow" />
      <text x="14" y="262" className="ed-note">撤销移动当前路径；只有“撤销后再做新编辑”才会丢弃旧的 Redo Future。</text>
    </svg>
    <figcaption>past / present / future 是理解线性编辑历史的最小模型；协同选择性撤销还要按操作来源避免回滚他人贡献。</figcaption>
  </figure>;
}

function EditorBlueprintDiagram() {
  return <figure className="knowledge-diagram-figure">
    <svg viewBox="0 0 800 370" role="img" aria-labelledby="editor-blueprint-title editor-blueprint-desc">
      <title id="editor-blueprint-title">编辑器从用户任务到文档内核与交付能力的架构蓝图</title>
      <desc id="editor-blueprint-desc">用户任务进入规范化文档模型，再由编辑命令和事务驱动渲染、历史保存、协作权限、导入导出和 AI 工具。</desc>
      <rect x="10" y="10" width="780" height="345" className="ed-panel" />
      <text x="30" y="38" className="ed-kicker">EDITOR PRODUCT SYSTEM / ONE DOCUMENT MODEL, MANY CONSUMERS</text>
      <rect x="42" y="58" width="716" height="52" rx="3" className="ed-task" />
      <text x="400" y="80" textAnchor="middle" className="ed-box-title">用户任务与交付目标</text>
      <text x="400" y="99" textAnchor="middle" className="ed-box-sub">PPT 叙事 · 海报创作 · H5 发布 · 富文本协作</text>
      <path d="M400 111 V130" className="ed-arrow" />
      <rect x="132" y="132" width="536" height="62" rx="3" className="ed-model" />
      <text x="400" y="157" textAnchor="middle" className="ed-box-title">语义文档模型 / Schema + Stable IDs + Assets</text>
      <text x="400" y="179" textAnchor="middle" className="ed-box-sub">document → page / frame → node / block → style / constraint / resource</text>
      <path d="M400 195 V215" className="ed-arrow" />
      <rect x="132" y="217" width="536" height="48" rx="3" className="ed-command" />
      <text x="400" y="247" textAnchor="middle" className="ed-box-title">编辑命令 / Transaction：校验 → 应用 → 记录 → 发布变更</text>
      <path d="M400 266 V282 M106 282 H694 M106 282 V297 M302 282 V297 M498 282 V297 M694 282 V297" className="ed-arrow" />
      <rect x="30" y="299" width="152" height="42" rx="3" className="ed-consumer" />
      <rect x="226" y="299" width="152" height="42" rx="3" className="ed-consumer" />
      <rect x="422" y="299" width="152" height="42" rx="3" className="ed-consumer" />
      <rect x="618" y="299" width="152" height="42" rx="3" className="ed-consumer" />
      <text x="106" y="325" textAnchor="middle" className="ed-box-sub">Canvas / DOM 渲染</text>
      <text x="302" y="325" textAnchor="middle" className="ed-box-sub">Undo / 保存 / 版本</text>
      <text x="498" y="325" textAnchor="middle" className="ed-box-sub">协同 / 权限 / 审计</text>
      <text x="694" y="325" textAnchor="middle" className="ed-box-sub">导入导出 / AI 工具</text>
    </svg>
    <figcaption>工具栏、快捷键、属性面板、自动化与 AI 都调用同一套命令/文档内核；渲染层只是同一文档的视图。</figcaption>
  </figure>;
}

function AgentArticle({ article }: { article: AgentArticleData }) {
  if (article.id !== "agent-edit-message") {
    return <article className="knowledge-article">
      <header className="knowledge-article-hero">
        <span className="knowledge-article-kicker">AI AGENT / FIELD NOTE</span>
        <h1>{article.title}</h1>
      {article.tags.length ? <div className="knowledge-article-tags">{article.tags.map((tag) => <span key={tag}>{tag}</span>)}</div> : null}
      </header>
      <div className="knowledge-article-content">
        <div className="knowledge-article-note"><strong>阅读边界</strong><span>区分产品公开可观察的行为与通用架构推演。厂商通常不会公开完整后端实现；文中明确标注的设计建议是跨产品可复用的抽象，不等于对 Codex 或 MULDO 私有实现的断言。</span></div>
        {article.sections.map((section, index) => <section className="knowledge-article-section" key={section.title}>
          <span>{String(index + 1).padStart(2, "0")} / {section.title}</span>
          <p>{section.body}</p>
          {section.code ? <pre><code>{section.code}</code></pre> : null}
        </section>)}
        <section className="knowledge-article-section knowledge-sources">
          <span>参考资料 / SOURCE NOTES</span>
          <p>产品文档用于确认公开交互和产品语义；架构解释中对未公开内部机制的部分，均以通用设计推演呈现。</p>
          <div className="knowledge-source-links">{article.sources.map((source) => <a key={source.href} href={source.href} target="_blank" rel="noreferrer">{source.label} ↗</a>)}</div>
        </section>
      </div>
    </article>;
  }

  return (
    <article className="knowledge-article">
      <header className="knowledge-article-hero">
        <span className="knowledge-article-kicker">AI AGENT / FIELD NOTE 001</span>
        <h1>编辑已发送消息后，AI 如何重新回答？</h1>
        <div className="knowledge-article-tags"><span>通用 Agent 架构</span><span>上下文管理</span><span>运行状态</span><span>工具调用</span></div>
      </header>
      <div className="knowledge-article-content">
        <div className="knowledge-article-note"><strong>阅读边界</strong><span>以下是跨框架常见的参考架构，不是任何单一产品的私有后端说明。不同系统会采用线性历史、分支、事件日志或图状态等不同组合。</span></div>
        <AgentExecutionFlow />
        {articleSections.map((section, index) => <section className="knowledge-article-section" key={section.id}>
          <span>{String(index + 1).padStart(2, "0")} / {section.title}</span>
          <p>{section.body}</p>
          {section.code ? <pre><code>{section.code}</code></pre> : null}
        </section>)}
        <section className="knowledge-article-section knowledge-sources">
          <span>参考资料 / SOURCE NOTES</span>
          <p>这些资料用于交叉理解公开的 Agent 图状态、工具调用协议与对话 API 形态；它们展示的是可复用的公开设计模式，不构成某个具体产品内部实现的证明。实际系统可能采用不同的数据模型、持久化策略和编排框架。</p>
          <div className="knowledge-source-links">
            <a href="https://docs.langchain.com/oss/javascript/langgraph/thinking-in-langgraph" target="_blank" rel="noreferrer">LangGraph · Thinking in LangGraph：状态、节点与检查点 ↗</a>
            <a href="https://docs.anthropic.com/ko/docs/agents-and-tools/tool-use/implement-tool-use" target="_blank" rel="noreferrer">Anthropic · Tool use：工具调用与结果回传协议 ↗</a>
            <a href="https://platform.openai.com/docs/api-reference/chat/object?lang=ruby" target="_blank" rel="noreferrer">OpenAI API · Chat：有序消息与工具选择 ↗</a>
          </div>
        </section>
      </div>
    </article>
  );
}

export function KnowledgeReader({ activeId }: { activeId: string }) {
  const experienceArticle = experienceArticles[activeId];
  if (experienceArticle) return <ProjectExperienceArticle article={experienceArticle} />;

  const editorArticle = editorArticles.find(({ id }) => id === activeId)?.article;
  if (editorArticle) return <ProjectExperienceArticle article={editorArticle} />;

  if (activeId === "experience" || activeId === "editor") {
    const folder = folders.find(({ id }) => id === activeId)!;
    return <div className="knowledge-empty-reader"><span className="eyebrow">{folder.index} / KNOWLEDGE FOLDER</span><h1>{folder.title}</h1><span className="knowledge-empty-mark" aria-hidden="true">＋</span></div>;
  }

  if (isPptSelection(activeId)) {
    const chapter = getPptChapter(activeId);
    return <div className="preview-canvas notes-preview-canvas knowledge-map-reader">
      <iframe className="knowledge-map-frame" name="courseware-map" src={`/knowledge/courseware-system-map.html#${encodeURIComponent(chapter)}`} title="课映 AI PPT 系统原理地图" />
    </div>;
  }

  const agentArticle = agentArticles.find(({ id }) => id === activeId) ?? agentArticles[0];
  return <AgentArticle article={agentArticle} />;
}
