import { useState, useEffect, useMemo } from 'react';
import airmonLogo from '../assets/airmon_logo.png';
import {
  Power, Plus, Minus, Wind, Settings, AlertTriangle,
  Thermometer, Zap, Home, Moon, Leaf, Signal,
  BarChart3, Shield, Smartphone, Activity, Gauge,
  CheckCircle2, AlertCircle, Wifi, Lightbulb,
  Snowflake, Sun, Droplets, RotateCcw, Calendar, Trash2, Bot, Sparkles, Wrench
} from 'lucide-react';

export default function App() {
  const [temperature, setTemperature] = useState(24.5);
  const [fanSpeed, setFanSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState('remote');
  const [ledEnabled, setLedEnabled] = useState(true);
  const [activeOperationMode, setActiveOperationMode] = useState(0);
  const [showRepairModal, setShowRepairModal] = useState(false);
  const [showMoldModal, setShowMoldModal] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);

  // 即時監測數據
  const [co2, setCo2] = useState(400);
  const [dustRate, setDustRate] = useState(12);
  const [rpm, setRpm] = useState(980);

  const [dashboardSubTab, setDashboardSubTab] = useState<'energy' | 'schedule'>('energy');
  const [scheduleToggles, setScheduleToggles] = useState([true, false, true]);
  const [scheduleItems, setScheduleItems] = useState([
    { day: '每週二 20:40', mode: '冷房', temp: '25.5°C', fan: 'LOW' },
    { day: '每週一 17:00', mode: '自動', temp: '26.0°C', fan: 'MID' },
    { day: '每週五 08:00', mode: '暖房', temp: '24.0°C', fan: 'HIGH' },
  ]);
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [newScheduleDays, setNewScheduleDays] = useState<string[]>([]);
  const [newScheduleTime, setNewScheduleTime] = useState('08:00');
  const [newScheduleMode, setNewScheduleMode] = useState('自動');
  const [newScheduleTemp, setNewScheduleTemp] = useState(26);
  const [newScheduleFan, setNewScheduleFan] = useState('MID');
  const [notification, setNotification] = useState<{ title: string; body: string } | null>(null);
  const [isAdjusting, setIsAdjusting] = useState(false);

  // 智慧模式狀態 (只保留強力運轉的 timer)
  const [ecoActive, setEcoActive] = useState(false);
  const [powerActive, setPowerActive] = useState(false);
  const [awayActive, setAwayActive] = useState(false);
  const [quietActive, setQuietActive] = useState(false);
  const [powerTimer, setPowerTimer] = useState(899); // 14:59 = 899 seconds

  // 自動關閉通知
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // 強力運轉倒數計時
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (powerActive && powerTimer > 0) {
      interval = setInterval(() => setPowerTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [powerActive, powerTimer]);

  // 即時監測數據更新
  useEffect(() => {
    const interval = setInterval(() => {
      setCo2(prev => Math.max(300, Math.min(500, prev + (Math.random() * 10 - 5))));
      setRpm(prev => Math.max(900, Math.min(1100, prev + Math.floor(Math.random() * 20 - 10))));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // 防護中心進入時的 10 秒數據模擬演習 (12% -> 45%)
  useEffect(() => {
    if (activeTab === 'guard') {
      const duration = 10000; // 10 seconds
      const startTime = Date.now();
      const startVal = dustRate;
      const targetVal = 45;
      if (startVal >= targetVal) return;

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setDustRate(startVal + ((targetVal - startVal) * progress));
        if (progress >= 1) clearInterval(interval);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const formatPowerTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const weekDays = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];

  const handleAddSchedule = () => {
    if (newScheduleDays.length === 0) return;
    const dayLabel = newScheduleDays.length === 7 ? '每天' : newScheduleDays.length === 1 ? `每${newScheduleDays[0]}` : `每${newScheduleDays.join('/')}`;
    setScheduleItems(prev => [...prev, { day: `${dayLabel} ${newScheduleTime}`, mode: newScheduleMode, temp: `${newScheduleTemp}°C`, fan: newScheduleFan }]);
    setScheduleToggles(prev => [...prev, true]);
    setNewScheduleDays([]);
    setNewScheduleTime('08:00');
    setNewScheduleMode('自動');
    setNewScheduleTemp(26);
    setNewScheduleFan('MID');
    setShowAddSchedule(false);
  };

  // --- Airflow Background Enhancement Logic ---
  const airflowConfig = useMemo(() => {
    const isEco = ecoActive;
    const isHeat = activeOperationMode === 2;

    const colors = isEco
      ? ['#4CAF50', '#81C784', '#E8F5E9']
      : isHeat
        ? ['#FFB74D', '#FF9800', '#FFE0B2']
        : ['#4FC3F7', '#81D4FA', '#E1F5FE'];

    const hexToRgba = (hex: string, alpha: number) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const glow = hexToRgba(colors[1], 0.15);
    const animation = isHeat ? 'heatFlow' : 'jetStrike';

    let level = fanSpeed;
    if (fanSpeed === 3) { // AUTO mode: Determine strength from temp difference
      const diff = Math.abs(26 - temperature); // Room temp is 26°C
      level = diff >= 4 ? 2 : diff >= 2 ? 1 : 0;
    }
    const fan = [
      { dur: [14, 16], op: [0.12, 0.20], cnt: 8 },  // LOW
      { dur: [9, 11], op: [0.18, 0.30], cnt: 12 },  // MEDIUM
      { dur: [4, 6], op: [0.25, 0.45], cnt: 18 },   // HIGH
    ][Math.min(level, 2)];

    return { colors, glow, animation, fan };
  }, [ecoActive, activeOperationMode, fanSpeed, temperature]);

  const streakObjects = useMemo(() => {
    const total = 20; // 根據風速調整氣流條數量，最高可達 20 條
    return Array.from({ length: total }).map((_, i) => ({
      id: i,
      // 規律垂直分佈：從 -20% 到 100%
      top: `${(i / total) * 120 - 20}%`,
      durScale: Math.random(),
      width: `${500 + Math.random() * 200}px`,
      opScale: Math.random(),
    }));
  }, []);

  // 動態主題顏色：暖房用暖黃，其餘(自動、冷房、除濕、送風)用藍色
  const themeColor = activeOperationMode === 2 ? '#E1B36C' : '#0A78F5';

  const operationModes = [
    { icon: <RotateCcw className="w-5 h-5" />, label: '自動', fanDefault: 3, tempDefault: 26, ticks: ['弱', '中', '強', '自動'], getLabel: (v: number) => ['弱', '中', '強', 'AI'][v] },
    { icon: <Snowflake className="w-5 h-5" />, label: '冷房', fanDefault: 0, tempDefault: 24, ticks: ['弱', '中', '強'], getLabel: (v: number) => ['弱', '中', '強'][v] },
    { icon: <Sun className="w-5 h-5" />, label: '暖房', fanDefault: 0, tempDefault: 30, ticks: ['弱', '中', '強'], getLabel: (v: number) => ['弱', '中', '強'][v] },
    { icon: <Droplets className="w-5 h-5" />, label: '除濕', fanDefault: 0, tempDefault: 27, ticks: ['弱', '中'], getLabel: (v: number) => ['弱', '中'][v] },
    { icon: <Wind className="w-5 h-5" />, label: '送風', fanDefault: 1, tempDefault: 26, ticks: ['弱', '中', '強', '自動'], getLabel: (v: number) => ['弱', '中', '強', 'AI'][v] },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'remote':
        return renderRemoteTab();
      case 'guard':
        return renderGuardTab();
      case 'dashboard':
        return renderDashboardTab();
      default:
        return null;
    }
  };

  const renderRemoteTab = () => (
    <>
      {/* Central Temperature Control */}
      <div className="mb-6">
        <div className="relative bg-[#121930]/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_0_40px_rgba(10,120,245,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5" style={{ color: themeColor }} />
              <span className="text-[#A1A1AA] font-bold" style={{ fontSize: '14px' }}>室內溫度</span>
            </div>
            <div className="text-[#FFFFFF] font-bold" style={{ fontSize: '28px', textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>26<span className="text-[#A1A1AA] text-lg ml-1">°C</span></div>
          </div>

          {/* Temperature Wheel */}
          <div className="relative flex items-center justify-center py-8">
            {/* Glow */}
            <div className="absolute inset-0 blur-[60px] rounded-full" style={{ backgroundColor: `${themeColor}26` }}></div>

            <button
              onClick={() => {
                const next = Math.max(16, temperature - 0.5);
                if (next !== temperature) {
                  setTemperature(next);
                  setIsAdjusting(true);
                  setTimeout(() => setIsAdjusting(false), 300);
                }
              }}
              className="relative z-10 w-14 h-14 bg-white/5 border border-white/20 rounded-full flex items-center justify-center transition-all active:scale-90 hover:border-[#E1B36C]/50"
              style={{ borderColor: isAdjusting ? `${themeColor}80` : '' }}
            >
              <Minus className="w-6 h-6 text-white" strokeWidth={2} />
            </button>

            <div className="mx-6 relative">
              <div
                className="w-44 h-44 rounded-full border flex items-center justify-center transition-all duration-300 ease-out bg-radial from-[#121930] to-transparent"
                style={{
                  borderColor: isAdjusting ? `${themeColor}99` : `${themeColor}4d`,
                  transform: isAdjusting ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isAdjusting ? `0 0 50px ${themeColor}66, inset 0 0 40px ${themeColor}40` : `0 0 40px ${themeColor}40, inset 0 0 30px ${themeColor}26`
                }}
              >
                <div className="absolute inset-0 rounded-full border-[3px] border-r-transparent border-b-transparent border-l-transparent animate-spin-slow" style={{ borderTopColor: themeColor, filter: `drop-shadow(0 0 12px ${themeColor}e6)` }}></div>
                <div className="text-center">
                  <div className="text-[#A1A1AA] font-bold mb-1" style={{ fontSize: '12px', letterSpacing: '0.1em' }}>設定溫度</div>
                  <div className="text-[#FFFFFF] font-bold" style={{ fontSize: '64px', lineHeight: '1', textShadow: '0 0 30px rgba(255,255,255,0.4)' }}>{temperature}</div>
                  <div className="font-bold mt-1" style={{ fontSize: '18px', color: themeColor }}>°C</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const next = Math.min(30, temperature + 0.5);
                if (next !== temperature) {
                  setTemperature(next);
                  setIsAdjusting(true);
                  setTimeout(() => setIsAdjusting(false), 300);
                }
              }}
              className="relative z-10 w-14 h-14 bg-white/5 border border-white/20 rounded-full flex items-center justify-center transition-all active:scale-90 hover:border-[#E1B36C]/50"
              style={{ borderColor: isAdjusting ? `${themeColor}80` : '' }}
            >
              <Plus className="w-6 h-6 text-white" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Status */}
      <div className="mb-6">
        <div className="bg-[#121930]/10 backdrop-blur-xl border-l-4 border-l-[#0A78F5] border-y border-r border-white/10 rounded-2xl px-5 py-4 flex items-center justify-between shadow-lg">
          <div className="flex-1 flex items-center justify-center gap-2">
            <div className="text-[#0A78F5] drop-shadow-[0_0_8px_rgba(10,120,245,0.8)]">{operationModes[activeOperationMode].icon}</div>
            <span className="text-[#FFFFFF] font-bold" style={{ fontSize: '14px' }}>{operationModes[activeOperationMode].label} 模式</span>
          </div>
          <div className="h-6 w-px bg-white/10"></div>
          <div className="flex-1 flex items-center justify-center gap-2">
            <Wind className="w-5 h-5 text-[#E1B36C]" />
            <span className="text-[#FFFFFF] font-bold" style={{ fontSize: '14px' }}>風力 {operationModes[activeOperationMode].getLabel(fanSpeed)}</span>
          </div>
        </div>
      </div>

      {/* Smart Mode 2x2 Grid */}
      <div className="mb-6">
        <h3 className="text-white/80 font-bold mb-3 px-1" style={{ fontSize: '16px' }}>智慧模式</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Eco Mode */}
          <button
            onClick={() => { setEcoActive(!ecoActive); if (!ecoActive) setPowerActive(false); }}
            className={`h-32 backdrop-blur-xl border rounded-2xl p-5 transition-all active:scale-95 border-t-2 flex flex-col items-center justify-center ${ecoActive
              ? 'bg-[#10B981]/10 border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.3)]'
              : 'bg-[#121930]/10 border-white/10'
              }`}
          >
            <Leaf className={`w-10 h-10 mb-2 ${ecoActive ? 'text-[#10B981] drop-shadow-[0_0_12px_rgba(16,185,129,0.55)]' : 'text-[#10B981]'}`} />
            <div className="text-white font-bold text-center" style={{ fontSize: '15px' }}>節能運轉</div>
          </button>

          {/* Power Mode */}
          <button
            onClick={() => { setPowerActive(!powerActive); setPowerTimer(899); if (!powerActive) setEcoActive(false); }}
            className={`h-32 backdrop-blur-xl border rounded-2xl p-5 transition-all active:scale-95 border-t-2 flex flex-col items-center justify-center ${powerActive
              ? 'bg-[#E1B36C]/10 border-[#E1B36C] shadow-[0_0_20px_rgba(225,179,108,0.3)]'
              : 'bg-[#121930]/10 border-white/10'
              }`}
          >
            <div className="relative w-10 h-10 mb-2">
              <Zap className={`w-10 h-10 ${powerActive ? 'text-[#E1B36C] drop-shadow-[0_0_12px_rgba(225,179,108,0.55)]' : 'text-[#E1B36C]'}`} />
            </div>
            <div className="text-white font-bold text-center" style={{ fontSize: '15px' }}>強力運轉</div>
            {powerActive && (
              <div className="mt-1 text-[#E1B36C] font-mono font-bold text-sm">{formatPowerTime(powerTimer)}</div>
            )}
          </button>

          {/* Away Mode */}
          <button
            onClick={() => setAwayActive(!awayActive)}
            className={`h-32 backdrop-blur-xl border rounded-2xl p-5 transition-all active:scale-95 border-t-2 flex flex-col items-center justify-center ${awayActive
              ? 'bg-[#0A78F5]/10 border-[#0A78F5] shadow-[0_0_20px_rgba(10,120,245,0.3)]'
              : 'bg-[#121930]/10 border-white/10'
              }`}
          >
            <Home className={`w-10 h-10 mb-2 transition-all ${awayActive ? 'text-[#0A78F5] drop-shadow-[0_0_12px_rgba(10,120,245,0.55)]' : 'text-[#0A78F5]'}`} />
            <div className="text-white font-bold text-center" style={{ fontSize: '15px' }}>外出模式</div>
          </button>

          {/* Outdoor Quiet */}
          <button
            onClick={() => setQuietActive(!quietActive)}
            className={`h-32 backdrop-blur-xl border rounded-2xl p-5 transition-all active:scale-95 border-t-2 flex flex-col items-center justify-center ${quietActive
              ? 'bg-[#A855F7]/10 border-[#A855F7] shadow-[0_0_20px_rgba(168,85,247,0.3)]'
              : 'bg-[#121930]/10 border-white/10'
              }`}
          >
            <Moon className={`w-10 h-10 mb-2 ${quietActive ? 'text-[#A855F7] drop-shadow-[0_0_12px_rgba(168,85,247,0.55)]' : 'text-[#A855F7]'}`} />
            <div className="text-white font-bold text-center" style={{ fontSize: '15px' }}>室外靜音</div>
          </button>
        </div>
      </div>

      {/* Operation Drawer */}
      <div className="mb-6">
        <div className="bg-[#121930]/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
          <h3 className="text-[#A1A1AA] font-bold mb-4" style={{ fontSize: '14px', letterSpacing: '0.1em' }}>操作模式</h3>

          {/* Mode Tabs */}
          <div className="space-y-2 mb-6">
            <div className="grid grid-cols-2 gap-2">
              {[0, 1].map((idx) => (
                <button
                  key={idx}
                  onClick={() => { setActiveOperationMode(idx); setFanSpeed(operationModes[idx].fanDefault); setTemperature(operationModes[idx].tempDefault); }}
                  className={`px-4 py-4 rounded-2xl font-bold transition-all active:scale-95 text-center flex items-center justify-center ${activeOperationMode === idx
                    ? 'bg-[#0A78F5] text-white shadow-[0_0_15px_rgba(10,120,245,0.5)]'
                    : 'bg-white/10 text-white/70 hover:bg-white/15'
                    }`}
                  style={{ fontSize: '14px' }}
                >
                  <span className="inline-block mr-1.5">{operationModes[idx].icon}</span>
                  {operationModes[idx].label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[2, 3, 4].map((idx) => (
                <button
                  key={idx}
                  onClick={() => { setActiveOperationMode(idx); setFanSpeed(operationModes[idx].fanDefault); setTemperature(operationModes[idx].tempDefault); }}
                  className={`px-4 py-4 rounded-2xl font-bold transition-all active:scale-95 text-center flex items-center justify-center ${activeOperationMode === idx
                    ? 'bg-[#0A78F5] text-white shadow-[0_0_15px_rgba(10,120,245,0.5)]'
                    : 'bg-white/10 text-white/70 hover:bg-white/15'
                    }`}
                  style={{ fontSize: '14px' }}
                >
                  <span className="inline-block mr-1.5">{operationModes[idx].icon}</span>
                  {operationModes[idx].label}
                </button>
              ))}
            </div>
          </div>

          {/* Fan Speed Slider */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[#A1A1AA] font-bold" style={{ fontSize: '14px' }}>風速</span>
              <span className="text-[#0A78F5] font-bold" style={{ fontSize: '16px', filter: 'drop-shadow(0 0 5px #0A78F5)' }}>
                {operationModes[activeOperationMode].getLabel(fanSpeed)}
              </span>
            </div>
            <div className="relative">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#0A78F5] to-[#E1B36C] rounded-full transition-all shadow-[0_0_10px_#0A78F5]"
                  style={{ width: `${15 + (fanSpeed / (operationModes[activeOperationMode].ticks.length - 1)) * 85}%` }}
                ></div>
              </div>
              <input
                type="range"
                min="0"
                max={operationModes[activeOperationMode].ticks.length - 1}
                step="1"
                value={fanSpeed}
                onChange={(e) => setFanSpeed(Number(e.target.value))}
                className="absolute top-0 left-0 w-full h-3 opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex justify-between mt-2 px-1">
              {operationModes[activeOperationMode].ticks.map((tick) => (
                <span key={tick} className="text-white/30" style={{ fontSize: '10px' }}>{tick}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderGuardTab = () => {
    const currentHealthScore = Math.floor(92 - (dustRate - 12) * 0.5);
    const dashOffset = 251.2 * (1 - currentHealthScore / 100);
    const currentWarranty = Math.max(0, Math.floor(18 - (92 - currentHealthScore) * 0.6));

    return (
      <>
        {/* Health Gauge */}
        <style>{`
        @keyframes barGrow {
          from { height: 0; opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(225, 179, 108, 0.4)); }
          50% { filter: drop-shadow(0 0 15px rgba(225, 179, 108, 0.8)); }
        }
      `}</style>
        <div className="mb-6">
          <div className="relative bg-[#121930]/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-visible">
            <div className="pointer-events-none absolute -top-14 -left-8 w-40 h-40 bg-[#0A78F5]/10 blur-[80px] rounded-full"></div>

            <div className="relative text-center">
              <h3 className="text-[#A1A1AA] font-bold mb-3" style={{ fontSize: '14px', letterSpacing: '0.2em' }}>健康分數</h3>

              {/* Semi-circular gauge */}
              <div className="w-64 h-48 mx-auto mb-8">
                <svg viewBox="0 0 200 100" className="w-full h-full">
                  <path
                    d="M 20 90 A 80 80 0 0 1 180 90"
                    fill="none"
                    stroke="rgba(255,255,255,0.03)"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 20 90 A 80 80 0 0 1 180 90"
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray="251.2"
                    style={{
                      strokeDashoffset: dashOffset,
                      transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      filter: 'drop-shadow(0 0 8px rgba(225, 179, 108, 0.6))'
                    }}
                  />
                  <defs>
                    <linearGradient id="gaugeGradient" x1="100%" y1="0%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#E1B36C" />
                      <stop offset="50%" stopColor="#FFF5E6" />
                      <stop offset="100%" stopColor="#E1B36C" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center translate-y-3 transition-all duration-1000 delay-500">
                  <div className="text-[#FFFFFF] font-bold animate-[pulse_2s_infinite]" style={{ fontSize: '72px', lineHeight: '1', textShadow: '0 0 40px rgba(225,179,108,0.5)' }}>{currentHealthScore}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[#A1A1AA] font-medium" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>動態保固狀態</div>
                <div className="text-[#E1B36C] font-bold flex items-center justify-center gap-2" style={{ fontSize: '16px', filter: 'drop-shadow(0 0 10px #E1B36C)' }}>
                  <Shield className="w-4 h-4" /> 已延長保固+{currentWarranty}個月
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Threat Card */}
        {dustRate > 40 && (
          <div className="mb-6">
            <div className="bg-[#121930]/10 backdrop-blur-xl border-t-2 border-t-[#F87171] border-x border-b border-white/10 rounded-3xl p-5 shadow-[0_0_20px_rgba(248,113,113,0.15)]">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-[#F87171] flex-shrink-0 mt-1 drop-shadow-[0_0_8px_#F87171]" />
                <div className="flex-1">
                  <h3 className="text-white font-bold mb-1" style={{ fontSize: '16px' }}>環境威脅偵測</h3>
                  <p className="text-red-400 mb-3" style={{ fontSize: '13px' }}>濾網積塵率過高，請清潔檢查。</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Guard Action Buttons */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setShowMoldModal(true)} className="bg-[#121930]/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5 transition-all active:scale-95 border-t-2 border-t-[#0A78F5]/50">
              <div className="flex flex-col items-center gap-3">
                <Sparkles className="w-10 h-10 text-[#0A78F5] drop-shadow-[0_0_8px_rgba(10,120,245,0.4)]" />
                <div className="text-white font-bold text-center" style={{ fontSize: '15px' }}>抑菌防霉</div>
                <div className="text-[#A1A1AA] text-center" style={{ fontSize: '11px' }}>啟動深度保養</div>
              </div>
            </button>

            <button
              onClick={() => setShowRepairModal(true)}
              className="bg-[#121930]/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5 transition-all active:scale-95 border-t-2 border-t-[#F87171]/50"
            >
              <div className="flex flex-col items-center gap-3">
                <Wrench className="w-10 h-10 text-[#F87171] drop-shadow-[0_0_8px_rgba(248,113,113,0.4)]" />
                <div className="text-white font-bold text-center" style={{ fontSize: '15px' }}>預警報修</div>
                <div className="text-red-400 text-center" style={{ fontSize: '12px' }}>申請維修</div>
              </div>
            </button>
          </div>
        </div>

        {/* Sensor Grid */}
        <div className="mb-6">
          <h3 className="text-[#A1A1AA] font-bold mb-3 px-1" style={{ fontSize: '14px', letterSpacing: '0.1em' }}>即時監測</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Air Quality */}
            <div className="bg-[#121930]/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="w-4 h-4 text-[#0A78F5]" />
                <span className="text-[#A1A1AA]" style={{ fontSize: '12px' }}>空氣品質 CO2</span>
              </div>
              <div className="text-[#FFFFFF] font-bold mb-1" style={{ fontSize: '26px' }}>{co2.toFixed(0)}<span className="text-xs ml-1 font-normal opacity-50">ppm</span></div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#0A78F5] animate-pulse"></div>
                <span className="text-[#0A78F5]" style={{ fontSize: '11px' }}>極佳</span>
              </div>
            </div>

            {/* Motor Speed */}
            <div className="bg-[#121930]/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-4 h-4 text-[#E1B36C]" />
                <span className="text-[#A1A1AA]" style={{ fontSize: '12px' }}>馬達轉速 RPM</span>
              </div>
              <div className="text-[#FFFFFF] font-bold mb-1" style={{ fontSize: '26px' }}>{rpm}</div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#E1B36C] animate-pulse"></div>
                <span className="text-[#E1B36C]" style={{ fontSize: '11px' }}>正常</span>
              </div>
            </div>

            {/* Filter Status */}
            <div className="bg-[#121930]/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-[#E1B36C]" />
                <span className="text-[#A1A1AA]" style={{ fontSize: '12px' }}>濾網積塵率</span>
              </div>
              <div className="text-[#FFFFFF] font-bold mb-1" style={{ fontSize: '26px' }}>{dustRate.toFixed(0)}<span className="text-sm ml-1">%</span></div>
              <div className={dustRate > 40 ? "text-red-400" : "text-[#E1B36C]"} style={{ fontSize: '11px' }}>{dustRate > 40 ? '偏高' : '健康'}</div>
            </div>

            {/* Refrigerant Monitor */}
            <div className="bg-[#121930]/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-[#0A78F5]" />
                <span className="text-[#A1A1AA]" style={{ fontSize: '12px' }}>冷媒狀態</span>
              </div>
              <div className="text-[#0A78F5] font-bold mb-1" style={{ fontSize: '20px' }}>安全</div>
              <div className="text-white/30" style={{ fontSize: '10px' }}>無異常</div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderDashboardTab = () => (
    <>
      {/* Sub-tab Switcher */}
      <div className="mb-6">
        <div className="bg-[#121930]/10 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 flex gap-1 shadow-inner">
          <button
            onClick={() => setDashboardSubTab('energy')}
            className={`flex-1 py-2.5 rounded-xl font-bold transition-all text-center flex items-center justify-center gap-2 ${dashboardSubTab === 'energy' ? 'bg-[#0A78F5] text-white shadow-[0_0_15px_rgba(10,120,245,0.4)]' : 'text-[#A1A1AA] hover:text-white/70'}`}
            style={{ fontSize: '14px' }}
          >
            <Zap className="w-4 h-4" /> 能源數據
          </button>
          <button
            onClick={() => setDashboardSubTab('schedule')}
            className={`flex-1 py-2.5 rounded-xl font-bold transition-all text-center flex items-center justify-center gap-2 ${dashboardSubTab === 'schedule' ? 'bg-[#0A78F5] text-white shadow-[0_0_15px_rgba(10,120,245,0.4)]' : 'text-[#A1A1AA] hover:text-white/70'}`}
            style={{ fontSize: '14px' }}
          >
            <Calendar className="w-4 h-4" /> 排程控制
          </button>
        </div>
      </div>

      {dashboardSubTab === 'energy' && <>
        {/* Device Management */}
        <div className="mb-6">
          <div className="bg-[#121930]/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl">
            <h3 className="text-[#A1A1AA] font-bold mb-4" style={{ fontSize: '14px', letterSpacing: '0.1em' }}>設備管理</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-[#0A78F5]" />
                  <span className="text-[#A1A1AA]" style={{ fontSize: '14px' }}>MAC Address</span>
                </div>
                <span className="text-[#FFFFFF] font-bold font-mono" style={{ fontSize: '13px' }}>3C:33:32:C0:0F:5C</span>
              </div>

              <div className="h-px bg-white/10"></div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-[#E1B36C]" />
                  <span className="text-[#A1A1AA]" style={{ fontSize: '14px' }}>主面板指示燈</span>
                </div>
                <button
                  onClick={() => setLedEnabled(!ledEnabled)}
                  className={`w-12 h-6 rounded-full transition-all ${ledEnabled ? 'bg-[#0A78F5]' : 'bg-white/10'}`}
                >
                  <div className={`w-5 h-5 mt-0.5 rounded-full bg-white transition-all shadow-lg ${ledEnabled ? 'ml-6' : 'ml-0.5'}`}></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Energy Analytics */}
        <div className="mb-6">
          <div className="relative bg-[#121930]/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E1B36C]/5 blur-[60px] rounded-full"></div>

            <div className="relative">
              <h3 className="text-[#A1A1AA] font-bold mb-4" style={{ fontSize: '14px', letterSpacing: '0.1em' }}>電量分析</h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-[#A1A1AA] mb-1" style={{ fontSize: '12px' }}>月累計用電量</div>
                  <div className="text-[#FFFFFF] font-bold" style={{ fontSize: '28px', textShadow: '0 0 15px rgba(255,255,255,0.2)' }}>142.6</div>
                  <div className="text-[#0A78F5] font-bold" style={{ fontSize: '11px' }}>KWH</div>
                </div>
                <div>
                  <div className="text-[#A1A1AA] mb-1" style={{ fontSize: '12px' }}>預估本月電費</div>
                  <div className="text-[#E1B36C] font-bold" style={{ fontSize: '28px', textShadow: '0 0 15px rgba(225,179,108,0.3)' }}>513</div>
                  <div className="text-[#E1B36C] font-bold" style={{ fontSize: '11px' }}>NTD</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="mb-6">
          <div className="bg-[#121930]/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-2xl">
            <h3 className="text-[#A1A1AA] font-bold mb-4" style={{ fontSize: '14px' }}>每週使用量</h3>

            <div className="h-40 flex items-end justify-between gap-2">
              {[
                { day: '週一', value: 65 },
                { day: '週二', value: 48 },
                { day: '週三', value: 72 },
                { day: '週四', value: 55 },
                { day: '週五', value: 80 },
                { day: '週六', value: 45 },
                { day: '週日', value: 38 }
              ].map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative group">
                    <div
                      className="w-full bg-gradient-to-t from-[#0A78F5] to-transparent rounded-t-sm transition-all group-hover:from-[#E1B36C] group-hover:shadow-[0_0_15px_#E1B36C] animate-[barGrow_0.8s_ease-out_both]"
                      style={{ height: `${data.value * 1.2}px`, animationDelay: `${idx * 100}ms` }}
                    ></div>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white text-black px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap">
                        {data.value}
                      </div>
                    </div>
                  </div>
                  <span className="text-white/50" style={{ fontSize: '11px' }}>{data.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Copilot */}
        <div className="mb-6">
          <div className="bg-[#121930]/10 backdrop-blur-xl border-t-2 border-t-[#E1B36C] border-white/10 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-[#E1B36C]/10 border border-[#E1B36C]/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-6 h-6 text-[#E1B36C] drop-shadow-[0_0_5px_#E1B36C]" />
              </div>
              <div className="flex-1">
                <div className="text-[#A1A1AA] font-bold mb-1" style={{ fontSize: '12px' }}>AI MONITORING</div>
                <p className="text-white/90 mb-4" style={{ fontSize: '14px' }}>
                  目前偵測到冷媒效率下降 8%。是否安排預防保養？
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setNotification({ title: 'AI 智慧防護', body: '抑菌防霉保養申請已送出' })}
                    className="flex-1 bg-[#E1B36C] text-black rounded-xl py-3 font-bold transition-all shadow-[0_0_15px_rgba(225,179,108,0.4)] active:scale-95 text-xs">
                    立即安排
                  </button>
                  <button
                    onClick={() => setNotification({ title: 'AI 智慧防護', body: '保養提醒已延後至一週後' })}
                    className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl py-3 font-bold transition-all active:scale-95 text-xs">
                    稍後再說
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>}

      {dashboardSubTab === 'schedule' && <>
        {/* Schedule Summary */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#121930]/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center shadow-xl">
              <div className="text-[#A1A1AA] mb-1" style={{ fontSize: '11px' }}>一般定時</div>
              <div className="font-bold" style={{ fontSize: '22px' }}>
                <span className="text-[#0A78F5]">2</span>
                <span className="text-white/40" style={{ fontSize: '13px' }}> / 8 組</span>
              </div>
            </div>
            <div className="bg-[#121930]/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center shadow-xl">
              <div className="text-[#A1A1AA] mb-1" style={{ fontSize: '11px' }}>週期排程</div>
              <div className="font-bold" style={{ fontSize: '22px' }}>
                <span className="text-[#E1B36C]">14</span>
                <span className="text-white/40" style={{ fontSize: '13px' }}> / 42 組</span>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule List */}
        <div className="mb-6 space-y-3">
          {scheduleItems.map((item, idx) => (
            <div key={idx} className="bg-[#121930]/10 backdrop-blur-xl border-l-2 border-l-[#E1B36C] border-white/5 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#E1B36C]/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-[#E1B36C]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold" style={{ fontSize: '15px' }}>{item.day}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-[#0A78F5]/20 text-[#0A78F5] rounded text-[10px] font-bold">{item.mode}</span>
                    <span className="text-[#A1A1AA]" style={{ fontSize: '12px' }}>{item.temp}</span>
                    <span className="text-white/20" style={{ fontSize: '12px' }}>• {item.fan}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => setScheduleToggles(prev => prev.map((v, i) => i === idx ? !v : v))}
                  className={`w-11 h-6 rounded-full transition-all ${scheduleToggles[idx] ? 'bg-[#E1B36C]' : 'bg-white/10'}`}
                >
                  <div className={`w-5 h-5 mt-0.5 rounded-full bg-white transition-all shadow ${scheduleToggles[idx] ? 'ml-[22px]' : 'ml-0.5'}`}></div>
                </button>
                <button
                  onClick={() => setScheduleItems(prev => prev.filter((_, i) => i !== idx))}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {scheduleItems.length === 0 && (
            <div className="text-center text-white/30 py-10" style={{ fontSize: '14px' }}>尚無排程</div>
          )}
        </div>

        {/* Add Schedule Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddSchedule(true)}
            className="w-full bg-[#121930]/10 hover:bg-[#121930]/20 border border-dashed border-white/20 rounded-2xl py-4 text-[#A1A1AA] font-bold transition-all active:scale-95"
            style={{ fontSize: '15px' }}
          >
            ＋ 新增排程
          </button>
        </div>
      </>}
    </>
  );

  return (
    <div className="size-full flex items-center justify-center bg-black">
      {/* Phone Mockup Frame - Space Gray */}
      <div className="relative">
        {/* Phone Outer Frame */}
        <div className="relative w-[454px] h-[956px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-[60px] p-3 shadow-2xl">
          {/* Screen Bezel */}
          <div
            className="relative w-full h-full rounded-[48px] overflow-hidden flex flex-col border-4 border-gray-900"
            style={{
              background: 'linear-gradient(135deg, #030010 0%, #011f2e 100%)'
            }}
          >
            <style>{`
              @keyframes jetStrike {
                0% { transform: rotate(30deg) translateX(-150%); opacity: 0; }
                20% { opacity: var(--base-opacity); }
                80% { opacity: var(--base-opacity); }
                100% { transform: rotate(30deg) translateX(450%); opacity: 0; }
              }
              @keyframes heatFlow {
                0% { transform: rotate(30deg) translateX(-150%); opacity: 0; }
                20% { opacity: var(--base-opacity); }
                80% { opacity: var(--base-opacity); }
                100% { transform: rotate(30deg) translateX(450%); opacity: 0; }
              }
              .streak {
                position: absolute;
                height: 8px;
                background: linear-gradient(90deg, transparent 0%, var(--wind-color-1) 15%, transparent 100%);
                border-radius: 50%;
                filter: blur(5px);
                transform-origin: left center;
                pointer-events: none;
              }
            `}</style>

            {/* Layer 0: Ambient Glow Layer */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-1000"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${airflowConfig.glow}, transparent 70%)`,
                filter: 'blur(100px)',
                zIndex: 0
              }}
            />

            {/* Layer 1: Airflow Layer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
              {streakObjects.slice(0, airflowConfig.fan.cnt).map((s) => (
                <div
                  key={s.id}
                  className="streak"
                  style={{
                    top: s.top,
                    left: '-20%', // 確保從視窗外左側起始
                    width: s.width,
                    '--base-opacity': airflowConfig.fan.op[0] + s.opScale * (airflowConfig.fan.op[1] - airflowConfig.fan.op[0]),
                    animationName: airflowConfig.animation,
                    animationDuration: `${airflowConfig.fan.dur[0] + s.durScale * (airflowConfig.fan.dur[1] - airflowConfig.fan.dur[0])}s`,
                    animationDelay: `-${s.id * 1.8 + s.durScale * 2}s`, // 規律錯開時間偏移
                    animationIterationCount: 'infinite',
                    animationTimingFunction: 'linear',
                    opacity: 0, // 初始透明，由 Keyframes 控制淡入
                    '--wind-color-1': airflowConfig.colors[1],
                  } as any}
                />
              ))}
            </div>

            {/* In-App Notification Overlay */}
            {notification && (
              <div className="absolute top-14 left-4 right-4 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="bg-[#1C1C1E]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E1B36C]/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-[#E1B36C]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold text-sm">{notification.title}</div>
                    <div className="text-white/60 text-xs mt-0.5 leading-tight">{notification.body}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Repair Modal - Moved inside phone frame */}
            {showRepairModal && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowRepairModal(false)}>
                <div
                  className="bg-[#121930]/80 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 mx-6 shadow-[0_0_50px_rgba(248,113,113,0.3)] w-full max-w-[320px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <div className="text-white font-bold" style={{ fontSize: '16px' }}>預警報修申請</div>
                      <div className="text-white/50" style={{ fontSize: '12px' }}>AI 偵測異常，建議儘早維修</div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
                    <div className="text-white/70 mb-2" style={{ fontSize: '13px' }}>偵測到的問題</div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                      <span className="text-white" style={{ fontSize: '14px' }}>冷媒效率下降 8%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <span className="text-white" style={{ fontSize: '14px' }}>E1 故障預警訊號</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowRepairModal(false);
                        setIsRepairing(true);
                        setNotification({ title: '報修申請成功', body: '工單編號：MR-2026-0602，預計 2 個工作天內回覆。' });
                      }}
                      className="flex-1 bg-red-500/80 hover:bg-red-500 text-white rounded-2xl py-3 font-bold transition-all active:scale-95 text-xs"
                    >
                      確認送出
                    </button>
                    <button
                      onClick={() => setShowRepairModal(false)}
                      className="flex-1 bg-white/10 hover:bg-white/15 text-white rounded-2xl py-3 font-bold transition-all active:scale-95 text-xs"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mold Prevention Modal - Moved inside phone frame */}
            {showMoldModal && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowMoldModal(false)}>
                <div
                  className="bg-[#121930]/80 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 mx-6 shadow-[0_0_50px_rgba(10,120,245,0.3)] w-full max-w-[320px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#0A78F5]/10 border border-[#0A78F5]/30 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-[#0A78F5]" />
                    </div>
                    <div>
                      <div className="text-white font-bold" style={{ fontSize: '16px' }}>防霉保養啟動</div>
                      <div className="text-white/50" style={{ fontSize: '12px' }}>建議立即執行</div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-[#0A78F5]"></div>
                      <span className="text-white" style={{ fontSize: '14px' }}>高溫乾燥 (30 分鐘)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#0A78F5]"></div>
                      <span className="text-white" style={{ fontSize: '14px' }}>抑菌風道清潔</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowMoldModal(false);
                        setNotification({ title: '保養啟動', body: '防霉保養已啟動，預計執行時間：30 分鐘。' });
                      }}
                      className="flex-1 bg-[#0A78F5]/80 hover:bg-[#0A78F5] text-white rounded-2xl py-3 font-bold transition-all active:scale-95 text-xs"
                    >
                      立即啟動
                    </button>
                    <button
                      onClick={() => setShowMoldModal(false)}
                      className="flex-1 bg-white/10 hover:bg-white/15 text-white rounded-2xl py-3 font-bold transition-all active:scale-95 text-xs"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Add Schedule Modal - Moved inside phone frame */}
            {showAddSchedule && (
              <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddSchedule(false)}>
                <div
                  className="w-full bg-[#121930]/80 backdrop-blur-2xl border-t border-white/20 rounded-t-3xl p-6 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5"></div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="text-white font-bold flex items-center gap-2 text-base"><Calendar className="w-5 h-5" /> 新增排程</div>
                    <button onClick={() => setShowAddSchedule(false)} className="text-white/40 hover:text-white/70 transition-colors text-xl">×</button>
                  </div>
                  {/* Day selector */}
                  <div className="mb-5">
                    <div className="text-white/60 mb-2" style={{ fontSize: '13px' }}>重複日</div>
                    <div className="flex gap-2">
                      {weekDays.map(d => (
                        <button
                          key={d}
                          onClick={() => setNewScheduleDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])}
                          className={`flex-1 py-2 rounded-xl font-bold transition-all ${newScheduleDays.includes(d) ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-white/50'}`}
                          style={{ fontSize: '11px' }}
                        >
                          {d.replace('週', '')}
                        </button>
                      ))}
                    </div>
                    {newScheduleDays.length === 0 && <div className="text-red-400 mt-1" style={{ fontSize: '11px' }}>請選擇至少一天</div>}
                  </div>

                  {/* Time */}
                  <div className="mb-5">
                    <div className="text-white/60 mb-2" style={{ fontSize: '13px' }}>時間</div>
                    <input
                      type="time"
                      value={newScheduleTime}
                      onChange={(e) => setNewScheduleTime(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white font-bold"
                      style={{ fontSize: '16px', colorScheme: 'dark' }}
                    />
                  </div>

                  {/* Mode */}
                  <div className="mb-5">
                    <div className="text-white/60 mb-2" style={{ fontSize: '13px' }}>運轉模式</div>
                    <div className="flex gap-2 flex-wrap">
                      {['自動', '冷房', '暖房', '除濕', '送風'].map(m => (
                        <button
                          key={m}
                          onClick={() => setNewScheduleMode(m)}
                          className={`px-4 py-2 rounded-xl font-bold transition-all ${newScheduleMode === m ? 'bg-[#D4AF37]/80 text-white' : 'bg-white/10 text-white/50'}`}
                          style={{ fontSize: '13px' }}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Temp */}
                  <div className="mb-5">
                    <div className="text-white/60 mb-2" style={{ fontSize: '13px' }}>設定溫度</div>
                    <div className="flex items-center justify-between gap-4">
                      <button
                        onClick={() => setNewScheduleTemp(prev => Math.max(16, prev - 0.5))}
                        className="w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/30 rounded-full flex items-center justify-center transition-all active:scale-95"
                      >
                        <Minus className="w-5 h-5 text-white" strokeWidth={3} />
                      </button>
                      <div className="text-white font-bold text-center" style={{ fontSize: '36px' }}>
                        {newScheduleTemp}<span className="text-[#D4AF37]" style={{ fontSize: '20px' }}>°C</span>
                      </div>
                      <button
                        onClick={() => setNewScheduleTemp(prev => Math.min(30, prev + 0.5))}
                        className="w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/30 rounded-full flex items-center justify-center transition-all active:scale-95"
                      >
                        <Plus className="w-5 h-5 text-white" strokeWidth={3} />
                      </button>
                    </div>
                  </div>

                  {/* Fan */}
                  <div className="mb-6">
                    <div className="text-white/60 mb-2" style={{ fontSize: '13px' }}>風量</div>
                    <div className="flex gap-2">
                      {['LOW', 'MID', 'HIGH', 'AUTO'].map(f => (
                        <button
                          key={f}
                          onClick={() => setNewScheduleFan(f)}
                          className={`flex-1 py-2 rounded-xl font-bold transition-all ${newScheduleFan === f ? 'bg-[#D4AF37]/80 text-white' : 'bg-white/10 text-white/50'}`}
                          style={{ fontSize: '12px' }}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Confirmation Button */}
                  <button
                    onClick={handleAddSchedule}
                    disabled={newScheduleDays.length === 0}
                    className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 ${newScheduleDays.length > 0 ? 'bg-[#D4AF37]/80 text-white shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'bg-white/10 text-white/20 cursor-not-allowed'}`}
                    style={{ fontSize: '15px' }}
                  >
                    確認新增
                  </button>
                </div>
              </div>
            )}

            {/* Status Bar Space */}
            {/* Status Bar Space / Dynamic Island Area */}
            <div className="sticky h-12 bg-[#041432] z-[60]"></div>
            {/* Top Bar Header - Fixed */}
            <div className="sticky top-0 z-[60] flex items-center justify-between px-6 py-3 bg-[#041432] backdrop-blur-md border-b border-white/5 shadow-md">
              <div className="flex items-center gap-2">
                <img src={airmonLogo} alt="AIRMON" className="h-7 object-contain" />
              </div>
              <div className="flex items-center gap-1.5">
                {isRepairing && (
                  <div className="px-3 py-1.5 bg-[#F87171]/20 border border-[#F87171]/30 rounded-full flex items-center gap-1.5 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#F87171]" />
                    <span className="text-[#F87171] font-bold" style={{ fontSize: '9px', letterSpacing: '0.05em' }}>報修中</span>
                  </div>
                )}
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24 relative z-10">
              {/* Compact Status Banner - Only in Remote Tab */}
              <div className="mb-6">
                {activeTab === 'remote' && (
                  <div className="flex items-center justify-between bg-[#121930]/10 backdrop-blur-xl border border-white/5 rounded-2xl px-4 py-3 shadow-inner">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <Shield className="w-5 h-5 text-[#0A78F5]" />
                        <div className="absolute inset-0 bg-[#0A78F5]/20 blur-md rounded-full"></div>
                      </div>
                      <span className="text-[#A1A1AA] font-bold tracking-wide" style={{ fontSize: '13px' }}>AIRGUARD 智慧守護中</span>
                    </div>
                    <div className="text-[#E1B36C] font-bold" style={{ fontSize: '18px', filter: 'drop-shadow(0 0 5px #E1B36C)' }}>{Math.floor(92 - (dustRate - 12) * 0.5)}</div>
                  </div>
                )}
              </div>
              {/* Tab Content */}
              {renderTabContent()}

            </div>

            {/* Bottom Navigation */}
            <div className="absolute bottom-0 left-0 right-0 z-[60]">
              <div className="bg-[#0D121F]/95 backdrop-blur-3xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <div className="grid grid-cols-3 px-4 pt-2 pb-4">
                  <button
                    onClick={() => setActiveTab('remote')}
                    className={`relative flex flex-col items-center gap-1 py-2 rounded-2xl transition-all active:scale-95 ${activeTab === 'remote'
                      ? 'text-[#E1B36C]'
                      : 'text-white/30 hover:bg-white/5'
                      }`}
                  >
                    {activeTab === 'remote' && <div className="absolute top-0 w-8 h-1 bg-[#E1B36C] rounded-full shadow-[0_0_10px_#E1B36C]"></div>}
                    <Smartphone className={`w-7 h-7 relative z-10 ${activeTab === 'remote' ? 'text-[#E1B36C]' : ''}`} strokeWidth={2.5} />
                    <span className="font-bold relative z-10" style={{ fontSize: '13px' }}>
                      遙控器
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('guard')}
                    className={`relative flex flex-col items-center gap-1 py-2 rounded-2xl transition-all active:scale-95 ${activeTab === 'guard'
                      ? 'text-[#E1B36C]'
                      : 'text-white/30 hover:bg-white/5'
                      }`}
                  >
                    {activeTab === 'guard' && <div className="absolute top-0 w-8 h-1 bg-[#E1B36C] rounded-full shadow-[0_0_10px_#E1B36C]"></div>}
                    <Shield className={`w-7 h-7 relative z-10 ${activeTab === 'guard' ? 'text-[#E1B36C]' : ''}`} strokeWidth={2.5} />
                    <span className="font-bold relative z-10" style={{ fontSize: '13px' }}>
                      防護中心
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`relative flex flex-col items-center gap-1 py-2 rounded-2xl transition-all active:scale-95 ${activeTab === 'dashboard'
                      ? 'text-[#E1B36C]'
                      : 'text-white/30 hover:bg-white/5'
                      }`}
                  >
                    {activeTab === 'dashboard' && <div className="absolute top-0 w-8 h-1 bg-[#E1B36C] rounded-full shadow-[0_0_10px_#E1B36C]"></div>}
                    <BarChart3 className={`w-7 h-7 relative z-10 ${activeTab === 'dashboard' ? 'text-[#E1B36C]' : ''}`} strokeWidth={2.5} />
                    <span className="font-bold relative z-10" style={{ fontSize: '13px' }}>
                      儀表板
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}