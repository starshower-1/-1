
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SUPPORT_PORTALS, CATEGORIES } from './constants.ts';
import { Portal, Announcement, GroundingSource } from './types.ts';
import { GeminiService } from './services/geminiService.ts';

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
    const summary = await onSummarize(title);
    setSelectedSummary({ title, text: summary });
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
  
  // New: Global Latest Notices
  const [globalNotices, setGlobalNotices] = useState<Announcement[]>([]);
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);

  useEffect(() => {
    const initFetch = async () => {
      setIsGlobalLoading(true);
      const latest = await gemini.fetchGlobalTop10();
      setGlobalNotices(latest);
      setIsGlobalLoading(false);
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
    const data = await gemini.fetchLatestNotices(portal.name, portal.url);
    setActiveNotices(data);
    setSelectedPortal(portal);
    setLoadingPortalId(null);
  };

  const handleSummarize = async (title: string) => {
    return await gemini.summarizeAnnouncement(title);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
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
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">오늘의 주요 공고 실시간 집계 중</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-green-600 uppercase">Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro */}
        <section className="mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">통합 지원 사업 현황</h2>
          <p className="text-slate-500 max-w-2xl">
            전북 지역의 경제, 기술, 콘텐츠 관련 주요 지원 기관 및 전국구 창업 포털을 한데 모았습니다. 
            아래 표에서 가장 최신의 주요 공고를 바로 확인하거나, 기관 카드를 클릭하여 AI 분석 리포트를 확인하세요.
          </p>
        </section>

        {/* Top 10 Latest Announcements Table */}
        <section className="mb-12">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-list-check"></i>
                </div>
                <h3 className="text-lg font-bold text-slate-800">실시간 통합 최신 지원사업 (TOP 10)</h3>
              </div>
              {!isGlobalLoading && (
                <button onClick={() => window.location.reload()} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                  <i className="fa-solid fa-rotate-right"></i> 새로고침
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              {isGlobalLoading ? (
                <div className="p-12 text-center">
                  <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-500 text-sm animate-pulse">AI가 실시간으로 여러 포털의 최신 공고를 수집하고 있습니다...</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                      <th className="px-6 py-3 w-32">공고일</th>
                      <th className="px-6 py-3 w-40">기관명</th>
                      <th className="px-6 py-3">공고 제목</th>
                      <th className="px-6 py-3 text-right">링크</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {globalNotices.length > 0 ? globalNotices.map((notice, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                          {notice.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">
                            {notice.summary?.split(' ')[0] || '전체'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {notice.title}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{notice.summary}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <a 
                            href={notice.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center justify-center w-8 h-8 bg-slate-100 text-slate-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          >
                            <i className="fa-solid fa-chevron-right text-[10px]"></i>
                          </a>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-20 text-center text-slate-400 text-sm">
                          표시할 공고가 없습니다. 다시 시도해 주세요.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>

        {/* Section Title */}
        <section className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">개별 지원 기관 목록</h2>
          <div className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
            총 <span className="text-blue-600 font-bold">{filteredPortals.length}</span>개 기관
          </div>
        </section>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
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
          <div className="md:hidden">
             <div className="flex items-center bg-white rounded-2xl px-4 py-3 border border-slate-200 w-full">
              <i className="fa-solid fa-magnifying-glass text-slate-400 mr-2"></i>
              <input 
                type="text" 
                placeholder="기관명 검색" 
                className="bg-transparent border-none outline-none text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Portal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPortals.map((portal) => (
            <PortalCard 
              key={portal.id} 
              portal={portal} 
              onSelect={handlePortalSelect}
              isLoading={loadingPortalId === portal.id}
            />
          ))}
          {filteredPortals.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4">
                <i className="fa-solid fa-face-sad-tear text-3xl text-slate-400"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800">검색 결과가 없습니다</h3>
              <p className="text-slate-500 mt-2">다른 검색어 혹은 카테고리를 선택해 보세요.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6 text-white">
                <i className="fa-solid fa-bell text-2xl text-blue-500"></i>
                <span className="text-xl font-black">전북 창업 지원 알림이</span>
              </div>
              <p className="text-sm leading-relaxed mb-6">
                전라북도 내 창업자와 중소상공인을 위한 통합 공지사항 플랫폼입니다. 
                여러 사이트를 일일이 방문할 필요 없이 AI 기반 실시간 정보 수집 기술로 최신 정보를 한곳에서 확인하세요.
              </p>
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-2 opacity-60">운영사 정보</h5>
                <p className="text-sm text-slate-300 font-bold">SS창업경영연구소, (주)소셜위즈</p>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <i className="fa-solid fa-envelope text-blue-500"></i>
                  <a href="mailto:jamkorea@naver.com" className="hover:text-white transition-colors">jamkorea@naver.com</a>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">주요 서비스 바로가기</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="https://www.jbci.or.kr" target="_blank" className="hover:text-blue-500 transition-colors flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full"></div>전북창업정보 온라인서비스</a></li>
                <li><a href="https://www.k-startup.go.kr" target="_blank" className="hover:text-blue-500 transition-colors flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full"></div>K-Startup</a></li>
                <li><a href="https://www.jbba.kr" target="_blank" className="hover:text-blue-500 transition-colors flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full"></div>전북경제통상진흥원</a></li>
                <li><a href="https://www.jbtp.or.kr" target="_blank" className="hover:text-blue-500 transition-colors flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full"></div>전북테크노파크</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">전북 창업 지원 허브</h4>
              <p className="text-sm mb-6">서비스 이용 관련 피드백이나 추가를 원하는 기관이 있다면 언제든 알려주세요. 창업가 여러분의 성공을 지원합니다.</p>
              <button 
                onClick={() => window.location.href='mailto:jamkorea@naver.com'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-paper-plane"></i>
                제휴 및 기관 추가 문의
              </button>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-16 pt-8 text-[11px] flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; 2024 SS창업경영연구소 & (주)소셜위즈. All Rights Reserved.</p>
            <p className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-500">Technology</span>
              Powered by Gemini 3 Flash & Google Search.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal */}
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