import { useState, useEffect } from 'react';
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
  const [powerMode, setPowerMode] = useState(false);
  const [ecoMode, setEcoMode] = useState(false);
  const [outdoorQuiet, setOutdoorQuiet] = useState(true);
  const [fanSpeed, setFanSpeed] = useState(50);
  const [activeTab, setActiveTab] = useState('remote');
  const [ledEnabled, setLedEnabled] = useState(true);
  const [awayMode, setAwayMode] = useState(false);
  const [activeOperationMode, setActiveOperationMode] = useState(0);
  const [showRepairModal, setShowRepairModal] = useState(false);
  const [showMoldModal, setShowMoldModal] = useState(false);
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

  // 自動關閉通知
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

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

  const operationModes = [
    { icon: <RotateCcw className="w-5 h-5" />, label: '自動', fanDefault: 60, tempDefault: 26, ticks: ['AUTO', 'LOW', 'MID', 'HIGH'], getLabel: (v: number) => v < 30 ? 'LOW' : v < 60 ? 'MID' : v < 85 ? 'HIGH' : 'AUTO' },
    { icon: <Snowflake className="w-5 h-5" />, label: '冷房', fanDefault: 80, tempDefault: 24, ticks: ['LOW', 'MID', 'HIGH'], getLabel: (v: number) => v < 30 ? 'LOW' : v < 65 ? 'MID' : 'HIGH' },
    { icon: <Sun className="w-5 h-5" />, label: '暖房', fanDefault: 55, tempDefault: 30, ticks: ['LOW', 'MID', 'HIGH'], getLabel: (v: number) => v < 30 ? 'LOW' : v < 65 ? 'MID' : 'HIGH' },
    { icon: <Droplets className="w-5 h-5" />, label: '除濕', fanDefault: 20, tempDefault: 27, ticks: ['LOW', 'MID'], getLabel: (v: number) => v < 50 ? 'LOW' : 'MID' },
    { icon: <Wind className="w-5 h-5" />, label: '送風', fanDefault: 50, tempDefault: 26, ticks: ['LOW', 'MID', 'HIGH', 'AUTO'], getLabel: (v: number) => v < 30 ? 'LOW' : v < 60 ? 'MID' : v < 85 ? 'HIGH' : 'AUTO' },
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
        <div className="relative bg-[#121930]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_0_40px_rgba(10,120,245,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-[#E1B36C]" />
              <span className="text-[#A1A1AA] font-bold" style={{ fontSize: '14px' }}>室內溫度</span>
            </div>
            <div className="text-[#FFFFFF] font-bold" style={{ fontSize: '28px', textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>26<span className="text-[#A1A1AA] text-lg ml-1">°C</span></div>
          </div>

          {/* Temperature Wheel */}
          <div className="relative flex items-center justify-center py-8">
            {/* Glow */}
            <div className="absolute inset-0 bg-[#E1B36C]/15 blur-[60px] rounded-full"></div>

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
            >
              <Minus className="w-6 h-6 text-white" strokeWidth={2} />
            </button>

            <div className="mx-6 relative">
              <div className={`w-44 h-44 rounded-full border flex items-center justify-center transition-all duration-300 ease-out bg-radial from-[#121930] to-transparent ${isAdjusting
                  ? 'border-[#E1B36C]/60 scale-105 shadow-[0_0_50px_rgba(225,179,108,0.4),inset_0_0_40px_rgba(225,179,108,0.25)]'
                  : 'border-[#E1B36C]/30 scale-100 shadow-[0_0_40px_rgba(225,179,108,0.25),inset_0_0_30px_rgba(225,179,108,0.15)]'
                }`}>
                <div className="absolute inset-0 rounded-full border-[3px] border-t-[#E1B36C] border-r-transparent border-b-transparent border-l-transparent animate-spin-slow" style={{ filter: 'drop-shadow(0 0 12px rgba(225, 179, 108, 0.9))' }}></div>
                <div className="text-center">
                  <div className="text-[#A1A1AA] font-bold mb-1" style={{ fontSize: '12px', letterSpacing: '0.1em' }}>設定溫度</div>
                  <div className="text-[#FFFFFF] font-bold" style={{ fontSize: '64px', lineHeight: '1', textShadow: '0 0 30px rgba(255,255,255,0.4)' }}>{temperature}</div>
                  <div className="text-[#E1B36C] font-bold mt-1" style={{ fontSize: '18px' }}>°C</div>
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
            >
              <Plus className="w-6 h-6 text-white" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Status */}
      <div className="mb-6">
        <div className="bg-[#121930]/70 backdrop-blur-xl border-l-4 border-l-[#0A78F5] border-y border-r border-white/10 rounded-2xl px-5 py-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <div className="text-[#0A78F5] drop-shadow-[0_0_8px_rgba(10,120,245,0.8)]">{operationModes[activeOperationMode].icon}</div>
            <span className="text-[#FFFFFF] font-bold" style={{ fontSize: '14px' }}>{operationModes[activeOperationMode].label} MODE</span>
          </div>
          <div className="h-6 w-px bg-white/10"></div>
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-[#E1B36C]" />
            <span className="text-[#FFFFFF] font-bold" style={{ fontSize: '14px' }}>風力: {operationModes[activeOperationMode].getLabel(fanSpeed)}</span>
          </div>
          <div className="h-6 w-px bg-white/10"></div>
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-[#0A78F5]" />
            <span className="text-[#FFFFFF] font-bold" style={{ fontSize: '14px' }}>{temperature}°C</span>
          </div>
        </div>
      </div>

      {/* Smart Mode 2x2 Grid */}
      <div className="mb-6">
        <h3 className="text-white/80 font-bold mb-3 px-1" style={{ fontSize: '16px' }}>智慧模式</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Eco Mode */}
          <button
            onClick={() => { setEcoMode(!ecoMode); if (!ecoMode) setPowerMode(false); }}
            className={`backdrop-blur-xl border rounded-2xl p-5 transition-all active:scale-95 border-t-2 ${ecoMode
                ? 'bg-[#0A78F5]/20 border-[#0A78F5] shadow-[0_0_20px_rgba(10,120,245,0.3)]'
                : 'bg-[#121930]/70 border-white/5 grayscale opacity-60'
              }`}
          >
            <div className="flex flex-col items-center gap-3">
              <Leaf className={`w-10 h-10 ${ecoMode ? 'text-[#0A78F5] drop-shadow-[0_0_10px_rgba(10,120,245,0.5)]' : 'text-white/40'}`} />
              <div className="text-white font-bold text-center" style={{ fontSize: '15px' }}>節能運轉</div>
              <div className={`w-12 h-6 rounded-full transition-all ${ecoMode ? 'bg-[#0A78F5]' : 'bg-white/10'}`}>
                <div className={`w-5 h-5 mt-0.5 rounded-full bg-white transition-all ${ecoMode ? 'ml-6' : 'ml-0.5'}`}></div>
              </div>
            </div>
          </button>

          {/* Power Mode */}
          <button
            onClick={() => { setPowerMode(!powerMode); if (!powerMode) setEcoMode(false); }}
            className={`backdrop-blur-xl border rounded-2xl p-5 transition-all active:scale-95 border-t-2 ${powerMode
                ? 'bg-[#E1B36C]/20 border-[#E1B36C] shadow-[0_0_20px_rgba(225,179,108,0.3)]'
                : 'bg-[#121930]/70 border-white/5 grayscale opacity-60'
              }`}
          >
            <div className="flex flex-col items-center gap-3">
              <Zap className={`w-10 h-10 ${powerMode ? 'text-[#E1B36C] drop-shadow-[0_0_10px_rgba(225,179,108,0.5)]' : 'text-white/40'}`} />
              <div className="text-white font-bold text-center" style={{ fontSize: '15px' }}>強力運轉</div>
              {powerMode ? (
                <div className="bg-white/20 px-3 py-1 rounded-full">
                  <div className="text-[#E1B36C] font-bold" style={{ fontSize: '16px' }}>14:59</div>
                </div>
              ) : (
                <div className="w-12 h-6 rounded-full bg-white/10">
                  <div className="w-5 h-5 mt-0.5 ml-0.5 rounded-full bg-white/30"></div>
                </div>
              )}
            </div>
          </button>

          {/* Away Mode */}
          <button
            onClick={() => setAwayMode(!awayMode)}
            className={`backdrop-blur-xl border rounded-2xl p-5 transition-all active:scale-95 border-t-2 ${awayMode
                ? 'bg-[#E1B36C]/20 border-[#E1B36C] shadow-[0_0_20px_rgba(225,179,108,0.3)]'
                : 'bg-[#121930]/70 border-white/5 grayscale opacity-60'
              }`}
          >
            <div className="flex flex-col items-center gap-3">
              <Home className={`w-10 h-10 transition-all ${awayMode ? 'text-[#E1B36C] drop-shadow-[0_0_8px_rgba(225,179,108,0.8)]' : 'text-white/60'}`} />
              <div className="text-white font-bold text-center" style={{ fontSize: '15px' }}>外出模式</div>
              <div className={`w-12 h-6 rounded-full transition-all ${awayMode ? 'bg-[#E1B36C]' : 'bg-white/10'}`}>
                <div className={`w-5 h-5 mt-0.5 rounded-full bg-white transition-all ${awayMode ? 'ml-6' : 'ml-0.5'}`}></div>
              </div>
            </div>
          </button>

          {/* Outdoor Quiet */}
          <button
            onClick={() => setOutdoorQuiet(!outdoorQuiet)}
            className={`backdrop-blur-xl border rounded-2xl p-5 transition-all active:scale-95 border-t-2 ${outdoorQuiet
                ? 'bg-[#0A78F5]/20 border-[#0A78F5] shadow-[0_0_20px_rgba(10,120,245,0.3)]'
                : 'bg-[#121930]/70 border-white/5 grayscale opacity-60'
              }`}
          >
            <div className="flex flex-col items-center gap-3">
              <Moon className={`w-10 h-10 ${outdoorQuiet ? 'text-[#0A78F5] drop-shadow-[0_0_10px_rgba(10,120,245,0.5)]' : 'text-white/40'}`} />
              <div className="text-white font-bold text-center" style={{ fontSize: '15px' }}>室外靜音</div>
              <div className={`w-12 h-6 rounded-full transition-all ${outdoorQuiet ? 'bg-[#0A78F5]' : 'bg-white/10'}`}>
                <div className={`w-5 h-5 mt-0.5 rounded-full bg-white transition-all ${outdoorQuiet ? 'ml-6' : 'ml-0.5'}`}></div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Operation Drawer */}
      <div className="mb-6">
        <div className="bg-[#121930]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
          <h3 className="text-[#A1A1AA] font-bold mb-4" style={{ fontSize: '14px', letterSpacing: '0.1em' }}>操作模式</h3>

          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {operationModes.map((mode, idx) => (
              <button
                key={idx}
                onClick={() => { setActiveOperationMode(idx); setFanSpeed(mode.fanDefault); setTemperature(mode.tempDefault); }}
                className={`flex-shrink-0 px-5 py-3 rounded-2xl font-bold transition-all active:scale-95 ${activeOperationMode === idx
                    ? 'bg-[#0A78F5] text-white shadow-[0_0_15px_rgba(10,120,245,0.5)]'
                    : 'bg-white/10 text-white/70 hover:bg-white/15'
                  }`}
                style={{ fontSize: '14px' }}
              >
                <span className="inline-block mr-1.5">{mode.icon}</span>
                {mode.label}
              </button>
            ))}
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
                  style={{ width: `${fanSpeed}%` }}
                ></div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
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

  const renderGuardTab = () => (
    <>
      {/* Health Gauge */}
      <style>{`
        @keyframes drawGauge {
          from { stroke-dashoffset: 251.2; }
          to { stroke-dashoffset: 25.12; }
        }
        @keyframes barGrow {
          from { height: 0; opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(225, 179, 108, 0.4)); }
          50% { filter: drop-shadow(0 0 15px rgba(225, 179, 108, 0.8)); }
        }
        .animate-gauge {
          animation: drawGauge 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
      <div className="mb-6">
        <div className="relative bg-[#121930]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#0A78F5]/10 blur-[80px] rounded-full"></div>

          <div className="relative text-center">
            <h3 className="text-[#A1A1AA] font-bold mb-8" style={{ fontSize: '14px', letterSpacing: '0.2em' }}>健康分數</h3>

            {/* Semi-circular gauge */}
            <div className="relative w-64 h-32 mx-auto mb-8">
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
                  strokeDashoffset="251.2"
                  className="animate-gauge"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(225, 179, 108, 0.6))' }}
                />
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#E1B36C" />
                    <stop offset="50%" stopColor="#FFF5E6" />
                    <stop offset="100%" stopColor="#E1B36C" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center translate-y-3 transition-all duration-1000 delay-500">
                <div className="text-[#FFFFFF] font-bold animate-[pulse_2s_infinite]" style={{ fontSize: '72px', lineHeight: '1', textShadow: '0 0 40px rgba(225,179,108,0.5)' }}>92</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[#A1A1AA] font-medium" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>動態保固狀態</div>
              <div className="text-[#E1B36C] font-bold flex items-center justify-center gap-2" style={{ fontSize: '16px', filter: 'drop-shadow(0 0 10px #E1B36C)' }}>
                <Shield className="w-4 h-4" /> 已延長保固+18個月
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Threat Card */}
      <div className="mb-6">
        <div className="bg-[#121930]/70 backdrop-blur-xl border-t-2 border-t-[#F87171] border-x border-b border-white/10 rounded-3xl p-5 shadow-[0_0_20px_rgba(248,113,113,0.15)]">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-[#F87171] flex-shrink-0 mt-1 drop-shadow-[0_0_8px_#F87171]" />
            <div className="flex-1">
              <h3 className="text-white font-bold mb-1" style={{ fontSize: '16px' }}>環境威脅偵測</h3>
              <p className="text-[#A1A1AA] mb-3" style={{ fontSize: '13px' }}>北投區域 - 溫泉硫化氣體影響</p>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 shadow-inner">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-[#0A78F5]" />
                  <span className="text-white font-bold" style={{ fontSize: '14px' }}>AI 智慧應對中</span>
                </div>
                <p className="text-[#0A78F5]" style={{ fontSize: '13px' }}>動態啟動抗硫化鍍層防護模式</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guard Action Buttons */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setShowMoldModal(true)} className="bg-[#121930]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-5 transition-all active:scale-95 border-t-2 border-t-[#0A78F5]/50">
            <div className="flex flex-col items-center gap-3">
              <Sparkles className="w-10 h-10 text-[#0A78F5] drop-shadow-[0_0_8px_rgba(10,120,245,0.4)]" />
              <div className="text-white font-bold text-center" style={{ fontSize: '15px' }}>抑菌防霉</div>
              <div className="text-[#A1A1AA] text-center" style={{ fontSize: '11px' }}>啟動深度保養</div>
            </div>
          </button>

          <button
            onClick={() => setShowRepairModal(true)}
            className="bg-[#121930]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-5 transition-all active:scale-95 border-t-2 border-t-[#F87171]/50"
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
          <div className="bg-[#121930]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="w-4 h-4 text-[#0A78F5]" />
              <span className="text-[#A1A1AA]" style={{ fontSize: '12px' }}>空氣品質 PM2.5</span>
            </div>
            <div className="text-[#FFFFFF] font-bold mb-1" style={{ fontSize: '26px' }}>18</div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#0A78F5] animate-pulse"></div>
              <span className="text-[#0A78F5]" style={{ fontSize: '11px' }}>極佳</span>
            </div>
          </div>

          {/* Motor Speed */}
          <div className="bg-[#121930]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="w-4 h-4 text-[#E1B36C]" />
              <span className="text-[#A1A1AA]" style={{ fontSize: '12px' }}>馬達轉速 RPM</span>
            </div>
            <div className="text-[#FFFFFF] font-bold mb-1" style={{ fontSize: '26px' }}>980</div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#E1B36C] animate-pulse"></div>
              <span className="text-[#E1B36C]" style={{ fontSize: '11px' }}>正常</span>
            </div>
          </div>

          {/* Filter Status */}
          <div className="bg-[#121930]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-[#E1B36C]" />
              <span className="text-[#A1A1AA]" style={{ fontSize: '12px' }}>濾網積塵率</span>
            </div>
            <div className="text-[#FFFFFF] font-bold mb-1" style={{ fontSize: '26px' }}>12<span className="text-sm ml-1">%</span></div>
            <div className="text-[#E1B36C]" style={{ fontSize: '11px' }}>健康</div>
          </div>

          {/* Refrigerant Monitor */}
          <div className="bg-[#121930]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-[#0A78F5]" />
              <span className="text-[#A1A1AA]" style={{ fontSize: '12px' }}>冷媒系統壓力</span>
            </div>
            <div className="text-[#0A78F5] font-bold mb-1" style={{ fontSize: '20px' }}>安全</div>
            <div className="text-white/30" style={{ fontSize: '10px' }}>無異常</div>
          </div>
        </div>
      </div>
    </>
  );

  const renderDashboardTab = () => (
    <>
      {/* Sub-tab Switcher */}
      <div className="mb-6">
        <div className="bg-[#121930]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 flex gap-1 shadow-inner">
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
          <div className="bg-[#121930]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl">
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
          <div className="relative bg-[#121930]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl overflow-hidden">
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
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-2xl">
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
          <div className="bg-[#121930]/70 backdrop-blur-xl border-t-2 border-t-[#E1B36C] border-white/10 rounded-3xl p-5 shadow-2xl">
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
            <div className="bg-[#121930]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center shadow-xl">
              <div className="text-[#A1A1AA] mb-1" style={{ fontSize: '11px' }}>一般定時</div>
              <div className="font-bold" style={{ fontSize: '22px' }}>
                <span className="text-[#0A78F5]">2</span>
                <span className="text-white/40" style={{ fontSize: '13px' }}> / 8 組</span>
              </div>
            </div>
            <div className="bg-[#121930]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center shadow-xl">
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
            <div key={idx} className="bg-[#121930]/70 backdrop-blur-xl border-l-2 border-l-[#E1B36C] border-white/5 rounded-2xl p-4 flex items-center justify-between gap-3">
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
            className="w-full bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-2xl py-4 text-[#A1A1AA] font-bold transition-all active:scale-95"
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
              background: 'radial-gradient(ellipse at top, #0D1326 0%, #090D1A 100%)'
            }}
          >

            {/* In-App Notification Overlay */}
            {notification && (
              <div className="absolute top-14 left-4 right-4 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="bg-[#1C1C1E]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-start gap-3">
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
                  className="bg-[#121930] border border-white/20 rounded-3xl p-6 mx-6 shadow-[0_0_50px_rgba(248,113,113,0.3)] w-full max-w-[320px]"
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
                  className="bg-[#121930] border border-white/20 rounded-3xl p-6 mx-6 shadow-[0_0_50px_rgba(10,120,245,0.3)] w-full max-w-[320px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#0A78F5]/10 border border-[#0A78F5]/30 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-white font-bold" style={{ fontSize: '16px' }}>防霉保養啟動</div>
                      <div className="text-white/50" style={{ fontSize: '12px' }}>建議立即執行</div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      <span className="text-white" style={{ fontSize: '14px' }}>高溫乾燥 (30 分鐘)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      <span className="text-white" style={{ fontSize: '14px' }}>抑菌風道清潔</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowMoldModal(false);
                        setNotification({ title: '保養啟動', body: '防霉保養已啟動，預計執行時間：30 分鐘。' });
                      }}
                      className="flex-1 bg-emerald-500/80 hover:bg-emerald-500 text-white rounded-2xl py-3 font-bold transition-all active:scale-95 text-xs"
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
                  className="w-full bg-[#121930] border-t border-white/20 rounded-t-3xl p-6 shadow-2xl"
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

            {/* Dynamic Island Space */}
            <div className="h-12 flex items-center justify-center">
              <div className="w-32 h-9 bg-black rounded-full"></div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 pb-32">

              {/* Top Bar Status */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <img src={airmonLogo} alt="AIRMON" className="h-5 object-contain" />
                </div>
                <div className="flex items-center gap-1.5">
                  <Signal className="w-3.5 h-3.5 text-[#0A78F5]" />
                  <div className="px-3 py-1.5 bg-[#F87171]/20 border border-[#F87171]/30 rounded-full flex items-center gap-1.5 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#F87171]" />
                    <span className="text-[#F87171] font-bold" style={{ fontSize: '9px', letterSpacing: '0.05em' }}>E1 FAULT</span>
                  </div>
                </div>
              </div>

              {/* Compact Status Banner */}
              <div className="mb-6">
                <div className="flex items-center justify-between bg-[#121930]/40 backdrop-blur-xl border border-white/5 rounded-2xl px-4 py-3 shadow-inner">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <Shield className="w-5 h-5 text-[#0A78F5]" />
                      <div className="absolute inset-0 bg-[#0A78F5]/20 blur-md rounded-full"></div>
                    </div>
                    <span className="text-[#A1A1AA] font-bold tracking-wide" style={{ fontSize: '13px' }}>AIRGUARD 智慧守護中</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-px bg-white/10"></div>
                    <div className="text-[#E1B36C] font-bold" style={{ fontSize: '18px', filter: 'drop-shadow(0 0 5px #E1B36C)' }}>92</div>
                  </div>
                </div>
              </div>
              {/* Tab Content */}
              {renderTabContent()}

            </div>

            {/* Bottom Navigation */}
            <div className="absolute bottom-0 left-0 right-0 pb-8">
              <div className="mx-5 bg-[#121930]/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
                <div className="grid grid-cols-3 p-3">
                  <button
                    onClick={() => setActiveTab('remote')}
                    className={`relative flex flex-col items-center gap-2 py-4 rounded-2xl transition-all active:scale-95 ${activeTab === 'remote'
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
                    className={`relative flex flex-col items-center gap-2 py-4 rounded-2xl transition-all active:scale-95 ${activeTab === 'guard'
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
                    className={`relative flex flex-col items-center gap-2 py-4 rounded-2xl transition-all active:scale-95 ${activeTab === 'dashboard'
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

            {/* iOS Home Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}