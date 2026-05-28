export interface CalculatorInput {
  totalAmount: number;
  downPayment: number;
  period: number;
}

export interface CalculatorResult {
  remainingPrincipal: number;
  serviceFee: number;
  totalRepayment: number;
  perTermPayment: number;
}

export interface AmortizationRow {
  termNumber: number;
  principalPayable: number;
  serviceFeePayable: number;
  totalTermPayable: number;
  remainingTermBalance: number;
}

export type CharacterId = "gardener" | "seer" | "doctor";

export interface CharacterConfig {
  id: CharacterId;
  name: string;
  jpName?: string;
  role: string;
  imagePath: string;
  accentColor: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  btnBg: string;
  getGeneralQuote: (total: number, monthly: number) => string;
  getWarningQuote: (message: string) => string;
}
