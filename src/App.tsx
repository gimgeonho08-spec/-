import React, { useState, useEffect } from 'react';
import { 
  PortfolioData 
} from './types';
import { initialPortfolioData } from './initialData';
import AdminPanel from './components/AdminPanel';
import { SmartLightSimulator } from './components/SmartLightSimulator';
import { 
  Award, 
  Cpu, 
  Zap, 
  Activity, 
  Database,
  Mail, 
  Github, 
  FileText, 
  Linkedin, 
  ArrowUpRight, 
  Settings, 
  Clock, 
  Lightbulb, 
  MoveRight,
  TrendingDown,
  Compass,
  CheckCircle2,
  AlertCircle,
  User,
  Search,
  Youtube,
  Image,
  Upload,
  Trash2,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [data, setData] = useState<PortfolioData>(initialPortfolioData);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [targetCompany] = useState<'hynix' | 'hanyang'>('hanyang');

  // Smooth scroll handler with offset for sticky header
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80; // height of our sticky navigation header
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveNav(id);
    }
  };

  // Section observer to automatically highlight the active section while scrolling
  useEffect(() => {
    const sections = ['home', 'about', 'timeline', 'project', 'experience', 'skills', 'archive', 'why', 'gallery', 'contact'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -30% 0px', // Trigger when section occupies the upper/middle viewport
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveNav(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          observer.unobserve(el);
        }
      });
    };
  }, []);

  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);

  // Search and Filter states for Section 6 (Insight DB)
  const [archiveFilter, setArchiveFilter] = useState<'All' | '독서' | '봉사' | '인턴' | '프로젝트'>('All');
  const [archiveSearch, setArchiveSearch] = useState('');

  // Photo Gallery category filter State
  const [galleryCategory, setGalleryCategory] = useState<'all' | 'capstone' | 'volunteer' | 'intern'>('all');

  // Synchronize and sanitize data format for backward compatibility
  const sanitizeAndProcessData = (raw: any): PortfolioData => {
    const parsed = { ...raw };
    if (parsed.experiences) {
      parsed.experiences = parsed.experiences.map((exp: any) => {
        if (exp.id === 'exp-1') {
          exp.period = '2024.09 ~ 2024.12 (4개월)';
          if (exp.activities) {
            exp.activities = exp.activities.map((act: string) => {
              if (
                act.includes('현장 소통') || 
                act.includes('데이터 검증') || 
                act.includes('외자 정비') || 
                act.includes('품질 관리')
              ) {
                return "'품질 관리' 및 '데이터 기반 역량 강화'";
              }
              return act;
            });
          }
        }
        if (exp.id === 'exp-2') {
          exp.period = '2023.09 ~ 2024.02 (6개월)';
          if (exp.activities) {
            exp.activities = exp.activities.map((act: string) => {
              if (act.includes('기후변화') || act.includes('에코-스마트') || act.includes('모의유엔')) {
                return '모의유엔(MUN) 정례화 및 시스템 이양';
              }
              if (act.includes('다국적 인력') || act.includes('친환경 전력') || act.includes('온라인 워크숍') || act.includes('마인드셋')) {
                return '온라인 워크숍 전환 및 디지털 소통';
              }
              if (act.includes('다문화 아동') || act.includes('리플릿 제작') || act.includes('ESG 캠페인')) {
                return 'ESG 캠페인 기획 및 교육 인프라 기증';
              }
              return act;
            });
          }
        }
        return exp;
      });
    }
    if (parsed.archive) {
      parsed.archive = parsed.archive.map((arch: any) => {
        if (arch.id === 'arch-2' || arch.title === 'KOICA 네팔 해외 연대 봉사') {
          arch.title = 'KOICA 스리랑카 해외 중기 봉사';
          arch.reflection = '일방적인 도움을 넘어 현지에 자생 가능한 \'시스템\'을 구축했던 해외봉사 경험은, 단편적인 기술 지표보다 공동체 내에서 지속 가능한 \'사회적 회로\'를 먼저 고민하는 공학적 설계의 시각으로 이어졌습니다.';
        }
        if (arch.id === 'arch-3' || arch.reflection?.includes('수백 조 원대로')) {
          arch.reflection = '수백억 원대로 추산되는 복잡한 발전 송전 설비 예산 통제 실무의 중심을 흘러가는 1차 조사용 엑셀 시트 행 단위를 성실히 교정한 경험에서, 무결점 데이터의 시작점이 하찮아 보이는 수작업 엔지니어링에 존재함을 인식했습니다.';
        }
        return arch;
      });
    }
    if (parsed.whyHireMe) {
      parsed.whyHireMe = parsed.whyHireMe.map((item: any) => {
        if (item.id === 'why-4' && (item.title?.includes('설 성찰하는') || item.title?.includes('엔진니어'))) {
          item.title = '성찰하는 엔지니어의 성장 습관';
        }
        return item;
      });
    }
    if (!parsed.galleryImages || parsed.galleryImages.length === 0) {
      parsed.galleryImages = initialPortfolioData.galleryImages;
    } else {
      parsed.galleryImages = parsed.galleryImages.map((img: any) => {
        if (img.id === 'init-vol-2') {
          return {
            id: "init-int-1",
            category: "intern",
            dataUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60",
            name: "한전KPS 인턴 실무 - 발전소 정비 기술 자료 검증 및 도면 교차 매칭.jpg",
            uploadedAt: "2025-11-10"
          };
        }
        return img;
      });
    }
    return parsed;
  };

  // Modern Cloud Sync & Local Storage hybrid loading
  useEffect(() => {
    const fetchSharedPortfolio = async () => {
      try {
        const response = await fetch('/api/portfolio');
        if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
          const cloudData = await response.json();
          if (cloudData && !cloudData.fallback && cloudData.aboutMe) {
            const sanitized = sanitizeAndProcessData(cloudData);
            setData(sanitized);
            localStorage.setItem('electrical_portfolio_data', JSON.stringify(sanitized));
            return;
          }
        } else {
          console.warn('API endpoint did not return JSON or was not successful (running on static client like Netlify). Using local storage.');
        }
      } catch (err) {
        console.warn('Could not contact full-stack server for sync (running on static host like Netlify):', err);
      }

      // Local storage hybrid fallback
      const saved = localStorage.getItem('electrical_portfolio_data');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.aboutMe) {
            // Auto-migrate if the cached name is the old placeholder '김건우'
            if (parsed.aboutMe.name === '김건우') {
              console.log('Migrating from old template placeholder data to updated baseline');
              localStorage.removeItem('electrical_portfolio_data');
            } else {
              const sanitized = sanitizeAndProcessData(parsed);
              setData(sanitized);
              localStorage.setItem('electrical_portfolio_data', JSON.stringify(sanitized));
              return;
            }
          }
        } catch (e) {
          console.error('Error parsing local storage backup:', e);
        }
      }

      // Initial data first-run setup
      setData(initialPortfolioData);
    };

    fetchSharedPortfolio();
  }, []);

  const handleSaveData = (newData: PortfolioData | ((prev: PortfolioData) => PortfolioData)) => {
    setData((prev) => {
      const updated = typeof newData === 'function' ? newData(prev) : newData;
      
      // Save locally first for fast instant response
      try {
        localStorage.setItem('electrical_portfolio_data', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save to localStorage:', err);
      }

      // Save to full-stack shared server in background to let anyone using the link view his exact edits!
      fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updated)
      })
      .then(res => {
        if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
          throw new Error('Response is not successful or not JSON (running on static host like Netlify)');
        }
        return res.json();
      })
      .then(res => {
        if (res && !res.success) {
          console.error('Server sync failed:', res);
        }
      })
      .catch(err => {
        console.warn('Server sync skipped (static host or backend offline):', err.message);
      });

      return updated;
    });
  };

  const handleResetToDefault = () => {
    setData(initialPortfolioData);
    localStorage.removeItem('electrical_portfolio_data');
    fetch('/api/portfolio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(initialPortfolioData)
    })
    .then(res => {
      if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Not dynamic server environment');
      }
      return res.json();
    })
    .catch(err => console.warn('Failed to reset on server (running on static host):', err.message));
  };

  // Real-time custom microgrid variables computed in self-contained simulator

  // Copy contact handler
  const handleCopy = (text: string, channel: string) => {
    navigator.clipboard.writeText(text);
    setCopiedChannel(channel);
    setTimeout(() => setCopiedChannel(null), 2500);
  };

  // RENDER: HERO INTRO (Used for Scroll Mode top)
  const renderHeroIntro = () => {
    return (
      <section className="pt-8 pb-4 relative" id="hero">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {targetCompany === 'hynix' ? (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#FF5A00] to-[#E0115F] text-white text-xs font-bold rounded-full tracking-wide shadow-md">
              <Zap className="w-3.5 h-3.5 animate-bounce" />
              SK하이닉스 [설비기술 / Utility Engineering] 추천 인재 제안
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-black text-white text-xs font-bold rounded-full tracking-wide">
              <Zap className="w-3.5 h-3.5" />
              한양이엔지 가치 맞춤형 전기공학 및 설비 자동화 추천 인재
            </span>
          )}
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black font-display tracking-tight leading-tight" id="hero-title">
            {data.hero.title}
          </h2>
          <p className="text-base sm:text-lg text-zinc-500 max-w-2xl mx-auto font-sans font-medium">
            {data.hero.subtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10" id="hero-numerical-indicators">
            {data.hero.stats.map((stat, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-zinc-200 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md hover:border-black transition-all card-glow shadow-sm"
                id={`stat-card-${idx}`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-50 rounded-full blur-2xl"></div>
                <div className="text-xs font-bold text-zinc-400 font-mono tracking-widest uppercase mb-1">METRIC {idx + 1}</div>
                <div className="text-4xl sm:text-5xl font-black text-black font-display tracking-wider mb-2">
                  {stat.value}
                </div>
                <p className="text-sm font-semibold text-black">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // RENDER: PORTAL HOME DASHBOARD
  const renderHomePortal = () => {
    return (
      <div className="space-y-16 animate-fade-in" id="home-dashboard">
        {/* Customized Corporate Slogan Box */}
        <div className="bg-black text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl" id="home-welcome-banner">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-1/4 translate-x-1/10">
            <Cpu className="w-96 h-96" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="col-span-1 lg:col-span-8 space-y-6">
              {targetCompany === 'hynix' ? (
                <span className="inline-block px-3.5 py-1 bg-gradient-to-r from-[#FF5A00]/25 to-[#E0115F]/25 text-[#FF5A00] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#FF5A00]/40 rounded-full">
                  • READY FOR SK HYNIX (SK하이닉스 신입 설비기술 인재 제안)
                </span>
              ) : (
                <span className="inline-block px-3.5 py-1 bg-zinc-800 text-[#FAF9F6] text-[10px] font-mono font-bold uppercase tracking-widest border border-zinc-700 rounded-full">
                  • READY FOR HANYANG ENG (한양이엔지 신입 인재 제안)
                </span>
              )}
              {targetCompany === 'hynix' ? (
                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-[1.25] sm:leading-[1.2] text-white">
                  반도체 Fab 전력 계통 최적화 및 <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A00] to-[#E0115F]">무결점 설비 자동화</span>를 실현할 {data.aboutMe.name}입니다.
                </h2>
              ) : (
                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-[1.25] sm:leading-[1.2] text-white">
                  회로 계통 설계와 제어 데이터를 결합하는 <br />
                  <span className="text-zinc-200">한양이엔지 최적화 인재</span>, {data.aboutMe.name}입니다.
                </h2>
              )}
              {targetCompany === 'hynix' ? (
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-medium">
                  SK하이닉스의 최고 신뢰성 반도체 초정밀 Cleanroom을 위한 고품질 전력 시스템 공급망과 고조파 왜곡 억제 장비를 가동할 준비를 갖추었습니다.
                  스마트 메인 제어 캡스톤, 한전KPS 발전 예비 계통 정비 실무 검증 능력 및 글로벌 수준의 협동력을 기반으로 초격차 반도체 무재해 설비 공정을 완벽 이행하겠습니다.
                </p>
              ) : (
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
                  반도체 및 디스플레이 핵심 유틸리티 설비(CCSS - 중앙화학물질공급장치)와 고정밀 클린룸 배관 제어 분야의 발전을 견인하겠습니다. 
                  스마트그리드 캡스톤, 한전KPS 인턴, KOICA ESG 활동을 통해 전력 회로 설계부터 펌웨어 코딩, 문서화까지 전천후 실무 기량을 완성했습니다.
                </p>
              )}
              <div className="flex flex-wrap gap-4 pt-2">
                <button 
                  onClick={() => handleScrollTo('about')}
                  className="px-6 py-3 bg-white hover:bg-zinc-100 text-black text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 inline-flex items-center gap-1.5"
                >
                  소개 및 역량 명세 보기
                  <MoveRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleScrollTo('project')}
                  className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold border border-zinc-700 rounded-xl transition-all active:scale-95 inline-flex items-center gap-1.5"
                >
                  {targetCompany === 'hynix' ? 'FAB 전력 최적 가동 Sandbox' : '스마트 가로등 Sandbox 가동'}
                  <Cpu className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 증명사진 (ID Photo) Container on the right with standard Korean Resume 3:4 Aspect Ratio */}
            <div className="col-span-1 lg:col-span-4 flex flex-col items-center lg:items-end justify-center w-full">
              <div className="w-44 h-[230px] sm:w-48 sm:h-[250px] bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl relative overflow-hidden group shadow-2xl transition-all duration-300 flex flex-col items-center justify-center p-1">
                {data.aboutMe.imageUrl ? (
                  <div className="w-full h-full relative rounded-xl overflow-hidden">
                    <img 
                      src={data.aboutMe.imageUrl} 
                      alt="증명사진" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-8 flex flex-col items-center justify-end text-center">
                      <span className="text-[9px] text-zinc-405 font-bold uppercase tracking-wider font-mono">
                        {targetCompany === 'hynix' ? 'SK HYNIX APPLICANT' : 'HANYANG ENG APPLICANT'}
                      </span>
                      <span className="text-xs text-white font-extrabold mt-0.5">{data.aboutMe.name}</span>
                    </div>
                    {/* Hover Upload actions */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-4 text-center">
                      <label className="cursor-pointer px-3 py-1.5 bg-white hover:bg-zinc-100 text-black text-[10px] font-bold rounded-lg shadow-md transition-all flex items-center gap-1">
                        <Upload className="w-3 h-3" /> 변경
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleAboutMeImageUpload(e)} 
                        />
                      </label>
                      <button 
                        onClick={handleAboutMeImageDelete}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold rounded-lg shadow-md transition-all flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> 삭제
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-zinc-950 rounded-xl relative">
                    {/* Sleek High-Tech Silhouette */}
                    <div className="w-16 h-16 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-900 text-zinc-500 mb-3 group-hover:text-zinc-300 group-hover:border-zinc-700 transition-all duration-300">
                      <User className="w-8 h-8 stroke-[1.25]" />
                    </div>
                    <label className="cursor-pointer transition-all duration-300">
                      <span className="text-[11px] font-black text-white hover:text-zinc-300 border-b border-zinc-600 hover:border-zinc-300 pb-0.5 tracking-tight flex items-center gap-1.5 justify-center">
                        <Camera className="w-3.5 h-3.5" /> 증명사진 등록
                      </span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleAboutMeImageUpload(e)} 
                      />
                    </label>
                    <p className="text-[9px] text-zinc-500 mt-2.5 leading-relaxed font-sans max-w-[140px]">
                      반명함판 규격(3:4 비율)의 신입 이력서용 사진 업로드
                    </p>
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-[7px] text-zinc-650 font-mono">3:4 RATIO</span>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-zinc-500 mt-2 font-mono uppercase tracking-widest text-center lg:text-right w-44 sm:w-48 px-1">
                ID Photo • {data.aboutMe.name}
              </p>
            </div>
          </div>
        </div>

        {/* Stats deck in Black and White */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="home-numerical-stats">
          {data.hero.stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-zinc-200 rounded-2xl p-6 relative overflow-hidden hover:scale-[1.01] hover:border-black transition-all card-glow shadow-sm"
              id={`home-stat-card-${idx}`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-50 rounded-full blur-2xl"></div>
              <div className="text-[10px] font-bold text-zinc-400 font-mono tracking-widest uppercase mb-1">METRIC 0{idx + 1}</div>
              <div className="text-4xl font-extrabold text-black font-display tracking-wider mb-2">
                {stat.value}
              </div>
              <p className="text-sm font-semibold text-zinc-850">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Bento Pages Link Grid - Satisfies '각 메뉴에 해당하는 페이지도 만들어줘' */}
        <div className="space-y-4">
          <div>
            {targetCompany === 'hynix' ? (
              <h4 className="text-xs font-bold text-black font-mono uppercase tracking-widest">• SK하이닉스 전용 인재 포털 메뉴</h4>
            ) : (
              <h4 className="text-xs font-bold text-black font-mono uppercase tracking-widest">• 한양이엔지 전용 인재 포털 메뉴</h4>
            )}
            <p className="text-xs text-zinc-500 mt-1">원하시는 카테고리를 클릭하면 해당 섹션으로 부드럽게 스크롤됩니다.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="home-bento-navigation-links">
            
            <div 
              onClick={() => handleScrollTo('about')}
              className="bg-white hover:border-black border border-zinc-200 p-5 rounded-2xl cursor-pointer transition-all active:scale-98 shadow-2xs group"
            >
              <span className="p-2.5 bg-black text-white rounded-xl inline-block mb-3">
                <User className="w-4 h-4" />
              </span>
              <h5 className="text-sm font-bold text-black flex items-center justify-between">
                소개 (About Candidate)
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-black transition-colors" />
              </h5>
              <p className="text-[11px] text-zinc-500 mt-2">안전, 규격대조, 전공 회로이론 완전체득 기초 요강을 분석합니다.</p>
            </div>

            <div 
              onClick={() => handleScrollTo('timeline')}
              className="bg-white hover:border-black border border-zinc-200 p-5 rounded-2xl cursor-pointer transition-all active:scale-98 shadow-2xs group"
            >
              <span className="p-2.5 bg-black text-white rounded-xl inline-block mb-3">
                <Clock className="w-4 h-4" />
              </span>
              <h5 className="text-sm font-bold text-black flex items-center justify-between">
                성장 연대기 (Story Node)
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-black transition-colors" />
              </h5>
              <p className="text-[11px] text-zinc-500 mt-2">연도별 멘토링부터 KOICA ESG 해외 협동, 대기업/발전 정비 인턴쉽 노드.</p>
            </div>

            <div 
              onClick={() => handleScrollTo('project')}
              className="bg-white hover:border-black border border-zinc-200 p-5 rounded-2xl cursor-pointer transition-all active:scale-98 shadow-2xs group"
            >
              <span className="p-2.5 bg-black text-white rounded-xl inline-block mb-3">
                <Cpu className="w-4 h-4" />
              </span>
              <h5 className="text-sm font-bold text-black flex items-center justify-between">
                제어 캡스톤 (Smart Grid)
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-black transition-colors" />
              </h5>
              <p className="text-[11px] text-zinc-500 mt-2">다중센서 신호처리와 임베디드 펌웨어, 최대 39% 전력 절감 가공 실태 가동.</p>
            </div>

            <div 
              onClick={() => handleScrollTo('experience')}
              className="bg-white hover:border-black border border-zinc-200 p-5 rounded-2xl cursor-pointer transition-all active:scale-98 shadow-2xs group"
            >
              <span className="p-2.5 bg-black text-white rounded-xl inline-block mb-3">
                <Zap className="w-4 h-4" />
              </span>
              <h5 className="text-sm font-bold text-black flex items-center justify-between">
                실무 및 활동 경험 (Field)
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-black transition-colors" />
              </h5>
              <p className="text-[11px] text-zinc-500 mt-2">정밀 수방 시방서 계산, 오차 분석, 도면 아카이브화 지원 실무.</p>
            </div>

            <div 
              onClick={() => handleScrollTo('skills')}
              className="bg-white hover:border-black border border-zinc-200 p-5 rounded-2xl cursor-pointer transition-all active:scale-98 shadow-2xs group"
            >
              <span className="p-2.5 bg-black text-white rounded-xl inline-block mb-3">
                <Database className="w-4 h-4" />
              </span>
              <h5 className="text-sm font-bold text-black flex items-center justify-between">
                기술 및 사용 도구 (Tech)
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-black transition-colors" />
              </h5>
              <p className="text-[11px] text-zinc-500 mt-2">AutoCAD Electrical, Matlab 수치연산, C/Embedded C++ 시스템 셋팅 역량.</p>
            </div>

            <div 
              onClick={() => handleScrollTo('archive')}
              className="bg-white hover:border-black border border-zinc-200 p-5 rounded-2xl cursor-pointer transition-all active:scale-98 shadow-2xs group"
            >
              <span className="p-2.5 bg-black text-white rounded-xl inline-block mb-3">
                <FileText className="w-4 h-4" />
              </span>
              <h5 className="text-sm font-bold text-black flex items-center justify-between">
                성찰 아카이브 (Database)
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-black transition-colors" />
              </h5>
              <p className="text-[11px] text-zinc-500 mt-2">일회성에 그치지 않는 성찰 기록: 기술과 배움의 성장 데이터를 검색.</p>
            </div>

            <div 
              onClick={() => handleScrollTo('gallery')}
              className="bg-white hover:border-black border border-zinc-200 p-5 rounded-2xl cursor-pointer transition-all active:scale-98 shadow-2xs group animate-pulse"
              id="bento-link-gallery"
            >
              <span className="p-2.5 bg-black text-white rounded-xl inline-block mb-3">
                <Image className="w-4 h-4" />
              </span>
              <h5 className="text-sm font-bold text-black flex items-center justify-between">
                성과 및 활동 사진첩 (Gallery)
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-black transition-colors" />
              </h5>
              <p className="text-[11px] text-zinc-500 mt-2">캡스톤디자인 실물 제어기 및 해외봉사 관련 소중한 현장 사진 아카이브.</p>
            </div>

          </div>
        </div>

        {/* Home Sandbox Preview Board - recruiters love interactive simulators */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm" id="home-sandbox-quicklook">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-100 pb-4 mb-6">
            <div>
              <span className="text-[10px] bg-black text-white font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider">Feature Showcase</span>
              <h5 className="text-base font-extrabold text-black mt-1">지능형 스마트가로등 제어 시뮬레이션</h5>
            </div>
            <button 
              onClick={() => handleScrollTo('project')}
              className="text-xs font-bold text-black hover:underline mt-2 md:mt-0 flex items-center gap-1"
            >
              가이드라인 및 캡스톤 스펙 전체 보기
              <MoveRight className="w-3.5 h-3.5" />
            </button>
          </div>
          {renderInteractiveSandboxOnly()}
        </div>

      </div>
    );
  };

  // RENDER: SECTION 1 - ABOUT ME
  const renderAbout = () => {
    return (
      <section id="about" className="scroll-mt-24 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Design Column left side: Interactive schematic card */}
          <div className="lg:col-span-5" id="about-card-left">
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 relative overflow-hidden card-glow shadow-sm">
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-black animate-ping"></span>
              </div>

              <div className="space-y-6">
                {/* Avatar schematic visual mockup */}
                <div className="w-full h-48 bg-zinc-55 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-grid opacity-5"></div>
                  <div className="absolute w-36 h-36 border border-zinc-200 rounded-full animate-spin-slow"></div>
                  <div className="absolute w-24 h-24 border border-zinc-300 rounded-full"></div>
                  
                  {/* SVG representation of semiconductor IC / gas distribution matrix mimicking CCSS */}
                  <svg className="w-16 h-16 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>

                  <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-black border border-black text-[9px] text-white font-mono rounded shadow-xs">
                    INTEGRATION: HANYANG_FACILITY
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-zinc-400 font-mono">SPECIFICATION CODES</span>
                  <h3 className="text-2xl font-black text-black font-display mt-0.5">{data.aboutMe.name}</h3>
                  <p className="text-xs text-zinc-500 font-bold font-mono mt-1">{data.aboutMe.role}</p>
                </div>

                {/* Trust keywords */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {data.aboutMe.keywords.map((word, i) => (
                    <span 
                      key={i} 
                      className="text-[11px] font-bold font-mono px-2.5 py-1 bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-full"
                    >
                      ▪ {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* About text right side */}
          <div className="lg:col-span-7 space-y-6" id="about-card-right">
            <span className="text-xs font-bold text-black uppercase tracking-widest font-mono">SECTION 01 / ABOUT ME</span>
            <h3 className="text-3xl font-black text-black tracking-tight leading-tight">
              현장 기술 규범을 철저히 기입하고, <br />
              마주한 오류를 정합된 가치로 정제해 나가는 인재입니다.
            </h3>
            
            <div className="space-y-4 text-zinc-600 text-sm leading-relaxed">
              {data.aboutMe.descriptions.map((desc, i) => (
                <p key={i} className="border-l-3 border-black pl-4 py-2 bg-white rounded-r border-t border-b border-r border-zinc-250 border-zinc-200">
                  {desc}
                </p>
              ))}
            </div>

            {/* Special recruiter callout checklist styled like modern corporate DX landing */}
            <div className="p-5 bg-white border border-zinc-200 rounded-2xl space-y-3 shadow-2xs">
              <span className="text-xs font-bold text-black font-mono uppercase block">인사담당자용 핵심 요찰 요약</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-black">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                  <span>전기기사/PLC 계통 지식 완전 훈련</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                  <span>배관 자동화 밸브 및 센서 신호처리 우수</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                  <span>한전KPS 인턴 기반의 정비 기술문서 대조 능숙</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                  <span>어떤 낯선 유틸리티 시퀀스도 분석하여 규명</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    );
  };

  // RENDER: SECTION 2 - MY STORY TIMELINE
  const renderTimeline = () => {
    // Sort chronological: oldest first (e.g., 2022 -> 2023 -> 2024 -> 2025 -> 2026)
    const sortedTimeline = [...data.timeline].sort((a, b) => {
      return a.year.localeCompare(b.year, undefined, { numeric: true, sensitivity: 'base' });
    });

    return (
      <section id="timeline" className="scroll-mt-24 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-black uppercase tracking-widest font-mono">SECTION 02 / STORY TIMELINE</span>
          <h3 className="text-3xl font-black text-black">역량의 축적과 변환 궤적</h3>
          <p className="text-sm text-zinc-500 max-w-xl mx-auto">{data.aboutMe.name} 사원 예정자의 수많은 교육과 현장 극복 노드입니다.</p>
        </div>

        <div className="relative max-w-3xl mx-auto" id="story-timeline-container">
          {/* vertical timeline rail */}
          <div className="absolute left-4 md:left-1/2 top-2 bottom-2 w-0.5 bg-zinc-200"></div>

          <div className="space-y-10">
            {sortedTimeline.map((event, index) => {
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={event.id}
                  className={`flex flex-col md:flex-row items-start relative ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                  id={`timeline-event-${event.id}`}
                >
                  {/* timeline node icon */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-black border-2 border-white z-10 flex items-center justify-center shadow-xs text-white">
                    <Clock className="w-3.5 h-3.5" />
                  </div>

                  {/* Timeline card widget */}
                  <div className="w-full md:w-[46%] pl-12 md:pl-0">
                    <div className="bg-white border border-zinc-200 hover:border-black p-6 rounded-2xl transition-all duration-300 shadow-xs hover:shadow-md card-glow group">
                      <span className="inline-flex items-center px-3 py-1 bg-zinc-100 border border-zinc-200 group-hover:bg-black group-hover:text-white group-hover:border-black text-zinc-800 font-mono font-bold text-[10px] rounded-full mb-3 shadow-3xs transition-all duration-300">
                        {event.year}
                      </span>
                      <h4 className="text-base font-black text-zinc-900 tracking-tight leading-snug group-hover:text-black transition-colors">
                        {event.title}
                      </h4>
                      <p className="text-[13px] text-zinc-600 font-medium mt-2.5 leading-relaxed tracking-normal">
                        {event.description}
                      </p>

                      {/* Dynamic Year-by-Year Photo Section */}
                      {event.imageUrl ? (
                        <div className="mt-4 relative overflow-hidden rounded-xl border border-zinc-200 aspect-video bg-zinc-50 group/img">
                          <img 
                            src={event.imageUrl} 
                            alt={event.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" 
                            referrerPolicy="no-referrer"
                          />
                          {/* Hover action overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                            <label className="cursor-pointer px-3 py-1.5 bg-white hover:bg-zinc-100 text-[11px] font-black text-black rounded-lg shadow-sm transition-all flex items-center gap-1">
                              <Upload className="w-3 h-3" /> 변경
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => handleTimelineImageUpload(e, event.id)} 
                              />
                            </label>
                            <button 
                              onClick={() => handleTimelineImageDelete(event.id)}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-[11px] font-black text-white rounded-lg shadow-sm transition-all flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> 삭제
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 border border-dashed border-zinc-200 hover:border-black bg-zinc-50/50 hover:bg-zinc-105 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all group/upload">
                          <Camera className="w-6 h-6 text-zinc-400 group-hover/upload:text-black mb-1 transition-colors" />
                          <label className="cursor-pointer">
                            <span className="text-[11px] font-black text-zinc-850 hover:text-black border-b border-zinc-300 hover:border-black transition-all">연도별 사진 등록</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => handleTimelineImageUpload(e, event.id)} 
                            />
                          </label>
                          <p className="text-[10px] text-zinc-400 mt-1">이 노드와 관련된 공학/실무 증빙 이미지를 올려보세요.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Spacer for MD screens to align layout */}
                  <div className="hidden md:block w-[8%]"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  // INTERACTIVE SANDBOX GRAPHIC ONLY (Shared between dashboard and project screen)
  const renderInteractiveSandboxOnly = () => {
    return <SmartLightSimulator targetCompany={targetCompany} />;
  };

  // RENDER: SECTION 3 - CORE CAPSTONE PROJECT
  const renderProject = () => {
    return (
      <section id="project" className="scroll-mt-24 space-y-12 animate-fade-in">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-black uppercase tracking-widest font-mono">SECTION 03 / REPRESENTATIVE CAPSTONE</span>
          <h2 className="text-3xl font-black text-black leading-tight">지능형 마이크로그리드 조명 가로등 제어 시스템</h2>
          <p className="text-sm text-zinc-500 max-w-xl mx-auto">유동물체 접근 속도 분석과 3단계 자동 조광 제어를 결합한 39% 고효율 하드웨어</p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden card-glow shadow-sm" id="core-project-main-box">
          
          {/* Interactive simulator head */}
          <div className="bg-[#FAF9F6] p-6 border-b border-zinc-200 relative" id="project-diagram-header">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-white border border-zinc-200 text-[10px] text-zinc-500 font-mono rounded shadow-xs">
              <Compass className="w-3.5 h-3.5 animate-spin-slow text-black" />
              INTELLIGENT HARDWARE SANDBOX
            </div>

            <h4 className="text-xs font-bold text-zinc-600 font-mono mb-4 uppercase tracking-wider">임베디드 제어 시퀀스 및 에너지 절감 시뮬레이터 (Interactive Sandbox)</h4>
            
            {renderInteractiveSandboxOnly()}
          </div>

          {/* Problem -> Solution -> Core metrics grid list */}
          <div className="p-6 md:p-8 space-y-8" id="project-specs-area">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* PROBLEM */}
              <div className="space-y-3 p-5 bg-zinc-50 border border-zinc-200 rounded-2xl shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-black text-white rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                  </span>
                  <h5 className="font-extrabold text-black text-sm">Problem (에너지 누수 원인 분석)</h5>
                </div>
                <p className="text-xs text-zinc-650 text-zinc-600 leading-relaxed pl-2 font-medium">
                  {data.coreProject.problem}
                </p>
              </div>

              {/* SOLUTION */}
              <div className="space-y-3 p-5 bg-zinc-50 border border-zinc-200 rounded-2xl shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-black text-white rounded-lg">
                    <Lightbulb className="w-5 h-5" />
                  </span>
                  <h5 className="font-extrabold text-black text-sm">Solution (자동화 제어 기반 혁신안)</h5>
                </div>
                <p className="text-xs text-zinc-650 text-zinc-600 leading-relaxed pl-2 font-medium">
                  {data.coreProject.solution}
                </p>
              </div>

            </div>

            {/* Roles & Outcomes */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-zinc-200">
              
              {/* My actual implementation roles */}
              <div className="lg:col-span-7 space-y-3">
                <h6 className="text-xs font-bold text-black uppercase tracking-widest font-mono">• My Action & Roles (기획·프로그래밍·도면)</h6>
                <ul className="space-y-2">
                  {data.coreProject.roles.map((act, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start text-xs text-zinc-600 leading-relaxed">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What I Learned and Real insight */}
              <div className="lg:col-span-5 space-y-3 p-5 bg-zinc-50 rounded-2xl border border-zinc-200 shadow-2xs">
                <h6 className="text-xs font-bold text-black uppercase tracking-widest font-mono">• What I Learned (학습한 핵심 역량)</h6>
                <ul className="space-y-3">
                  {data.coreProject.learnings.map((lrn, idx) => {
                    let title = '';
                    let body = lrn;

                    // Parse "[Title] Body" format
                    const bracketMatch = lrn.match(/^\[(.*?)\]\s*(.*)$/);
                    if (bracketMatch) {
                      title = bracketMatch[1];
                      body = bracketMatch[2];
                    } else {
                      // Fallback parser if it doesn't have brackets but contains defaults
                      if (lrn.includes('이종 센서')) {
                        title = '센서 동기화 및 필터링';
                      } else if (lrn.includes('하드웨어 신호')) {
                        title = '임베디드 하드웨어 최적화';
                      } else if (lrn.includes('서로 다른 기술')) {
                        title = '융합 인터페이스 리더십';
                      }
                    }

                    return (
                      <li key={idx} className="flex gap-3 items-start text-xs text-zinc-800 leading-relaxed bg-white p-3.5 rounded-xl border border-zinc-150 shadow-3xs hover:shadow-2xs transition-shadow duration-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          {title && (
                            <strong className="text-black font-extrabold text-[11px] sm:text-xs block">
                              [{title}]
                            </strong>
                          )}
                          <span className="text-zinc-655 text-zinc-600 block text-[11px] sm:text-xs leading-relaxed font-sans">
                            {body}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

            </div>

            {/* Numerical Result banner */}
            <div className="bg-white border border-zinc-200 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-zinc-100 text-black rounded-xl border border-zinc-200">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h6 className="text-sm font-extrabold text-black tracking-tight">마이크로그리드 전송 실증 산식 및 성과</h6>
                  <p className="text-xs text-zinc-500">I2C LCD 통신 및 실시간 적산 전력 산출을 통한 실질적 에너지 절감 증명</p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <span className="text-[10px] text-zinc-500 font-mono uppercase">Energy Consumption Reduced</span>
              </div>
            </div>

          </div>

        </div>
      </section>
    );
  };

  // RENDER: SECTION 4 - FIELD EXPERIENCE
  const renderExperience = () => {
    return (
      <section id="experience" className="scroll-mt-24 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-black uppercase tracking-widest font-mono">SECTION 04 / FIELD EXPERIENCE</span>
          <h3 className="text-3xl font-black text-black">현장 실무 및 해외 협동 경험</h3>
          <p className="text-sm text-zinc-500 max-w-xl mx-auto">기초 도면 해독과 부품 원가 검증, 엄격한 가이드라인 준수를 익힌 실무 검증서.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="experience-card-grid">
          {data.experiences.map((exp) => (
            <div 
              key={exp.id} 
              className="bg-white border border-zinc-200 hover:border-black rounded-2xl p-6 relative overflow-hidden transition-all shadow-sm card-glow flex flex-col justify-between"
              id={`exp-card-${exp.id}`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b border-zinc-150 pb-3">
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-black text-white font-mono font-bold text-[9px] rounded mb-1 uppercase tracking-wider">
                      {exp.period}
                    </span>
                    <h4 className="text-lg font-black text-black font-display tracking-tight leading-none mt-1">{exp.company}</h4>
                    <p className="text-xs text-zinc-400 font-semibold font-mono mt-1">{exp.role}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5 border-b border-zinc-100 pb-3">
                    <span className="text-[10px] font-bold text-black uppercase tracking-widest font-mono block">수행 주요 액션 (What I Did)</span>
                    <ul className="space-y-1.5">
                      {exp.activities.map((act, i) => (
                        <li key={i} className="text-xs text-zinc-600 flex gap-2 items-start leading-relaxed">
                          <span className="text-black shrink-0 font-bold">↳</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono block">학습 및 성찰 (My Learnings)</span>
                    <ul className="space-y-1.5">
                      {exp.learnings.map((lrn, i) => (
                        <li key={i} className="text-xs text-zinc-700 font-medium flex gap-2 items-start leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
                          <span>{lrn}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // RENDER: SECTION 5 - TECHNICAL SKILLS
  const renderSkills = () => {
    return (
      <section id="skills" className="scroll-mt-24 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-black uppercase tracking-widest font-mono">SECTION 05 / TECHNOLOGY MATRIX</span>
          <h3 className="text-3xl font-black text-black">전공 보유 기술 및 사용 도구</h3>
          <p className="text-sm text-zinc-500 max-w-xl mx-auto">설비 시공 가이드 도면 해독부터 다중 제어 임베디드 시퀀스까지의 역량 범위입니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto" id="skills-matrix-deck">
          
          {/* Electrical Section */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 hover:border-black transition-all card-glow shadow-sm">
            <div className="flex items-center gap-3 border-b border-zinc-150 pb-3 mb-4">
              <span className="p-2 bg-black text-white rounded-xl">
                <Zap className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-black tracking-wide">학부 전공 및 전력 지식</h4>
                <p className="text-[10px] text-zinc-400 font-mono">Electrical Fundamentals</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.skills.electrical.map((sk, i) => (
                <span key={i} className="text-xs px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-lg font-bold tracking-wide hover:border-black hover:bg-white transition-colors">
                  ▪ {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Programming Section */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 hover:border-black transition-all card-glow shadow-sm">
            <div className="flex items-center gap-3 border-b border-zinc-150 pb-3 mb-4">
              <span className="p-2 bg-black text-white rounded-xl">
                <Cpu className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-black tracking-wide">임베디드 제어 및 프로그래밍</h4>
                <p className="text-[10px] text-zinc-400 font-mono">Systems & Signal Processing</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.skills.programming.map((sk, i) => (
                <span key={i} className="text-xs px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-lg font-bold tracking-wide hover:border-black hover:bg-white transition-colors">
                  ⚙ {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Tools Section */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 hover:border-black transition-all card-glow shadow-sm">
            <div className="flex items-center gap-3 border-b border-zinc-150 pb-3 mb-4">
              <span className="p-2 bg-black text-white rounded-xl">
                <Database className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-black tracking-wide">정밀 해석 및 수량화 도구</h4>
                <p className="text-[10px] text-zinc-400 font-mono">Documentation & Math</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.skills.tools.map((sk, i) => (
                <span key={i} className="text-xs px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-lg font-bold tracking-wide hover:border-black hover:bg-white transition-colors">
                  📊 {sk}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>
    );
  };

  // RENDER: SECTION 6 - THE INSIGHT ARCHIVE (EXPERIENCE DATABASE) - WITH AWESOME INTERACTIVE FILTERS
  const renderArchive = () => {
    // Filter rows based on search and category tab
    const filteredArchive = data.archive.filter(item => {
      const matchCategory = archiveFilter === 'All' || item.category === archiveFilter;
      const matchSearch = item.title.toLowerCase().includes(archiveSearch.toLowerCase()) || 
                          item.reflection.toLowerCase().includes(archiveSearch.toLowerCase()) ||
                          item.category.toLowerCase().includes(archiveSearch.toLowerCase());
      return matchCategory && matchSearch;
    });

    return (
      <section id="archive" className="scroll-mt-24 space-y-12 bg-white py-10 rounded-3xl px-6 border border-zinc-200">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-black uppercase tracking-widest font-mono">SECTION 06 / REFLECTIVE DATABASE</span>
          <h3 className="text-3xl font-black text-black">성찰 및 가용성 데이터베이스</h3>
          <p className="text-sm text-zinc-500 max-w-xl mx-auto">
            {data.aboutMe.name} 예비 사원의 실패 경험과 극복기, 인사이트를 아카이빙 테이블로 체계화하여 조회하는 내재적 역량의 증거입니다.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6" id="archive-table">
          
          {/* SEARCH & FILTER CONTROLS */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-zinc-50 p-4 rounded-2xl border border-zinc-250 border-zinc-200">
            {/* Category selection horizontal pills */}
            <div className="flex flex-wrap gap-1.5">
              {(['All', '독서', '봉사', '인턴', '프로젝트'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setArchiveFilter(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all ${
                    archiveFilter === cat 
                      ? 'bg-black text-white shadow-xs' 
                      : 'bg-white border border-zinc-200 text-zinc-500 hover:text-black hover:border-zinc-350'
                  }`}
                >
                  {cat === 'All' ? '전체 보기' : cat}
                </button>
              ))}
            </div>

            {/* Live Search bar */}
            <div className="relative w-full sm:w-60">
              <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text"
                placeholder="검색어 입력..."
                value={archiveSearch}
                onChange={(e) => setArchiveSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-zinc-200 rounded-xl text-black placeholder-zinc-450 focus:outline-none focus:border-black font-semibold"
              />
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-2xs">
            <div className="grid grid-cols-12 bg-zinc-50 px-4 py-3 border-b border-zinc-200 text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
              <div className="col-span-3">카테고리</div>
              <div className="col-span-9">경험 및 기술적 가치 성찰 코멘트</div>
            </div>

            <div className="divide-y divide-zinc-150 border-t border-zinc-100">
              {filteredArchive.length > 0 ? (
                filteredArchive.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 px-4 py-4 items-start gap-2 hover:bg-zinc-50 transition-colors">
                    <div className="col-span-12 md:col-span-3 flex items-center gap-2">
                      <span className={`px-2.5 py-1 text-[9px] font-bold rounded-md font-mono whitespace-nowrap shrink-0 ${
                        item.category === '독서' ? 'bg-zinc-100 border border-zinc-250 text-black' :
                        item.category === '봉사' ? 'bg-zinc-950 text-white' :
                        item.category === '인턴' ? 'bg-zinc-100 border border-black text-black' :
                        'bg-zinc-50 border border-zinc-205 text-zinc-700'
                      }`}>
                        {item.category}
                      </span>
                      <span className="text-xs font-bold text-black font-display truncate hidden md:inline">
                        {item.title.split(' (')[0]}
                      </span>
                    </div>
                    
                    <div className="col-span-12 md:col-span-9 space-y-1">
                      <span className="text-xs font-black text-black md:hidden block mt-1">{item.title}</span>
                      <span className="text-[10px] font-mono font-bold block text-zinc-400 md:hidden pb-1">{item.category}</span>
                      <p className="text-xs text-zinc-600 leading-relaxed font-sans font-medium">
                        {item.reflection}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-zinc-400 text-xs font-mono">
                  검색 결과에 맞는 성찰 데이터가 존재하지 않습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };

  // RENDER: SECTION 7 - WHY HIRE ME (OUTLOOK)
  const renderWhy = () => {
    return (
      <section id="why" className="scroll-mt-24 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-black uppercase tracking-widest font-mono">SECTION 07 / RECRUITER OUTLOOK</span>
          {targetCompany === 'hynix' ? (
            <>
              <h3 className="text-3xl font-black text-black">왜 이 엔지니어를 SK하이닉스에 모셔야 하는가?</h3>
              <p className="text-sm text-zinc-500 max-w-xl mx-auto">SK하이닉스가 추구하는 초격차 메모리 기술과 무재해/초안정성 가치에 부합하는 역량 도킹 분석</p>
            </>
          ) : (
            <>
              <h3 className="text-3xl font-black text-black">왜 이 엔지니어를 한양이엔지에 모셔야 하는가?</h3>
              <p className="text-sm text-zinc-500 max-w-xl mx-auto">한양이엔지가 추구하는 가치에 명확히 도킹하는 최적화된 채용이유 분석</p>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto" id="why-hire-grid">
          {data.whyHireMe.map((item, idx) => (
            <div 
              key={item.id} 
              className="p-6 bg-white border border-zinc-200 rounded-2xl relative overflow-hidden transition-all card-glow shadow-sm hover:border-black"
              id={`why-card-${item.id}`}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-zinc-50 rounded-full blur-xl"></div>
              
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-mono font-bold text-sm shrink-0">
                  {idx + 1}
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-base font-bold text-black font-display tracking-tight">{item.title}</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // RENDER: SECTION 08 - 성과 및 해외 활동 사진첩 (Gallery)
  const renderGallery = () => {
    const currentGalleryImages = data.galleryImages || [];

    const filteredImages = currentGalleryImages.filter(img => {
      if (galleryCategory === 'all') return true;
      return img.category === galleryCategory;
    });

    return (
      <section id="gallery" className="scroll-mt-24 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-black uppercase tracking-widest font-mono">• SECTION 08 / VISUAL ARCHIVE</span>
          <h3 className="text-3xl font-black text-black tracking-tight font-display">성과, 인턴 및 해외 활동 사진첩</h3>
          <p className="text-xs text-zinc-500 max-w-xl mx-auto">
            직접 개발한 캡스톤디자인 램프 모듈, 한전KPS 인턴 현장 실무 및 해외 봉사활동의 생생한 실체적 증거 자료입니다. 
            컴퓨터에서 직접 여러 장의 사진을 실시간으로 추가하거나 삭제하여 장기 보존할 수 있습니다.
          </p>
        </div>

        {/* Dynamic Image Upload Segment */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-xs max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="text-sm font-bold text-black flex items-center gap-1.5">
                <Camera className="w-4 h-4" /> 내 컴퓨터에서 새로운 사진 올리기 (여러 장 선택 가능)
              </h4>
              <p className="text-[11px] text-zinc-500 mt-1">파일 탐색기나 바탕화면에서 한 번에 여러 장의 사진을 선택하여 올릴 수 있습니다.</p>
            </div>
            
            {/* Upload form button triggers */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 w-full sm:w-auto">
                <label className="cursor-pointer">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={(e) => handleImageUpload(e, 'capstone')}
                    className="hidden" 
                    id="upload-capstone-input"
                  />
                  <div className="px-3.5 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-[11px] font-bold transition-all text-center flex items-center justify-center gap-1">
                    <Upload className="w-3 h-3" /> 🎓 캡스톤디자인
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={(e) => handleImageUpload(e, 'intern')}
                    className="hidden" 
                    id="upload-intern-input"
                  />
                  <div className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[11px] font-bold transition-all text-center flex items-center justify-center gap-1">
                    <Upload className="w-3 h-3" /> 💼 인턴실무
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={(e) => handleImageUpload(e, 'volunteer')}
                    className="hidden" 
                    id="upload-volunteer-input"
                  />
                  <div className="px-3.5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 rounded-xl text-[11px] font-bold transition-all text-center flex items-center justify-center gap-1">
                    <Upload className="w-3 h-3" /> 🌏 해외봉사
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters bar */}
        <div className="flex justify-center flex-wrap gap-1.5">
          {[
            { id: 'all', label: '전체 사진첩' },
            { id: 'capstone', label: '🎓 캡스톤디자인' },
            { id: 'intern', label: '💼 인턴실무' },
            { id: 'volunteer', label: '🌏 해외봉사활동' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setGalleryCategory(tab.id as any)}
              className={`px-5 py-2 text-xs font-bold rounded-full border transition-all ${
                galleryCategory === tab.id
                  ? 'bg-black text-white border-black shadow-xs font-black'
                  : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400 hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid view layout */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-16 bg-white border border-zinc-150 rounded-3xl max-w-4xl mx-auto space-y-3">
            <div className="w-12 h-12 bg-zinc-50 border border-zinc-250 rounded-xl inline-flex items-center justify-center text-zinc-400">
              <Image className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold text-black">등록된 사진이 없습니다</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">상단의 업로드 버튼을 눌러 소중한 기술 성과물을 채워보세요!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto animate-fade-in" id="gallery-photo-grid">
            {filteredImages.map((img) => (
              <div 
                key={img.id} 
                className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-2xs group relative flex flex-col hover:border-black transition-all hover:shadow-xs"
              >
                <div className="h-48 w-full bg-zinc-100 overflow-hidden relative">
                  <img 
                    src={img.dataUrl} 
                    alt={img.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wide uppercase shadow-xs ${
                      img.category === 'capstone'
                        ? 'bg-black text-white'
                        : img.category === 'intern'
                        ? 'bg-blue-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}>
                      {img.category === 'capstone' 
                        ? '캡스톤디자인' 
                        : img.category === 'intern' 
                        ? '인턴실무' 
                        : '해외봉사'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleImageDelete(img.id)}
                    className="absolute bottom-2 right-2 p-2 bg-white/95 hover:bg-red-600 hover:text-white text-zinc-600 rounded-lg shadow-sm transition-all text-xs"
                    title="사진 삭제하기"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2 bg-white">
                  <p className="text-xs font-bold text-black line-clamp-2 leading-relaxed" title={img.name}>
                    {img.name.replace(/\.[^/.]+$/, "")}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                    <span>등록일자</span>
                    <span className="font-semibold">{img.uploadedAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  // In-browser high-quality JPEG compression/limiting function to prevent localStorage QuotaExceededError
  const compressImage = (dataUrl: string, maxWidth = 1000, maxHeight = 1000, quality = 0.75): Promise<string> => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => {
        resolve(dataUrl);
      };
    });
  };

  // Photo uploader core handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, category: 'capstone' | 'volunteer' | 'intern') => {
    if (!e.target.files) return;
    const files: File[] = Array.from(e.target.files);
    
    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawDataUrl = reader.result as string;
        const dataUrl = await compressImage(rawDataUrl);
        const newImg = {
          id: 'gallery-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
          category,
          dataUrl,
          name: file.name,
          uploadedAt: new Date().toLocaleDateString('ko-KR')
        };
        handleSaveData((prev) => {
          const currentImages = prev.galleryImages || [];
          return {
            ...prev,
            galleryImages: [...currentImages, newImg]
          };
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageDelete = (id: string) => {
    handleSaveData((prev) => {
      const currentImages = prev.galleryImages || [];
      const updatedImages = currentImages.filter(img => img.id !== id);
      return {
        ...prev,
        galleryImages: updatedImages
      };
    });
  };

  const handleTimelineImageUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
      const rawDataUrl = reader.result as string;
      const dataUrl = await compressImage(rawDataUrl);
      handleSaveData((prev) => {
        const updatedTimeline = prev.timeline.map(item => {
          if (item.id === id) {
            return { ...item, imageUrl: dataUrl };
          }
          return item;
        });
        return {
          ...prev,
          timeline: updatedTimeline
        };
      });
    };
    reader.readAsDataURL(file);
  };

  const handleTimelineImageDelete = (id: string) => {
    handleSaveData((prev) => {
      const updatedTimeline = prev.timeline.map(item => {
        if (item.id === id) {
          const { imageUrl, ...rest } = item;
          return rest;
        }
        return item;
      });
      return {
        ...prev,
        timeline: updatedTimeline
      };
    });
  };

  const handleAboutMeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
      const rawDataUrl = reader.result as string;
      const dataUrl = await compressImage(rawDataUrl, 800, 1000, 0.8);
      handleSaveData((prev) => ({
        ...prev,
        aboutMe: {
          ...prev.aboutMe,
          imageUrl: dataUrl
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleAboutMeImageDelete = () => {
    handleSaveData((prev) => ({
      ...prev,
      aboutMe: {
        ...prev.aboutMe,
        imageUrl: ''
      }
    }));
  };

  // RENDER: SECTION 9 - CONTACT
  const renderContact = () => {
    return (
      <section id="contact" className="scroll-mt-24 py-12 relative flex justify-center">
        
        <div className="max-w-3xl w-full bg-white border border-zinc-200 rounded-3xl p-8 relative z-10 card-glow text-center space-y-8 shadow-sm" id="contact-panel-box">
          <div className="space-y-2">
            <span className="text-xs font-bold text-black uppercase tracking-widest font-mono">SECTION 09 / REACH ME</span>
            {targetCompany === 'hynix' ? (
              <>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight leading-snug">
                  SK하이닉스의 전력 제어 신뢰성을 극대화할<br className="hidden sm:inline" /> 조력자를 채용하세요
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto font-medium leading-relaxed tracking-normal">
                  초정밀 반도체 Fab 전력 계통 보상, 고효율 예비전력 자동 시퀀스 및<br className="hidden sm:inline" /> 설비 제어 알고리즘의 최전선에 기여하겠습니다.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight leading-snug">
                  한양이엔지의 생산성과 신뢰를 높일<br className="hidden sm:inline" /> 조력자를 채용하세요
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto leading-relaxed tracking-normal">
                  초고순도 제어 설비, 송배전 유틸리티,<br className="hidden sm:inline" /> CCSS 하드웨어 제어 시퀀스의 최전선에 기여하겠습니다.
                </p>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            
            {/* EMAIL */}
            <div 
              onClick={() => handleCopy(data.contact.email, 'email')}
              className="bg-zinc-50 hover:bg-white border border-zinc-200 p-4 rounded-2xl cursor-pointer text-left transition-all hover:border-black flex items-center gap-3 relative overflow-hidden active:scale-95 group shadow-2xs"
            >
              <span className="p-2.5 bg-zinc-100 text-black border border-zinc-200 rounded-lg shrink-0">
                <Mail className="w-5 h-5" />
              </span>
              <div className="truncate flex-1">
                <span className="text-[9px] text-zinc-400 font-bold block uppercase tracking-wide">EMAIL (클릭 후 자동 복사)</span>
                <span className="text-xs font-mono font-bold text-black truncate tracking-wide">{data.contact.email}</span>
              </div>
              
              <AnimatePresence>
                {copiedChannel === 'email' && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="absolute inset-0 bg-black flex items-center justify-center text-white text-xs font-bold"
                  >
                    이메일 클립보드 복사 완료!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* YOUTUBE */}
            <a 
              href={data.contact.youtube} 
              target="_blank" 
              rel="noreferrer noopener"
              className="bg-[#FF0000]/5 hover:bg-[#FF0000]/10 border border-red-250/50 p-4 rounded-2xl text-left transition-all hover:border-red-500 flex items-center gap-3 active:scale-95 group shadow-2xs"
            >
              <span className="p-2.5 bg-red-150 text-red-600 border border-red-200 rounded-lg shrink-0 flex items-center justify-center">
                <Youtube className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[9px] text-red-500 font-bold block uppercase tracking-wide flex items-center gap-1">
                  YOUTUBE
                  <ArrowUpRight className="w-3 h-3 text-red-400" />
                </span>
                <span className="text-xs font-sans font-bold text-black tracking-normal">호야24</span>
              </div>
            </a>

          </div>

          <p className="text-[10px] text-zinc-400 font-mono">
            © 2026 {data.aboutMe.name}. All Rights Reserved. Built as a fully dynamic compliant portfolio for {targetCompany === 'hynix' ? 'SK HYNIX' : 'HANYANG ENG'}.
          </p>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#000000] selection:bg-black/10 selection:text-black relative overflow-x-hidden circuit-grid nav-glow" id="e-portfolio-root">
      <div className="apple-wallpaper-glow" />
      
      {/* Upper Utility Grid Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E5E5EA] transition-all shadow-2xs" id="main-navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {targetCompany === 'hynix' ? (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF5A00] to-[#E0115F] text-white flex flex-col items-center justify-center font-sans font-black text-xs tracking-tighter relative overflow-hidden group border border-orange-500 shadow-sm">
                <span className="leading-none flex items-center justify-center text-[10px]">SK</span>
                <span className="text-[8px] font-bold tracking-tight opacity-90 leading-none mt-0.5">hynix</span>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-black text-white flex flex-col items-center justify-center font-sans font-black text-xs tracking-tighter relative overflow-hidden group border border-zinc-800">
                <span className="leading-none flex items-center justify-center">한양</span>
                <span className="text-[7.5px] font-bold tracking-normal opacity-90 leading-none mt-0.5">ENG</span>
              </div>
            )}
            <div>
              <h1 className="text-sm font-black text-black font-display tracking-tight flex items-center gap-1.5">
                {targetCompany === 'hynix' ? 'SK하이닉스의 인재' : '한양이엔지의 인재'}{' '}
                <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-extrabold ${targetCompany === 'hynix' ? 'bg-gradient-to-r from-[#FF5A00] to-[#E0115F] text-white shadow-xs' : 'bg-black text-white'}`}>
                  {data.aboutMe.name}
                </span>
              </h1>
              <p className="text-[11px] text-zinc-500 font-mono hidden sm:block">
                {targetCompany === 'hynix' 
                  ? 'SK Hynix Target: Semiconductor Utilities & Yield Backup Power Automation' 
                  : 'Hanyang ENG Ready: Plant Facility & Automated Control Engineer'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Link */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 bg-zinc-100/80 backdrop-blur-md p-1.5 rounded-full border border-zinc-200/60 shadow-xs">
            {[
              { id: 'home', name: '홈' },
              { id: 'about', name: '소개' },
              { id: 'timeline', name: '성장 연대기' },
              { id: 'project', name: '캡스톤' },
              { id: 'experience', name: '경험' },
              { id: 'skills', name: '기술' },
              { id: 'archive', name: '아카이브' },
              { id: 'why', name: '채용이유' },
              { id: 'gallery', name: '사진첩' }
            ].map(link => (
              <button
                key={link.id}
                onClick={() => handleScrollTo(link.id)}
                className={`text-[11px] xl:text-xs font-semibold tracking-wide whitespace-nowrap px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                  activeNav === link.id
                    ? targetCompany === 'hynix'
                      ? 'bg-gradient-to-r from-[#FF5A00] to-[#E0115F] text-white shadow-xs font-bold'
                      : 'bg-black text-white shadow-xs font-bold'
                    : 'text-zinc-500 hover:text-black hover:bg-zinc-200/50'
                }`}
              >
                {link.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">


            <button 
              onClick={() => handleScrollTo('contact')}
              className="px-3.5 py-1.5 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-full text-xs font-bold transition-all inline-flex items-center gap-1.5 text-black shadow-xs"
            >
              Contact
              <ArrowUpRight className="w-3.5 h-3.5 text-black" />
            </button>

            {/* Admin Tool Activation trigger */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-2 bg-black hover:bg-zinc-950 text-white rounded-full transition-all shadow-sm active:scale-95 flex items-center gap-1.5 border border-zinc-800"
              title="관리자 설정 모드 (비밀번호: 1111)"
              id="admin-trigger-button"
            >
              <Settings className="w-4 h-4" />
              <span className="text-xs font-extrabold font-display hidden md:inline">Admin</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in" id="main-content-flow">
        
        <div className="space-y-32">
          <section id="home" className="scroll-mt-24">
            {renderHomePortal()}
          </section>
          
          <hr className="border-t border-zinc-200" />
          
          {renderAbout()}
          
          <hr className="border-t border-zinc-200" />
          
          {renderTimeline()}
          
          <hr className="border-t border-zinc-200" />
          
          {renderProject()}
          
          <hr className="border-t border-zinc-200" />
          
          {renderExperience()}
          
          <hr className="border-t border-zinc-200" />
          
          {renderSkills()}
          
          <hr className="border-t border-zinc-200" />
          
          {renderArchive()}
          
          <hr className="border-t border-zinc-200" />
          
          {renderWhy()}
          
          <hr className="border-t border-zinc-200" />

          <section id="gallery" className="scroll-mt-24">
            {renderGallery()}
          </section>
          
          <hr className="border-t border-zinc-200" />
          
          {renderContact()}
        </div>

      </main>

      {/* ADMIN CONTROL PANEL POPUP DRAWER */}
      <AdminPanel 
        data={data}
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onSave={handleSaveData}
        onReset={handleResetToDefault}
      />

    </div>
  );
}
