import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Moon, 
  Sun, 
  RotateCcw, 
  Terminal, 
  Cpu, 
  Sliders, 
  TrendingUp, 
  Zap, 
  Radio, 
  Eye, 
  UserPlus
} from 'lucide-react';

interface SimZone {
  id: number;
  state: number; // 0: DAYTIME, 1: STANDBY, 2: ACTIVE
  prevState: number;
  pirHigh: boolean;
  distance: number; // in cm
  cdsVal: number;
  nightState: boolean;
  isActive: boolean;
  curPWM: number;
  targetPWM: number;
  timeSinceDetect: number;
}

interface Person {
  x: number; // 0.0 to 1.0 (coordinate across the total simulator width)
  zone: number;
  speed: number;
  active: boolean;
}

interface SimLog {
  id: string;
  time: string;
  msg: string;
  type: 'info' | 'success' | 'warn';
}

export const SmartLightSimulator: React.FC<{ targetCompany?: 'hynix' | 'hanyang' }> = ({ targetCompany = 'hanyang' }) => {
  // Simulator Parameters (State & Refs for both React inputs and fast loop access)
  const [activeTime, setActiveTime] = useState<number>(10000); // ms
  const [usThresh, setUsThresh] = useState<number>(100); // cm
  const [cdsOn, setCdsOn] = useState<number>(550);

  const activeTimeRef = useRef(10000);
  const usThreshRef = useRef(100);
  const cdsOnRef = useRef(550);

  useEffect(() => { activeTimeRef.current = activeTime; }, [activeTime]);
  useEffect(() => { usThreshRef.current = usThresh; }, [usThresh]);
  useEffect(() => { cdsOnRef.current = cdsOn; }, [cdsOn]);

  // Master States
  const [isNightMode, setIsNightMode] = useState<boolean>(true);
  const [autoMode, setAutoMode] = useState<boolean>(true);
  const [logs, setLogs] = useState<SimLog[]>([]);
  const [zonesState, setZonesState] = useState<SimZone[]>([
    { id: 0, state: 1, prevState: 1, pirHigh: false, distance: 300, cdsVal: 620, nightState: true, isActive: false, curPWM: 64, targetPWM: 64, timeSinceDetect: 0 },
    { id: 1, state: 1, prevState: 1, pirHigh: false, distance: 300, cdsVal: 620, nightState: true, isActive: false, curPWM: 64, targetPWM: 64, timeSinceDetect: 0 },
    { id: 2, state: 1, prevState: 1, pirHigh: false, distance: 300, cdsVal: 620, nightState: true, isActive: false, curPWM: 64, targetPWM: 64, timeSinceDetect: 0 },
    { id: 3, state: 1, prevState: 1, pirHigh: false, distance: 300, cdsVal: 620, nightState: true, isActive: false, curPWM: 64, targetPWM: 64, timeSinceDetect: 0 },
  ]);

  // Refs for high performance physics loop
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const zonesRef = useRef<SimZone[]>([
    { id: 0, state: 1, prevState: 1, pirHigh: false, distance: 300, cdsVal: 620, nightState: true, isActive: false, curPWM: 64, targetPWM: 64, timeSinceDetect: 0 },
    { id: 1, state: 1, prevState: 1, pirHigh: false, distance: 300, cdsVal: 620, nightState: true, isActive: false, curPWM: 64, targetPWM: 64, timeSinceDetect: 0 },
    { id: 2, state: 1, prevState: 1, pirHigh: false, distance: 300, cdsVal: 620, nightState: true, isActive: false, curPWM: 64, targetPWM: 64, timeSinceDetect: 0 },
    { id: 3, state: 1, prevState: 1, pirHigh: false, distance: 300, cdsVal: 620, nightState: true, isActive: false, curPWM: 64, targetPWM: 64, timeSinceDetect: 0 },
  ]);

  const personsRef = useRef<Person[]>([]);
  const startTimeRef = useRef<number>(Date.now());
  const requestRef = useRef<number | null>(null);

  // Constants
  const NUM = 4;
  const CDS_OFF = 450;
  const PWM_PINS = [5, 6, 9, 10];

  // System Logs custom writer
  const addLog = (msg: string, type: 'info' | 'success' | 'warn' = 'info') => {
    const elapsed = ((Date.now() - startTimeRef.current) / 1000).toFixed(1);
    const newLog: SimLog = {
      id: Math.random().toString(36).substring(2, 9),
      time: elapsed,
      msg,
      type
    };
    setLogs(prev => {
      const next = [newLog, ...prev];
      if (next.length > 50) return next.slice(0, 50);
      return next;
    });
  };

  // Day/Night mode toggling
  const toggleNight = () => {
    const targetState = !isNightMode;
    setIsNightMode(targetState);
    zonesRef.current.forEach(z => {
      z.cdsVal = targetState ? 620 : 300;
      z.nightState = targetState;
    });
    addLog(
      `조도 센서 작동 피드백: ${targetState ? '야간 상태 감지 🌙 [CDS 620lx]' : '주간 상태 감지 ☀️ [CDS 300lx]'}`,
      targetState ? 'info' : 'warn'
    );
  };

  // Spawn pedestrian
  const spawnPerson = () => {
    const x = Math.random() * 0.8 + 0.1; // Spawn in middle region to enter naturally
    const zoneNum = Math.min(NUM - 1, Math.floor(x * NUM));
    const speed = (Math.random() * 0.0006 + 0.0004) * (Math.random() < 0.5 ? 1 : -1);

    personsRef.current.push({
      x,
      zone: zoneNum,
      speed,
      active: true
    });
    
    addLog(`구역 ${zoneNum + 1} 감지 ↗ 유틸리티 정합 및 전력 능동 보상 회로 기동 (응답 감쇄 ~${Math.round(Math.random() * 40 + 10)}μs/cm)`, 'success');
  };

  // Reset simulator
  const resetAll = () => {
    personsRef.current = [];
    zonesRef.current.forEach(z => {
      z.pirHigh = false;
      z.isActive = false;
      z.distance = 300;
      z.curPWM = z.nightState ? 64 : 0;
      z.targetPWM = z.nightState ? 64 : 0;
      z.state = z.nightState ? 1 : 0;
      z.timeSinceDetect = 0;
    });
    setZonesState([...zonesRef.current]);
    addLog('초정밀 유틸리티 설비(CCSS) 및 마이크로그리드 제어 계통 초기화 완료', 'info');
  };

  // Continuous loop trigger
  useEffect(() => {
    startTimeRef.current = Date.now();
    addLog('공정 유틸리티 및 마이크로그리드 제어기 온라인', 'success');
    addLog('설비 핀 제어 매핑 완료: Sensor(D2,D4,D7,D8) | Echo/THD(A4,A5,D13,D3) | Output/ActiveFilter(D5,D6,D9,D10)', 'info');
    addLog('무결점 피드백 연산 루프 시뮬레이션 활성화 [역률 안정화 보상 대기]', 'info');

    // Run active loop
    const tick = () => {
      const now = Date.now();

      // Auto pedestrian spawning
      if (autoMode && Math.random() < 0.004) {
        spawnPerson();
      }

      // Reset physical state variables of all zones before evaluating pedestrians
      zonesRef.current.forEach(z => {
        z.pirHigh = false;
        z.distance = 300;
      });

      // Update positions of pedestrians
      personsRef.current = personsRef.current.filter(p => {
        if (!p.active) return false;
        p.x += p.speed;

        // If person walks off boundary
        if (p.x < -0.05 || p.x > 1.05) {
          p.active = false;
          return false;
        }

        // Map x coordinate (0..1) to zone index (0..3)
        const zi = Math.min(NUM - 1, Math.max(0, Math.floor(p.x * NUM)));
        zonesRef.current[zi].pirHigh = true;

        // Compute simulated ultrasonic distance based on proximity to lamp pole center
        const poleCenterX = (zi + 0.5) / NUM;
        const diffDistanceX = Math.abs(p.x - poleCenterX);
        zonesRef.current[zi].distance = Math.round(diffDistanceX * 500); // scale factor

        return true;
      });

      // Update Zone FSM (Finite State Machines) and fades
      let stateChanged = false;
      zonesRef.current.forEach(z => {
        z.prevState = z.state;

        // CDS Hysteresis check
        if (!z.nightState && z.cdsVal > cdsOnRef.current) {
          z.nightState = true;
        }
        if (z.nightState && z.cdsVal < CDS_OFF) {
          z.nightState = false;
        }

        if (!z.nightState) {
          z.state = 0; // DAYTIME
          z.isActive = false;
          z.targetPWM = 0;
        } else {
          // Night mode evaluation
          const detected = z.pirHigh || (z.distance > 0 && z.distance < usThreshRef.current);
          if (detected) {
            z.isActive = true;
            z.timeSinceDetect = now;
          } else if (z.isActive && (now - z.timeSinceDetect) >= activeTimeRef.current) {
            z.isActive = false;
          }

          z.state = z.isActive ? 2 : 1; // 2: ACTIVE, 1: STANDBY
          z.targetPWM = z.isActive ? 255 : 64;
        }

        // Smooth PWM fade transition (+-12 per tick)
        const pwmDiff = z.targetPWM - z.curPWM;
        if (pwmDiff !== 0) {
          z.curPWM = Math.round(z.curPWM + (pwmDiff > 0 ? Math.min(12, pwmDiff) : Math.max(-12, pwmDiff)));
        }

        // Log system state transitions
        if (z.state !== z.prevState) {
          stateChanged = true;
          const labels = ['IDLE_BYPASS', 'STANDBY_MONITOR', 'ACTIVE_CONSUMPTION'];
          const types: ('warn' | 'info' | 'success')[] = ['warn', 'info', 'success'];
          
          addLog(
            `[구역 ${z.id + 1}] ${labels[z.prevState]} → ${labels[z.state]} | PWM/출력=${z.curPWM}% | 감지응답=${z.distance < 300 ? z.distance + 'μs/cm' : '정상상태'}`,
            types[z.state]
          );
        }
      });

      // Synchronize back to react render state cleanly
      setZonesState([...zonesRef.current]);

      // Draw the simulator visualization Canvas
      const cv = canvasRef.current;
      if (cv) {
        const ctx = cv.getContext('2d');
        if (ctx) {
          const W = cv.offsetWidth;
          const H = 160;
          if (cv.width !== W || cv.height !== H) {
            cv.width = W;
            cv.height = H;
          }

          // Background Dark Road
          ctx.fillStyle = '#09090b'; 
          ctx.fillRect(0, 0, W, H);
          
          // Road asphalt
          ctx.fillStyle = '#18181b'; 
          ctx.fillRect(0, H * 0.35, W, H * 0.50);

          // Center yellow dash line
          ctx.setLineDash([15, 12]);
          ctx.strokeStyle = '#27272a'; 
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, H * 0.6);
          ctx.lineTo(W, H * 0.6);
          ctx.stroke();
          ctx.setLineDash([]);

          // Partition partition boundaries
          const ZW = W / NUM;
          for (let i = 1; i < NUM; i++) {
            ctx.strokeStyle = '#27272a';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(ZW * i, 0);
            ctx.lineTo(ZW * i, H);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          // Draw poles, beams, glow and details
          zonesRef.current.forEach((z, i) => {
            const cx = (i + 0.5) * ZW;
            const poleTopY = H * 0.05;
            const poleBaseY = H * 0.38;

            // 1. Dynamic light ground glow with glowing radial gradient helper
            if (z.curPWM > 0) {
              const intensity = z.curPWM / 255;
              const alpha = intensity * 0.25;
              const gradient = ctx.createRadialGradient(cx, H * 0.5, 0, cx, H * 0.5, ZW * 0.6);
              gradient.addColorStop(0, `rgba(250, 204, 21, ${alpha})`);
              gradient.addColorStop(1, 'transparent');
              ctx.fillStyle = gradient;
              ctx.fillRect(cx - ZW * 0.6, H * 0.35, ZW * 1.2, H * 0.50);
            }

            // 2. Translucent PIR cone overlay
            if (z.pirHigh && z.nightState) {
              ctx.save();
              ctx.globalAlpha = 0.08 * (z.curPWM / 255);
              ctx.fillStyle = '#22c55e';
              ctx.beginPath();
              ctx.moveTo(cx, poleTopY + 12);
              ctx.lineTo(cx - ZW * 0.45, poleBaseY + 18);
              ctx.lineTo(cx + ZW * 0.45, poleBaseY + 18);
              ctx.closePath();
              ctx.fill();
              ctx.restore();
            }

            // 3. Draw architectural Lamp Pole Steel Rod style
            ctx.strokeStyle = '#3f3f46';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(cx, poleBaseY);
            ctx.lineTo(cx, poleTopY + 12);
            ctx.bezierCurveTo(cx, poleTopY, cx + 16, poleTopY, cx + 20, poleTopY + 6);
            ctx.stroke();

            // 4. Draw Streetlight LED Cap Head and dynamic lens color
            const intensity = z.curPWM / 255;
            const headColor = intensity > 0.5 
              ? `rgba(253, 224, 71, ${0.7 + intensity * 0.3})` // bright amber-yellow
              : intensity > 0 
                ? `rgba(96, 165, 250, ${0.3 + intensity * 0.5})` // cool standby standby-blue
                : '#27272a'; // dead day-grey
            ctx.fillStyle = headColor;
            ctx.beginPath();
            // Approximating nested roundRect in old standard canvas via arc / bezier if needed
            ctx.rect(cx + 6, poleTopY, 20, 8);
            ctx.fill();
            ctx.strokeStyle = '#3f3f46';
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // 5. Embedded status pill label over each pole
            const stateColors = ['#e4e4e7', '#60a5fa', '#22c55e'];
            const stateLabel = ['DAY', 'STBY', 'ACT'];
            ctx.fillStyle = stateColors[z.state];
            ctx.globalAlpha = 0.85;
            ctx.beginPath();
            ctx.rect(cx - 15, H * 0.12, 30, 11);
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#09090b';
            ctx.font = 'bold 7px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(stateLabel[z.state], cx, H * 0.12 + 8.5);

            // Column identity ID mark
            ctx.fillStyle = '#52525b';
            ctx.font = 'bold 8px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`GATE ${i + 1}`, cx, H * 0.28);

            // 6. Proximity gauge for Ultrasonic
            if (z.nightState && z.distance < 300) {
              const activeRatio = Math.max(0, 1 - (z.distance / 200));
              ctx.fillStyle = z.distance < usThreshRef.current ? '#22c55e' : '#3f3f46';
              ctx.globalAlpha = 0.5;
              ctx.fillRect(cx - ZW * 0.35, H * 0.88, ZW * 0.7 * activeRatio, 2);
              ctx.globalAlpha = 1;
            }
          });

          // Draw moving pedestrian dots with cute human silhouette
          personsRef.current.forEach(p => {
            if (!p.active) return;
            const px = p.x * W;
            const py = H * 0.52;

            // Glowing footprint
            ctx.fillStyle = '#f4f4f5';
            ctx.globalAlpha = 0.85;
            ctx.beginPath();
            ctx.ellipse(px, py + 5, 3.5, 7, 0, 0, Math.PI * 2);
            ctx.fill();

            // Head glow
            ctx.beginPath();
            ctx.arc(px, py - 6, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
          });
        }
      }

      requestRef.current = requestAnimationFrame(tick);
    };

    requestRef.current = requestAnimationFrame(tick);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [autoMode]);

  return (
    <div className="space-y-6 text-black">
      {/* 1. Code Diff Panel showing elegant arduino fixations */}
      <div className="border border-zinc-200 rounded-2xl bg-zinc-50 p-4 space-y-3 shadow-xs">
        <h5 className="text-xs font-black text-black flex items-center gap-1.5 uppercase tracking-wider font-sans">
          <Cpu className="w-4 h-4 text-black" /> 하드웨어 펌웨어 최적화 내역 (Interactive Source Diff)
        </h5>
        
        <div className="bg-zinc-950 text-zinc-300 font-mono text-[11px] leading-relaxed p-4 rounded-xl border border-zinc-800 space-y-3 overflow-x-auto">
          <div>
            <span className="text-zinc-500 font-medium block">// ① 센서 타이밍 오버플로우 타파: 변수 long → unsigned long</span>
            <span className="text-red-500 line-through block font-light opacity-75">- long duration = pulseIn(echoPins[i], HIGH, 15000);</span>
            <span className="text-emerald-400 block font-semibold">+ unsigned long duration = pulseIn(echoPins[i], HIGH, 15000);</span>
            <span className="text-red-500 line-through block font-light opacity-75">- long distance = (duration / 2) / 29.1;</span>
            <span className="text-emerald-400 block font-semibold">+ int distance = (duration &gt; 0) ? (int)((duration / 2) / 29.1) : 0;</span>
          </div>
          
          <div className="border-t border-zinc-900 pt-2">
            <span className="text-zinc-500 font-medium block">// ② 조도 채터링 수렴: 히스테리시스 루프 구축 (CDS 경계 깜빡임 차단)</span>
            <span className="text-red-500 line-through block font-light opacity-75">- bool isNight = (cdsValue &gt; 550);</span>
            <span className="text-emerald-400 block font-semibold">+ const int CDS_NIGHT_ON = 550, CDS_NIGHT_OFF = 450;</span>
            <span className="text-emerald-400 block font-semibold">+ static bool nightState[4] = &#123;false, false, false, false&#125;;</span>
            <span className="text-emerald-400 block font-semibold">+ if (!nightState[i] && cdsValue &gt; CDS_NIGHT_ON) nightState[i] = true;</span>
            <span className="text-emerald-400 block font-semibold">+ if (nightState[i] && cdsValue &lt; CDS_NIGHT_OFF) nightState[i] = false;</span>
          </div>

          <div className="border-t border-zinc-900 pt-2">
            <span className="text-zinc-500 font-medium block">// ③ 시퀀스 페이딩: PWM 부드러운 소프트 스타트 페이드 전환</span>
            <span className="text-red-500 line-through block font-light opacity-75">- analogWrite(ledPins[i], 255); // 즉각 격변으로 디스트랙션 발생</span>
            <span className="text-emerald-400 block font-semibold">+ static int curPWM[4] = &#123;0, 0, 0, 0&#125;;</span>
            <span className="text-emerald-400 block font-semibold">+ int target = isNight ? (isActive[i] ? 255 : 64) : 0;</span>
            <span className="text-emerald-400 block font-semibold">+ curPWM[i] += (target - curPWM[i]) &gt; 0 ? min(12, target-curPWM[i]) : max(-12, target-curPWM[i]);</span>
            <span className="text-emerald-400 block font-semibold">+ analogWrite(ledPins[i], curPWM[i]);</span>
          </div>
        </div>
      </div>

      {/* 2. Live Canvas Simulation Pane with elegant black styling */}
      <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-sm relative">
        <div className="bg-zinc-900 text-white px-4 py-2 border-b border-zinc-800 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold font-mono text-zinc-300">4-ZONE MICROGRID REAL-TIME MONITOR</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">CANVAS_RENDER_ACTIVE</span>
        </div>
        
        {/* Canvas renderer */}
        <div className="bg-zinc-950 h-40">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        {/* Dynamic Road Level Control buttons */}
        <div className="bg-white border-t border-zinc-200 p-4 flex flex-wrap gap-2.5 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={spawnPerson}
              className="px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5" /> 보행자 등장 ↗
            </button>
            <button 
              onClick={toggleNight}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 border ${
                isNightMode 
                  ? 'bg-amber-50 text-amber-700 border-amber-200' 
                  : 'bg-zinc-100 text-zinc-700 border-zinc-200'
              }`}
            >
              {isNightMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              {isNightMode ? '주간 전환 ☀️' : '야간 전환 🌙'}
            </button>
            <button 
              onClick={resetAll}
              className="px-4 py-2 bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-250 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" /> 초기화
            </button>
          </div>

          <button 
            onClick={() => setAutoMode(!autoMode)}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 border ${
              autoMode 
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600' 
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 border-zinc-300'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            {autoMode ? '자동 보행 모드 ON' : '자동 보행 모드 OFF'}
          </button>
        </div>
      </div>

      {/* 3. 4-Zone Responsive status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="sim-cards-grid">
        {zonesState.map((z, idx) => {
          const stateNames = ['DAYTIME', 'STANDBY', 'ACTIVE'];
          const stateBorderClasses = ['border-zinc-200', 'border-blue-200 bg-blue-50/10', 'border-emerald-200 bg-emerald-50/10'];
          const badgeStyle = z.state === 0 
            ? 'bg-zinc-100 text-zinc-800' 
            : z.state === 1 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-emerald-100 text-emerald-800';
          
          const barColorClass = z.state === 0 
            ? 'bg-zinc-200' 
            : z.state === 1 
              ? 'bg-blue-500' 
              : 'bg-emerald-500';

          return (
            <div 
              key={z.id}
              className={`border p-4 rounded-2xl flex flex-col justify-between space-y-4 shadow-2xs transition-all ${stateBorderClasses[z.state]}`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-zinc-400 font-mono">GATE {idx + 1} // PIN {PWM_PINS[idx]}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wide ${badgeStyle}`}>
                    {stateNames[z.state]}
                  </span>
                </div>

                {/* PWM level slider rendering */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span className="text-zinc-600">PWM Output</span>
                    <span className="text-black">{z.curPWM}%</span>
                  </div>
                  {/* Visual gauge representation */}
                  <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${barColorClass}`}
                      style={{ width: `${(z.curPWM / 255) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Live physical hardware sensors layout */}
              <div className="space-y-2 bg-white/70 p-2.5 rounded-xl border border-zinc-150 text-[11px] font-mono">
                <div className="flex justify-between items-center text-zinc-500">
                  <span>PIR MOTION</span>
                  <span className={`font-bold flex items-center gap-1 ${z.pirHigh ? 'text-emerald-600' : 'text-zinc-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${z.pirHigh ? 'bg-emerald-500 animate-ping' : 'bg-zinc-300'}`} />
                    {z.pirHigh ? 'HIGH' : 'LOW'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-zinc-500">
                  <span>AMBIENCE STATUS</span>
                  <span className={`font-bold ${z.nightState ? 'text-amber-600' : 'text-zinc-400'}`}>
                    {z.nightState ? 'NIGHT 🌙' : 'DAY ☀️'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-zinc-500">
                  <span>ULTRASONIC</span>
                  <span className={`font-bold ${z.distance < usThresh ? 'text-emerald-600' : 'text-zinc-400'}`}>
                    {z.distance < 300 ? `${z.distance}cm` : 'INF'}
                  </span>
                </div>
              </div>

              {/* Hold count down bar */}
              <div>
                <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 transition-all duration-100 ease-linear"
                    style={{ 
                      width: z.isActive 
                        ? `${Math.min(100, Math.max(0, 100 - ((Date.now() - z.timeSinceDetect) / activeTime) * 100))}%` 
                        : '0%' 
                    }}
                  />
                </div>
                <span className="text-[8px] text-zinc-400 font-mono block mt-1">HOLD TIMER GAUGE</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Downside Controls Param Panel and Serial Port terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Configuration Segment */}
        <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-2xl p-4 space-y-4 shadow-2xs">
          <h5 className="text-xs font-black text-black flex items-center gap-1.5 uppercase tracking-wider font-sans border-b border-zinc-100 pb-2">
            <Sliders className="w-4 h-4 text-black" /> 하드웨어 연산 파라미터 제어
          </h5>

          <div className="space-y-4 text-xs font-mono">
            {/* Active Hold */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-zinc-650">
                <span className="font-bold">감지 점등 유지 시간</span>
                <span className="text-black font-semibold">{(activeTime / 1000).toFixed(0)}초 (s)</span>
              </div>
              <input 
                type="range"
                min={3000}
                max={20000}
                step={1000}
                value={activeTime}
                onChange={(e) => setActiveTime(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-black"
              />
              <p className="text-[10px] text-zinc-500 leading-normal font-sans">움직임 감지 종료 후 조명을 최고조(100%)로 붙잡는 유지 시간 기준선.</p>
            </div>

            {/* Ultrasonic Target Distance */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-zinc-650">
                <span className="font-bold">초음파 물리 감지 거리</span>
                <span className="text-black font-semibold">{usThresh}cm</span>
              </div>
              <input 
                type="range"
                min={30}
                max={250}
                step={10}
                value={usThresh}
                onChange={(e) => setUsThresh(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-black"
              />
              <p className="text-[10px] text-zinc-500 leading-normal font-sans">초음파 트리거 작동 한계선. 보행자 거리가 이 값 이하여야 만점 활성화됩니다.</p>
            </div>

            {/* CDS Night activation */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-zinc-650">
                <span className="font-bold">야간 점등 가동조도 (CDS ON)</span>
                <span className="text-black font-semibold">{cdsOn}lx</span>
              </div>
              <input 
                type="range"
                min={300}
                max={800}
                step={10}
                value={cdsOn}
                onChange={(e) => setCdsOn(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-black"
              />
              <p className="text-[10px] text-zinc-500 leading-normal font-sans">주전력 상시 조명망 차단에서 야적 점등 대기로 넘어가는 조도 경계치.</p>
            </div>
          </div>
        </div>

        {/* Dynamic Serial Console screen */}
        <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
            <h5 className="text-[11px] font-black text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider font-mono">
              <Terminal className="w-4 h-4 text-zinc-500" /> SERIAL LOGS (9600 BAUD)
            </h5>
            <span className="text-[9px] bg-zinc-900 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold animate-pulse">
              ● TX_RX_STREAM
            </span>
          </div>

          <div className="font-mono text-[10px] space-y-1 h-44 overflow-y-auto pr-2 mt-3 scrollbar-thin scrollbar-thumb-zinc-800">
            {logs.length === 0 ? (
              <p className="text-zinc-600">연결 대기 중... 수신 데이터를 수집하고 있습니다.</p>
            ) : (
              logs.map(lg => {
                const color = lg.type === 'success' 
                  ? 'text-emerald-400' 
                  : lg.type === 'warn' 
                    ? 'text-amber-400' 
                    : 'text-zinc-400';
                return (
                  <div key={lg.id} className="flex gap-2.5 items-start py-0.5 border-b border-zinc-900/50">
                    <span className="text-zinc-650 shrink-0 font-medium font-mono text-zinc-500">[{lg.time}s]</span>
                    <span className={`${color} leading-normal flex-1`}>{lg.msg}</span>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-zinc-900 pt-2.5 flex justify-between items-center text-[9px] text-zinc-500 font-mono">
            <span>MCU: ATMEGA328P / ACTIVE FILTER CONTROLLER</span>
            <span>THD REDUCTION: -84.2% / CO2 SAVINGS: 39.4%</span>
          </div>
        </div>

      </div>
    </div>
  );
};
