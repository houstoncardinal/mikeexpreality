import { useState, useMemo, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator, DollarSign, Percent, Calendar } from "lucide-react";
import { trackMortgageCalculator } from "@/lib/analytics";

interface MortgageCalculatorProps {
  propertyPrice: number;
}

export const MortgageCalculator = ({ propertyPrice }: MortgageCalculatorProps) => {
  const [homePrice, setHomePrice] = useState(propertyPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const hasTracked = useRef(false);

  // Track calculator usage on first interaction
  useEffect(() => {
    if (!hasTracked.current && homePrice !== propertyPrice) {
      trackMortgageCalculator(homePrice, downPaymentPercent, loanTerm);
      hasTracked.current = true;
    }
  }, [homePrice, downPaymentPercent, loanTerm, propertyPrice]);

  const downPayment = useMemo(() => (homePrice * downPaymentPercent) / 100, [homePrice, downPaymentPercent]);
  const loanAmount = useMemo(() => homePrice - downPayment, [homePrice, downPayment]);

  const monthlyPayment = useMemo(() => {
    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) return 0;
    
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    const payment =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return Math.round(payment);
  }, [loanAmount, interestRate, loanTerm]);

  const totalPayment = useMemo(() => monthlyPayment * loanTerm * 12, [monthlyPayment, loanTerm]);
  const totalInterest = useMemo(() => totalPayment - loanAmount, [totalPayment, loanAmount]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="border-0 shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 font-serif text-xl">
          <Calculator className="h-5 w-5 text-accent" />
          Mortgage Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Home Price */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            Home Price
          </Label>
          <Input
            type="number"
            value={homePrice}
            onChange={(e) => setHomePrice(Number(e.target.value))}
            className="text-lg font-semibold"
          />
        </div>

        {/* Down Payment */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Percent className="h-4 w-4 text-muted-foreground" />
              Down Payment
            </Label>
            <span className="text-sm font-semibold text-accent">
              {downPaymentPercent}% ({formatCurrency(downPayment)})
            </span>
          </div>
          <Slider
            value={[downPaymentPercent]}
            onValueChange={(value) => setDownPaymentPercent(value[0])}
            min={0}
            max={50}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Percent className="h-4 w-4 text-muted-foreground" />
              Interest Rate
            </Label>
            <span className="text-sm font-semibold text-accent">{interestRate}%</span>
          </div>
          <Slider
            value={[interestRate]}
            onValueChange={(value) => setInterestRate(value[0])}
            min={1}
            max={12}
            step={0.125}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1%</span>
            <span>12%</span>
          </div>
        </div>

        {/* Loan Term */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Loan Term
            </Label>
            <span className="text-sm font-semibold text-accent">{loanTerm} years</span>
          </div>
          <div className="flex gap-2">
            {[15, 20, 30].map((term) => (
              <button
                key={term}
                onClick={() => setLoanTerm(term)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  loanTerm === term
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {term} yr
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="pt-4 border-t border-border space-y-4">
          <div className="bg-accent/10 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Estimated Monthly Payment</p>
            <p className="font-serif text-3xl font-bold text-accent">
              {formatCurrency(monthlyPayment)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Principal & Interest</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-secondary rounded-lg p-3 text-center">
              <p className="text-muted-foreground mb-1">Loan Amount</p>
              <p className="font-semibold text-foreground">{formatCurrency(loanAmount)}</p>
            </div>
            <div className="bg-secondary rounded-lg p-3 text-center">
              <p className="text-muted-foreground mb-1">Total Interest</p>
              <p className="font-semibold text-foreground">{formatCurrency(totalInterest)}</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            *Estimate does not include taxes, insurance, or PMI. 
            Contact us for a personalized quote.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
