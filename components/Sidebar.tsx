
import React, { useState } from 'react';
import { WorkItem, Page, SidebarMenu, TypographyStyle } from '../types';
import { Lock, ChevronRight, Menu, X } from 'lucide-react';

interface SidebarProps {
  works: WorkItem[];
  currentPage: Page;
  selectedWorkId?: string;
  onNavigate: (page: Page, workId?: string) => void;
  menuLabels: SidebarMenu;
  sidebarStyle: TypographyStyle;
}

export const Sidebar: React.FC<SidebarProps> = ({ works, currentPage, selectedWorkId, onNavigate, menuLabels, sidebarStyle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getStyle = (s: TypographyStyle) => ({
    fontSize: `${s.fontSize}px`,
    lineHeight: s.lineHeight,
    letterSpacing: `${s.letterSpacing}em`,
    fontWeight: s.fontWeight,
    color: s.color || '#000000',
  });

  const handleNav = (page: Page, id?: string) => {
    onNavigate(page, id);
    setIsOpen(false);
  };

  return (
    <>
      <header className="lg:hidden fixed top-0 left-0 w-full z-[100] px-6 py-5 bg-white border-b border-black/5 flex items-center justify-between">
        <button 
          className="text-lg font-black tracking-tighter text-black flex items-center gap-2" 
          onClick={() => handleNav(Page.MAIN)}
        >
          <span className="w-[2px] h-4 bg-black rounded-full" />
          CHIRO.zip
        </button>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 text-black hover:bg-black/5 rounded-full transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[80] transition-opacity duration-300" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-screen w-64 lg:w-64 bg-white border-r border-black/5 z-[90] flex flex-col transition-transform duration-500 ease-out text-black
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <nav className="flex-1 overflow-y-auto px-4 pt-24 pb-10 space-y-14">
          {/* CHIRO.zip Section */}
          <section>
            <h2 className="flex items-center gap-2 px-6 mb-3 text-lg font-bold text-black tracking-tight uppercase whitespace-nowrap">
              <span className="w-[2px] h-5 bg-black rounded-full shrink-0" />
              CHIRO.zip
            </h2>
            <ul className="space-y-0">
              <NavItem 
                label={menuLabels.main} 
                active={currentPage === Page.MAIN} 
                onClick={() => handleNav(Page.MAIN)} 
              />
              <NavItem 
                label={menuLabels.about} 
                active={currentPage === Page.ABOUT} 
                onClick={() => handleNav(Page.ABOUT)} 
              />
              <NavItem 
                label={menuLabels.capability} 
                active={currentPage === Page.CAPABILITY} 
                onClick={() => handleNav(Page.CAPABILITY)} 
              />
            </ul>
          </section>

          {/* WORK Section */}
          <section>
            <div className="flex items-center justify-between px-6 mb-3">
              <h2 className="flex items-center gap-2 text-lg font-bold text-black tracking-tight uppercase whitespace-nowrap">
                <span className="w-[2px] h-5 bg-black rounded-full shrink-0" />
                WORK
              </h2>
            </div>
            <ul className="space-y-0">
              {works.map((work) => {
                const isActive = currentPage === Page.WORK_DETAIL && selectedWorkId === work.id;
                return (
                  <li key={work.id} className="relative">
                    <button
                      onClick={() => handleNav(Page.WORK_DETAIL, work.id)}
                      style={{
                        fontWeight: isActive ? 900 : 500,
                        color: isActive ? 'var(--point-color)' : '#999999'
                      }}
                      className={`w-full text-left px-6 py-1.5 transition-all duration-300 group flex items-center justify-between text-[14px] ${
                        isActive
                          ? 'bg-black/[0.02]'
                          : 'hover:text-black'
                      }`}
                    >
                      <span className="truncate">{work.brand}</span>
                      {isActive && <ChevronRight size={12} className="shrink-0 text-point" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Contact Section */}
          <section>
            <h2 className="flex items-center gap-2 px-6 mb-3 text-lg font-bold text-black tracking-tight uppercase whitespace-nowrap">
              <span className="w-[2px] h-5 bg-black rounded-full shrink-0" />
              Contact me.
            </h2>
            <div className="space-y-1 px-6 pl-10">
              <a href="tel:010-4796-7464" className="block text-[14px] font-medium text-black/60 hover:text-black transition-colors whitespace-nowrap">010.4796.7464</a>
              <a href="mailto:h7466@naver.com" className="block text-[14px] font-medium text-black/60 hover:text-black transition-colors truncate">h7466@naver.com</a>
            </div>
          </section>
        </nav>
      </aside>
    </>
  );
};

const NavItem: React.FC<{ 
  label: string; 
  active: boolean; 
  onClick: () => void; 
}> = ({
  label,
  active,
  onClick
}) => (
  <li className="relative">
    <button
      onClick={onClick}
      style={{
        fontWeight: active ? 900 : 500,
        color: active ? 'var(--point-color)' : '#999999'
      }}
      className={`w-full flex items-center gap-3 px-6 py-1.5 transition-all duration-300 group text-[15px] ${
        active
          ? 'bg-black/[0.02]'
          : 'hover:text-black'
      }`}
    >
      <span className="whitespace-nowrap">{label}</span>
      {active && <ChevronRight size={12} className="shrink-0 ml-auto" />}
    </button>
  </li>
);
