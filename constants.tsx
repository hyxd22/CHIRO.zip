
import { WorkItem, SiteInfo, SidebarMenu } from './types';

export const INITIAL_SITE_INFO: SiteInfo = {
  heroHeadline: "브랜드 {톤} 위에서,\n{소비자}에게 닿는 디자인.",
  heroHeadlineStyle: { fontSize: 85, lineHeight: 1.2, letterSpacing: -0.03, fontWeight: 900, color: "#ffffff" },
  heroSubheadline: "광고대행사에서 {80여 개 이상}의 브랜드·클라이언트와 작업하며\n배너와 그래픽 디자인을 해온 {4년차 디자이너}입니다.",
  heroSubheadlineStyle: { fontSize: 22, lineHeight: 1.5, letterSpacing: -0.03, fontWeight: 500, color: "#aaaaaa" },
  mainIntroText: "여러 브랜드를 동시에 다루는 환경에서\n각 브랜드의 {정체성}을 유지하며 작업해왔고,\n소비자가 실제로 마주하는 화면을 기준으로\n{정보}와 {흐름}을 정리하는데 익숙합니다.",
  mainIntroTextStyle: { fontSize: 28, lineHeight: 1.4, letterSpacing: -0.03, fontWeight: 400, color: "#000000" },
  designProcessTitle: "DESIGN PROCESS",
  designProcessTitleStyle: { fontSize: 32, lineHeight: 1, letterSpacing: -0.03, fontWeight: 500, color: "rgba(255, 255, 255, 0.2)" },
  designProcessSteps: [
    { title: "브랜드 톤 설정", description: "브랜드에 맞는 톤과 분위기를 기준으로 디자인합니다." },
    { title: "정보 구조 정리", description: "정보가 한눈에 들어오도록 화면을 구성합니다." },
    { title: "매체 맞춤 디자인", description: "노출 환경을 고려해 결과물을 조정합니다" }
  ],
  designProcessStepTitleStyle: { fontSize: 20, lineHeight: 1.2, letterSpacing: -0.02, fontWeight: 900, color: "#ffffff" },
  designProcessStepDescriptionStyle: { fontSize: 14, lineHeight: 1.6, letterSpacing: 0, fontWeight: 500, color: "rgba(255, 255, 255, 0.5)" },
  worksGalleryTitle: "Selected Works",
  worksGalleryTitleStyle: { fontSize: 32, lineHeight: 1, letterSpacing: -0.03, fontWeight: 500, color: "rgba(255, 255, 255, 0.2)" },
  capabilitiesTitle: "그래픽과 영상, 커뮤니케이션 경험을 바탕으로\n브랜드를 이해하고 표현합니다.",
  capabilitiesTitleStyle: { fontSize: 31, lineHeight: 1.2, letterSpacing: -0.03, fontWeight: 500, color: "#ffffff" },
  capabilities: [
    { title: 'Graphic Design', description: '배너 · 프로모션 · 캠페인 비주얼\n브랜드 톤을 유지하면서 소비자가 직관적으로 이해할 수 있는 그래픽 디자인' },
    { title: 'Video', description: '간단한 영상 · 모션 그래픽\nPremiere Pro / After Effects' },
    { title: 'Communication', description: '능동적인 커뮤니케이션\n기획 의도 이해 & 방향 제안' },
    { title: 'Brand Understanding', description: '브랜드의 방향과 맥락을 이해하고 정체성을 해치지 않는 디자인' }
  ],
  capabilityItemTitleStyle: { fontSize: 22, lineHeight: 1.2, letterSpacing: -0.02, fontWeight: 900, color: "#ffffff" },
  capabilityItemDescriptionStyle: { fontSize: 18, lineHeight: 1.7, letterSpacing: -0.01, fontWeight: 500, color: "#cccccc" },
  aboutIntro: "{80여 개 이상}의 브랜드·클라이언트와 협업하며\n배너, 프로모션, 캠페인 그래픽을 중심으로\n다양한 업종의 커뮤니케이션 작업을 경험했습니다.",
  aboutIntroStyle: { fontSize: 28, lineHeight: 1.32, letterSpacing: -0.03, fontWeight: 500, color: "#ffffff" },
  aboutPerspectiveLabel: "Design Perspective",
  aboutDesignCriteria: "디자인을 할 때 형식보다 소비자의 이해 흐름을 먼저 봅니다.\n짧은 시간 안에 무엇이 전달되어야 하는지,\n어디서 선택이 이루어지는지를 기준으로 화면을 구성해왔습니다.",
  aboutWorkingStyleLabel: "Working Style",
  aboutWorkingStyle: "업무를 진행할 때 주어진 요청을 그대로 처리하기보다,\n목적과 사용 맥락을 먼저 확인하는 편입니다.\n필요하다면 방향을 제안하고, 더 나은 결과를 위해\n능동적으로 의견을 공유하며 작업해왔습니다.",
  aboutExperienceLabel: "Professional Experience",
  aboutExperience: "이전 회사에서는 디자인 업무와 함께 마케팅 커뮤니케이션 일부를 경험하며,\n성과 지표와 운영 흐름을 자연스럽게 이해하게 되었습니다.\n그 덕분에 디자인 결과물이 실제로 어떻게 사용되는지까지 고려하며\n작업할 수 있었습니다.",
  aboutClosing: "빠르게 소비되는 화면 속에서도\n소비자에게는 명확하고, 브랜드에는 무리가 없는 디자인을 지향합니다.",
  aboutClosingStyle: { fontSize: 24, lineHeight: 1.32, letterSpacing: -0.03, fontWeight: 500, color: "#ffffff" },
  aboutSectionSpacing: 120,
  bodyTextStyle: { fontSize: 18, lineHeight: 1.7, letterSpacing: -0.01, fontWeight: 500, color: "#cccccc" },
  pointColor: "#347BED",
  workTitleStyle: { fontSize: 120, lineHeight: 1, letterSpacing: -0.06, fontWeight: 900, color: "#ffffff" },
  sidebarStyle: { fontSize: 13, lineHeight: 1, letterSpacing: 0, fontWeight: 500, color: "#000000" },
  sectionHeadingStyle: { fontSize: 90, lineHeight: 1, letterSpacing: -0.05, fontWeight: 900, color: "#ffffff" },
  cardTitleStyle: { fontSize: 22, lineHeight: 1.2, letterSpacing: -0.02, fontWeight: 900, color: "#ffffff" },
  contactHeadline: "CONTACT",
  contactHeadlineStyle: { fontSize: 80, lineHeight: 1, letterSpacing: -0.03, fontWeight: 500, color: "#ffffff" },
  contactSubheadline: "그래픽 디자인 관련 제안을 환영합니다.\n포트폴리오 문의나 협업 제안도 편하게 연락 주세요.",
  contactSubheadlineStyle: { fontSize: 21, lineHeight: 1.33, letterSpacing: -0.03, fontWeight: 400, color: "rgba(255,255,255,0.4)" },
  workMetadataLabelStyle: { fontSize: 10, lineHeight: 1, letterSpacing: 0.15, fontWeight: 900, color: "#888888" },
  workMetadataValueStyle: { fontSize: 14, lineHeight: 1.2, letterSpacing: -0.01, fontWeight: 700, color: "#ffffff" },
  workOneLinerStyle: { fontSize: 20, lineHeight: 1.4, letterSpacing: -0.02, fontWeight: 500, color: "#aaaaaa" },
  workDetailHeaderBrandStyle: { fontSize: 90, lineHeight: 0.9, letterSpacing: -0.02, fontWeight: 900, color: "#ffffff" },
  workDetailHeaderTitleStyle: { fontSize: 28, lineHeight: 1.2, letterSpacing: -0.04, fontWeight: 800, color: "#ffffff" },
  workDetailHeaderBulletStyle: { fontSize: 16, lineHeight: 1.45, letterSpacing: -0.02, fontWeight: 500, color: "#cccccc" },
  workDetailTabStyle: { fontSize: 14, lineHeight: 1, letterSpacing: 0.1, fontWeight: 900, color: "#347bed" },
};

export const INITIAL_MENU: SidebarMenu = {
  main: "Main",
  about: "About",
  capability: "Capability",
  contact: "Contact"
};

export const INITIAL_WORKS: WorkItem[] = [
  {
    id: '1',
    brand: 'aise (에이세)',
    company: '현대홈쇼핑',
    category: '여성 이너웨어 / 데일리웨어',
    oneLiner: '현대홈쇼핑 패션 브랜드 / 이너웨어 & 의류',
    thumbnail: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800',
    role: '브랜드 및 상품 중심의 명확한 메시지와 할인율 강조로 클릭 유도\n브랜드 감성을 살리기 위해 CI 및 모델컷으로 정제된 레이아웃 사용\n제품별 컬러를 반영한 배경 및 통일성 있는 타이포그래피로 브랜드 일관성 유지',
    media: ['카카오 채널', '메타', '디지털 광고 배너', '홈쇼핑 연계 온라인 프로모션'],
    creativeDirections: [],
    visuals: [
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'
    ]
  }
];
