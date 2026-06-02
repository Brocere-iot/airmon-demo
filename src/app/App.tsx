import { useState } from 'react';
import airmonLogo from '../assets/airmon_logo.png';
import {
  Power, Plus, Minus, Wind, Settings, AlertTriangle,
  Thermometer, Zap, Home, Moon, Leaf, Signal,
  BarChart3, Shield, Smartphone, Activity, Gauge,
  CheckCircle2, AlertCircle, Wifi, Lightbulb
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
    { icon: '🔄', label: 'Ⓐ 自動', fanDefault: 60, tempDefault: 26,   ticks: ['LOW', 'MID', 'HIGH', 'AUTO'], getLabel: (v: number) => v < 30 ? 'LOW' : v < 60 ? 'MID' : v < 85 ? 'HIGH' : 'AUTO' },
    { icon: '❄️', label: '冷房',   fanDefault: 80, tempDefault: 24,   ticks: ['LOW', 'MID', 'HIGH'],          getLabel: (v: number) => v < 30 ? 'LOW' : v < 65 ? 'MID' : 'HIGH' },
    { icon: '☀️', label: '暖房',   fanDefault: 55, tempDefault: 30,   ticks: ['LOW', 'MID', 'HIGH'],          getLabel: (v: number) => v < 30 ? 'LOW' : v < 65 ? 'MID' : 'HIGH' },
    { icon: '💧', label: '除濕',   fanDefault: 20, tempDefault: 27,   ticks: ['LOW', 'MID'],                  getLabel: (v: number) => v < 50 ? 'LOW' : 'MID' },
    { icon: '🌬️', label: '送風',  fanDefault: 50, tempDefault: 26,   ticks: ['LOW', 'MID', 'HIGH', 'AUTO'], getLabel: (v: number) => v < 30 ? 'LOW' : v < 60 ? 'MID' : v < 85 ? 'HIGH' : 'AUTO' },
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
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-white/80 font-bold" style={{ fontSize: '15px' }}>室內溫度</span>
            </div>
            <div className="text-[#D4AF37] font-bold" style={{ fontSize: '28px' }}>26°C</div>
          </div>

          {/* Temperature Wheel */}
          <div className="relative flex items-center justify-center py-8">
            {/* Glow */}
            <div className="absolute inset-0 bg-[#D4AF37]/10 blur-3xl rounded-full"></div>

            <button
              onClick={() => setTemperature(Math.max(16, temperature - 0.5))}
              className="relative z-10 w-16 h-16 bg-white/10 hover:bg-white/20 border-2 border-white/30 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95"
            >
              <Minus className="w-8 h-8 text-white" strokeWidth={3} />
            </button>

            <div className="mx-8 relative">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-[#2ECF8F]/30 border-4 border-[#D4AF37]/50 flex items-center justify-center shadow-2xl shadow-[#D4AF37]/40">
                <div className="text-center">
                  <div className="text-white/60 font-bold mb-1" style={{ fontSize: '14px' }}>設定溫度</div>
                  <div className="text-white font-bold" style={{ fontSize: '56px', lineHeight: '1' }}>{temperature}</div>
                  <div className="text-[#D4AF37] font-bold" style={{ fontSize: '24px' }}>°C</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setTemperature(Math.min(30, temperature + 0.5))}
              className="relative z-10 w-16 h-16 bg-white/10 hover:bg-white/20 border-2 border-white/30 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95"
            >
              <Plus className="w-8 h-8 text-white" strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Status */}
      <div className="mb-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-4 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-2">
            <div className="text-[#2ECF8F]" style={{ fontSize: '20px' }}>{operationModes[activeOperationMode].icon}</div>
            <span className="text-white font-bold" style={{ fontSize: '15px' }}>{operationModes[activeOperationMode].label}模式</span>
          </div>
          <div className="h-6 w-px bg-white/20"></div>
          <div className="flex items-center gap-2">
            <div className="text-[#D4AF37]" style={{ fontSize: '20px' }}>💨</div>
            <span className="text-white font-bold" style={{ fontSize: '15px' }}>風量: {operationModes[activeOperationMode].getLabel(fanSpeed)}</span>
          </div>
          <div className="h-6 w-px bg-white/20"></div>
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-[#2ECF8F]" />
            <span className="text-white font-bold" style={{ fontSize: '15px' }}>{temperature}°C</span>
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
            className={`backdrop-blur-xl border rounded-2xl p-5 transition-all shadow-xl active:scale-95 ${
              ecoMode
                ? 'bg-gradient-to-br from-emerald-500/40 to-emerald-600/40 border-emerald-400/50 shadow-emerald-400/30'
                : 'bg-white/10 hover:bg-white/15 border-white/20'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="text-5xl">🍃</div>
              <div className="text-white font-bold text-center" style={{ fontSize: '15px' }}>節能運轉</div>
              <div className={`w-12 h-6 rounded-full transition-all ${ecoMode ? 'bg-[#2ECF8F]' : 'bg-white/20'}`}>
                <div className={`w-5 h-5 mt-0.5 rounded-full bg-white transition-all ${ecoMode ? 'ml-6' : 'ml-0.5'}`}></div>
              </div>
            </div>
          </button>

          {/* Power Mode */}
          <button
            onClick={() => { setPowerMode(!powerMode); if (!powerMode) setEcoMode(false); }}
            className={`backdrop-blur-xl border rounded-2xl p-5 transition-all shadow-xl active:scale-95 ${
              powerMode
                ? 'bg-gradient-to-br from-blue-500/40 to-blue-600/40 border-blue-400/50 shadow-blue-400/30'
                : 'bg-white/10 hover:bg-white/15 border-white/20'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="text-5xl">⚡</div>
              <div className="text-white font-bold text-center" style={{ fontSize: '15px' }}>強力運轉</div>
              {powerMode ? (
                <div className="bg-white/20 px-3 py-1 rounded-full">
                  <div className="text-white font-bold" style={{ fontSize: '16px' }}>14:59</div>
                </div>
              ) : (
                <div className="w-12 h-6 rounded-full bg-white/20">
                  <div className="w-5 h-5 mt-0.5 ml-0.5 rounded-full bg-white"></div>
                </div>
              )}
            </div>
          </button>

          {/* Away Mode */}
          <button
            onClick={() => setAwayMode(!awayMode)}
            className={`backdrop-blur-xl border rounded-2xl p-5 transition-all shadow-xl active:scale-95 ${
              awayMode
                ? 'bg-gradient-to-br from-orange-500/40 to-orange-600/40 border-orange-400/50 shadow-orange-400/30'
                : 'bg-white/10 hover:bg-white/15 border-white/20'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="text-5xl">🏠</div>
              <div className="text-white font-bold text-center" style={{ fontSize: '15px' }}>外出模式</div>
              <div className={`w-12 h-6 rounded-full transition-all ${awayMode ? 'bg-orange-400' : 'bg-white/20'}`}>
                <div className={`w-5 h-5 mt-0.5 rounded-full bg-white transition-all ${awayMode ? 'ml-6' : 'ml-0.5'}`}></div>
              </div>
            </div>
          </button>

          {/* Outdoor Quiet */}
          <button
            onClick={() => setOutdoorQuiet(!outdoorQuiet)}
            className={`backdrop-blur-xl border-2 rounded-2xl p-5 transition-all shadow-xl active:scale-95 ${
              outdoorQuiet
                ? 'bg-cyan-500/20 border-cyan-400/60 shadow-cyan-400/30'
                : 'bg-white/10 hover:bg-white/15 border-white/20'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="text-5xl">🌙</div>
              <div className="text-white font-bold text-center" style={{ fontSize: '15px' }}>室外靜音</div>
              <div className={`w-12 h-6 rounded-full transition-all ${outdoorQuiet ? 'bg-cyan-400' : 'bg-white/20'}`}>
                <div className={`w-5 h-5 mt-0.5 rounded-full bg-white transition-all ${outdoorQuiet ? 'ml-6' : 'ml-0.5'}`}></div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Operation Drawer */}
      <div className="mb-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
          <h3 className="text-white/80 font-bold mb-4" style={{ fontSize: '16px' }}>運轉模式</h3>

          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {operationModes.map((mode, idx) => (
              <button
                key={idx}
                onClick={() => { setActiveOperationMode(idx); setFanSpeed(mode.fanDefault); setTemperature(mode.tempDefault); }}
                className={`flex-shrink-0 px-5 py-3 rounded-2xl font-bold transition-all active:scale-95 ${
                  activeOperationMode === idx
                    ? 'bg-[#D4AF37]/80 text-white shadow-lg shadow-[#D4AF37]/30'
                    : 'bg-white/10 text-white/70 hover:bg-white/15'
                }`}
                style={{ fontSize: '15px' }}
              >
                <span className="mr-1.5">{mode.icon}</span>
                {mode.label}
              </button>
            ))}
          </div>

          {/* Fan Speed Slider */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-white/80 font-bold" style={{ fontSize: '15px' }}>風量調整</span>
              <span className="text-[#D4AF37] font-bold" style={{ fontSize: '16px' }}>
                {operationModes[activeOperationMode].getLabel(fanSpeed)}
              </span>
            </div>
            <div className="relative">
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#2ECF8F] rounded-full transition-all"
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
                <span key={tick} className="text-white/50" style={{ fontSize: '12px' }}>{tick}</span>
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
      <div className="mb-6">
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
          <div className="absolute inset-0 bg-[#D4AF37]/10 blur-3xl rounded-3xl"></div>

          <div className="relative text-center">
            <h3 className="text-white/80 font-bold mb-4" style={{ fontSize: '16px' }}>機體健康評分</h3>

            {/* Semi-circular gauge */}
            <div className="relative w-48 h-24 mx-auto mb-4">
              <svg viewBox="0 0 200 100" className="w-full h-full">
                <path
                  d="M 20 90 A 80 80 0 0 1 180 90"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path
                  d="M 20 90 A 80 80 0 0 1 180 90"
                  fill="none"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray="251.2"
                  strokeDashoffset="25.12"
                />
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2ECF8F" />
                    <stop offset="100%" stopColor="#D4AF37" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-[#D4AF37] font-bold" style={{ fontSize: '64px', lineHeight: '1' }}>92</div>
              </div>
            </div>

            <div className="text-white/70 mb-2" style={{ fontSize: '14px' }}>動態保固狀態</div>
            <div className="text-[#2ECF8F] font-bold" style={{ fontSize: '18px' }}>已延長 +18 個月</div>
          </div>
        </div>
      </div>

      {/* Environmental Threat Card */}
      <div className="mb-6">
        <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-xl border-2 border-red-400/40 rounded-3xl p-5 shadow-2xl shadow-red-500/20">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-white font-bold mb-2" style={{ fontSize: '16px' }}>⚠️ 區域環境監測</h3>
              <p className="text-white/90 mb-3" style={{ fontSize: '14px' }}>溫泉硫化區域</p>

              <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-[#2ECF8F]" />
                  <span className="text-white font-bold" style={{ fontSize: '14px' }}>🛡️ AI 守護對策</span>
                </div>
                <p className="text-[#2ECF8F]" style={{ fontSize: '13px' }}>已自動啟動抗硫化防護流程</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guard Action Buttons */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setShowMoldModal(true)} className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl border border-emerald-400/40 rounded-2xl p-5 transition-all shadow-xl active:scale-95 hover:bg-emerald-500/30">
            <div className="flex flex-col items-center gap-3">
              <div className="text-5xl">🧴</div>
              <div className="text-white font-bold text-center" style={{ fontSize: '15px' }}>防霉保養</div>
              <div className="text-emerald-400 text-center" style={{ fontSize: '12px' }}>立即啟動</div>
            </div>
          </button>

          <button
            onClick={() => setShowRepairModal(true)}
            className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-xl border border-red-400/40 rounded-2xl p-5 transition-all shadow-xl active:scale-95 hover:bg-red-500/30"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="text-5xl">🔧</div>
              <div className="text-white font-bold text-center" style={{ fontSize: '15px' }}>預警報修</div>
              <div className="text-red-400 text-center" style={{ fontSize: '12px' }}>申請維修</div>
            </div>
          </button>
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="mb-6">
        <h3 className="text-white/80 font-bold mb-3 px-1" style={{ fontSize: '16px' }}>感測器狀態</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Air Quality */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="w-5 h-5 text-[#2ECF8F]" />
              <span className="text-white/70" style={{ fontSize: '13px' }}>空氣品質</span>
            </div>
            <div className="text-[#D4AF37] font-bold mb-1" style={{ fontSize: '24px' }}>18</div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#2ECF8F]"></div>
              <span className="text-[#2ECF8F]" style={{ fontSize: '12px' }}>優良</span>
            </div>
          </div>

          {/* Motor Speed */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="w-5 h-5 text-[#2ECF8F]" />
              <span className="text-white/70" style={{ fontSize: '13px' }}>馬達轉速</span>
            </div>
            <div className="text-[#D4AF37] font-bold mb-1" style={{ fontSize: '24px' }}>980</div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#2ECF8F]"></div>
              <span className="text-[#2ECF8F]" style={{ fontSize: '12px' }}>RPM 正常</span>
            </div>
          </div>

          {/* Filter Status */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-yellow-400" />
              <span className="text-white/70" style={{ fontSize: '13px' }}>濾網積塵</span>
            </div>
            <div className="text-[#D4AF37] font-bold mb-1" style={{ fontSize: '24px' }}>12%</div>
            <div className="text-yellow-400" style={{ fontSize: '11px' }}>建議30天後清潔</div>
          </div>

          {/* Refrigerant Monitor */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-[#2ECF8F]" />
              <span className="text-white/70" style={{ fontSize: '13px' }}>冷媒監測</span>
            </div>
            <div className="text-[#2ECF8F] font-bold mb-1" style={{ fontSize: '20px' }}>安全</div>
            <div className="text-white/50" style={{ fontSize: '11px' }}>無外洩跡象</div>
          </div>
        </div>
      </div>
    </>
  );

  const renderDashboardTab = () => (
    <>
      {/* Sub-tab Switcher */}
      <div className="mb-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 flex gap-1">
          <button
            onClick={() => setDashboardSubTab('energy')}
            className={`flex-1 py-2.5 rounded-xl font-bold transition-all text-center ${dashboardSubTab === 'energy' ? 'bg-[#1E3A8A] text-white shadow-lg' : 'text-white/50 hover:text-white/70'}`}
            style={{ fontSize: '14px' }}
          >
            ⚡ 能源分析
          </button>
          <button
            onClick={() => setDashboardSubTab('schedule')}
            className={`flex-1 py-2.5 rounded-xl font-bold transition-all text-center ${dashboardSubTab === 'schedule' ? 'bg-[#1E3A8A] text-white shadow-lg' : 'text-white/50 hover:text-white/70'}`}
            style={{ fontSize: '14px' }}
          >
            📅 排程管理
          </button>
        </div>
      </div>

      {dashboardSubTab === 'energy' && <>
        {/* Device Management */}
        <div className="mb-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-2xl">
            <h3 className="text-white/80 font-bold mb-4" style={{ fontSize: '16px' }}>設備管理</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-[#2ECF8F]" />
                  <span className="text-white/70" style={{ fontSize: '14px' }}>📡 MAC Address</span>
                </div>
                <span className="text-[#D4AF37] font-bold" style={{ fontSize: '14px' }}>3C:33:32:C0:0F:5C</span>
              </div>

              <div className="h-px bg-white/10"></div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-white/70" style={{ fontSize: '14px' }}>💡 LED指示燈</span>
                </div>
                <button
                  onClick={() => setLedEnabled(!ledEnabled)}
                  className={`w-14 h-7 rounded-full transition-all ${ledEnabled ? 'bg-[#2ECF8F]' : 'bg-white/20'}`}
                >
                  <div className={`w-6 h-6 mt-0.5 rounded-full bg-white transition-all shadow-lg ${ledEnabled ? 'ml-7' : 'ml-0.5'}`}></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Energy Analytics */}
        <div className="mb-6">
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-2xl">
            <div className="absolute inset-0 bg-[#D4AF37]/10 blur-3xl rounded-3xl"></div>

            <div className="relative">
              <h3 className="text-white/80 font-bold mb-4" style={{ fontSize: '16px' }}>能源分析</h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-white/60 mb-1" style={{ fontSize: '13px' }}>本月累計用電</div>
                  <div className="text-[#D4AF37] font-bold" style={{ fontSize: '28px' }}>142.6</div>
                  <div className="text-white/50" style={{ fontSize: '12px' }}>kWh</div>
                </div>
                <div>
                  <div className="text-white/60 mb-1" style={{ fontSize: '13px' }}>預估電費</div>
                  <div className="text-[#D4AF37] font-bold" style={{ fontSize: '28px' }}>513</div>
                  <div className="text-white/50" style={{ fontSize: '12px' }}>NT$</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="mb-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-2xl">
            <h3 className="text-white/80 font-bold mb-4" style={{ fontSize: '16px' }}>每週用電趨勢</h3>

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
                      className="w-full bg-gradient-to-t from-[#D4AF37] to-[#2ECF8F] rounded-t-lg transition-all group-hover:opacity-80"
                      style={{ height: `${data.value * 1.2}px` }}
                    ></div>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                        {data.value}%
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
          <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl border border-purple-400/30 rounded-3xl p-5 shadow-2xl shadow-purple-500/20">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                <span style={{ fontSize: '20px' }}>🤖</span>
              </div>
              <div className="flex-1">
                <div className="text-white/80 font-bold mb-1" style={{ fontSize: '14px' }}>AIRGUARD Copilot</div>
                <p className="text-white/90 mb-4" style={{ fontSize: '14px' }}>
                  目前偵測到冷媒效率下降 8%。是否安排預防保養？
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => alert('✅ 已安排預防保養！\n\n服務人員將於 3 個工作天內與您聯繫確認時間。\n\n工單編號：AG-2026-0602')}
                    className="flex-1 bg-[#D4AF37]/80 hover:bg-[#D4AF37] border border-[#D4AF37] text-white rounded-2xl py-3 font-bold transition-all shadow-lg active:scale-95" style={{ fontSize: '14px' }}>
                    立即安排
                  </button>
                  <button
                    onClick={() => alert('ℹ️ 已記錄提醒。\n\n系統將在 7 天後再次通知您安排保養。')}
                    className="flex-1 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-2xl py-3 font-bold transition-all active:scale-95" style={{ fontSize: '14px' }}>
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
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-center shadow-xl">
              <div className="text-white/60 mb-1" style={{ fontSize: '12px' }}>一般定時</div>
              <div className="font-bold" style={{ fontSize: '22px' }}>
                <span className="text-[#D4AF37]">2</span>
                <span className="text-white/40" style={{ fontSize: '13px' }}> / 8 組</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-center shadow-xl">
              <div className="text-white/60 mb-1" style={{ fontSize: '12px' }}>週期排程</div>
              <div className="font-bold" style={{ fontSize: '22px' }}>
                <span className="text-[#D4AF37]">14</span>
                <span className="text-white/40" style={{ fontSize: '13px' }}> / 42 組</span>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule List */}
        <div className="mb-6 space-y-3">
          {scheduleItems.map((item, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold" style={{ fontSize: '15px' }}>{item.day}</div>
                <div className="text-white/50 mt-1" style={{ fontSize: '13px' }}>
                  [{item.mode}] {item.temp} &nbsp;風量：{item.fan}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => setScheduleToggles(prev => prev.map((v, i) => i === idx ? !v : v))}
                  className={`w-12 h-6 rounded-full transition-all ${scheduleToggles[idx] ? 'bg-[#2ECF8F]' : 'bg-white/20'}`}
                >
                  <div className={`w-5 h-5 mt-0.5 rounded-full bg-white transition-all shadow ${scheduleToggles[idx] ? 'ml-6' : 'ml-0.5'}`}></div>
                </button>
                <button
                  onClick={() => setScheduleItems(prev => prev.filter((_, i) => i !== idx))}
                  className="text-red-400 hover:text-red-300 transition-colors"
                  style={{ fontSize: '18px' }}
                >
                  🗑️
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
            className="w-full bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-dashed border-white/30 rounded-2xl py-4 text-white/60 font-bold transition-all active:scale-95"
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
      {/* Repair Modal */}
      {showRepairModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowRepairModal(false)}>
          <div
            className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/20 rounded-3xl p-6 mx-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 border border-red-400/40 rounded-full flex items-center justify-center">
                <span style={{ fontSize: '20px' }}>🔧</span>
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
                onClick={() => { setShowRepairModal(false); alert('✅ 報修申請已送出！\n\n工單編號：MR-2026-0602\n預計 2 個工作天內回覆。'); }}
                className="flex-1 bg-red-500/80 hover:bg-red-500 text-white rounded-2xl py-3 font-bold transition-all active:scale-95"
                style={{ fontSize: '14px' }}
              >
                確認送出報修
              </button>
              <button
                onClick={() => setShowRepairModal(false)}
                className="flex-1 bg-white/10 hover:bg-white/15 text-white rounded-2xl py-3 font-bold transition-all active:scale-95"
                style={{ fontSize: '14px' }}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mold Prevention Modal */}
      {showMoldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowMoldModal(false)}>
          <div
            className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/20 rounded-3xl p-6 mx-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-400/40 rounded-full flex items-center justify-center">
                <span style={{ fontSize: '20px' }}>🧴</span>
              </div>
              <div>
                <div className="text-white font-bold" style={{ fontSize: '16px' }}>防霉保養啟動</div>
                <div className="text-white/50" style={{ fontSize: '12px' }}>AI 自動偵測潮濕風險，建議立即執行</div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
              <div className="text-white/70 mb-3" style={{ fontSize: '13px' }}>保養項目</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="text-white" style={{ fontSize: '14px' }}>高溫乾燥循環 (30 分鐘)</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="text-white" style={{ fontSize: '14px' }}>抑菌風道清潔</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <span className="text-white" style={{ fontSize: '14px' }}>建議配合濾網清潔</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowMoldModal(false); alert('✅ 防霉保養已啟動！\n\n預計執行時間：30 分鐘\n完成後將自動通知您。'); }}
                className="flex-1 bg-emerald-500/80 hover:bg-emerald-500 text-white rounded-2xl py-3 font-bold transition-all active:scale-95"
                style={{ fontSize: '14px' }}
              >
                立即啟動
              </button>
              <button
                onClick={() => setShowMoldModal(false)}
                className="flex-1 bg-white/10 hover:bg-white/15 text-white rounded-2xl py-3 font-bold transition-all active:scale-95"
                style={{ fontSize: '14px' }}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Schedule Modal */}
      {showAddSchedule && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddSchedule(false)}>
          <div
            className="w-full max-w-[454px] bg-gradient-to-b from-gray-900 to-gray-950 border-t border-white/20 rounded-t-3xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5"></div>

            <div className="flex items-center justify-between mb-5">
              <div className="text-white font-bold" style={{ fontSize: '17px' }}>📅 新增排程</div>
              <button onClick={() => setShowAddSchedule(false)} className="text-white/40 hover:text-white/70 transition-colors" style={{ fontSize: '24px' }}>×</button>
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

            {/* Confirm */}
            <button
              onClick={handleAddSchedule}
              disabled={newScheduleDays.length === 0}
              className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 ${newScheduleDays.length > 0 ? 'bg-[#D4AF37]/80 hover:bg-[#D4AF37] text-white' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
              style={{ fontSize: '15px' }}
            >
              確認新增
            </button>
          </div>
        </div>
      )}

      {/* Phone Mockup Frame - Space Gray */}
      <div className="relative">
        {/* Phone Outer Frame */}
        <div className="relative w-[454px] h-[956px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-[60px] p-3 shadow-2xl">
          {/* Screen Bezel */}
          <div
            className="relative w-full h-full rounded-[48px] overflow-hidden flex flex-col border-4 border-gray-900"
            style={{
              background: 'radial-gradient(ellipse at top, #0D1B3E 0%, #050A15 100%)'
            }}
          >

            {/* Dynamic Island Space */}
            <div className="h-12 flex items-center justify-center">
              <div className="w-32 h-9 bg-black rounded-full"></div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 pb-32">

              {/* Top Bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <img src={airmonLogo} alt="AIRMON" className="h-5 object-contain" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Signal className="w-3.5 h-3.5 text-[#2ECF8F]" />
                    <span className="text-white/60" style={{ fontSize: '10px' }}>-48 dBm</span>
                  </div>
                  <div className="px-3 py-1.5 bg-red-500/20 border border-red-400/30 rounded-full flex items-center gap-1.5 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-red-300 font-bold" style={{ fontSize: '11px' }}>E1 故障預警</span>
                  </div>
                </div>
              </div>

              {/* Hero Banner */}
              <div className="mb-6">
                <div className="relative">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-[#D4AF37]/20 blur-2xl rounded-3xl"></div>

                  <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Shield className="w-6 h-6 text-[#2ECF8F]" />
                        <div className="text-white font-bold" style={{ fontSize: '18px' }}>AIRGUARD 智慧守護中</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white/60" style={{ fontSize: '13px' }}>健康分數</div>
                        <div className="text-[#D4AF37] font-bold" style={{ fontSize: '32px' }}>92</div>
                      </div>
                    </div>

                    <button onClick={() => setActiveTab('guard')} className="w-full bg-gradient-to-r from-[#D4AF37]/80 to-[#B8941F]/80 hover:from-[#D4AF37] hover:to-[#B8941F] text-white rounded-2xl py-4 font-bold transition-all shadow-lg shadow-[#D4AF37]/30 active:scale-95" style={{ fontSize: '16px' }}>
                      ▶ 展演選單 (Executive Demo)
                    </button>
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              {renderTabContent()}

            </div>

            {/* Bottom Navigation */}
            <div className="absolute bottom-0 left-0 right-0 pb-8">
              <div className="mx-5 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl">
                <div className="grid grid-cols-3 p-3">
                  <button
                    onClick={() => setActiveTab('remote')}
                    className={`flex flex-col items-center gap-2 py-4 rounded-2xl transition-all active:scale-95 ${
                      activeTab === 'remote'
                        ? 'bg-[#D4AF37]/20'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <Smartphone className={`w-7 h-7 ${activeTab === 'remote' ? 'text-[#D4AF37]' : 'text-white/60'}`} strokeWidth={2.5} />
                    <span className={`font-bold ${activeTab === 'remote' ? 'text-[#D4AF37]' : 'text-white/60'}`} style={{ fontSize: '13px' }}>
                      📱 遙控器
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('guard')}
                    className={`flex flex-col items-center gap-2 py-4 rounded-2xl transition-all active:scale-95 ${
                      activeTab === 'guard'
                        ? 'bg-[#D4AF37]/20'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <Shield className={`w-7 h-7 ${activeTab === 'guard' ? 'text-[#D4AF37]' : 'text-white/60'}`} strokeWidth={2.5} />
                    <span className={`font-bold ${activeTab === 'guard' ? 'text-[#D4AF37]' : 'text-white/60'}`} style={{ fontSize: '13px' }}>
                      🛡️ 防護中心
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex flex-col items-center gap-2 py-4 rounded-2xl transition-all active:scale-95 ${
                      activeTab === 'dashboard'
                        ? 'bg-[#D4AF37]/20'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <BarChart3 className={`w-7 h-7 ${activeTab === 'dashboard' ? 'text-[#D4AF37]' : 'text-white/60'}`} strokeWidth={2.5} />
                    <span className={`font-bold ${activeTab === 'dashboard' ? 'text-[#D4AF37]' : 'text-white/60'}`} style={{ fontSize: '13px' }}>
                      📊 儀表板
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