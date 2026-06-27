import { PortfolioData } from './types';

export const initialPortfolioData: PortfolioData = {
  hero: {
    title: "전기공학 & 반도체 유틸리티 자동화 제어 엔지니어",
    subtitle: "고신뢰성 계통 설계, 능동 제어 전력 인프라 및 신뢰성 검증 실무 경험을 겸비한 반도체 설비 최적화 전문 인재입니다.",
    stats: [
      { value: "99.1%", label: "계동 역률 최적 보상 수준" },
      { value: "320시간+", label: "발전/전력 설비 실무 교육 및 인턴" },
      { value: "1위", label: "캡스톤 디자인 기술 완성도 평가" }
    ]
  },
  aboutMe: {
    name: "김건우",
    role: "전력 설비 및 자동화 제어 엔지니어 (Plant Facility & Automated Control Engineer)",
    keywords: ["계통 정비 실무 검증 완료", "FAB 전력 제어 보상 설계", "C / C++ 펌웨어 최적화", "KOICA 글로벌 리더십"],
    descriptions: [
      "학부 과정에서 전기계통 및 전력전자설계를 전공하며 고신뢰 배관 및 클린룸 핵심 유틸리티 설비(CCSS)의 정비 및 모니터링 시퀀스를 마스터했습니다.",
      "발전 송전 설비 예산 통제 실무와 한전KPS 인턴 실무를 통해 무결점 데이터 관리 및 도면 해독 기량을 축적하였습니다.",
      "초음파 및 PIR 센서 제어 알림을 이용한 능동 조명 제어 마이크로그리드 시스템을 설계 및 시뮬레이터로 제작하여 기술적 자생 능력을 입증하였습니다."
    ],
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&q=80"
  },
  timeline: [
    { id: "tl-1", year: "2022", title: "전기공학 심화 주전공 진입", description: "회로이론, 전력 계통 공학 및 전기 기기 구조론 성과 우수 및 설계 기초 완성." },
    { id: "tl-2", year: "2023", title: "임베디드 제어 및 펌웨어 개발 마스터", description: "AVR ATMEGA328P 마이크로컨트롤러 기반의 외부 인트럽트 및 ADC 샘플링 실무 기획 제어." },
    { id: "tl-3", year: "2024", title: "한전KPS 발전소 정비 기술 실무 연수", description: "송배전 예비 계통 정비, 도면 교차 매칭 기법을 이용한 부품 정밀 검증 이행." },
    { id: "tl-4", year: "2025", title: "KOICA 글로벌 ESG 기술 봉사 리더십", description: "현지 자생 가능한 전력 설비 교육 프로그램 개발 및 글로벌 협업 우수 단원 선정." },
    { id: "tl-5", year: "2026", title: "능동 최적 제어 캡스톤 디자인 1위", description: "히스테리시스 루프와 초음파 펄스 동요 모의 장치를 임베디드 시뮬레이터로 제작 및 특허 출원 연계." }
  ],
  coreProject: {
    id: "core-proj-1",
    title: "고정밀 스마트 전력 그리드 & 능동 조명 자동 제어 시스템",
    period: "2025.09 - 2026.02",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80",
    problem: "일반 가로등 및 반도체 공장 대기 전력 계통은 불필요한 누설 전류와 계동 전압 SAG 고조파 왜곡에 실시간 대응이 불가능하여 에너지가 낭비되고 설비 신뢰성이 위협받고 있었습니다.",
    solution: "초음파 센서와 PIR 센서의 결합 알고리즘 및 CDS 히스테리시스 루프 제어를 구현하여, 보행자 진입 시 즉각 역률을 보상하고 대기모드 시 유효전력을 감쇄시키는 저비용 고신뢰 제어 노드를 임베디드로 구현했습니다.",
    roles: ["임베디드 센서 융합 펌웨어 프로그램 설계", "H-Bridge 역률 능동 정합 보상 제어 회로 설계", "수동 필터 기반 THD 차단 특성 검증"],
    result: "기존 보상 전력망 대비 누설 저감 효과 39.4%를 달성하였으며 전원 동요 노이즈 정합 감쇄 시간 50ms 미만을 검증했습니다.",
    learnings: ["상호 배타적인 센서 특성의 수집 데이터 가중 합성법 습득", "실시간 계통 모의 테스트에서 시뮬레이션 간극을 극복하는 무결점 펌웨어 정밀 교정 지식 확보"]
  },
  experiences: [
    {
      id: "exp-1",
      company: "한전KPS (KEPCO KPS)",
      role: "발전 정비 및 계통 실무 인턴",
      period: "2024.03 - 2024.08",
      activities: [
        "발전소 정비 기술 자료 검증 및 1차 도면 대조",
        "송배전 배전반 보수 현장 보조 및 유지보수 이력 문서 정리"
      ],
      learnings: [
        "수백억 예산의 전력 기기 핵심 정비의 무결성은 정합된 기록의 대조에서부터 시작함을 실감",
        "현장 엔지니어 지침서 관리 절차 엄격 숙지"
      ]
    },
    {
      id: "exp-2",
      company: "KOICA (한국국제협력단)",
      role: "글로벌 ESG 전력 인프라 봉사 단원",
      period: "2025.01 - 2025.04",
      activities: [
        "현지 전력 인프라 미비 지역 맞춤 자생 전력 교육 설계",
        "스마트 마이크로그리드 간이 설치 프로젝트 리더십 수행"
      ],
      learnings: [
        "단순한 시혜 기술 지원이 아닌 유지 보수 가능한 인적 인프라 체계를 세우는 기술 외교의 필요성 인지"
      ]
    }
  ],
  skills: {
    electrical: [
      "송배전 공학 & 계동 임피던스 설계",
      "역률 능동 제어 회로 (Active Power Factor Correction)",
      "CCSS 중앙제어 시스템 시퀀스 제어디자인",
      "수동/능동 필터 고조파 감쇄 설계"
    ],
    programming: [
      "Embedded C / C++ (Cortex-M, AVR, ATMEGA)",
      "PLC 제어 프로그래밍 (XG5000, LD)",
      "Python 데이터 전처리 및 회귀 최적화 모의"
    ],
    tools: [
      "MATLAB & Simulink 계통 해석",
      "Altium Designer PCB Artwork",
      "OrCAD PSpice 신호 회로 분석",
      "Excel VBA 엔지니어링 자동 문서 가공"
    ]
  },
  archive: [
    { id: "arch-1", category: "독서", title: "반도체 공정 자동화와 제어 시퀀스의 미래", reflection: "첨단 나노 공정에서의 사소한 전압 SAG는 생산 수율에 수조 원대 피해를 주기에 제어 노드의 무결점이 기업 경쟁력임을 확인했습니다." },
    { id: "arch-2", category: "봉사", title: "KOICA 봉사 - 필리핀 오지 자립형 전력망 설치 활동", reflection: "개발도상국 현지에 맞게 자생 가능한 소형 전력망을 이식하며, 공학의 가치는 완벽한 정비 지침 수립에 있음을 배웠습니다." },
    { id: "arch-3", category: "인턴", title: "한전KPS 인턴 - 설비 안전 기준 대조 프로젝트", reflection: "도면 대조 작업 시 사소한 수치 오차를 검증하여 정비 품질의 완결성을 끌어올린 엔지니어링 성찰을 축적했습니다." },
    { id: "arch-4", category: "프로젝트", title: "특허 출원 - 다중 센서 결합 활성화 전력 저감 가로등", reflection: "보행자 감지 융합 시 가상 초음파 센싱을 결합하여 히스테리시스 오동작 신뢰도를 99.8% 확보했습니다." }
  ],
  whyHireMe: [
    { id: "why-1", title: "확립된 규범 중심의 수작업 검증 능력", description: "한전KPS 현장 경험을 통해 하찮아 보이는 원단위 데이터 및 도면의 미세한 모순을 성실히 교차 검증하는 인재입니다." },
    { id: "why-2", title: "반도체 Fab 맞춤형 전력 최적화 역량", description: "반도체 Cleanroom 초정밀 설비와 고품질 화학물질 유틸리티 공급 장치(CCSS)의 전원 정합 및 순간 Sagar 전압 차단 제어 능력을 즉시 발휘할 수 있습니다." },
    { id: "why-3", title: "C/C++ 및 PLC 하이브리드 제어 정합성", description: "회로 하드웨어 설계뿐 아니라 내부 임베디드 펌웨어 수준의 알고리즘 코딩, 실시간 가상 제어 루프를 직접 설계 가능한 전천후 실력자입니다." },
    { id: "why-4", title: "성찰하는 엔지니어의 성장 습관", description: "실패 이탈 데이터나 오류 기록들을 버리지 않고 하나의 지식 데이터베이스로 구조화하여 미래 오동작 예방에 자산화하는 습관을 지녔습니다." }
  ],
  contact: {
    email: "gimgeonho08@gmail.com",
    youtube: "https://youtube.com"
  },
  galleryImages: [
    { id: "init-vol-1", category: "volunteer", dataUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=60", name: "KOICA 필리핀 현지 전력 및 교육 인프라 기술 지도 활동.jpg", uploadedAt: "2025-02-15" },
    { id: "init-int-1", category: "intern", dataUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60", name: "한전KPS 인턴 실무 - 발전소 정비 기술 자료 검증 및 도면 교차 매칭.jpg", uploadedAt: "2025-11-10" },
    { id: "init-cap-1", category: "capstone", dataUrl: "https://images.unsplash.com/photo-1517055720730-0766ae085402?w=800&auto=format&fit=crop&q=60", name: "캡스톤 디자인 - Active PFC 임베디드 제어 시뮬레이터 구성도.jpg", uploadedAt: "2026-02-28" }
  ]
};
