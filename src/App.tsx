import React, { useState, useEffect, useMemo } from "react";
import { 
  Building, 
  Coins, 
  TrendingUp, 
  Info, 
  AlertCircle, 
  CalendarDays, 
  Sparkles, 
  HelpCircle, 
  RefreshCw, 
  BookOpen, 
  Settings, 
  Heart, 
  ArrowRight, 
  Check, 
  Clock, 
  Calculator as CalcIcon,
  Smile, 
  Sliders, 
  UserPlus 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CalculatorInput, CalculatorResult, AmortizationRow, CharacterId } from "./types";
import { CHARACTERS } from "./characters";

export default function App() {
  // Input states
  const [totalAmountInput, setTotalAmountInput] = useState<string>("12000");
  const [downPaymentInput, setDownPaymentInput] = useState<string>("2000");
  const [periodInput, setPeriodInput] = useState<number>(12);
  const [customPeriod, setCustomPeriod] = useState<string>("");
  const [isCustomPeriodActive, setIsCustomPeriodActive] = useState<boolean>(false);
  
  // Theme and dialogue states
  const [selectedCharId, setSelectedCharId] = useState<CharacterId>("gardener");
  const [lastCalculationSparkle, setLastCalculationSparkle] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Active character profile
  const character = useMemo(() => {
    return CHARACTERS.find((c) => c.id === selectedCharId) || CHARACTERS[0];
  }, [selectedCharId]);

  // Raw numeric conversions
  const totalAmount = parseFloat(totalAmountInput) || 0;
  const downPayment = parseFloat(downPaymentInput) || 0;
  
  // 1. Validation and correction rules in real-time
  useEffect(() => {
    let error: string | null = null;
    
    if (isNaN(totalAmount) || totalAmount < 0) {
      error = "总金额不能为负数或空值噢";
    } else if (isNaN(downPayment) || downPayment < 0) {
      error = "首付金额不能为负数或空值噢";
    } else if (downPayment > totalAmount) {
      error = "首付金额不能大于商品总金额哦！首付已调整为跟总额相等。";
    } else if (periodInput <= 0) {
      error = "分期期数必须是大于 0 的正整数哦";
    } else if (periodInput > 360) {
      error = "建议分期数不要超过360期 (30年) 喔！";
    }
    
    setErrorMessage(error);
  }, [totalAmount, downPayment, periodInput]);

  // Clean values for calculations
  const validatedTotal = Math.max(0, totalAmount);
  const validatedDown = Math.min(validatedTotal, Math.max(0, downPayment));
  const remainingPrincipal = Math.max(0, validatedTotal - validatedDown);
  const period = Math.max(1, periodInput);

  // 2. core calculation logic (Service fee rule: flat fee of 0.035 multiplier per term on remainingPrincipal)
  const serviceFeePerTerm = remainingPrincipal * 0.035;
  const serviceFee = serviceFeePerTerm * period;
  const totalRepayment = remainingPrincipal + serviceFee;
  const perTermPayment = (remainingPrincipal / period) + serviceFeePerTerm;

  // Real-time voice dialog bubble based on calculation status
  const characterBubbleText = useMemo(() => {
    if (errorMessage) {
      return character.getWarningQuote(errorMessage);
    }
    return character.getGeneralQuote(remainingPrincipal, perTermPayment);
  }, [errorMessage, character, remainingPrincipal, perTermPayment]);

  // 3. Down payment quick percentages
  const handleDownPercent = (percent: number) => {
    const calculatedDown = validatedTotal * percent;
    setDownPaymentInput(calculatedDown.toFixed(1));
    triggerSparkle();
  };

  // 4. Period selectors (Preset buttons)
  const handlePresetPeriod = (p: number) => {
    setIsCustomPeriodActive(false);
    setPeriodInput(p);
    triggerSparkle();
  };

  // 5. Custom period input validation
  const handleCustomPeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, ""); // only digits
    setCustomPeriod(val);
    if (val) {
      const parsed = parseInt(val, 10);
      setPeriodInput(parsed > 0 ? parsed : 12);
    }
  };

  // Trigger brief visual sparkle/recalculate animation effect
  const triggerSparkle = () => {
    setLastCalculationSparkle(true);
    setTimeout(() => setLastCalculationSparkle(false), 800);
  };

  // One-click manual recalculate backup
  const handleManualCalculate = () => {
    // Sanitize any out of limit values on click
    if (downPayment > totalAmount) {
      setDownPaymentInput(totalAmountInput);
    }
    triggerSparkle();
  };

  // Amortization Schedule Calculations
  const amortizationData = useMemo<AmortizationRow[]>(() => {
    if (period <= 0) return [];
    
    const rows: AmortizationRow[] = [];
    const principalPerMonth = remainingPrincipal / period;
    const feePerMonth = serviceFeePerTerm;
    const totalDuePerMonth = perTermPayment;
    
    let currentBalance = totalRepayment;
    
    for (let i = 1; i <= period; i++) {
      currentBalance = Math.max(0, currentBalance - totalDuePerMonth);
      rows.push({
        termNumber: i,
        principalPayable: principalPerMonth,
        serviceFeePayable: feePerMonth,
        totalTermPayable: totalDuePerMonth,
        remainingTermBalance: currentBalance
      });
    }
    return rows;
  }, [remainingPrincipal, serviceFeePerTerm, perTermPayment, period, totalRepayment]);

  return (
    <div className="min-h-screen bg-[#FAF7CD] text-slate-800 flex flex-col font-sans relative overflow-x-hidden selection:bg-amber-400 selection:text-amber-950">
      
      {/* Dynamic Ambient Blur Background based on warm cream aesthetics */}
      <div className="absolute top-0 left-0 right-0 h-[500px] overflow-hidden pointer-events-none">
        <div className="absolute top-[-25%] left-[5%] w-[50vw] h-[50vw] rounded-full blur-[130px] opacity-40 bg-amber-200 transition-all duration-1000" />
        <div className="absolute top-[-10%] right-[10%] w-[40vw] h-[40vw] rounded-full blur-[110px] opacity-35 bg-yellow-200 transition-all duration-1000" />
      </div>

      {/* Decorative top mini notice line */}
      <div className="bg-amber-50 border-b border-amber-100 text-xs text-amber-800 py-2.5 px-4 flex justify-between items-center z-10 font-medium">
        <div className="flex items-center gap-1.5 font-mono">
          <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>亦岁岁年年 专属财务卫士</span>
          <span className="text-amber-200">|</span>
          <span className="text-amber-700 select-none">单期 3.5% 固定庄园服务费</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          <span>温润金黄版 · 智能计算器已就绪</span>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 z-10 flex flex-col gap-6">
        
        {/* BIG LOGO: 亦岁岁年年 Prominent Brand Logo */}
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 p-6 md:p-10 rounded-2xl border-2 border-dashed border-amber-600 text-amber-950 shadow-xl flex flex-col items-center text-center justify-center gap-3" style={{ boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.15)' }}>
          {/* Floating cute warm elements inside the banner */}
          <div className="absolute inset-0 opacity-20 pointer-events-none flex justify-around items-center">
            <span className="text-3xl animate-bounce" style={{ animationDelay: '0.1s' }}>🌻</span>
            <span className="text-2xl animate-pulse" style={{ animationDelay: '1s' }}>🌻</span>
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0.7s' }}>🌻</span>
            <span className="text-2xl animate-pulse" style={{ animationDelay: '1.9s' }}>🌻</span>
            <span className="text-3xl animate-bounce" style={{ animationDelay: '1.3s' }}>🌻</span>
          </div>
          
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white/45 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold tracking-widest border border-amber-300/40 uppercase text-amber-900 shadow-sm">
              ✨ 亦 岁 岁 年 年 · 庄 园 特 供 版 ✨
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-widest text-amber-950 drop-shadow-[0_2px_4px_rgba(245,158,11,0.2)] py-1.5 flex items-center justify-center gap-3">
              🌻 亦岁岁年年 🌻
            </h1>
            
            <p className="text-sm md:text-base text-amber-900 font-medium max-w-2xl leading-relaxed">
              岁岁欢愉，年年称意。结合第五人格精美角色管家，为您理清任意项目分期账目。
              <span className="block mt-1 text-xs text-amber-950/90 font-bold">（每期固定计算 3.5% 服务费，而并非平均分摊，保障每一期费用透明）</span>
            </p>
          </div>
        </div>

        {/* Header Hero Board */}
        <header id="manor_header_panel" className="bg-white border border-amber-100 rounded-2xl p-5 md:p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50/40 rounded-full border border-amber-100 translate-x-12 -translate-y-12"></div>
          
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-widest text-amber-700 bg-amber-50 border border-amber-200 rounded-full font-bold">
                Identity V Cute Style
              </span>
              <span className="px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-widest text-teal-600 bg-teal-50 border border-teal-200 rounded-full font-bold">
                全自动联动计算
              </span>
            </div>
            
            <h2 className="text-2xl font-display font-bold text-amber-950 flex items-center gap-2">
              <CalcIcon className="w-6 h-6 text-amber-500 shrink-0" />
              <span>庄园分期明细对账工具</span>
            </h2>
            
            <p className="text-xs text-slate-500">
              这里是属于您的无感联动记账台。您可以随意修改商品总价、首付款，系统将瞬间更新您每期需支付的回声总额！
            </p>
          </div>

          {/* Quick Character Picker Grid */}
          <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100 shrink-0">
            <h3 className="text-xs text-amber-800 mb-2.5 text-center sm:text-left font-bold">
              请点击切换您专属的庄园助手:
            </h3>
            
            <div className="flex gap-2.5 justify-center">
              {CHARACTERS.map((char) => {
                const isSelected = char.id === selectedCharId;
                return (
                  <button
                    key={char.id}
                    onClick={() => {
                      setSelectedCharId(char.id);
                      triggerSparkle();
                    }}
                    className={`relative p-2 rounded-lg flex flex-col items-center gap-1 transition-all text-xs border w-[82px] ${
                      isSelected
                        ? "bg-white border-amber-500 text-amber-900 shadow-md ring-1 ring-amber-500/20"
                        : "bg-white/80 hover:bg-white border-amber-100 text-slate-500"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-amber-100 flex items-center justify-center border-2 border-amber-200">
                      <img
                        src={char.imagePath}
                        alt={char.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover scale-110"
                      />
                    </div>
                    <span className="font-bold text-[10px] truncate w-full text-center">{char.name.split(" ")[0]}</span>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 flex items-center justify-center text-white text-[9px] font-bold">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Chibi Character Animation Dialogue Panel */}
        <section className={`rounded-xl p-4 md:p-5 border-2 border-dashed transition-all duration-300 flex flex-col md:flex-row items-center gap-5 ${character.bgColor} ${character.borderColor}`}>
          
          {/* Bobbing animated character container */}
          <div 
            onClick={triggerSparkle}
            className="cursor-pointer select-none shrink-0 border-stitched p-1.5 rounded-full group bg-white max-w-[120px] max-h-[120px]"
            title="戳戳我触发小火花！"
            style={{ color: '#d97706' }}
          >
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-amber-50 flex items-center justify-center border border-amber-200">
              <img
                src={character.imagePath}
                alt={character.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover scale-115 group-hover:scale-125 transition-transform duration-300 animate-bob"
              />
              <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
              </div>
            </div>
          </div>

          {/* Interactive Dialog Bubble */}
          <div className="flex-1 space-y-2 relative w-full">
            <div className="text-xs uppercase font-bold tracking-wider text-amber-950 flex items-center gap-1.5">
              <span>{character.name}</span>
              <span className="opacity-40">/</span>
              <span>{character.jpName}</span>
              <span className="text-[9px] py-0.5 px-2 rounded-full font-bold tracking-normal bg-amber-500 text-white">
                {character.role.split("，")[0]}
              </span>
            </div>
            
            {/* The actual text prompt dialog bubble styling */}
            <div className="relative bg-white text-slate-700 p-4 rounded-xl border border-amber-200 shadow-sm text-sm leading-relaxed before:content-[''] before:absolute before:-top-3 before:left-14 before:md:-left-3 before:md:top-6 before:border-8 before:border-transparent before:border-b-white before:md:border-b-transparent before:md:border-r-white">
              <p className="min-h-[30px] flex items-center font-medium text-slate-800">
                {characterBubbleText}
              </p>
            </div>
            
            <p className="text-[10px] text-amber-600 font-medium pl-1">
              *提示：在下方修改参数，庄园助手的意见将实时刷新，随时可以使用一键刷新计算。
            </p>
          </div>
        </section>

        {/* Core Calculation Dual Column Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Form & Inputs Area (lg:col-span-7) */}
          <div id="calculator_input_group" className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-amber-100 rounded-2xl p-5 md:p-6 shadow-md space-y-6">
              
              <div className="flex justify-between items-center border-b border-amber-100 pb-3">
                <h3 className="text-base font-bold text-amber-900 flex items-center gap-2">
                  <Sliders className="w-4.5 h-4.5 text-amber-500" />
                  <span>账单配置组合 (1. 输入区)</span>
                </h3>
                <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  自动联动开启
                </span>
              </div>

              {/* Item Total Value Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    总金额 & 商品价值 (元)
                  </label>
                  <span className="text-xs text-slate-400">
                    例如：商品或回声礼包购买价
                  </span>
                </div>
                
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-600 font-bold font-mono">
                    ¥
                  </div>
                  <input
                    type="number"
                    value={totalAmountInput}
                    onChange={(e) => {
                      setTotalAmountInput(e.target.value);
                      triggerSparkle();
                    }}
                    placeholder="输入项目总价"
                    className="w-full pl-7 pr-4 py-3 bg-amber-50/30 border border-amber-200 rounded-lg text-amber-950 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all text-lg"
                    min="0"
                  />
                </div>
              </div>

              {/* Down Payment & Sliders */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    首付金额 (元)
                  </label>
                  <span className="text-xs text-amber-700 font-mono font-bold">
                    占比: {validatedTotal > 0 ? ((validatedDown / validatedTotal) * 100).toFixed(0) : 0}%
                  </span>
                </div>

                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-600 font-bold font-mono">
                    ¥
                  </div>
                  <input
                    type="number"
                    value={downPaymentInput}
                    onChange={(e) => {
                      setDownPaymentInput(e.target.value);
                      triggerSparkle();
                    }}
                    placeholder="不付首付款填 0"
                    className="w-full pl-7 pr-4 py-3 bg-amber-50/30 border border-amber-200 rounded-lg text-amber-950 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all text-lg"
                    min="0"
                  />
                </div>

                {/* Percentage Shortcuts Selector Grid */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-800 block">快捷首付成数一键设定：</span>
                  <div className="grid grid-cols-4 gap-2 text-xs font-bold">
                    {[0.35, 0.40, 0.45, 0.50].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handleDownPercent(pct)}
                        className="py-2.5 rounded-lg bg-amber-50/50 hover:bg-amber-100/70 border border-amber-200 flex flex-col items-center gap-1 text-amber-900 active:scale-95 transition-all text-center justify-center shadow-sm"
                      >
                        <span className="text-sm font-extrabold text-amber-800">{pct * 100}%</span>
                        <span className="text-[10px] text-amber-650 font-medium font-sans">
                          {pct === 0.5 ? "首付半款" : "精选首付"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Locked Core Field: Remaining Principal */}
              <div className="p-3.5 bg-amber-50/50 border border-dashed border-amber-200 rounded-lg flex justify-between items-center shadow-inner">
                <div className="space-y-0.5">
                  <span className="text-xs text-amber-800 block font-bold">
                    剩余款项 (首付后贷款本金)
                  </span>
                  <span className="text-[10px] text-amber-600 block font-medium">
                    由本系统自动计算：商品总价 - 已付首付
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-amber-500 font-bold">不可编辑</span>
                  <div className="text-xl font-extrabold font-mono text-amber-950">
                    ¥ {remainingPrincipal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Installment Term Selection with toggleable Custom Stepper */}
              <div className="space-y-3.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    剩余款项期数 (月)
                  </label>
                  <span className="text-xs text-amber-700 font-bold">
                    当前: <span className="font-extrabold text-amber-800 font-mono text-sm">{period}</span> 期 (期)
                  </span>
                </div>

                {/* Switcher Option Toggles */}
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomPeriodActive(false);
                      setPeriodInput(12);
                      triggerSparkle();
                    }}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      !isCustomPeriodActive 
                        ? "bg-amber-500 border-amber-500 text-white shadow-sm" 
                        : "bg-white border-amber-100 text-amber-700"
                    }`}
                  >
                    常用预设期数 (快捷)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomPeriodActive(true);
                      triggerSparkle();
                    }}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      isCustomPeriodActive 
                        ? "bg-amber-500 border-amber-500 text-white shadow-sm" 
                        : "bg-white border-amber-100 text-amber-700"
                    }`}
                  >
                    自定义期数 (正整数)
                  </button>
                </div>

                {/* Predefined values buttons (if not active, else custom field) */}
                <div className="relative">
                  <AnimatePresence mode="wait">
                    {!isCustomPeriodActive ? (
                      <motion.div
                        key="preset-row animate"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.12 }}
                        className="grid grid-cols-4 gap-2"
                      >
                        {[3, 6, 12, 24].map((p) => {
                          const isActive = periodInput === p;
                          return (
                            <button
                              key={p}
                              type="button"
                              onClick={() => handlePresetPeriod(p)}
                              className={`py-2 rounded-lg border font-mono font-bold transition-all ${
                                isActive
                                  ? "bg-amber-100 text-amber-900 border-amber-400 shadow-sm scale-[1.03] font-black"
                                  : "bg-white border-amber-100 text-slate-500 hover:border-amber-300"
                              }`}
                            >
                              {p} 期
                            </button>
                          );
                        })}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="custom-row animate"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.12 }}
                        className="flex gap-2 items-center"
                      >
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={customPeriod}
                            onChange={handleCustomPeriodChange}
                            placeholder="请输入 1 - 360"
                            className="w-full px-4 py-2 bg-amber-50/10 border border-amber-200 rounded-lg text-amber-950 font-semibold font-mono text-center focus:outline-none focus:ring-1 focus:ring-amber-400"
                          />
                          <span className="absolute right-3.5 top-2 text-xs text-amber-500 font-bold font-mono">
                            期
                          </span>
                        </div>
                        
                        {/* Stepper utility icons +/- */}
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              const curr = Math.max(1, periodInput - 1);
                              setPeriodInput(curr);
                              setCustomPeriod(curr.toString());
                              triggerSparkle();
                            }}
                            className="w-9 h-9 rounded-lg bg-white border border-amber-200 flex items-center justify-center font-bold text-amber-600 hover:bg-amber-50"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const curr = Math.min(360, periodInput + 1);
                              setPeriodInput(curr);
                              setCustomPeriod(curr.toString());
                              triggerSparkle();
                            }}
                            className="w-9 h-9 rounded-lg bg-white border border-amber-200 flex items-center justify-center font-bold text-amber-600 hover:bg-amber-50"
                          >
                            +
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Dynamic Error Status Alerts */}
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex gap-3 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <div>
                    <span className="font-bold text-rose-900">提醒：</span>
                    {errorMessage}
                  </div>
                </div>
              )}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 font-semibold text-sm">
                <button
                  type="button"
                  onClick={handleManualCalculate}
                  className="flex-1 py-3 px-5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-amber-950 cursor-pointer active:scale-95 shadow-md"
                >
                  <RefreshCw className={`w-4 h-4 ${lastCalculationSparkle ? "animate-spin" : ""}`} />
                  <span>一键计算 (重新拉取庄园测算)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTotalAmountInput("12000");
                    setDownPaymentInput("2000");
                    setPeriodInput(12);
                    setIsCustomPeriodActive(false);
                    setCustomPeriod("");
                    triggerSparkle();
                  }}
                  className="py-3 px-4 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors border border-amber-200 text-xs text-center font-bold"
                >
                  重置默认参数
                </button>
              </div>

            </div>

            {/* Core Calculations Rules Explainer Board */}
            <div className="bg-amber-50/75 p-4 md:p-5 rounded-2xl border border-amber-100 text-xs text-amber-900 space-y-3 shadow-sm">
              <h3 className="font-bold text-amber-900 flex items-center gap-1.5 text-sm">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>亦岁岁年年 庄园金融指南</span>
              </h3>
              
              <ul className="space-y-2.5 list-disc list-inside text-amber-950 font-medium leading-relaxed">
                <li>
                  <span className="font-bold">服务费自动核算：</span>
                  本系统固定 <span className="font-bold">每一期</span> 产生的服务费均为首付后“剩余本金”乘以系数 <span className="font-mono text-amber-600 font-extrabold">3.5% (或0.035)</span>，简单直接且保障每期费率一致。
                </li>
                <li>
                  <span className="font-bold">每期还款公式：</span>
                  <code className="bg-white/80 py-0.5 px-1.5 rounded text-amber-700 border border-amber-100 font-mono font-bold">
                    (剩余本金 ÷ 期数) + 每期服务费 (本金 × 3.5%)
                  </code>
                </li>
                <li>
                  <span className="font-bold">全部应付金额：</span>
                  <code className="bg-white/80 py-0.5 px-1.5 rounded text-amber-700 border border-amber-100 font-mono font-bold">
                    剩余本金 + (每期服务费 × 分期期数)
                  </code>
                </li>
              </ul>
              <div className="bg-white/90 p-3 rounded-lg border border-amber-100/50 text-[11px] text-amber-600 leading-snug font-medium">
                财务提醒：岁岁平安胜过利息堆叠。本页提供实时的自动联动算期，所有计算和提示均基于离线浏览器内存处理，确保您的数据零留存极佳。
              </div>
            </div>

          </div>

          {/* Right Column: Calculations Result Areas & Detailed Scrollable Progress (lg:col-span-5) */}
          <div id="calculator_results_panel" className="lg:col-span-5 space-y-6">
            
            <div className="bg-white border border-amber-100 rounded-2xl p-5 md:p-6 shadow-md relative overflow-hidden space-y-6">
              
              {/* Highlight Sparkle Background on recalculation */}
              {lastCalculationSparkle && (
                <div className="absolute inset-0 bg-amber-500/5 animate-pulse pointer-events-none z-0" />
              )}
              
              <div className="flex justify-between items-center border-b border-amber-100 pb-3 relative z-10">
                <h3 className="text-base font-bold text-amber-900 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-500 animate-pulse" />
                  <span>计算报告 (2. 结果区)</span>
                </h3>
                
                <span className="text-[10px] text-amber-700 font-bold font-mono bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  费率: 3.5%
                </span>
              </div>

              {/* Huge Highlight Core Variable: Per Terms Repayment */}
              <div className="space-y-1 text-center bg-amber-50/50 py-5 px-4 rounded-xl border border-amber-100 relative z-10">
                
                <span className="text-xs text-amber-800 block font-bold uppercase tracking-wider">
                  ★ 每期应还金额 ★
                </span>
                
                <div className="pt-1.5 select-all font-mono font-extrabold text-amber-600 tracking-tight text-3xl md:text-4xl">
                  ¥ {perTermPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>

                <p className="text-xs text-amber-700 font-semibold">
                  总共还款期数: <span className="font-extrabold text-amber-800 font-mono">{period}</span> 期
                </p>
              </div>

              {/* Detailed Breakdown variables */}
              <div className="space-y-3.5 relative z-10">
                
                <div className="flex justify-between items-center bg-amber-50/20 p-3 rounded-lg border border-amber-100/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                    <span className="text-xs text-slate-600 font-semibold">每期独立服务费 (3.5%)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold font-mono text-amber-600">
                      ¥ {serviceFeePerTerm.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      分期总计服务费 ¥{serviceFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (共{period}期)
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-amber-50/20 p-3 rounded-lg border border-amber-100/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                    <span className="text-xs text-slate-600 font-semibold">欲贷剩余本金</span>
                  </div>
                  <span className="text-sm font-extrabold font-mono text-slate-800">
                    ¥ {remainingPrincipal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-amber-100/30 p-3 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></div>
                    <span className="text-xs text-amber-900 font-bold">总应还本息和</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold font-mono text-amber-600">
                      ¥ {totalRepayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-amber-600 block font-bold">
                      本金 + 服务费
                    </span>
                  </div>
                </div>

              </div>

              {/* Dynamic Health Advisor Rating badge */}
              <div className="p-3 rounded-lg border bg-amber-50/10 border-amber-200 text-xs flex gap-3 relative z-10 text-amber-950 font-medium">
                <div className="h-5 w-5 bg-amber-500/15 rounded-full flex items-center justify-center text-amber-600 shrink-0 select-none font-bold">
                  ★
                </div>
                <div>
                  <span className="font-bold text-amber-950">分期负担指数评估：</span>
                  {perTermPayment > 5000 ? (
                    <span className="text-rose-600 font-extrabold">高压力档 (注意庄园预警 ⚠️)</span>
                  ) : perTermPayment > 1000 ? (
                    <span className="text-amber-600 font-extrabold">中等消费档 (健康周转 ✨)</span>
                  ) : perTermPayment > 0 ? (
                    <span className="text-emerald-600 font-extrabold">无忧安全岛 (轻松消化 🌻)</span>
                  ) : (
                    <span className="text-slate-500">还请设置符合条件的本金。</span>
                  )}
                </div>
              </div>

            </div>

            {/* Comprehensive Amortization Table Schedule Panel */}
            <div className="bg-white border border-amber-100 rounded-2xl p-5 md:p-6 shadow-md space-y-4">
              
              <div className="flex justify-between items-center border-b border-amber-100 pb-3">
                <h3 className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                  <CalendarDays className="w-4.5 h-4.5 text-amber-500" />
                  <span>还款回声进度预测表</span>
                </h3>
                
                <span className="text-[11px] font-mono text-amber-650 font-extrabold">
                  按期划扣 (每期固定服务费, 共{period}期)
                </span>
              </div>

              {/* Scrollable list of months */}
              <div className="overflow-y-auto max-h-72 border border-amber-200 rounded-lg bg-amber-50/10">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-amber-50 text-amber-900 font-mono border-b border-amber-100 sticky top-0 font-bold">
                    <tr>
                      <th className="py-2.5 px-3 text-center w-12 border-r border-amber-100">期数</th>
                      <th className="py-2.5 px-2">当期应还金额</th>
                      <th className="py-2.5 px-2 hidden sm:table-cell">每期 (本金 + 固定服务费)</th>
                      <th className="py-2.5 px-3 text-right">剩余账单本息</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100/50 font-mono text-[11px] text-slate-700">
                    {amortizationData.map((row) => (
                      <tr 
                        key={row.termNumber}
                        className="hover:bg-amber-100/30 transition-colors"
                      >
                        <td className="py-2.5 px-3 text-center text-amber-700 font-bold border-r border-amber-100">
                          {row.termNumber}
                        </td>
                        <td className="py-2.5 px-2 font-bold text-slate-900">
                          ¥{row.totalTermPayable.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-2 text-slate-500 hidden sm:table-cell">
                          ¥{row.principalPayable.toFixed(1)} + ¥{row.serviceFeePayable.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-amber-600 font-bold">
                          ¥{row.remainingTermBalance.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    
                    {amortizationData.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-500 italic">
                          请先在左边配置并输入商品总计。
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <p className="text-[10px] text-amber-500 text-right italic font-medium">
                *每期服务费固定为首付后剩余本金的 3.5%，本金按期平摊，确保透明。
              </p>

            </div>

          </div>

        </div>

      </main>

      {/* Footer copyright */}
      <footer className="bg-white/80 border-t border-amber-200 py-6 px-4 text-center mt-12 z-10 text-xs text-amber-700 space-y-1 font-semibold">
        <p className="font-mono">
          亦岁岁年年 暖心信贷与分期对账系统 &copy; {new Date().getFullYear()}
        </p>
        <p className="text-[11px] text-amber-600 font-medium font-sans">
          数据仅用于辅助分析，无外部网络上送。愿亦岁岁年年常伴、温暖每一天。🌻
        </p>
      </footer>
    </div>
  );
}
