import { CharacterConfig } from "./types";

export const CHARACTERS: CharacterConfig[] = [
  {
    id: "gardener",
    name: "园丁 (艾玛·伍兹)",
    jpName: "Emma Woods",
    role: "庄园里的开心果，擅长用稻草和鲜花安慰心灵。",
    imagePath: "/src/assets/images/gardener_chibi_1779960739295.png",
    accentColor: "from-amber-400 to-amber-600",
    bgColor: "bg-amber-50/90",
    borderColor: "border-amber-200",
    textColor: "text-amber-800",
    btnBg: "bg-amber-500 hover:bg-amber-600 text-white",
    getGeneralQuote: (total, monthly) => {
      if (total === 0) return "今天的庄园好安静呀！悄悄告诉你，按比例做分期规划，钱包就能像小花盆一样装满金币哦~ 🌻";
      if (monthly > 5000) return "哇……每月的款项好多呀！就像要修剪一大片杂乱的荆棘灌木一样，我们要加倍努力浇水啦！别担心，艾玛会一直陪着你的！🩹";
      if (monthly > 1000) return "唔，这个数字正好！每个月存起这么一小笔，就像在庄园里种下一颗香香的种子，到期了就能收获快乐！✨";
      return "好棒！每期只要一点点，比艾玛买稻草做草帽还轻松呢~ 🌾";
    },
    getWarningQuote: (message) => {
      return `哎呀！艾玛的园艺剪刀好像被卡住了：${message}。快检查一下参数是不是填错啦？🧶`;
    }
  },
  {
    id: "seer",
    name: "先知 (伊莱·克拉克)",
    jpName: "Eli Clark",
    role: "洞悉未来的占卜师，由役鸟指引着命运的轨迹。",
    imagePath: "/src/assets/images/seer_chibi_1779960759188.png",
    accentColor: "from-indigo-500 to-indigo-750",
    bgColor: "bg-indigo-50/90",
    borderColor: "border-indigo-200",
    textColor: "text-indigo-850",
    btnBg: "bg-indigo-600 hover:bg-indigo-750 text-white",
    getGeneralQuote: (total, monthly) => {
      if (total === 0) return "役鸟轻拂羽翼，在未来的画卷中，我看清了你明智的财富规划。请说出你心中的数目……🔮";
      if (monthly > 5000) return "不可忽视的沉重预示……每期应还款项较高，如夜幕般笼罩。建议在圣餐来临前做好严格的储备计划。🦉";
      if (monthly > 1000) return "星轨流转，月相平和。这是一个平稳的契约，在你的承受范围之内，未来的道路一切安好。🌟";
      return "役鸟衔来了轻盈的小麦。这一缕契约的负荷非常微弱，完全不会干扰到你的运势平衡。🌙";
    },
    getWarningQuote: (message) => {
      return `虚妄的幻象遮蔽了天眼：${message}。命运不接受如此混乱的刻度，请重新拨动它的天平。👁️‍🗨️`;
    }
  },
  {
    id: "doctor",
    name: "医生 (艾米丽·黛儿)",
    jpName: "Emily Dyer",
    role: "温柔理智的治愈者，守护每一个生命与资产的健康。",
    imagePath: "/src/assets/images/doctor_chibi_1779960776580.png",
    accentColor: "from-sky-400 to-cyan-600",
    bgColor: "bg-emerald-50/90",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-800",
    btnBg: "bg-teal-600 hover:bg-teal-700 text-white",
    getGeneralQuote: (total, monthly) => {
      if (total === 0) return "你好，我是艾米丽。健康的体魄需要长期调理，健康的财务同样需要精心诊治。来测算一下吧！🩺";
      if (monthly > 5000) return "警告：检测到过度消费带来的超负荷压迫。每期应还额度已经超过了安全绿线，容易导致心理焦虑，建议减少首付或拉长期限。💊";
      if (monthly > 1000) return "处方：按当期计划按时还款，多摄入蔬菜，保持良好作息。你的财务状况处于轻度亚健康，但完全在自我修复范围内。📋";
      return "非常棒的体检报告！本期分期指数极其健康，如同晨曦下的心率一样平稳。请保持这样优秀的规划态度！❤️";
    },
    getWarningQuote: (message) => {
      return `紧急救治：输入参数触发了急性排异反应 —— ${message}。请立刻注入合理的数据，以便我进行缝合！🩹`;
    }
  }
];
