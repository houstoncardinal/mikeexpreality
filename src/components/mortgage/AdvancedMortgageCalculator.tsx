import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  DollarSign,
  Percent,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  PiggyBank,
  BarChart3,
  Shield,
  FileText,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface RateScenario {
  label: string;
  rate: number;
  description: string;
  likelihood: "low" | "medium" | "high";
}

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  totalPaid: number;
  totalInterest: number;
}

const RATE_SCENARIOS: RateScenario[] = [
  { label: "Best Case", rate: -0.75, description: "Rates drop significantly", likelihood: "low" },
  { label: "Optimistic", rate: -0.5, description: "Moderate rate decrease", likelihood: "medium" },
  { label: "Current", rate: 0, description: "Rates stay stable", likelihood: "high" },
  { label: "Pessimistic", rate: 0.5, description: "Moderate rate increase", likelihood: "medium" },
  { label: "Worst Case", rate: 1.0, description: "Significant rate increase", likelihood: "low" },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercent = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  }).format(value / 100);
};

export function AdvancedMortgageCalculator() {
  const [homePrice, setHomePrice] = useState(450000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.75);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(1.2);
  const [homeInsurance, setHomeInsurance] = useState(1500);
  const [pmiRate, setPmiRate] = useState(0.5);
  const [hoaFees, setHoaFees] = useState(0);
  const [extraPayment, setExtraPayment] = useState(0);
  const [showAmortization, setShowAmortization] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(2); // Current

  const downPayment = useMemo(() => (homePrice * downPaymentPercent) / 100, [homePrice, downPaymentPercent]);
  const loanAmount = useMemo(() => homePrice - downPayment, [homePrice, downPayment]);
  const requiresPMI = downPaymentPercent < 20;

  const calculateMonthlyPayment = useCallback((principal: number, rate: number, termYears: number) => {
    if (principal <= 0 || rate <= 0 || termYears <= 0) return 0;
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = termYears * 12;
    return (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }, []);

  const principalAndInterest = useMemo(() => 
    calculateMonthlyPayment(loanAmount, interestRate, loanTerm),
    [loanAmount, interestRate, loanTerm, calculateMonthlyPayment]
  );

  const monthlyPropertyTax = useMemo(() => (homePrice * propertyTax / 100) / 12, [homePrice, propertyTax]);
  const monthlyInsurance = useMemo(() => homeInsurance / 12, [homeInsurance]);
  const monthlyPMI = useMemo(() => requiresPMI ? (loanAmount * pmiRate / 100) / 12 : 0, [loanAmount, pmiRate, requiresPMI]);
  const monthlyHOA = hoaFees;

  const totalMonthlyPayment = useMemo(() => 
    principalAndInterest + monthlyPropertyTax + monthlyInsurance + monthlyPMI + monthlyHOA,
    [principalAndInterest, monthlyPropertyTax, monthlyInsurance, monthlyPMI, monthlyHOA]
  );

  const totalPaymentOverLife = useMemo(() => principalAndInterest * loanTerm * 12, [principalAndInterest, loanTerm]);
  const totalInterest = useMemo(() => totalPaymentOverLife - loanAmount, [totalPaymentOverLife, loanAmount]);

  // Rate scenario calculations
  const scenarioPayments = useMemo(() => {
    return RATE_SCENARIOS.map(scenario => ({
      ...scenario,
      adjustedRate: interestRate + scenario.rate,
      payment: calculateMonthlyPayment(loanAmount, interestRate + scenario.rate, loanTerm),
    }));
  }, [interestRate, loanAmount, loanTerm, calculateMonthlyPayment]);

  // Extra payment impact
  const extraPaymentImpact = useMemo(() => {
    if (extraPayment <= 0) return null;

    const monthlyRateStandard = interestRate / 100 / 12;
    const standardMonths = loanTerm * 12;
    
    let balance = loanAmount;
    let monthsWithExtra = 0;
    let totalInterestWithExtra = 0;
    const monthlyPrincipalInterest = principalAndInterest;

    while (balance > 0 && monthsWithExtra < standardMonths * 2) {
      const interestPayment = balance * monthlyRateStandard;
      const principalPayment = Math.min(balance, monthlyPrincipalInterest - interestPayment + extraPayment);
      balance -= principalPayment;
      totalInterestWithExtra += interestPayment;
      monthsWithExtra++;
    }

    const monthsSaved = standardMonths - monthsWithExtra;
    const interestSaved = totalInterest - totalInterestWithExtra;

    return {
      monthsSaved,
      yearsSaved: Math.floor(monthsSaved / 12),
      remainingMonthsSaved: monthsSaved % 12,
      interestSaved,
      newPayoffMonths: monthsWithExtra,
    };
  }, [extraPayment, loanAmount, interestRate, loanTerm, principalAndInterest, totalInterest]);

  // Generate amortization schedule
  const amortizationSchedule = useMemo((): AmortizationRow[] => {
    if (!showAmortization) return [];
    
    const schedule: AmortizationRow[] = [];
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;
    let balance = loanAmount;
    let totalPaid = 0;
    let totalInterestPaid = 0;

    for (let month = 1; month <= totalPayments && balance > 0; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = Math.min(balance, principalAndInterest - interestPayment + extraPayment);
      balance -= principalPayment;
      totalPaid += principalAndInterest + extraPayment;
      totalInterestPaid += interestPayment;

      // Only add yearly entries to keep it manageable
      if (month % 12 === 0 || month === totalPayments || balance <= 0) {
        schedule.push({
          month,
          payment: principalAndInterest + extraPayment,
          principal: principalPayment,
          interest: interestPayment,
          balance: Math.max(0, balance),
          totalPaid,
          totalInterest: totalInterestPaid,
        });
      }
    }

    return schedule;
  }, [showAmortization, loanAmount, interestRate, loanTerm, principalAndInterest, extraPayment]);

  // Affordability ratio (28/36 rule)
  const affordabilityCheck = useMemo(() => {
    // Assuming gross monthly income for illustration (user would input this in a full version)
    const estimatedMinimumIncome = totalMonthlyPayment / 0.28;
    return {
      monthlyIncomeNeeded: estimatedMinimumIncome,
      annualIncomeNeeded: estimatedMinimumIncome * 12,
      housingRatio: 28, // Max recommended
    };
  }, [totalMonthlyPayment]);

  return (
    <TooltipProvider>
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
            Advanced Mortgage Calculator
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Plan your home purchase with comprehensive payment analysis, rate scenarios, and compliance information.
          </p>
        </div>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="calculator" className="gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Calculator</span>
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Rate Scenarios</span>
            </TabsTrigger>
            <TabsTrigger value="savings" className="gap-2">
              <PiggyBank className="h-4 w-4" />
              <span className="hidden sm:inline">Extra Payments</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Disclosures</span>
            </TabsTrigger>
          </TabsList>

          {/* Main Calculator Tab */}
          <TabsContent value="calculator" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Section */}
              <Card className="lg:col-span-2 border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Loan Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Home Price */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Home Price
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>The total purchase price of the property</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        type="number"
                        value={homePrice}
                        onChange={(e) => setHomePrice(Number(e.target.value))}
                        className="text-lg font-semibold"
                      />
                    </div>

                    {/* Interest Rate */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Interest Rate (%)
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Annual interest rate. Current average: ~6.5-7%</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        type="number"
                        step="0.125"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="text-lg font-semibold"
                      />
                    </div>
                  </div>

                  {/* Down Payment Slider */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-muted-foreground" />
                        Down Payment
                      </Label>
                      <span className="text-sm font-semibold text-primary">
                        {downPaymentPercent}% ({formatCurrency(downPayment)})
                      </span>
                    </div>
                    <Slider
                      value={[downPaymentPercent]}
                      onValueChange={(value) => setDownPaymentPercent(value[0])}
                      min={0}
                      max={50}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span className={requiresPMI ? "text-amber-500 font-medium" : ""}>
                        {requiresPMI && "⚠️ PMI required below 20%"}
                      </span>
                      <span>50%</span>
                    </div>
                  </div>

                  {/* Loan Term */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Loan Term
                    </Label>
                    <div className="flex gap-2">
                      {[10, 15, 20, 30].map((term) => (
                        <button
                          key={term}
                          onClick={() => setLoanTerm(term)}
                          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                            loanTerm === term
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "bg-secondary text-foreground hover:bg-secondary/80"
                          }`}
                        >
                          {term} yr
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Additional Costs */}
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between">
                        Additional Costs (Taxes, Insurance, HOA)
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Property Tax Rate (%)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={propertyTax}
                            onChange={(e) => setPropertyTax(Number(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Annual Home Insurance ($)</Label>
                          <Input
                            type="number"
                            value={homeInsurance}
                            onChange={(e) => setHomeInsurance(Number(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Monthly HOA Fees ($)</Label>
                          <Input
                            type="number"
                            value={hoaFees}
                            onChange={(e) => setHoaFees(Number(e.target.value))}
                          />
                        </div>
                        {requiresPMI && (
                          <div className="space-y-2">
                            <Label>PMI Rate (%)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={pmiRate}
                              onChange={(e) => setPmiRate(Number(e.target.value))}
                            />
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>

              {/* Results Section */}
              <Card className="border-0 shadow-card bg-gradient-to-br from-primary/5 to-accent/5">
                <CardHeader>
                  <CardTitle>Monthly Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <motion.div
                    key={totalMonthlyPayment}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-4"
                  >
                    <p className="font-serif text-4xl font-bold text-primary">
                      {formatCurrency(totalMonthlyPayment)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Monthly Payment</p>
                  </motion.div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Principal & Interest</span>
                      <span className="font-medium">{formatCurrency(principalAndInterest)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Property Tax</span>
                      <span className="font-medium">{formatCurrency(monthlyPropertyTax)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Home Insurance</span>
                      <span className="font-medium">{formatCurrency(monthlyInsurance)}</span>
                    </div>
                    {requiresPMI && (
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-muted-foreground flex items-center gap-1">
                          PMI
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Private Mortgage Insurance is required when down payment is less than 20%</p>
                            </TooltipContent>
                          </Tooltip>
                        </span>
                        <span className="font-medium text-amber-600">{formatCurrency(monthlyPMI)}</span>
                      </div>
                    )}
                    {hoaFees > 0 && (
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-muted-foreground">HOA Fees</span>
                        <span className="font-medium">{formatCurrency(monthlyHOA)}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 space-y-3">
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <div className="flex justify-between text-sm">
                        <span>Loan Amount</span>
                        <span className="font-semibold">{formatCurrency(loanAmount)}</span>
                      </div>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <div className="flex justify-between text-sm">
                        <span>Total Interest ({loanTerm} yrs)</span>
                        <span className="font-semibold">{formatCurrency(totalInterest)}</span>
                      </div>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <div className="flex justify-between text-sm">
                        <span>Min. Annual Income Needed</span>
                        <span className="font-semibold">{formatCurrency(affordabilityCheck.annualIncomeNeeded)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Based on 28% housing ratio</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Amortization Schedule */}
            <Card className="mt-6 border-0 shadow-card">
              <Collapsible open={showAmortization} onOpenChange={setShowAmortization}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-secondary/30 transition-colors rounded-t-lg">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Amortization Schedule
                      </span>
                      {showAmortization ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-2">Year</th>
                            <th className="text-right py-2 px-2">Payment</th>
                            <th className="text-right py-2 px-2">Interest</th>
                            <th className="text-right py-2 px-2">Balance</th>
                            <th className="text-right py-2 px-2">Total Paid</th>
                          </tr>
                        </thead>
                        <tbody>
                          {amortizationSchedule.map((row) => (
                            <tr key={row.month} className="border-b border-border/30 hover:bg-secondary/20">
                              <td className="py-2 px-2">{Math.ceil(row.month / 12)}</td>
                              <td className="text-right py-2 px-2">{formatCurrency(row.payment)}</td>
                              <td className="text-right py-2 px-2 text-amber-600">{formatCurrency(row.interest)}</td>
                              <td className="text-right py-2 px-2">{formatCurrency(row.balance)}</td>
                              <td className="text-right py-2 px-2">{formatCurrency(row.totalPaid)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </TabsContent>

          {/* Rate Scenarios Tab */}
          <TabsContent value="scenarios" className="mt-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Interest Rate Scenario Planning
                </CardTitle>
                <CardDescription>
                  See how potential rate changes could affect your monthly payment. Based on current rate of {interestRate}%.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {scenarioPayments.map((scenario, index) => (
                    <motion.div
                      key={scenario.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedScenario(index)}
                      className={`cursor-pointer rounded-lg p-4 transition-all ${
                        selectedScenario === index
                          ? "bg-primary text-primary-foreground shadow-lg ring-2 ring-primary"
                          : "bg-secondary/50 hover:bg-secondary"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {scenario.rate < 0 ? (
                          <TrendingDown className="h-4 w-4 text-emerald-500" />
                        ) : scenario.rate > 0 ? (
                          <TrendingUp className="h-4 w-4 text-rose-500" />
                        ) : (
                          <span className="text-lg">—</span>
                        )}
                        <span className="font-semibold text-sm">{scenario.label}</span>
                      </div>
                      <p className="text-2xl font-bold mb-1">
                        {formatCurrency(scenario.payment)}
                      </p>
                      <p className={`text-xs ${selectedScenario === index ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        {scenario.adjustedRate.toFixed(2)}% rate
                      </p>
                      <Badge
                        variant={scenario.likelihood === "high" ? "default" : scenario.likelihood === "medium" ? "secondary" : "outline"}
                        className="mt-2 text-xs"
                      >
                        {scenario.likelihood} likelihood
                      </Badge>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-700 dark:text-amber-400">Important Disclaimer</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        These rate scenarios are for illustrative purposes only and do not constitute a prediction or guarantee 
                        of future interest rates. Actual rates may vary based on market conditions, your credit profile, and 
                        other factors. Always consult with a licensed mortgage professional for accurate rate quotes.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Extra Payments Tab */}
          <TabsContent value="savings" className="mt-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5 text-primary" />
                  Extra Payment Calculator
                </CardTitle>
                <CardDescription>
                  See how making additional monthly payments can save you money and time.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="max-w-md">
                  <Label className="mb-2 block">Monthly Extra Payment ($)</Label>
                  <Input
                    type="number"
                    value={extraPayment}
                    onChange={(e) => setExtraPayment(Number(e.target.value))}
                    placeholder="Enter additional monthly amount"
                  />
                </div>

                <AnimatePresence>
                  {extraPaymentImpact && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-emerald-600">
                          {extraPaymentImpact.yearsSaved > 0 && `${extraPaymentImpact.yearsSaved}y `}
                          {extraPaymentImpact.remainingMonthsSaved}m
                        </p>
                        <p className="text-sm text-muted-foreground">Time Saved</p>
                      </div>
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-emerald-600">
                          {formatCurrency(extraPaymentImpact.interestSaved)}
                        </p>
                        <p className="text-sm text-muted-foreground">Interest Saved</p>
                      </div>
                      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-primary">
                          {Math.ceil(extraPaymentImpact.newPayoffMonths / 12)} years
                        </p>
                        <p className="text-sm text-muted-foreground">New Payoff Time</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!extraPayment && (
                  <div className="text-center py-8 text-muted-foreground">
                    <PiggyBank className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>Enter an extra monthly payment amount to see potential savings</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="mt-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Legal Disclosures & Compliance Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="bg-secondary/50 rounded-lg p-4 mb-4">
                    <h4 className="flex items-center gap-2 font-semibold mb-2">
                      <FileText className="h-4 w-4" />
                      TILA Disclosure (Truth in Lending Act)
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      This calculator provides estimates only and is not a commitment to lend. The actual terms of any 
                      loan, including interest rate, fees, and monthly payment, may differ from estimates provided here. 
                      You will receive a Loan Estimate that details your actual costs within three business days of 
                      applying for a mortgage.
                    </p>
                  </div>

                  <div className="bg-secondary/50 rounded-lg p-4 mb-4">
                    <h4 className="flex items-center gap-2 font-semibold mb-2">
                      <FileText className="h-4 w-4" />
                      RESPA Disclosure (Real Estate Settlement Procedures Act)
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      You are not required to complete any mortgage application or agreement to obtain information 
                      about closing costs or settlement services. These estimates do not include all potential 
                      closing costs. A complete list will be provided in your Closing Disclosure.
                    </p>
                  </div>

                  <div className="bg-secondary/50 rounded-lg p-4 mb-4">
                    <h4 className="flex items-center gap-2 font-semibold mb-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      Rate Prediction Disclaimer
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      The rate scenarios presented are hypothetical illustrations based on assumed market conditions. 
                      They are NOT predictions, forecasts, or guarantees of future rates. Interest rates are influenced 
                      by complex economic factors including Federal Reserve policy, inflation, employment data, and 
                      global market conditions. Past rate trends do not guarantee future performance. Always work with 
                      a licensed mortgage professional for current rate information.
                    </p>
                  </div>

                  <div className="bg-secondary/50 rounded-lg p-4 mb-4">
                    <h4 className="flex items-center gap-2 font-semibold mb-2">
                      <FileText className="h-4 w-4" />
                      Equal Housing Opportunity
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      We are committed to the letter and spirit of U.S. policy for the achievement of equal housing 
                      opportunity throughout the nation. We encourage and support an affirmative advertising and 
                      marketing program in which there are no barriers to obtaining housing because of race, color, 
                      religion, sex, handicap, familial status, or national origin.
                    </p>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Calculator Assumptions</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Calculations assume a fixed-rate mortgage with level monthly payments</li>
                      <li>• Property taxes and insurance are estimates and may vary by location</li>
                      <li>• PMI is estimated at {pmiRate}% and typically required for down payments under 20%</li>
                      <li>• HOA fees vary by property and community</li>
                      <li>• Actual loan terms depend on credit score, income, debt-to-income ratio, and other factors</li>
                      <li>• This calculator does not include potential mortgage points or origination fees</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button variant="outline" asChild>
                    <a href="/contact" className="gap-2">
                      <Calculator className="h-4 w-4" />
                      Get a Personalized Quote
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
