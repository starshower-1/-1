
import React, { useState, useEffect, useMemo } from 'react';
import { SUPPORT_PORTALS, CATEGORIES } from './constants.ts';
import { Portal, Announcement, GroundingSource } from './types.ts';
import { GeminiService } from './services/geminiService.ts';

// 전역에서 인스턴스화하되 내부에서 안전하게 처리됨
const gemini = new GeminiService();

const PortalCard: React.FC<{
  portal: Portal;
  onSelect: (p: Portal) => void;
  isLoading: boolean;
}> = ({ portal, onSelect, isLoading }) => {
  return (
    <div 
      onClick={() => onSelect(portal)}
      className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-600 text-white text-xl">
            <i className={`fa-solid ${portal.icon}`}></i>
          </div>
          <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-500 rounded-lg">
            {portal.category}
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-800 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
          {portal.name}
        </h3>
        <p className="text-sm text-slate-500 mt-2 truncate">
          {new URL(portal.url).hostname}
        </p>
      </div>
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20 backdrop-blur-[1px]">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        </div>
      )}
    </div>
  );
};

const AnnouncementModal: React.FC<{
  portal: Portal;
  notices: Announcement[];
  sources: GroundingSource[];
  onClose: () => void;
  onSummarize: (title: string) => Promise<string>;
}> = ({ portal, notices, sources, onClose, onSummarize }) => {
  const [selectedSummary, setSelectedSummary] = useState<{ title: string; text: string } | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleSummarize = async (title: string) => {
    setIsSummarizing(true);
    try {
      const summary = await onSummarize(title);
      setSelectedSummary({ title, text: summary });
    } catch (e) {
      setSelectedSummary({ title, text: "요약 도중 오류가 발생했습니다." });
    }
    setIsSummarizing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{portal.name}</h2>
            <p className="text-blue-100 text-sm mt-1">최근 업데이트된 공지사항</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {notices.length > 0 ? (
            notices.map((notice, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:border-blue-200 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="flex-1">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{notice.date}</span>
                    <h4 className="text-lg font-bold text-slate-800 mt-1 leading-snug">{notice.title}</h4>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleSummarize(notice.title)}
                      className="whitespace-nowrap px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
                    >
                      <i className="fa-solid fa-wand-magic-sparkles"></i>
                      요약하기
                    </button>
                    <a 
                      href={notice.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="whitespace-nowrap px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
                    >
                      상세보기
                      <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                    </a>
                  </div>
                </div>
                {selectedSummary?.title === notice.title && (
                  <div className="mt-4 p-4 bg-white border border-blue-100 rounded-xl text-slate-700 text-sm leading-relaxed animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold">
                      <i className="fa-solid fa-robot"></i>
                      AI 요약 결과
                    </div>
                    {isSummarizing ? (
                      <div className="flex items-center gap-2 py-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        분석 중...
                      </div>
                    ) : (
                      selectedSummary.text
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-slate-400">
              <i className="fa-solid fa-inbox text-5xl mb-4 block"></i>
              검색된 최신 공지사항이 없습니다.
            </div>
          )}

          {sources.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-100">
              <h5 className="text-sm font-bold text-slate-500 mb-3 flex items-center gap-2">
                <i className="fa-solid fa-link"></i>
                정보 출처 (Google Search)
              </h5>
              <div className="flex flex-wrap gap-2">
                {sources.map((src, i) => (
                  <a 
                    key={i} 
                    href={src.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {src.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <p className="text-sm text-slate-500">
            실시간 업데이트는 <span className="text-blue-600 font-bold">Gemini 3 Flash</span> 기반 Google 검색을 활용합니다.
          </p>
          <a 
            href={portal.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 font-bold hover:underline flex items-center gap-1"
          >
            포털 직접 가기
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPortal, setSelectedPortal] = useState<Portal | null>(null);
  const [loadingPortalId, setLoadingPortalId] = useState<string | null>(null);
  const [activeNotices, setActiveNotices] = useState<{ announcements: Announcement[], sources: GroundingSource[] }>({ announcements: [], sources: [] });
  
  const [globalNotices, setGlobalNotices] = useState<Announcement[]>([]);
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);

  useEffect(() => {
    const initFetch = async () => {
      try {
        setIsGlobalLoading(true);
        const latest = await gemini.fetchGlobalTop10();
        setGlobalNotices(latest || []);
      } catch (err) {
        console.error("Global fetch error:", err);
      } finally {
        setIsGlobalLoading(false);
      }
    };
    initFetch();
  }, []);

  const filteredPortals = useMemo(() => {
    return SUPPORT_PORTALS.filter(portal => {
      const matchesFilter = filter === 'All' || portal.category === filter;
      const matchesSearch = portal.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchTerm]);

  const handlePortalSelect = async (portal: Portal) => {
    setLoadingPortalId(portal.id);
    try {
      const data = await gemini.fetchLatestNotices(portal.name, portal.url);
      setActiveNotices(data);
      setSelectedPortal(portal);
    } catch (err) {
      console.error("Portal select error:", err);
    } finally {
      setLoadingPortalId(null);
    }
  };

  const handleSummarize = async (title: string) => {
    return await gemini.summarizeAnnouncement(title);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <i className="fa-solid fa-bell"></i>
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight">전북 창업 지원 알림이</h1>
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Jeonbuk Startup Notice Hub</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 border border-slate-200 w-full max-w-sm ml-8">
              <i className="fa-solid fa-magnifying-glass text-slate-400 mr-2"></i>
              <input 
                type="text" 
                placeholder="기관명을 검색하세요..." 
                className="bg-transparent border-none outline-none text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-green-600 uppercase">Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">통합 지원 사업 현황</h2>
          <p className="text-slate-500 max-w-2xl">
            전북 지역의 주요 지원 기관 공지사항을 실시간으로 확인하세요. 기관 카드를 클릭하면 AI가 상세 분석을 도와드립니다.
          </p>
        </section>

        <section className="mb-12">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-list-check"></i>
                </div>
                <h3 className="text-lg font-bold text-slate-800">실시간 통합 최신 지원사업 (TOP 10)</h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              {isGlobalLoading ? (
                <div className="p-12 text-center">
                  <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-500 text-sm">AI가 실시간으로 수집 중입니다...</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                      <th className="px-6 py-3 w-32">공고일</th>
                      <th className="px-6 py-3">공고 제목</th>
                      <th className="px-6 py-3 text-right">링크</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {globalNotices.length > 0 ? globalNotices.map((notice, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4 text-sm text-slate-500 font-medium">{notice.date}</td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-800 line-clamp-1">{notice.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{notice.summary}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <a href={notice.link} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                            <i className="fa-solid fa-chevron-right text-xs"></i>
                          </a>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-20 text-center text-slate-400 text-sm">데이터를 불러올 수 없습니다.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>

        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                filter === cat.value 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPortals.map((portal) => (
            <PortalCard 
              key={portal.id} 
              portal={portal} 
              onSelect={handlePortalSelect}
              isLoading={loadingPortalId === portal.id}
            />
          ))}
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <p className="text-sm">&copy; 2024 SS창업경영연구소 & (주)소셜위즈. Powered by Gemini & Google Search.</p>
        </div>
      </footer>

      {selectedPortal && (
        <AnnouncementModal 
          portal={selectedPortal} 
          notices={activeNotices.announcements} 
          sources={activeNotices.sources}
          onClose={() => setSelectedPortal(null)}
          onSummarize={handleSummarize}
        />
      )}
    </div>
  );
}