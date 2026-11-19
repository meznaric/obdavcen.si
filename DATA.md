# How do taxes work in Slovenia TLDR.

## Interesting facts

### 1. Mrtva cona
Pri 0 € stroškov se bolj splača imeti pogodbo za 60.000 € na leto kot za 87.000 € na leto, saj je normirani s. p. toliko ugodnejši, da lahko z drugimi oblikami izplačaš več šele pri 88.000 € na leto ali več.

Če pa imaš 10.000 € stroškov, se ta meja zniža z 88.000 € na 80.000 €. Mrtva cona izgine šele pri 37.000 € stroškov.

### 2. Progresivna davčna lestvica skoraj ne obstaja
Pri zelo nizkih zneskih je lestvica malenkost progresivna, takoj ko prihodki presežejo mejo za normirance, pa vidimo, da je izplačevanje z dividendami najučinkovitejše in da je krivulja skoraj ravna.
Lestvica postane tem bolj progresivna, čim več imamo stroškov.

### 3. Digitalni delavci na daljavo potegnejo kratko
Ker imajo digitalni podjetniki na daljavo zelo nizke stroške, morajo plačati zelo visoke davke. Prav podjetnikom, ki v državo pripeljejo denar, se torej godi najslabše.

## By Company Type

### Normirani s. p.

#### 1. Social Security Contributions (Prispevki)

Same calculation as regular SP:
- Zavarovalna osnova = min(max(0.75 × (dobicek/12), minimalnaOsnova), 3.5 × avgSalary) × 12
- minimalnaOsnova = 0.6 × avgSalary
- dobicek = revenue - normiraniExpenses + lastYearPrispevki
- normiraniExpenses = revenue × 80%

Total contribution rate ≈ 38.2% of zavarovalna osnova:
- PIZ (Pension): 24.35%
- Health: 13.45%
- Other (unemployment, parental care): 0.4%
Plus fixed health insurance (≈35€/month)

#### 2. Flat Tax Rate

Unlike regular SP, uses simplified taxation:
- Tax base = revenue × 20% (only 20% of revenue is considered income)
- Flat tax rate = 20%
- Final tax = Tax base × 20%

No tax brackets or reliefs apply.

#### 3. Final Calculation

Net Income = Revenue - Prispevki - Flat Tax - Real Expenses

Key limitations:
- Maximum allowed revenue: 60,000€/year
- Fixed 80% expense recognition regardless of real expenses
- Real expenses only affect cash flow, not tax calculation
- Previous year's prispevki still affect current year's calculation
- Simpler but potentially more expensive at higher revenues

Advantages:
- Predictable tax rate
- No bookkeeping required
- Beneficial for businesses with real expenses < 80% of revenue
- Lower administrative burden


### S. p.

### 1. Social Security Contributions (Prispevki)

Prispevki are calculated based on "zavarovalna osnova" (insurance base):
- Zavarovalna osnova = min(max(0.75 × (dobicek/12), minimalnaOsnova), 3.5 × avgSalary) × 12
- minimalnaOsnova = 0.6 × avgSalary
- dobicek = revenue - expenses + lastYearPrispevki

Total contribution rate ≈ 38.2% of zavarovalna osnova:
- PIZ (Pension): 24.35%
- Health: 13.45%
- Other (unemployment, parental care): 0.4%
Plus fixed health insurance (≈35€/month)

### 2. Income Tax (Dohodnina)

Tax base = revenue - prispevki - expenses - generalTaxRelief

Progressive tax brackets (2024):
- 16% up to 8,755€
- 26% 8,755€ to 25,750€
- 33% 25,750€ to 51,500€
- 39% 51,500€ to 74,160€
- 50% above 74,160€

### 3. Final Calculation

Net Income = Revenue - Prispevki - Dohodnina - Expenses

Key points:
- Higher expenses reduce both prispevki and dohodnina
- Previous year's prispevki affect current year's calculation
- Minimum zavarovalna osnova ensures minimum contributions
- General tax relief reduces taxable income

### D. o. o. (Limited Liability Company)

#### 1. Salary Calculations

Gross1 = Base salary amount
Gross2 = Gross1 + employer contributions

Employee contributions (from Gross1):
- Total rate ≈ 22.1%
- PIZ: 15.5%
- Health: 6.36%
- Other: 0.24%
Plus fixed health insurance (≈35€/month)

Employer contributions (on top of Gross1):
- Total rate ≈ 16.1%
- PIZ: 8.85%
- Health: 6.56%
- Other: 0.69%

#### 2. Salary Tax (Dohodnina)

Tax base = Gross1 - employee contributions - generalTaxRelief

Progressive tax brackets (2024):
- 16% up to 8,755€
- 26% 8,755€ to 25,750€
- 33% 25,750€ to 51,500€
- 39% 51,500€ to 74,160€
- 50% above 74,160€

Net Salary = Gross1 - employee contributions - dohodnina

#### 3. Company Profit Tax

Profit = Revenue - Expenses - Gross2
Corporate tax (DDPO) = Profit × 22%
Net profit = Profit - Corporate tax

#### 4. Dividend Tax

Dividends tax = Net profit × 25%
Net dividends = Net profit - Dividends tax

#### 5. Final Calculation

Total net income = Net salary + Net dividends
Total tax burden = Employee contributions + Employer contributions + Dohodnina + Corporate tax + Dividends tax

Key points:
- Higher salary reduces company profit and thus dividend taxes
- Expenses reduce corporate tax base
- Double taxation on dividends (corporate + dividend tax)
- Can optimize between salary vs dividends ratio

### DOO Strategies

#### 1. Minimal Salary + Maximum Dividends
- Pay minimum required salary (minimalna plača)
- Distribute remaining profit as dividends
- Optimizes for lower progressive tax rates
- Higher dividend tax exposure

#### 2. Maximum Salary
- Convert most/all profit into salary
- Minimal or no dividends
- Higher progressive tax exposure
- But single taxation (no dividend tax)

