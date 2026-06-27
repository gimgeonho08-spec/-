import React, { useState, useEffect } from 'react';
import { 
  PortfolioData, 
  TimelineEvent, 
  ExperienceCard, 
  ArchiveItem, 
  WhyHireMeItem 
} from '../types';
import { 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  X, 
  Lock, 
  Unlock, 
  FileText, 
  Cpu, 
  Activity, 
  Database,
  Layers,
  Award,
  Link,
  Camera,
  User
} from 'lucide-react';

interface AdminPanelProps {
  data: PortfolioData;
  onSave: (newData: PortfolioData) => void;
  onReset: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ data, onSave, onReset, isOpen, onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'timeline' | 'project' | 'experience' | 'skills' | 'archive' | 'why' | 'contact'>('hero');
  const [editedData, setEditedData] = useState<PortfolioData>(JSON.parse(JSON.stringify(data)));
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Temp state for adding new items
  const [newTimeline, setNewTimeline] = useState<Omit<TimelineEvent, 'id'>>({ year: '', title: '', description: '' });
  const [newExp, setNewExp] = useState<Omit<ExperienceCard, 'id'>>({ company: '', role: '', period: '', activities: [''], learnings: [''] });
  const [newArchive, setNewArchive] = useState<Omit<ArchiveItem, 'id'>>({ category: '독서', title: '', reflection: '' });

  // Skill input temps
  const [newElectrical, setNewElectrical] = useState('');
  const [newProgramming, setNewProgramming] = useState('');
  const [newTool, setNewTool] = useState('');
  const [isResetConfirming, setIsResetConfirming] = useState(false);

  // Synchronize editedData with parent-provided data when first opened or authenticated
  useEffect(() => {
    if (isOpen) {
      setEditedData(JSON.parse(JSON.stringify(data)));
      setIsResetConfirming(false);
    }
  }, [isOpen, isAuthenticated]);

  // Synchronize with parent state in real-time on every keystroke/change
  useEffect(() => {
    if (isOpen && isAuthenticated && editedData) {
      onSave(editedData);
    }
  }, [editedData, isOpen, isAuthenticated, onSave]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1111') {
      setIsAuthenticated(true);
      setAuthError('');
      setEditedData(JSON.parse(JSON.stringify(data))); // Synced with global state upon unlock
    } else {
      setAuthError('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleSaveAll = () => {
    onSave(editedData);
    onClose();
  };

  const handleResetToDefault = () => {
    if (!isResetConfirming) {
      setIsResetConfirming(true);
    } else {
      onReset();
      setIsResetConfirming(false);
      onClose();
    }
  };

  // Helper functions to manage arrays
  const updateHeroStat = (index: number, field: 'value' | 'label', val: string) => {
    const updated = { ...editedData };
    updated.hero.stats[index][field] = val;
    setEditedData(updated);
  };

  const updateAboutDesc = (index: number, val: string) => {
    const updated = { ...editedData };
    updated.aboutMe.descriptions[index] = val;
    setEditedData(updated);
  };

  const addAboutDescRow = () => {
    const updated = { ...editedData };
    updated.aboutMe.descriptions.push('');
    setEditedData(updated);
  };

  const deleteAboutDescRow = (index: number) => {
    const updated = { ...editedData };
    updated.aboutMe.descriptions = updated.aboutMe.descriptions.filter((_, i) => i !== index);
    setEditedData(updated);
  };

  const updateKeyword = (index: number, val: string) => {
    const updated = { ...editedData };
    updated.aboutMe.keywords[index] = val;
    setEditedData(updated);
  };

  // TIMELINE ACTIONS
  const deleteTimelineItem = (id: string) => {
    const updated = { ...editedData };
    updated.timeline = updated.timeline.filter(item => item.id !== id);
    setEditedData(updated);
  };

  const addTimelineItem = () => {
    if (!newTimeline.year || !newTimeline.title) {
      alert('연도와 활동명을 채워주세요.');
      return;
    }
    const updated = { ...editedData };
    updated.timeline.push({
      id: `time-${Date.now()}`,
      ...newTimeline
    });
    setEditedData(updated);
    setNewTimeline({ year: '', title: '', description: '' });
  };

  // PROJECT ACTIONS
  const updateProjectRole = (index: number, val: string) => {
    const updated = { ...editedData };
    updated.coreProject.roles[index] = val;
    setEditedData(updated);
  };

  const addProjectRoleRow = () => {
    const updated = { ...editedData };
    updated.coreProject.roles.push('');
    setEditedData(updated);
  };

  const deleteProjectRoleRow = (index: number) => {
    const updated = { ...editedData };
    updated.coreProject.roles = updated.coreProject.roles.filter((_, i) => i !== index);
    setEditedData(updated);
  };

  const updateProjectLearning = (index: number, val: string) => {
    const updated = { ...editedData };
    updated.coreProject.learnings[index] = val;
    setEditedData(updated);
  };

  const addProjectLearningRow = () => {
    const updated = { ...editedData };
    updated.coreProject.learnings.push('');
    setEditedData(updated);
  };

  const deleteProjectLearningRow = (index: number) => {
    const updated = { ...editedData };
    updated.coreProject.learnings = updated.coreProject.learnings.filter((_, i) => i !== index);
    setEditedData(updated);
  };

  // EXPERIENCE ACTIONS
  const deleteExperienceItem = (id: string) => {
    const updated = { ...editedData };
    updated.experiences = updated.experiences.filter(exp => exp.id !== id);
    setEditedData(updated);
  };

  const addExperienceItem = () => {
    if (!newExp.company || !newExp.role || !newExp.period) {
      alert('기관(회사)명, 역할, 기간을 작성해주세요.');
      return;
    }
    const cleanActivities = newExp.activities.filter(a => a.trim() !== '');
    const cleanLearnings = newExp.learnings.filter(l => l.trim() !== '');

    const updated = { ...editedData };
    updated.experiences.push({
      id: `exp-${Date.now()}`,
      company: newExp.company,
      role: newExp.role,
      period: newExp.period,
      activities: cleanActivities.length > 0 ? cleanActivities : ['상세 업무 기록 양식'],
      learnings: cleanLearnings.length > 0 ? cleanLearnings : ['학습 및 성장 기록 양식']
    });
    setEditedData(updated);
    setNewExp({ company: '', role: '', period: '', activities: [''], learnings: [''] });
  };

  // TECHNICAL SKILLS
  const addSkill = (type: 'electrical' | 'programming' | 'tools', val: string) => {
    if (!val.trim()) return;
    const updated = { ...editedData };
    updated.skills[type].push(val.trim());
    setEditedData(updated);
  };

  const deleteSkill = (type: 'electrical' | 'programming' | 'tools', index: number) => {
    const updated = { ...editedData };
    updated.skills[type] = updated.skills[type].filter((_, i) => i !== index);
    setEditedData(updated);
  };

  // RESOURCE ARCHIVE (SEC 6)
  const addArchiveItem = () => {
    if (!newArchive.title || !newArchive.reflection) {
      alert('경험 제목과 배운 점(성찰)을 작성해주세요.');
      return;
    }
    const updated = { ...editedData };
    updated.archive.push({
      id: `arch-${Date.now()}`,
      ...newArchive
    });
    setEditedData(updated);
    setNewArchive({ category: '독서', title: '', reflection: '' });
  };

  const deleteArchiveItem = (id: string) => {
    const updated = { ...editedData };
    updated.archive = updated.archive.filter(item => item.id !== id);
    setEditedData(updated);
  };

  // WHY HIRE ME
  const updateWhyHireMe = (index: number, field: 'title' | 'description', val: string) => {
    const updated = { ...editedData };
    updated.whyHireMe[index][field] = val;
    setEditedData(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" id="admin-modal-container">
      <div className="bg-slate-900 border border-slate-700/60 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden" id="admin-panel">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-zinc-800 text-zinc-300 rounded-lg">
              {isAuthenticated ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight font-display">e-Portfolio DB - 통합 관리자 시스템</h2>
              <p className="text-xs text-slate-400">데이터 무결성을 보호하며 한글 및 수식을 직관적으로 가공할 수 있습니다.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Section if not logged in */}
        {!isAuthenticated ? (
          <div className="p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto" id="admin-auth-panel">
            <Lock className="w-12 h-12 text-zinc-400 mb-4 animate-pulse" />
            <h3 className="text-xl font-bold text-slate-100 mb-1 font-display">보안 인증 필요</h3>
            <p className="text-sm text-slate-400 mb-6">포트폴리오의 임의 왜곡을 방지하기 위해 관리자 암호를 입력하십시오.</p>
            
            <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
              <div>
                <input 
                  type="password"
                  placeholder="관리자 비밀번호를 입력하세요 (예: 1111)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-center focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-slate-600 tracking-widest"
                  autoFocus
                />
                {authError && <p className="text-rose-400 text-xs mt-2 font-medium">{authError}</p>}
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-white font-medium rounded-lg transition-all shadow-md font-display text-sm"
              >
                인가 수행하기
              </button>
            </form>
            <p className="text-[11px] text-slate-500 mt-6 font-mono font-semibold">GUIDELINE SPECIFIED PW: 1111</p>
          </div>
        ) : (
          /* Real Admin Dashboard when authenticated */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden" id="admin-dashboard-layout">
            
            {/* Sidebar Tabs */}
            <div className="w-full md:w-56 bg-slate-950 border-r border-slate-800 flex flex-col overflow-y-auto shrink-0">
              <div className="p-3">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold px-3">데이터 관리 섹션</span>
              </div>
              <nav className="flex-1 px-2 space-y-1">
                {[
                  { id: 'hero', label: '첫 화면 (Hero)', icon: Layers },
                  { id: 'about', label: '인물소개 (About)', icon: FileText },
                  { id: 'timeline', label: '스토리 타임라인', icon: Activity },
                  { id: 'project', label: '대표 캡스톤', icon: Cpu },
                  { id: 'experience', label: '체험 및 경력', icon: Award },
                  { id: 'skills', label: '기술 스택', icon: Database },
                  { id: 'archive', label: '경험 아카이브', icon: Database },
                  { id: 'why', label: '채용이유 제안', icon: Award },
                  { id: 'contact', label: '연락망 채널', icon: Link },
                ].map((tab) => {
                  const IconComp = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-all text-left ${
                        activeTab === tab.id 
                          ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500 font-bold' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <IconComp className="w-4 h-4 shrink-0" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex flex-col gap-2">
                <button
                  onClick={handleLogout}
                  className="w-full py-1.5 px-3 border border-slate-800 hover:border-slate-700 bg-slate-900 text-[11px] font-semibold text-slate-300 hover:text-white rounded transition-all"
                >
                  로그아웃
                </button>
                <button
                  onClick={handleResetToDefault}
                  className={`w-full py-1.5 px-3 border text-[11px] font-semibold rounded transition-all flex items-center justify-center gap-1.5 ${
                    isResetConfirming 
                      ? 'bg-rose-600 hover:bg-rose-500 border-rose-500 text-white animate-pulse' 
                      : 'bg-rose-950/20 hover:bg-rose-950/40 border-rose-900/30 hover:border-rose-800 text-rose-400'
                  }`}
                  title="모든 저장 내용을 기본 예제(김건우 시나리오)로 완전 초기화합니다"
                >
                  <RotateCcw className="w-3 h-3" />
                  {isResetConfirming ? '정말 복원하시겠습니까? (다시 클릭)' : '기본값 초기화'}
                </button>
              </div>
            </div>

            {/* Editing Work Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-900/40" id="admin-work-area">
              
              {/* TAB 1: HERO */}
              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Hero Section 수정</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">메인 카피 메시지</label>
                      <input 
                        type="text"
                        value={editedData.hero.title}
                        onChange={(e) => setEditedData({ ...editedData, hero: { ...editedData.hero, title: e.target.value } })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">서브 설명구 (또는 슬로건)</label>
                      <input 
                        type="text"
                        value={editedData.hero.subtitle}
                        onChange={(e) => setEditedData({ ...editedData, hero: { ...editedData.hero, subtitle: e.target.value } })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-bold text-slate-300 mt-6 mb-2">핵심 숫자 3종 (직무 가치 데이터)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {editedData.hero.stats.map((stat, idx) => (
                          <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                            <span className="text-xs font-bold text-blue-400">지표 {idx + 1}</span>
                            <input 
                              type="text"
                              value={stat.value}
                              placeholder="39% / 1회"
                              onChange={(e) => updateHeroStat(idx, 'value', e.target.value)}
                              className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-white text-xs font-mono font-bold focus:outline-none focus:border-blue-500"
                            />
                            <input 
                              type="text"
                              value={stat.label}
                              placeholder="설명 문구"
                              onChange={(e) => updateHeroStat(idx, 'label', e.target.value)}
                              className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300 text-xs focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ABOUT */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">About Me 인적사항 수정</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">성명</label>
                        <input 
                          type="text"
                          value={editedData.aboutMe.name}
                          onChange={(e) => setEditedData({ ...editedData, aboutMe: { ...editedData.aboutMe, name: e.target.value } })}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">엔지니어 직격 포지션 정보</label>
                        <input 
                          type="text"
                          value={editedData.aboutMe.role}
                          onChange={(e) => setEditedData({ ...editedData, aboutMe: { ...editedData.aboutMe, role: e.target.value } })}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* ID Photo (증명사진) Upload Section */}
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
                      <label className="block text-xs font-semibold text-slate-300">신입 이력서용 증명사진 (3:4 비율)</label>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-[85px] border border-slate-800 bg-slate-900 rounded-md overflow-hidden relative flex items-center justify-center">
                          {editedData.aboutMe.imageUrl ? (
                            <img 
                              src={editedData.aboutMe.imageUrl} 
                              alt="증명사진" 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <User className="w-6 h-6 text-slate-600" />
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex gap-2">
                            <label className="cursor-pointer px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded transition-all flex items-center gap-1.5">
                              <Camera className="w-3.5 h-3.5" /> 업로드
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setEditedData({
                                        ...editedData,
                                        aboutMe: { ...editedData.aboutMe, imageUrl: reader.result as string }
                                      });
                                    };
                                    reader.readAsDataURL(e.target.files[0]);
                                  }
                                }}
                              />
                            </label>
                            {editedData.aboutMe.imageUrl && (
                              <button
                                type="button"
                                onClick={() => setEditedData({
                                  ...editedData,
                                  aboutMe: { ...editedData.aboutMe, imageUrl: '' }
                                })}
                                className="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 border border-rose-900/30 text-rose-400 text-xs font-bold rounded transition-all flex items-center gap-1.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> 삭제
                              </button>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500">지정 규격: 반명함판 3:4 종횡비 권장 (정밀 크롭 적용)</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-2">핵심 직무 키워드 4선</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {editedData.aboutMe.keywords.map((k, idx) => (
                          <div key={idx} className="flex flex-col gap-1">
                            <span className="text-[10px] text-slate-500 font-bold">Key {idx + 1}</span>
                            <input 
                              type="text"
                              value={k}
                              onChange={(e) => updateKeyword(idx, e.target.value)}
                              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                      <div className="flex items-center justify-between mt-4 mb-2">
                        <label className="block text-xs font-semibold text-slate-300">인사담당자용 서술형 설명 (줄 단위 정리)</label>
                        <button
                          onClick={addAboutDescRow}
                          className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> 문장 추가
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {editedData.aboutMe.descriptions.map((desc, idx) => (
                          <div key={idx} className="flex gap-2 items-start">
                            <span className="text-xs text-slate-600 font-mono mt-2.5">[{idx + 1}]</span>
                            <textarea 
                              value={desc}
                              onChange={(e) => updateAboutDesc(idx, e.target.value)}
                              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 h-20"
                            />
                            <button
                              onClick={() => deleteAboutDescRow(idx)}
                              className="p-2 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/20 hover:text-rose-400 text-slate-500 rounded-lg mt-1 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
              )}

               {/* TAB 3: TIMELINE */}
              {activeTab === 'timeline' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">My Story 타임라인 가공</h3>
                  
                  {/* Current List (Inline Editable) */}
                  <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                    {editedData.timeline.map((item) => (
                      <div key={item.id} className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-lg flex flex-col gap-3">
                        <div className="flex gap-3 items-center">
                          <div className="w-24 shrink-0">
                            <label className="block text-[10px] text-slate-500 font-bold mb-0.5">연도</label>
                            <input
                              type="text"
                              value={item.year}
                              onChange={(e) => {
                                const updated = { ...editedData };
                                updated.timeline = updated.timeline.map(t => t.id === item.id ? { ...t, year: e.target.value } : t);
                                setEditedData(updated);
                              }}
                              className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-sky-400 text-xs font-mono font-bold focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <label className="block text-[10px] text-slate-500 font-bold mb-0.5">활동명 (Title)</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const updated = { ...editedData };
                                updated.timeline = updated.timeline.map(t => t.id === item.id ? { ...t, title: e.target.value } : t);
                                setEditedData(updated);
                              }}
                              className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-white text-xs font-bold focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          <button
                            onClick={() => deleteTimelineItem(item.id)}
                            className="p-1.5 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 rounded transition-all shrink-0 mt-4"
                            title="연혁 삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-500 font-bold mb-0.5">간략한 설명/성과</label>
                          <textarea
                            value={item.description}
                            onChange={(e) => {
                              const updated = { ...editedData };
                              updated.timeline = updated.timeline.map(t => t.id === item.id ? { ...t, description: e.target.value } : t);
                              setEditedData(updated);
                            }}
                            rows={2}
                            className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-300 text-xs focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                          />
                        </div>

                        <div className="flex items-center justify-between gap-4 border-t border-slate-900 pt-2 pb-1">
                          <div className="flex items-center gap-3">
                            {item.imageUrl && (
                              <img 
                                src={item.imageUrl} 
                                alt="" 
                                className="w-12 h-8 rounded object-cover border border-slate-800 shrink-0" 
                                referrerPolicy="no-referrer"
                              />
                            )}
                            <div className="flex items-center gap-2.5">
                              <label className="cursor-pointer text-[10px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 bg-slate-900/60 hover:bg-slate-900 px-2.5 py-1 rounded border border-slate-800/80 transition-all">
                                <span>📷 사진 {item.imageUrl ? '변경' : '등록'}</span>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        const updated = { ...editedData };
                                        updated.timeline = updated.timeline.map(t => {
                                          if (t.id === item.id) {
                                            return { ...t, imageUrl: reader.result as string };
                                          }
                                          return t;
                                        });
                                        setEditedData(updated);
                                      };
                                      reader.readAsDataURL(e.target.files[0]);
                                    }
                                  }}
                                />
                              </label>

                              {item.imageUrl && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = { ...editedData };
                                    updated.timeline = updated.timeline.map(t => {
                                      if (t.id === item.id) {
                                        const { imageUrl, ...rest } = t;
                                        return rest;
                                      }
                                      return t;
                                    });
                                    setEditedData(updated);
                                  }}
                                  className="text-[10px] text-rose-400 hover:text-rose-300 font-bold bg-slate-900/40 hover:bg-slate-900 px-2.5 py-1 rounded border border-slate-800/80 transition-all"
                                >
                                  🗑️ 이미지 삭제
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Form */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                    <span className="text-xs font-bold text-blue-400 block border-b border-slate-800 pb-1">새 타임라인 연혁 추가</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-500 font-bold mb-1">연도</label>
                        <input 
                          type="text"
                          placeholder="예: 2024"
                          value={newTimeline.year}
                          onChange={(e) => setNewTimeline({ ...newTimeline, year: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[11px] text-slate-500 font-bold mb-1">활동명</label>
                        <input 
                          type="text"
                          placeholder="예: 한전KPS 인턴 과정 수료"
                          value={newTimeline.title}
                          onChange={(e) => setNewTimeline({ ...newTimeline, title: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 font-bold mb-1">간략한 설명/성과</label>
                      <input 
                        type="text"
                        placeholder="예: 전장 발전 문서 분석 및 실무 시스템 적합성 분석"
                        value={newTimeline.description}
                        onChange={(e) => setNewTimeline({ ...newTimeline, description: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    
                    {/* Add Image Picker to Add Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-500 font-bold mb-1">연도별 활동 사진 (선택)</label>
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-850 rounded text-slate-300 text-xs font-bold transition-all flex-1 text-center">
                            {newTimeline.imageUrl ? '📸 사진 선택됨' : '📂 사진 파일 선택...'}
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setNewTimeline({ ...newTimeline, imageUrl: reader.result as string });
                                  };
                                  reader.readAsDataURL(e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                          {newTimeline.imageUrl && (
                            <button
                              type="button"
                              onClick={() => setNewTimeline({ ...newTimeline, imageUrl: undefined })}
                              className="p-1 px-2 bg-rose-950/30 border border-rose-900 text-rose-400 hover:bg-rose-900/50 text-xs rounded font-bold transition-colors"
                            >
                              제거
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={addTimelineItem}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-md flex items-center gap-1 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" /> 활동 추가하기
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PROJECT */}
              {activeTab === 'project' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">대표 프로젝트 (ESG Smart Grid) 수정</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">프로젝트 명칭</label>
                      <input 
                        type="text"
                        value={editedData.coreProject.title}
                        onChange={(e) => setEditedData({ ...editedData, coreProject: { ...editedData.coreProject, title: e.target.value } })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">진행 기간</label>
                      <input 
                        type="text"
                        value={editedData.coreProject.period}
                        onChange={(e) => setEditedData({ ...editedData, coreProject: { ...editedData.coreProject, period: e.target.value } })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-rose-400 mb-1">Problem (발생한 현장 문제)</label>
                      <textarea 
                        value={editedData.coreProject.problem}
                        onChange={(e) => setEditedData({ ...editedData, coreProject: { ...editedData.coreProject, problem: e.target.value } })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 h-20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-emerald-400 mb-1">Solution (기술적 대응 방안)</label>
                      <textarea 
                        value={editedData.coreProject.solution}
                        onChange={(e) => setEditedData({ ...editedData, coreProject: { ...editedData.coreProject, solution: e.target.value } })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 h-20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-blue-400 mb-1">Result (수량화된 전기 절감 결과)</label>
                      <input 
                        type="text"
                        value={editedData.coreProject.result}
                        onChange={(e) => setEditedData({ ...editedData, coreProject: { ...editedData.coreProject, result: e.target.value } })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 font-mono text-white"
                      />
                    </div>

                    {/* Roles array */}
                    <div>
                      <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-4 mb-2">
                        <label className="block text-xs font-bold text-slate-300">본인의 기술적 역할 (My Role)</label>
                        <button
                          onClick={addProjectRoleRow}
                          className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                          <Plus className="w-3" /> 역할 추가
                        </button>
                      </div>
                      <div className="space-y-2">
                        {editedData.coreProject.roles.map((role, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input 
                              type="text"
                              value={role}
                              onChange={(e) => updateProjectRole(idx, e.target.value)}
                              className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-850 rounded text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                            />
                            <button
                              onClick={() => deleteProjectRoleRow(idx)}
                              className="p-1.5 hover:bg-rose-950/20 text-slate-500 hover:text-rose-400 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Learnings array */}
                    <div>
                      <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-4 mb-2">
                        <label className="block text-xs font-bold text-slate-300">엔지니어로 배운 점 (What I Learned)</label>
                        <button
                          onClick={addProjectLearningRow}
                          className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                          <Plus className="w-3" /> 학습항목 추가
                        </button>
                      </div>
                      <div className="space-y-2">
                        {editedData.coreProject.learnings.map((learn, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input 
                              type="text"
                              value={learn}
                              onChange={(e) => updateProjectLearning(idx, e.target.value)}
                              className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-850 rounded text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                            />
                            <button
                              onClick={() => deleteProjectLearningRow(idx)}
                              className="p-1.5 hover:bg-rose-950/20 text-slate-500 hover:text-rose-400 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: EXPERIENCE */}
              {activeTab === 'experience' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Experience (한전KPS, KOICA 등)</h3>
                  
                  {/* Current Experience list */}
                  <div className="space-y-4">
                    {editedData.experiences.map((exp) => (
                      <div key={exp.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-blue-400">{exp.company} | {exp.role}</span>
                          <button
                            onClick={() => deleteExperienceItem(exp.id)}
                            className="p-1 hover:bg-rose-950/30 text-slate-500 hover:text-rose-400 rounded transition-all"
                            title="해당 경험 카드 삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-400 font-mono">{exp.period}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                          <div className="p-2 bg-slate-900 rounded">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">주요 실무</span>
                            <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1 mt-1">
                              {exp.activities.map((act, i) => <li key={i}>{act}</li>)}
                            </ul>
                          </div>
                          <div className="p-2 bg-slate-900 rounded">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">인사이트 & 배움</span>
                            <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1 mt-1">
                              {exp.learnings.map((lrn, i) => <li key={i}>{lrn}</li>)}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Experience card */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                    <span className="text-xs font-bold text-blue-400 block border-b border-slate-800 pb-1">새로운 세션/경험 카드 추가</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-500 font-semibold mb-1">기관/회사명</label>
                        <input 
                          type="text"
                          placeholder="예: 현대오토에버"
                          value={newExp.company}
                          onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 font-semibold mb-1">역할</label>
                        <input 
                          type="text"
                          placeholder="예: 제어시스템 개발 인턴"
                          value={newExp.role}
                          onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 font-semibold mb-1">기간</label>
                        <input 
                          type="text"
                          placeholder="예: 2025.12 ~ 2026.02"
                          value={newExp.period}
                          onChange={(e) => setNewExp({ ...newExp, period: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] text-slate-400 font-semibold">수행할 주요 행동 (줄 나눔하여 입력)</label>
                      <textarea
                        placeholder="전력 제어 모듈 설계 보조&#10;정기 설비 체크리스트 작업 참여"
                        rows={2}
                        onChange={(e) => setNewExp({ ...newExp, activities: e.target.value.split('\n') })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] text-slate-400 font-semibold">획득한 교훈과 배움 (줄 나눔하여 입력)</label>
                      <textarea
                        placeholder="신뢰할 수 있는 백업 코드 작성의 소중함&#10;팀의 유동적 문제 조율 모델 체득"
                        rows={2}
                        onChange={(e) => setNewExp({ ...newExp, learnings: e.target.value.split('\n') })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={addExperienceItem}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" /> 경험 세션 저장
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: SKILLS */}
              {activeTab === 'skills' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Technical Skills 기술 스택 제어</h3>
                  
                  {/* Category manager */}
                  <div className="space-y-6">
                    {/* Electrical */}
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                      <span className="text-xs font-bold text-blue-400">Electrical (전공 전문 지식)</span>
                      
                      <div className="flex flex-wrap gap-2">
                        {editedData.skills.electrical.map((sk, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-slate-800 text-white rounded text-xs">
                            {sk}
                            <button onClick={() => deleteSkill('electrical', idx)} className="text-slate-500 hover:text-rose-400">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2 max-w-sm">
                        <input 
                          type="text"
                          placeholder="새 전공지식 추가"
                          value={newElectrical}
                          onChange={(e) => setNewElectrical(e.target.value)}
                          onKeyDown={(e) => { if(e.key === 'Enter') { addSkill('electrical', newElectrical); setNewElectrical(''); } }}
                          className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white focus:outline-none"
                        />
                        <button 
                          onClick={() => { addSkill('electrical', newElectrical); setNewElectrical(''); }}
                          className="px-3 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold"
                        >
                          추가
                        </button>
                      </div>
                    </div>

                    {/* Programming */}
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                      <span className="text-xs font-bold text-teal-400">Programming (임베디드 및 로직 언어)</span>
                      
                      <div className="flex flex-wrap gap-2">
                        {editedData.skills.programming.map((sk, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-slate-800 text-white rounded text-xs">
                            {sk}
                            <button onClick={() => deleteSkill('programming', idx)} className="text-slate-500 hover:text-rose-400">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2 max-w-sm">
                        <input 
                          type="text"
                          placeholder="새 프로그래밍 스택 추가"
                          value={newProgramming}
                          onChange={(e) => setNewProgramming(e.target.value)}
                          onKeyDown={(e) => { if(e.key === 'Enter') { addSkill('programming', newProgramming); setNewProgramming(''); } }}
                          className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white focus:outline-none"
                        />
                        <button 
                          onClick={() => { addSkill('programming', newProgramming); setNewProgramming(''); }}
                          className="px-3 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold"
                        >
                          추가
                        </button>
                      </div>
                    </div>

                    {/* Tools */}
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                      <span className="text-xs font-bold text-amber-500">Tools & Documentation (실무 유틸리티)</span>
                      
                      <div className="flex flex-wrap gap-2">
                        {editedData.skills.tools.map((sk, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-slate-800 text-white rounded text-xs">
                            {sk}
                            <button onClick={() => deleteSkill('tools', idx)} className="text-slate-500 hover:text-rose-400">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2 max-w-sm">
                        <input 
                          type="text"
                          placeholder="새 도구 스택 추가"
                          value={newTool}
                          onChange={(e) => setNewTool(e.target.value)}
                          onKeyDown={(e) => { if(e.key === 'Enter') { addSkill('tools', newTool); setNewTool(''); } }}
                          className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white focus:outline-none"
                        />
                        <button 
                          onClick={() => { addSkill('tools', newTool); setNewTool(''); }}
                          className="px-3 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold"
                        >
                          추가
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: ARCHIVE */}
              {activeTab === 'archive' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Experience Database (경험 아카이브 성찰 관리)</h3>
                  
                  {/* Current database table */}
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {editedData.archive.map((item) => (
                      <div key={item.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-start gap-4">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded shrink-0 uppercase tracking-wider ${
                          item.category === '독서' ? 'bg-amber-950/40 border border-amber-800/30 text-amber-400' :
                          item.category === '봉사' ? 'bg-indigo-950/40 border border-indigo-800/30 text-indigo-400' :
                          item.category === '인턴' ? 'bg-cyan-950/40 border border-cyan-800/30 text-cyan-400' :
                          'bg-emerald-950/40 border border-emerald-800/30 text-emerald-400'
                        }`}>
                          {item.category}
                        </span>
                        <div className="flex-1 space-y-1">
                          <h4 className="text-xs font-bold text-slate-100">{item.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed font-sans">{item.reflection}</p>
                        </div>
                        <button
                          onClick={() => deleteArchiveItem(item.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Archive Form */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                    <span className="text-xs font-bold text-blue-400 block border-b border-slate-800 pb-1">새 연구 성찰 기록 추가</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-500 font-bold mb-1">카테고리</label>
                        <select
                          value={newArchive.category}
                          onChange={(e) => setNewArchive({ ...newArchive, category: e.target.value as any })}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-200 rounded text-xs focus:outline-none focus:border-blue-500"
                        >
                          <option value="독서">독서</option>
                          <option value="봉사">봉사</option>
                          <option value="인턴">인턴</option>
                          <option value="프로젝트">프로젝트</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[11px] text-slate-500 font-bold mb-1">경험 아티클 명칭</label>
                        <input 
                          type="text"
                          placeholder="예: 현대 사회 속 마이크로그리드 이슈 분석"
                          value={newArchive.title}
                          onChange={(e) => setNewArchive({ ...newArchive, title: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 font-bold mb-1">본 경험을 직무 가치로 전환한 성찰 문장</label>
                      <textarea
                        rows={2}
                        placeholder="예: 책을 읽고 복잡한 전기 정비도 일일 표준 프로토콜 데이터의 유기적 흐름임을 각성하는 동기 획득..."
                        value={newArchive.reflection}
                        onChange={(e) => setNewArchive({ ...newArchive, reflection: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={addArchiveItem}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" /> 아카이브 적재
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: WHY */}
              {activeTab === 'why' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Why Hire Me (4가지 인사담당자 핵심 채용이유 제안)</h3>
                  <div className="space-y-4">
                    {editedData.whyHireMe.map((item, idx) => (
                      <div key={item.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                        <span className="text-[10px] font-bold text-blue-400">강점 요인 {idx + 1}</span>
                        <input 
                          type="text"
                          value={item.title}
                          onChange={(e) => updateWhyHireMe(idx, 'title', e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-850 rounded text-white text-xs font-bold focus:outline-none focus:border-blue-500"
                        />
                        <textarea 
                          value={item.description}
                          onChange={(e) => updateWhyHireMe(idx, 'description', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded text-slate-300 text-xs focus:outline-none focus:border-blue-500 h-16"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 9: CONTACT */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Contact 연락 방식 변경</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">이메일</label>
                      <input 
                        type="email"
                        value={editedData.contact.email}
                        onChange={(e) => setEditedData({ ...editedData, contact: { ...editedData.contact, email: e.target.value } })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">유튜브 링크</label>
                      <input 
                        type="text"
                        value={editedData.contact.youtube || ''}
                        onChange={(e) => setEditedData({ ...editedData, contact: { ...editedData.contact, youtube: e.target.value } })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* Footer */}
        {isAuthenticated && (
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center">
            <span className="text-xs text-blue-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              인증 활성화 상태 (수정사항 보존 대기중)
            </span>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-slate-705 hover:bg-slate-800 text-xs font-semibold text-slate-300 rounded-lg transition-all"
              >
                취소
              </button>
              <button
                onClick={handleSaveAll}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <Save className="w-4 h-4" /> 변경내용 저장 및 적용
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
