import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Page, WorkItem, SiteInfo, SidebarMenu, TypographyStyle } from './types';
import { INITIAL_WORKS, INITIAL_SITE_INFO, INITIAL_MENU } from './constants';
import {
  ArrowRight,
  Plus,
  Trash2,
  LogIn,
  X,
  Edit2,
  ChevronLeft,
  Sliders,
  Image as ImageIcon,
  Download,
  Clipboard,
  Link as LinkIcon,
} from 'lucide-react';

/** -------------------------
 * Utils
 * ------------------------- */
const isMediaVideo = (src: string) => {
  if (!src) return false;
  return (
    src.startsWith('data:video') ||
    src.toLowerCase().endsWith('.mp4') ||
    src.toLowerCase().endsWith('.mov') ||
    src.toLowerCase().endsWith('.webm')
  );
};

/** -------------------------
 * Components
 * ------------------------- */
const StyledText: React.FC<{ text: string; pointColor: string }> = ({ text, pointColor }) => {
  if (!text) return null;
  const parts = text.split(/(\{.*?\})/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('{') && part.endsWith('}')) {
          const content = part.slice(1, -1);
          const [displayText, customColor] = content.split('|');
          return (
            <span key={i} style={{ color: customColor || pointColor }}>
              {displayText}
            </span>
          );
        }
        return part;
      })}
    </>
  );
};

const WorkCard: React.FC<{ work: WorkItem; onClick: () => void }> = ({ work, onClick }) => {
  const displayMedia = work.thumbnail || (work.visuals && work.visuals[0]);
  const isVideo = isMediaVideo(displayMedia);
  const isVertical = work.category === '상세페이지';

  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer overflow-hidden rounded-[2rem] bg-[#111] border border-white/5 ${
        isVertical ? 'aspect-[3/4]' : 'aspect-square'
      } transition-all duration-700 hover:shadow-2xl hover:border-white/10`}
    >
      {displayMedia ? (
        isVideo ? (
          <video
            src={displayMedia}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
            muted
            loop
            autoPlay
            playsInline
          />
        ) : (
          <img
            src={displayMedia}
            alt={work.brand}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
            onError={(e) => {
              // 썸네일 깨졌을 때 UI 깨짐 방지: 그냥 숨김 처리
              e.currentTarget.style.display = 'none';
            }}
          />
        )
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[#111] text-white/10">
          <ImageIcon size={48} />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-10 flex flex-col justify-end">
        <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
          <p className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">{work.company}</p>
          <h3 className="text-2xl font-black text-white tracking-tight">{work.brand}</h3>
          <p className="text-sm text-white/60 font-medium line-clamp-1">{work.oneLiner}</p>
        </div>
      </div>
    </div>
  );
};

/** ✅ 없어서 빌드 터지던 VisualItem 컴포넌트 */
const VisualItem: React.FC<{
  src: string;
  index: number;
  isVertical?: boolean;
  onClick: (src: string) => void;
}> = ({ src, index, isVertical, onClick }) => {
  const isVideo = isMediaVideo(src);

  return (
    <div
      onClick={() => onClick(src)}
      className={`overflow-hidden group bg-[#111] rounded-[1.5rem] lg:rounded-[2rem] transition-all duration-500 ${
        isVertical ? 'aspect-[3/4]' : 'aspect-square'
      } border border-white/5 relative cursor-pointer hover:shadow-xl hover:border-white/20`}
    >
      <div className="w-full h-full">
        {isVideo ? (
          <video
            src={src}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={src}
            alt={`Work ${index}`}
            className="w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105 group-hover:opacity-100"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800?text=Visual+Load+Failed';
            }}
          />
        )}
        <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </div>
  );
};

const Lightbox: React.FC<{ src: string; onClose: () => void }> = ({ src, onClose }) => {
  const isVideo = isMediaVideo(src);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center p-4 sm:p-8 lg:p-10 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto"
      onClick={onClose}
    >
      <button
        className="fixed top-6 right-6 lg:top-10 lg:right-10 text-white/50 hover:text-white transition-all z-[210] p-4 bg-white/10 rounded-full shadow-lg backdrop-blur-md"
        onClick={onClose}
      >
        <X size={32} />
      </button>
      <div
        className="relative max-w-4xl w-full my-auto flex flex-col items-center justify-center py-10"
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo ? (
          <video src={src} className="w-full rounded-3xl shadow-2xl" controls autoPlay playsInline />
        ) : (
          <img src={src} alt="Expanded view" className="w-full h-auto object-contain rounded-3xl shadow-2xl" />
        )}
      </div>
    </div>
  );
};

const StyleControl: React.FC<{
  label: string;
  style: TypographyStyle;
  onChange: (newStyle: TypographyStyle) => void;
}> = ({ label, style, onChange }) => (
  <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/10 space-y-4 text-left">
    <div className="flex items-center gap-2 text-point mb-2">
      <Sliders size={14} />
      <span className="text-[10px] font-black uppercase tracking-widest">{label} Style</span>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <label className="text-[9px] text-white/30 font-bold uppercase">Size (px)</label>
        <input
          type="number"
          value={style?.fontSize || 16}
          onChange={(e) => onChange({ ...style, fontSize: Number(e.target.value) })}
          className="w-full bg-[#222] border border-white/10 rounded-xl p-2 text-xs font-bold text-white focus:border-point outline-none"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[9px] text-white/30 font-bold uppercase">Line Height</label>
        <input
          type="number"
          step="0.1"
          value={style?.lineHeight || 1.2}
          onChange={(e) => onChange({ ...style, lineHeight: Number(e.target.value) })}
          className="w-full bg-[#222] border border-white/10 rounded-xl p-2 text-xs font-bold text-white focus:border-point outline-none"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[9px] text-white/30 font-bold uppercase">Letter Spacing</label>
        <input
          type="number"
          step="0.01"
          value={style?.letterSpacing || 0}
          onChange={(e) => onChange({ ...style, letterSpacing: Number(e.target.value) })}
          className="w-full bg-[#222] border border-white/10 rounded-xl p-2 text-xs font-bold text-white focus:border-point outline-none"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[9px] text-white/30 font-bold uppercase">Weight</label>
        <select
          value={style?.fontWeight || 400}
          onChange={(e) => onChange({ ...style, fontWeight: Number(e.target.value) })}
          className="w-full bg-[#222] border border-white/10 rounded-xl p-2 text-xs font-bold text-white focus:border-point outline-none appearance-none"
        >
          <option value="100">Thin</option>
          <option value="300">Light</option>
          <option value="400">Regular</option>
          <option value="500">Medium</option>
          <option value="700">Bold</option>
          <option value="900">Black</option>
        </select>
      </div>
      <div className="col-span-2 space-y-1">
        <label className="text-[9px] text-white/30 font-bold uppercase">Color (Hex)</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={style?.color || '#ffffff'}
            onChange={(e) => onChange({ ...style, color: e.target.value })}
            className="h-9 w-12 bg-[#222] border border-white/10 rounded-xl p-1 cursor-pointer"
          />
          <input
            type="text"
            value={style?.color || '#ffffff'}
            onChange={(e) => onChange({ ...style, color: e.target.value })}
            className="flex-1 bg-[#222] border border-white/10 rounded-xl p-2 text-xs font-bold text-white focus:border-point outline-none"
          />
        </div>
      </div>
    </div>
  </div>
);

/** -------------------------
 * App
 * ------------------------- */
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.MAIN);
  const [selectedWorkId, setSelectedWorkId] = useState<string | undefined>();

  const [works, setWorks] = useState<WorkItem[]>(() => {
    try {
      const saved = localStorage.getItem('chiro_works_v2');
      return saved ? JSON.parse(saved) : INITIAL_WORKS;
    } catch {
      return INITIAL_WORKS;
    }
  });

  const [siteInfo, setSiteInfo] = useState<SiteInfo>(() => {
    try {
      const saved = localStorage.getItem('chiro_site_info_v2');
      if (saved) return { ...INITIAL_SITE_INFO, ...JSON.parse(saved) };
    } catch {}
    return INITIAL_SITE_INFO;
  });

  const [menuLabels, setMenuLabels] = useState<SidebarMenu>(() => {
    try {
      const saved = localStorage.getItem('chiro_menu_v2');
      return saved ? JSON.parse(saved) : INITIAL_MENU;
    } catch {
      return INITIAL_MENU;
    }
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [editingWork, setEditingWork] = useState<WorkItem | null>(null);
  const [newVisualUrl, setNewVisualUrl] = useState('');
  const [adminTab, setAdminTab] = useState<'works' | 'main' | 'about' | 'capability' | 'contact' | 'menu' | 'system'>(
    'works'
  );
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [expandedMedia, setExpandedMedia] = useState<string | null>(null);

  const workSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('chiro_works_v2', JSON.stringify(works));
      localStorage.setItem('chiro_site_info_v2', JSON.stringify(siteInfo));
      localStorage.setItem('chiro_menu_v2', JSON.stringify(menuLabels));
    } catch (e) {
      console.warn('Storage limit exceeded.', e);
      if (e instanceof Error && e.name === 'QuotaExceededError') {
        setSaveStatus('Storage Full!');
        setTimeout(() => setSaveStatus(null), 3000);
      }
    }
  }, [works, siteInfo, menuLabels]);

  const navigate = (page: Page, workId?: string) => {
    setCurrentPage(page);
    setSelectedWorkId(workId);
    setEditingWork(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1264') setIsAdmin(true);
  };

  const exportConfig = () => {
    const config = { works, siteInfo, menuLabels };
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setSaveStatus('Exported!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const getStyle = (s: TypographyStyle, isMobile?: boolean) => {
    if (!s) return { color: '#ffffff' };
    const fontSize = isMobile && s.fontSize > 40 ? Math.max(32, s.fontSize * 0.6) : s.fontSize;
    return {
      fontSize: `${fontSize}px`,
      lineHeight: s.lineHeight || 1.2,
      letterSpacing: `${s.letterSpacing || 0}em`,
      fontWeight: s.fontWeight || 400,
      color: s.color || '#ffffff',
      whiteSpace: 'pre-line' as const,
    };
  };

  const addGalleryVisual = () => {
    if (!newVisualUrl.trim() || !editingWork) return;
    setEditingWork({
      ...editingWork,
      visuals: [...editingWork.visuals, newVisualUrl.trim()],
    });
    setNewVisualUrl('');
  };

  const currentWork = works.find((w) => w.id === selectedWorkId);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-point selection:text-white overflow-x-hidden">
      <style>{`
        :root { --point-color: ${siteInfo.pointColor} !important; }
        .text-point { color: ${siteInfo.pointColor} !important; }
        .bg-point { background-color: ${siteInfo.pointColor} !important; }
        .border-point { border-color: ${siteInfo.pointColor} !important; }
        h1, h2, p { word-break: keep-all; }
      `}</style>

      <Sidebar
        works={works}
        currentPage={currentPage}
        selectedWorkId={selectedWorkId}
        onNavigate={navigate}
        menuLabels={menuLabels}
        sidebarStyle={siteInfo.sidebarStyle}
      />

      <main className="lg:pl-64 transition-all duration-500 min-h-screen w-full relative bg-black">
        {expandedMedia && <Lightbox src={expandedMedia} onClose={() => setExpandedMedia(null)} />}

        {currentPage === Page.MAIN && (
          <section className="fade-up text-center overflow-x-hidden bg-black relative">
            <div className="relative pt-24 lg:pt-40 pb-16 lg:pb-32 px-5 sm:px-12 lg:px-24">
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
                <div className="absolute inset-0 bg-black" />
              </div>

              <div className="max-w-6xl mx-auto space-y-16 lg:space-y-24 relative z-10">
                <div className="space-y-10 lg:space-y-16">
                  <h2
                    style={getStyle(siteInfo.heroHeadlineStyle, true)}
                    className="tracking-tighter mx-auto text-white max-w-[18ch] sm:max-w-none leading-[1.05] px-1"
                  >
                    <StyledText text={siteInfo.heroHeadline} pointColor={siteInfo.pointColor} />
                  </h2>

                  <div className="h-px w-24 mx-auto bg-white/10"></div>

                  <p
                    style={getStyle(siteInfo.heroSubheadlineStyle, true)}
                    className="max-w-[36ch] sm:max-w-3xl mx-auto text-white/70 px-2"
                  >
                    <StyledText text={siteInfo.heroSubheadline} pointColor={siteInfo.pointColor} />
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6">
                  <button
                    onClick={() => workSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white text-black px-8 lg:px-10 py-4 lg:py-5 rounded-full font-black text-sm lg:text-base flex items-center justify-center gap-3 hover:bg-point hover:text-white transition-all duration-500 w-full sm:w-auto shadow-lg"
                  >
                    WORK ARCHIVE <ArrowRight size={18} />
                  </button>

                  <button
                    onClick={() => navigate(Page.CONTACT)}
                    className="px-8 lg:px-10 py-4 lg:py-5 rounded-full font-black text-sm lg:text-base border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all duration-500 text-center w-full sm:w-auto"
                  >
                    CONTACT
                  </button>
                </div>
              </div>
            </div>

            <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] bg-white py-20 lg:py-32 border-y border-black/5 z-10">
              <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-24">
                <p
                  style={{ ...getStyle(siteInfo.mainIntroTextStyle, true), color: '#000000' }}
                  className="tracking-tight max-w-5xl mx-auto"
                >
                  <StyledText text={siteInfo.mainIntroText} pointColor={siteInfo.pointColor} />
                </p>
              </div>
            </div>

            <div className="max-w-6xl mx-auto space-y-16 lg:space-y-24 pt-16 lg:pt-32 bg-black relative z-10">
              <div className="flex flex-col items-center">
                <h3 style={getStyle(siteInfo.designProcessTitleStyle)} className="tracking-tighter uppercase">
                  <StyledText text={siteInfo.designProcessTitle} pointColor={siteInfo.pointColor} />
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {siteInfo.designProcessSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="relative group p-6 sm:p-8 lg:p-10 bg-[#0a0a0a] border border-white/5 rounded-[1.5rem] lg:rounded-[2rem] text-left space-y-4 lg:space-y-6 hover:shadow-2xl transition-all duration-500 shadow-xl hover:border-white/10"
                  >
                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-black text-sm shadow-xl z-10 transition-transform group-hover:scale-110">
                      0{idx + 1}
                    </div>
                    <h4 style={getStyle(siteInfo.designProcessStepTitleStyle)} className="tracking-tight pt-2 text-white">
                      {step.title}
                    </h4>
                    <p style={getStyle(siteInfo.designProcessStepDescriptionStyle)} className="leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              ref={workSectionRef}
              className="max-w-7xl mx-auto space-y-12 lg:space-y-20 pt-12 lg:pt-20 pb-20 lg:pb-32 bg-black relative z-10"
            >
              <div className="flex flex-col items-center gap-4">
                <span style={getStyle(siteInfo.worksGalleryTitleStyle)} className="uppercase tracking-[0.4em] font-black">
                  <StyledText text={siteInfo.worksGalleryTitle} pointColor={siteInfo.pointColor} />
                </span>
                <div className="w-24 h-px bg-white/10"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
                {works.map((work) => (
                  <WorkCard key={work.id} work={work} onClick={() => navigate(Page.WORK_DETAIL, work.id)} />
                ))}
              </div>
            </div>
          </section>
        )}

        {currentPage === Page.ABOUT && (
          <section className="min-h-screen py-32 lg:py-40 px-6 sm:px-12 lg:px-24 space-y-24 lg:space-y-48 fade-up text-center bg-black">
            <div className="max-w-5xl mx-auto">
              <h2 style={getStyle(siteInfo.aboutIntroStyle, true)} className="tracking-tighter mx-auto text-white">
                <StyledText text={siteInfo.aboutIntro} pointColor={siteInfo.pointColor} />
              </h2>
            </div>

            <div className="max-w-5xl mx-auto">
              {[
                { label: siteInfo.aboutPerspectiveLabel, text: siteInfo.aboutDesignCriteria },
                { label: siteInfo.aboutWorkingStyleLabel, text: siteInfo.aboutWorkingStyle },
                { label: siteInfo.aboutExperienceLabel, text: siteInfo.aboutExperience },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center gap-8 py-16 border-t ${idx === 0 ? 'border-white/20' : 'border-white/5'}`}
                  style={{ marginBottom: idx === 2 ? 0 : siteInfo.aboutSectionSpacing }}
                >
                  <div className="w-full">
                    <h3 style={getStyle(siteInfo.cardTitleStyle)} className="uppercase tracking-[0.2em] font-black text-white">
                      {item.label}
                    </h3>
                  </div>
                  <div className="max-w-3xl">
                    <p style={{ ...getStyle(siteInfo.bodyTextStyle), lineHeight: 1.55 }} className="mx-auto text-white/80">
                      <StyledText text={item.text} pointColor={siteInfo.pointColor} />
                    </p>
                  </div>
                </div>
              ))}

              <div className="pt-24 lg:pt-32">
                <div className="bg-[#0a0a0a] p-10 lg:p-16 rounded-[1.5rem] lg:rounded-[2rem] text-center border border-white/5 shadow-inner">
                  <p style={{ ...getStyle(siteInfo.aboutClosingStyle, true), color: '#ffffff' }} className="mx-auto leading-tight max-w-4xl">
                    <StyledText text={siteInfo.aboutClosing} pointColor={siteInfo.pointColor} />
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {currentPage === Page.CAPABILITY && (
          <section className="min-h-screen py-32 lg:py-40 px-6 sm:px-12 lg:px-24 flex flex-col items-center justify-center fade-up text-center bg-black">
            <div className="max-w-6xl mx-auto space-y-16 lg:space-y-24 w-full">
              <h2
                style={getStyle(siteInfo.capabilitiesTitleStyle, true)}
                className="tracking-tighter text-white border-b border-white/10 pb-8 lg:pb-12 mx-auto"
              >
                <StyledText text={siteInfo.capabilitiesTitle} pointColor={siteInfo.pointColor} />
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 w-full">
                {siteInfo.capabilities.map((cap, i) => (
                  <div
                    key={i}
                    className="space-y-6 lg:space-y-8 flex flex-col items-center p-12 bg-[#0a0a0a] rounded-[2rem] border border-white/5 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 hover:border-white/10"
                  >
                    <h3 style={getStyle(siteInfo.capabilityItemTitleStyle)} className="mx-auto text-white">
                      <StyledText text={cap.title} pointColor={siteInfo.pointColor} />
                    </h3>
                    <p style={getStyle(siteInfo.capabilityItemDescriptionStyle)} className="max-w-lg mx-auto text-white/50">
                      <StyledText text={cap.description} pointColor={siteInfo.pointColor} />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {currentPage === Page.CONTACT && (
          <section className="min-h-screen flex items-center justify-center px-6 sm:px-12 lg:px-16 py-32 fade-up text-center bg-black">
            <div className="max-w-6xl w-full space-y-16 lg:space-y-32">
              <div className="space-y-8">
                <h2 style={getStyle(siteInfo.contactHeadlineStyle, true)} className="tracking-tighter leading-none text-center mx-auto text-white">
                  <StyledText text={siteInfo.contactHeadline} pointColor={siteInfo.pointColor} />
                </h2>
                <p style={getStyle(siteInfo.contactSubheadlineStyle, true)} className="max-w-3xl mx-auto text-center">
                  <StyledText text={siteInfo.contactSubheadline} pointColor={siteInfo.pointColor} />
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden w-full mx-auto shadow-2xl border border-white/5">
                <div className="p-10 lg:p-20 bg-black hover:bg-white group transition-all duration-700 text-center flex flex-col items-center justify-center border-r border-white/5">
                  <p className="text-[10px] text-white/40 group-hover:text-black/40 uppercase tracking-[0.5em] font-black mb-4 lg:mb-6 mx-auto transition-colors">
                    Email Address
                  </p>
                  <a
                    href="mailto:h7466@naver.com"
                    className="text-xl lg:text-3xl font-black text-white group-hover:text-black block break-all mx-auto transition-colors"
                  >
                    h7466@naver.com
                  </a>
                </div>

                <div className="p-10 lg:p-20 bg-black hover:bg-white group transition-all duration-700 text-center flex flex-col items-center justify-center">
                  <p className="text-[10px] text-white/40 group-hover:text-black/40 uppercase tracking-[0.5em] font-black mb-4 lg:mb-6 mx-auto transition-colors">
                    Mobile Contact
                  </p>
                  <a
                    href="tel:010-4796-7464"
                    className="text-xl lg:text-3xl font-black text-white group-hover:text-black block mx-auto transition-colors"
                  >
                    010-4796-7464
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {currentPage === Page.WORK_DETAIL && currentWork && (
          <section className="min-h-screen py-24 lg:py-32 px-6 sm:px-12 lg:px-24 space-y-16 lg:space-y-24 fade-up bg-black">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16 py-10 lg:py-16">
                <div className="w-full lg:w-1/2 flex items-center justify-start">
                  <div className="relative inline-block">
                    <h1 style={getStyle(siteInfo.workDetailHeaderBrandStyle, true)} className="text-white leading-none">
                      {currentWork.brand}
                    </h1>
                  </div>
                </div>

                <div className="w-full lg:w-1/2 space-y-8 lg:space-y-10 text-left">
                  <div className="space-y-4">
                    <p className="text-white font-black tracking-tight text-lg lg:text-xl uppercase">{currentWork.company}</p>
                    <h2 style={getStyle(siteInfo.workDetailHeaderTitleStyle, true)} className="tracking-tight leading-tight text-white">
                      {currentWork.oneLiner}
                    </h2>
                  </div>

                  <div className="space-y-2.5">
                    {currentWork.role.split('\n').map((line, i) => (
                      <p key={i} style={getStyle(siteInfo.workDetailHeaderBulletStyle)} className="text-white/60">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center py-16 lg:py-20 space-y-4">
                <div className="flex items-center gap-3 text-point">
                  <ImageIcon size={20} className="text-point" />
                  <span style={getStyle(siteInfo.workDetailTabStyle)} className="uppercase tracking-[0.3em]">
                    Creative_Media
                  </span>
                </div>
                <div className="w-20 lg:w-24 h-1 bg-point rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {currentWork.visuals.map((img, i) => (
                  <VisualItem
                    key={i}
                    src={img}
                    index={i}
                    isVertical={currentWork.category === '상세페이지'}
                    onClick={setExpandedMedia}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {currentPage === Page.ADMIN && (
          <section className="min-h-screen py-32 lg:py-40 px-6 sm:px-12 lg:px-24 fade-up bg-black">
            {!isAdmin ? (
              <div className="max-w-md mx-auto p-10 lg:p-16 border border-white/10 rounded-[1.5rem] lg:rounded-[2rem] space-y-12 text-center bg-[#0a0a0a] shadow-2xl">
                <LogIn className="mx-auto text-white" size={48} />
                <h2 className="text-2xl lg:text-3xl font-black mx-auto text-white">Admin Access</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Security Key"
                    className="w-full p-5 lg:p-6 bg-[#111] border border-white/10 rounded-2xl font-bold text-white text-center tracking-[0.5em] lg:tracking-[1em] outline-none focus:border-point"
                  />
                  <button
                    type="submit"
                    className="w-full bg-white text-black p-5 lg:p-6 rounded-2xl font-black hover:bg-point hover:text-white transition-all"
                  >
                    Unlock Terminal
                  </button>
                </form>
              </div>
            ) : (
              <div className="max-w-6xl mx-auto space-y-12 lg:space-y-16 text-white bg-black">
                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/10 pb-8 lg:pb-10 gap-6">
                  <h2 className="text-3xl lg:text-4xl font-black tracking-tighter text-white">Terminal Settings</h2>
                  <div className="flex flex-wrap gap-2 justify-center bg-[#111] p-2 rounded-full border border-white/5">
                    {['works', 'main', 'about', 'capability', 'contact', 'menu', 'system'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setAdminTab(t as any)}
                        className={`px-4 lg:px-6 py-2 lg:py-2.5 rounded-full font-bold text-[10px] lg:text-xs transition-all uppercase tracking-widest ${
                          adminTab === t ? 'bg-white text-black' : 'text-white/30 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 p-6 lg:p-16 rounded-[1.5rem] lg:rounded-[2rem] w-full text-center shadow-sm relative overflow-hidden">
                  {saveStatus && (
                    <div className="absolute top-4 right-4 bg-point text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest animate-bounce z-50">
                      {saveStatus}
                    </div>
                  )}

                  {adminTab === 'works' &&
                    (editingWork ? (
                      <div className="space-y-12 text-left">
                        <button
                          onClick={() => setEditingWork(null)}
                          className="flex items-center gap-2 font-bold text-white/30 hover:text-white transition-all"
                        >
                          <ChevronLeft size={16} /> Back
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-8">
                            <label className="text-[10px] font-black uppercase tracking-widest">
                              Header Text (Left Side Underline)
                            </label>
                            <input
                              className="w-full p-5 bg-[#111] border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-point"
                              value={editingWork.brand}
                              onChange={(e) => setEditingWork({ ...editingWork, brand: e.target.value })}
                            />

                            <label className="text-[10px] font-black uppercase tracking-widest">
                              Metadata Top Line (e.g. Company Name)
                            </label>
                            <input
                              className="w-full p-5 bg-[#111] border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-point"
                              value={editingWork.company}
                              onChange={(e) => setEditingWork({ ...editingWork, company: e.target.value })}
                            />

                            <label className="text-[10px] font-black uppercase tracking-widest">
                              Metadata Middle Line (One-Liner Headline)
                            </label>
                            <input
                              className="w-full p-5 bg-[#111] border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-point"
                              value={editingWork.oneLiner}
                              onChange={(e) => setEditingWork({ ...editingWork, oneLiner: e.target.value })}
                            />

                            <label className="text-[10px] font-black uppercase tracking-widest">
                              Metadata Bottom Section (Role / Description)
                            </label>
                            <textarea
                              className="w-full p-5 bg-[#111] border border-white/10 rounded-2xl text-white min-h-[150px] outline-none focus:border-point"
                              placeholder="Enter text. No automatic bullets."
                              value={editingWork.role}
                              onChange={(e) => setEditingWork({ ...editingWork, role: e.target.value })}
                            />
                          </div>

                          <div className="space-y-8">
                            <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                              <ImageIcon size={12} /> Archive Thumbnail URL
                            </label>

                            <div className="space-y-3">
                              <input
                                className="w-full p-5 bg-[#111] border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-point"
                                placeholder="Paste Image/Video URL here..."
                                value={editingWork.thumbnail || ''}
                                onChange={(e) => setEditingWork({ ...editingWork, thumbnail: e.target.value })}
                              />

                              {editingWork.thumbnail && (
                                <div className="p-4 bg-[#111] border border-white/5 rounded-2xl flex items-center justify-center">
                                  {isMediaVideo(editingWork.thumbnail) ? (
                                    <video src={editingWork.thumbnail} className="max-h-32 rounded-xl" muted />
                                  ) : (
                                    <img
                                      src={editingWork.thumbnail}
                                      className="max-h-32 rounded-xl"
                                      onError={(e) =>
                                        ((e.target as HTMLImageElement).src =
                                          'https://via.placeholder.com/150?text=Invalid+URL')
                                      }
                                    />
                                  )}
                                </div>
                              )}
                            </div>

                            <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 pt-4">
                              <LinkIcon size={12} /> Gallery Visuals (Add URL)
                            </label>

                            <div className="flex gap-2">
                              <input
                                className="flex-1 p-5 bg-[#111] border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-point"
                                placeholder="Paste Visual URL (Image/Video)..."
                                value={newVisualUrl}
                                onChange={(e) => setNewVisualUrl(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addGalleryVisual()}
                              />
                              <button
                                onClick={addGalleryVisual}
                                className="px-8 bg-point text-white rounded-2xl font-black hover:opacity-80 transition-all"
                              >
                                ADD
                              </button>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mt-4">
                              {editingWork.visuals.map((v, i) => {
                                const isVid = isMediaVideo(v);
                                return (
                                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/5 bg-[#111]">
                                    {isVid ? (
                                      <video src={v} className="w-full h-full object-cover" muted />
                                    ) : (
                                      <img
                                        src={v}
                                        className="w-full h-full object-cover"
                                        onError={(e) =>
                                          ((e.target as HTMLImageElement).src =
                                            'https://via.placeholder.com/150?text=Invalid+URL')
                                        }
                                      />
                                    )}
                                    <button
                                      onClick={() =>
                                        setEditingWork({
                                          ...editingWork,
                                          visuals: editingWork.visuals.filter((_, idx) => idx !== i),
                                        })
                                      }
                                      className="absolute top-1 right-1 bg-black/80 rounded-full p-1.5 transition-all hover:bg-red-500 shadow-lg"
                                    >
                                      <X size={12} />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setWorks(
                              works
                                .map((w) => (w.id === editingWork.id ? editingWork : w))
                                .concat(works.find((w) => w.id === editingWork.id) ? [] : [editingWork])
                            );
                            setEditingWork(null);
                          }}
                          className="w-full bg-white text-black p-6 rounded-2xl font-black hover:bg-point hover:text-white transition-all uppercase tracking-widest"
                        >
                          Save Project Changes
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <button
                          onClick={() =>
                            setEditingWork({
                              id: Date.now().toString(),
                              brand: 'New Project',
                              company: '',
                              category: '',
                              oneLiner: '',
                              thumbnail: '',
                              role: '',
                              media: [],
                              creativeDirections: [],
                              visuals: [],
                            })
                          }
                          className="p-8 border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center gap-4 hover:border-point hover:text-point transition-all"
                        >
                          <Plus size={32} />
                          <span className="font-black uppercase tracking-widest text-xs">New Project Entry</span>
                        </button>

                        {works.map((w) => (
                          <div key={w.id} className="p-8 bg-[#111] border border-white/5 rounded-[2rem] flex flex-col items-center justify-between group">
                            <span className="font-black text-xl mb-4 text-center">{w.brand}</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingWork(w)}
                                className="p-3 bg-white/5 rounded-xl hover:bg-white hover:text-black transition-all"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('Are you sure?')) setWorks(works.filter((x) => x.id !== w.id));
                                }}
                                className="p-3 bg-red-900/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}

                  {adminTab === 'main' && (
                    <div className="space-y-16 text-left animate-in fade-in">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-6">
                          <label className="text-[10px] font-black uppercase tracking-widest">Hero Headline</label>
                          <textarea
                            className="w-full p-5 bg-[#111] border border-white/10 rounded-2xl text-white outline-none focus:border-point min-h-[100px]"
                            value={siteInfo.heroHeadline}
                            onChange={(e) => setSiteInfo({ ...siteInfo, heroHeadline: e.target.value })}
                          />
                          <StyleControl
                            label="Headline Style"
                            style={siteInfo.heroHeadlineStyle}
                            onChange={(s) => setSiteInfo({ ...siteInfo, heroHeadlineStyle: s })}
                          />
                        </div>
                        <div className="space-y-6">
                          <label className="text-[10px] font-black uppercase tracking-widest">Hero Subheadline</label>
                          <textarea
                            className="w-full p-5 bg-[#111] border border-white/10 rounded-2xl text-white outline-none focus:border-point min-h-[100px]"
                            value={siteInfo.heroSubheadline}
                            onChange={(e) => setSiteInfo({ ...siteInfo, heroSubheadline: e.target.value })}
                          />
                          <StyleControl
                            label="Subheadline Style"
                            style={siteInfo.heroSubheadlineStyle}
                            onChange={(s) => setSiteInfo({ ...siteInfo, heroSubheadlineStyle: s })}
                          />
                        </div>
                      </div>

                      <div className="pt-10 border-t border-white/5 space-y-8">
                        <label className="text-[10px] font-black uppercase tracking-widest block">
                          Narrative Intro (White Box Section)
                        </label>
                        <textarea
                          className="w-full p-6 bg-[#111] border border-white/10 rounded-3xl text-white outline-none focus:border-point min-h-[120px] font-bold"
                          value={siteInfo.mainIntroText}
                          onChange={(e) => setSiteInfo({ ...siteInfo, mainIntroText: e.target.value })}
                        />
                        <StyleControl
                          label="Intro Text Style"
                          style={siteInfo.mainIntroTextStyle}
                          onChange={(s) => setSiteInfo({ ...siteInfo, mainIntroTextStyle: s })}
                        />
                      </div>

                      <div className="pt-10 border-t border-white/5 space-y-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                          <div className="space-y-6">
                            <label className="text-[10px] font-black uppercase tracking-widest block">
                              Design Process Header
                            </label>
                            <input
                              className="w-full p-4 bg-[#111] border border-white/10 rounded-2xl text-white outline-none focus:border-point"
                              value={siteInfo.designProcessTitle}
                              onChange={(e) => setSiteInfo({ ...siteInfo, designProcessTitle: e.target.value })}
                            />
                          </div>
                          <StyleControl
                            label="Process Title Style"
                            style={siteInfo.designProcessTitleStyle}
                            onChange={(s) => setSiteInfo({ ...siteInfo, designProcessTitleStyle: s })}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                          {siteInfo.designProcessSteps.map((step, idx) => (
                            <div key={idx} className="p-6 bg-[#111] border border-white/5 rounded-[1.5rem] space-y-4">
                              <label className="text-[8px] font-black text-white/30 uppercase tracking-widest">
                                Step 0{idx + 1}
                              </label>
                              <input
                                className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-point"
                                value={step.title}
                                onChange={(e) => {
                                  const newSteps = [...siteInfo.designProcessSteps];
                                  newSteps[idx].title = e.target.value;
                                  setSiteInfo({ ...siteInfo, designProcessSteps: newSteps });
                                }}
                              />
                              <textarea
                                className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white/60 text-xs outline-none focus:border-point min-h-[80px]"
                                value={step.description}
                                onChange={(e) => {
                                  const newSteps = [...siteInfo.designProcessSteps];
                                  newSteps[idx].description = e.target.value;
                                  setSiteInfo({ ...siteInfo, designProcessSteps: newSteps });
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-10 border-t border-white/5 space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                          <div className="space-y-6">
                            <label className="text-[10px] font-black uppercase tracking-widest block">
                              Gallery Section Title
                            </label>
                            <input
                              className="w-full p-4 bg-[#111] border border-white/10 rounded-2xl text-white outline-none focus:border-point"
                              value={siteInfo.worksGalleryTitle}
                              onChange={(e) => setSiteInfo({ ...siteInfo, worksGalleryTitle: e.target.value })}
                            />
                          </div>
                          <StyleControl
                            label="Gallery Title Style"
                            style={siteInfo.worksGalleryTitleStyle}
                            onChange={(s) => setSiteInfo({ ...siteInfo, worksGalleryTitleStyle: s })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {adminTab === 'about' && (
                    <div className="space-y-16 text-left animate-in fade-in">
                      <div className="space-y-8">
                        <label className="text-[10px] font-black uppercase tracking-widest block">About Intro Heading</label>
                        <textarea
                          className="w-full p-6 bg-[#111] border border-white/10 rounded-3xl text-white outline-none focus:border-point min-h-[100px]"
                          value={siteInfo.aboutIntro}
                          onChange={(e) => setSiteInfo({ ...siteInfo, aboutIntro: e.target.value })}
                        />
                        <StyleControl
                          label="Intro Style"
                          style={siteInfo.aboutIntroStyle}
                          onChange={(s) => setSiteInfo({ ...siteInfo, aboutIntroStyle: s })}
                        />
                      </div>

                      <div className="pt-10 border-t border-white/5 space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-widest block">Card 1: Perspective</label>
                        <div className="space-y-4">
                          <input
                            className="w-full p-4 bg-[#111] border border-white/10 rounded-2xl text-white outline-none focus:border-point font-black"
                            value={siteInfo.aboutPerspectiveLabel}
                            onChange={(e) => setSiteInfo({ ...siteInfo, aboutPerspectiveLabel: e.target.value })}
                          />
                          <textarea
                            className="w-full p-5 bg-[#111] border border-white/10 rounded-2xl text-white/80 outline-none focus:border-point min-h-[100px]"
                            value={siteInfo.aboutDesignCriteria}
                            onChange={(e) => setSiteInfo({ ...siteInfo, aboutDesignCriteria: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="pt-10 border-t border-white/5 space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-widest block">Card 2: Working Style</label>
                        <div className="space-y-4">
                          <input
                            className="w-full p-4 bg-[#111] border border-white/10 rounded-2xl text-white outline-none focus:border-point font-black"
                            value={siteInfo.aboutWorkingStyleLabel}
                            onChange={(e) => setSiteInfo({ ...siteInfo, aboutWorkingStyleLabel: e.target.value })}
                          />
                          <textarea
                            className="w-full p-5 bg-[#111] border border-white/10 rounded-2xl text-white/80 outline-none focus:border-point min-h-[100px]"
                            value={siteInfo.aboutWorkingStyle}
                            onChange={(e) => setSiteInfo({ ...siteInfo, aboutWorkingStyle: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="pt-10 border-t border-white/5 space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-widest block">Card 3: Experience</label>
                        <div className="space-y-4">
                          <input
                            className="w-full p-4 bg-[#111] border border-white/10 rounded-2xl text-white outline-none focus:border-point font-black"
                            value={siteInfo.aboutExperienceLabel}
                            onChange={(e) => setSiteInfo({ ...siteInfo, aboutExperienceLabel: e.target.value })}
                          />
                          <textarea
                            className="w-full p-5 bg-[#111] border border-white/10 rounded-2xl text-white/80 outline-none focus:border-point min-h-[100px]"
                            value={siteInfo.aboutExperience}
                            onChange={(e) => setSiteInfo({ ...siteInfo, aboutExperience: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="pt-10 border-t border-white/5 space-y-8">
                        <label className="text-[10px] font-black uppercase tracking-widest">Closing Message</label>
                        <textarea
                          className="w-full p-5 bg-[#111] border border-white/10 rounded-2xl text-white outline-none focus:border-point font-black"
                          value={siteInfo.aboutClosing}
                          onChange={(e) => setSiteInfo({ ...siteInfo, aboutClosing: e.target.value })}
                        />
                        <StyleControl
                          label="Closing Style"
                          style={siteInfo.aboutClosingStyle}
                          onChange={(s) => setSiteInfo({ ...siteInfo, aboutClosingStyle: s })}
                        />
                      </div>
                    </div>
                  )}

                  {adminTab === 'capability' && (
                    <div className="space-y-16 text-left animate-in fade-in">
                      <div className="space-y-8">
                        <label className="text-[10px] font-black uppercase tracking-widest">Capabilities Header</label>
                        <input
                          className="w-full p-5 bg-[#111] border border-white/10 rounded-2xl text-white outline-none focus:border-point font-black"
                          value={siteInfo.capabilitiesTitle}
                          onChange={(e) => setSiteInfo({ ...siteInfo, capabilitiesTitle: e.target.value })}
                        />
                        <StyleControl
                          label="Header Style"
                          style={siteInfo.capabilitiesTitleStyle}
                          onChange={(s) => setSiteInfo({ ...siteInfo, capabilitiesTitleStyle: s })}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 border-t border-white/5">
                        {siteInfo.capabilities.map((cap, idx) => (
                          <div key={idx} className="p-6 bg-[#111] border border-white/5 rounded-3xl space-y-4">
                            <input
                              className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white font-bold outline-none focus:border-point"
                              value={cap.title}
                              onChange={(e) => {
                                const newCaps = [...siteInfo.capabilities];
                                newCaps[idx].title = e.target.value;
                                setSiteInfo({ ...siteInfo, capabilities: newCaps });
                              }}
                            />
                            <textarea
                              className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white/60 text-xs outline-none focus:border-point min-h-[80px]"
                              value={cap.description}
                              onChange={(e) => {
                                const newCaps = [...siteInfo.capabilities];
                                newCaps[idx].description = e.target.value;
                                setSiteInfo({ ...siteInfo, capabilities: newCaps });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {adminTab === 'contact' && (
                    <div className="space-y-16 text-left animate-in fade-in">
                      <div className="space-y-8">
                        <label className="text-[10px] font-black uppercase tracking-widest block">Contact Page Headline</label>
                        <textarea
                          className="w-full p-6 bg-[#111] border border-white/10 rounded-3xl text-white outline-none focus:border-point min-h-[120px]"
                          value={siteInfo.contactHeadline}
                          onChange={(e) => setSiteInfo({ ...siteInfo, contactHeadline: e.target.value })}
                        />
                        <StyleControl
                          label="Contact Headline Style"
                          style={siteInfo.contactHeadlineStyle}
                          onChange={(s) => setSiteInfo({ ...siteInfo, contactHeadlineStyle: s })}
                        />

                        <label className="text-[10px] font-black uppercase tracking-widest block mt-4">Contact Subheadline</label>
                        <textarea
                          className="w-full p-4 bg-[#111] border border-white/10 rounded-2xl text-white outline-none focus:border-point min-h-[80px]"
                          value={siteInfo.contactSubheadline}
                          onChange={(e) => setSiteInfo({ ...siteInfo, contactSubheadline: e.target.value })}
                        />
                        <StyleControl
                          label="Contact Subheadline Style"
                          style={siteInfo.contactSubheadlineStyle}
                          onChange={(s) => setSiteInfo({ ...siteInfo, contactSubheadlineStyle: s })}
                        />
                      </div>
                    </div>
                  )}

                  {adminTab === 'menu' && (
                    <div className="space-y-12 text-left">
                      <div className="space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-widest">Global Identity Color</label>
                        <div className="flex gap-4">
                          <input
                            type="color"
                            value={siteInfo.pointColor}
                            onChange={(e) => setSiteInfo({ ...siteInfo, pointColor: e.target.value })}
                            className="h-16 w-16 bg-[#111] border border-white/10 rounded-2xl p-1 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={siteInfo.pointColor}
                            onChange={(e) => setSiteInfo({ ...siteInfo, pointColor: e.target.value })}
                            className="flex-1 p-5 bg-[#111] border border-white/10 rounded-2xl text-white font-mono uppercase focus:border-point outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {adminTab === 'system' && (
                    <div className="space-y-10">
                      <div className="p-12 bg-[#111] border border-white/5 rounded-[2rem] flex flex-col items-center gap-6">
                        <Download className="text-white/20" size={48} />
                        <h4 className="font-black uppercase tracking-widest text-xs">Backup & Export</h4>
                        <button
                          onClick={exportConfig}
                          className="bg-white text-black px-10 py-4 rounded-full font-black flex items-center gap-3 hover:bg-point hover:text-white transition-all"
                        >
                          COPY CONFIG JSON <Clipboard size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-center pt-10 pb-20">
                  <button
                    onClick={() => setIsAdmin(false)}
                    className="text-[10px] font-black text-white/20 hover:text-white border-b border-white/10 uppercase tracking-[0.5em] transition-all pb-1"
                  >
                    Exit Admin Terminal
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default App;
