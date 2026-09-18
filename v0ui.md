# Sakhi (सखी) — Screen-by-Screen UI & UX Specification (`v0 / Stitch` Blueprint)

> **Target Users**: Rural women, Self-Help Group (SHG) members, micro-entrepreneurs, and individuals with limited financial/digital literacy.
> **Core Principles**: Large touch targets, minimal cognitive load, zero bank jargon, audio narration support, deterministic calculations, zero page reloads, multilingual support (English, Hindi, Telugu).
> **Note**: Colors and typography are excluded as per styling guidelines.

---

## Screen 1 — Startup Splash & Greeting (`StartupGreeting`)

* **Screen Type**: Temporary full-screen animated overlay.
* **Trigger**: Automatic on session start.
* **Layout Structure**: Centered vertical card.
* **UI Elements (Top to Bottom)**:
  1. **Brand Mascot Emblem**: Stylized central emblem (`स`).
  2. **Product Badge**: Pill container reading `Sakhi Financial Companion`.
  3. **Main Headline**: `Namaste, {User Name} 👋` (or `Namaste, Sister 👋`).
  4. **Sub-caption**: `Your personal financial companion is ready`.
  5. **Interaction Hint**: `Tap anywhere to continue`.
* **Behavior & Transitions**:
  * Automatically fades out after 1.6 seconds, transitioning smoothly into the main application.
  * Tapping anywhere immediately dismisses the screen.
  * Persisted in session storage (does not replay on tab switching).

---

## Screen 2 — Interactive App Tour & Walkthrough (`InteractiveTutorial`)

* **Screen Type**: Centered modal with backdrop blur.
* **Trigger**: Automatically launches on first-time user login, or via "Replay Interactive App Tour" in Settings.
* **Layout Structure**: Header + Progress Bar + Step Card Content + Navigation Footer.
* **Header & Progress**:
  * Step Badge (e.g., `Step 1 • Welcome`, `Step 2 • My Money`, `Step 3 • Journey`, `Step 4 • Schemes`, `Step 5 • AI Companion`).
  * `Skip Tour` button (top right).
  * Horizontal Progress Indicator Bar (fills proportionally from 20% to 100%).
* **Step-by-Step Content Feed (5 Carousel Steps)**:
  * **Step 1 • Welcome**:
    * Large Star Icon.
    * Title: `Namaste, Sister! Welcome to Sakhi`.
    * Subtitle: `Your personal, trustworthy financial companion`.
    * Body: Plain-language explanation of Sakhi as a sister-like guide for household money without bank jargon.
    * Tip Box: `💡 Everything is calculated automatically and kept 100% private.`
  * **Step 2 • My Money**:
    * Large Wallet Icon.
    * Title: `1. Know Your Monthly Money Left (Surplus)`.
    * Subtitle: `Income minus household expenses`.
    * Body: Explains how logging income and expenses automatically reveals money left over to save.
    * Tip Box: `💡 Even ₹500 saved on market day builds your safety shield over time.`
  * **Step 3 • Journey**:
    * Large Compass Icon.
    * Title: `2. Your 7-Stage Financial Roadmap`.
    * Subtitle: `From emergency safety to financial freedom`.
    * Body: Explains the step-by-step milestone progression (Emergency Fund → Clearing high-interest loans → Savings → Government schemes).
    * Tip Box: `💡 Tap 🔊 Listen on any milestone to hear Sakhi explain it.`
  * **Step 4 • Schemes**:
    * Large Shield Icon.
    * Title: `3. Verified Government Schemes`.
    * Subtitle: `Central & State support for women and SHGs`.
    * Body: Explains how the 5-question matcher finds grants, micro-credit, and insurance policies.
    * Tip Box: `💡 Includes direct links to official government portals.`
  * **Step 5 • AI Companion**:
    * Large Robot Mascot Icon.
    * Title: `4. Ask Sakhi Anytime`.
    * Subtitle: `Voice and text in your own language`.
    * Body: Explains talking to Sakhi in English, Hindi, or Telugu about loans, savings, and family budgets.
    * Tip Box: `🎉 You are now ready to take control of your financial freedom!`
* **Footer Navigation Controls**:
  * Left: `Back` button (hidden on Step 1).
  * Right: `Next Step` button (on Steps 1-4) / `Let's Get Started! 🎉` button (on Step 5, triggers celebration confetti and saves completion state).

---

## Screen 3 — Conversational User Onboarding (`Onboarding`)

* **Screen Type**: Full-page multi-step onboarding wizard.
* **Trigger**: Displayed when no user session/data exists.
* **Layout Structure**: Header + Step Indicator + Input Form + Action Buttons.
* **Header**:
  * App Mascot Icon.
  * Title: `Welcome to Sakhi (सखी)`.
  * Subtitle: `Let's set up your profile in 3 simple steps`.
  * Quick Action: `Explore as Lakshmi (Demo)` button (populates full sample profile in one tap).
* **Step-by-Step Forms**:
  * **Step 1: Personal Details**:
    * Full Name text input (e.g., `Lakshmi`).
    * Age number input with quick preset chips (`25`, `28`, `35`, `45`).
    * State selection dropdown (`Telangana`, `Andhra Pradesh`, `Maharashtra`, etc.).
    * Self-Help Group (SHG) Membership toggle cards (`Yes, active member` / `No`).
    * Rural / Village resident toggle cards (`Yes, rural/village` / `No, urban`).
    * Navigation: `Next Step →`.
  * **Step 2: Income & Cashflow**:
    * Monthly Household Income number input (₹).
    * Estimated Monthly Expenses number input (₹).
    * Current Savings in bank / cash number input (₹).
    * Existing Debt / Private loans number input (₹).
    * Primary Occupation text input (e.g., `Tailoring & Small Trade`).
    * Navigation: `← Back` and `Next Step →`.
  * **Step 3: First Dream / Goal**:
    * What are you saving for? text input (e.g., `Daughter's College Fees`).
    * Target Amount number input (₹).
    * Time horizon number input in months (e.g., `12`).
    * Navigation: `← Back` and `Complete Setup & Enter Sakhi 🎉`.

---

## Screen 4 — Home Dashboard (`Home`)

* **Screen Type**: Primary scrollable dashboard view (Tab 1 of Bottom Navigation).
* **Top Header (Global)**:
  * Left: Profile picture / Avatar icon with fallback initial + `Namaste, {name} 👋` + State subtitle (Tapping opens **Screen 16: Profile View**).
  * Right: `☰` Hamburger menu button (Tapping opens **Screen 17: Settings Drawer**).
* **Main Feed Sections**:
  1. **Hero Financial Health Summary Banner**:
     * Top row: Greeting `Namaste, {User Name}` + Location badge (e.g., `Telangana`).
     * Income Stat: `Your Monthly Income` in large bold text (`₹{income}`).
     * Surplus Card Container: Label `Calculated Monthly Surplus`, Large highlighted amount (`₹{surplus}`), and a `Breakdown →` button navigating to **Screen 5 (My Money)**.
  2. **Primary Action Card: "Talk to Sakhi"**:
     * Robot companion icon + `AI Voice/Text` badge.
     * Title: `Talk to Sakhi`.
     * Dynamic Status Subtitle: `Ask about your ₹{surplus} surplus, debt or schemes`.
     * Right chevron arrow icon.
     * Tapping opens **Screen 15 (Ask Sakhi AI Modal)**.
  3. **2x2 Feature Navigation Grid**:
     * **Card 1 • My Money**: Wallet icon, Title `My Money`, Subtitle `Income, expenses & transactions`, Arrow icon.
     * **Card 2 • My Journey**: Compass icon, `Stage {id}` badge, Title `My Journey`, Subtitle with current stage name.
     * **Card 3 • My Goals**: Target icon, `{percent}%` badge, Title `My Goals`, Subtitle with primary goal name.
     * **Card 4 • Benefits**: Shield icon, `15 Schemes` badge, Title `Benefits`, Subtitle `Government schemes & loans`.
  4. **Learn Guides Shortcut Banner**:
     * Book icon + Title: `Learn: Financial Guides` + Subtitle: `Emergency Fund • Managing Loans • Disciplined Savings • Micro-Insurance` + Right arrow.
     * Navigates to **Screen 14 (Learn Tab)**.
  5. **Active Dream Progress Preview Card**:
     * Top row: `Active Dream` label + `₹{amount}/mo required` monthly savings badge.
     * Goal Title in bold.
     * Visual Progress Bar (saved so far vs. target).
     * Footer metrics: `Saved: ₹{current}` vs. `Target: ₹{target}`.
* **Bottom Navigation Bar (Global)**:
  * 6 Tabs: `Home` (Active), `My Money`, `Journey`, `Goals`, `Benefits`, `Learn`.

---

## Screen 5 — My Money & Cashflow Tracking (`MyMoney`)

* **Screen Type**: Scrollable tab view (Tab 2 of Bottom Navigation).
* **Header**:
  * Title: `My Money & Health`.
  * Subtitle: `Real-time calculations from your logged income & expenses`.
* **Main Sections**:
  1. **2x2 Financial Overview Cards Grid (`MoneyCard`)**:
     * **Income Card**: Downward arrow icon, Title `Income`, Amount `₹{income}`, Subtitle `Monthly inflow`.
     * **Expense Card**: Upward arrow icon, Title `Expense`, Amount `₹{expenses}`, Subtitle `Monthly outflow`.
     * **Surplus Card**: Trend icon, Title `Surplus`, Amount `₹{surplus}`, Subtitle `Left to save & invest` (or `Monthly deficit`).
     * **Savings Card**: Shield icon, Title `Savings`, Amount `₹{savings}`, Subtitle `In bank & cash`.
  2. **High-Interest Debt Alert Card (Conditional — shown if debt > 0)**:
     * Warning triangle icon.
     * Title: `Total Outstanding Debt`.
     * Debt Amount in bold (`₹{debt}`).
     * Actionable Guidance: `Suggested payment: ~₹{payment}/mo from surplus`.
  3. **Emergency Fund Safety Shield Card**:
     * Header: Shield icon, Title `🛡 Emergency Fund`, Badge `{percent}% complete`.
     * Amount Display: `₹{current_saved} / ₹{target_amount}` (Target is automatically calculated as 3 months of basic expenses).
     * Visual Progress Bar.
     * Sub-caption: `Build your safety net (3 months of household expenses)`.
  4. **Transaction Log & Feed (`TransactionList`)**:
     * Top Bar: Title `Recent Money Log` + `+ Log Money` primary button (opens **Screen 6**).
     * Filter Chips: `All`, `Income`, `Expense`.
     * Empty State: `No Transactions Logged Yet` with prompt button.
     * Transaction List Items: Category badge, Date, Description, Amount (`+ ₹{amount}` / `- ₹{amount}`), and Delete trash icon.
* **Floating Action**: "Ask Sakhi" AI button.

---

## Screen 6 — Add Transaction / Money Log Modal (`TransactionList` Modal)

* **Screen Type**: Modal dialog with backdrop blur.
* **Trigger**: Tapping `+ Log Money` on Screen 5.
* **Header**: Title `Log Income or Expense`, Subtitle `Keep track of your household cashflow`, Close icon.
* **Form Inputs**:
  1. **Transaction Type Toggle**:
     * Two full-width segmented buttons: `Income (+)` vs. `Expense (-)`.
  2. **Amount Input (₹)**:
     * Large numeric input with ₹ symbol prefix.
  3. **Category Dropdown Select**:
     * Income options: `Salary / Wages`, `Shop Sales / Market`, `Agricultural / Livestock`, `SHG Loan Disbursed`, `Government Benefit`, `Other Income`.
     * Expense options: `Food & Groceries`, `Rent & Electricity`, `Healthcare / Medicine`, `Children's School / Fees`, `Loan Interest / Repayment`, `Festival / Family Function`, `Other Expense`.
  4. **Transaction Date Input**:
     * Date picker defaulting to today.
     * **Validation Constraint**: Rejects future dates with descriptive feedback; accepts today or past dates only.
  5. **Description Input**:
     * Text field with placeholder (e.g., `Market day vegetable sales`).
* **Footer Actions**:
  * `Cancel` button.
  * `Save Transaction` primary button (instantly recalculates all financial totals across the app without page reload).

---

## Screen 7 — 7-Stage Freedom Journey Roadmap (`Journey`)

* **Screen Type**: Scrollable tab view (Tab 3 of Bottom Navigation).
* **Header**:
  * Badge: `Financial Freedom Roadmap`.
  * Title: `Your 7-Stage Journey`.
  * Subtitle: `Step-by-step guidance tailored to your real surplus and savings`.
* **Active Milestone Hero Card**:
  * Header: `Current Active Milestone` badge + `Stage {id} of 7`.
  * Stage Name in large bold text (e.g., `Stage 2: Build Emergency Shield`).
  * Rural-friendly explanation of why this milestone protects the household.
  * **Immediate Action Callout Box**:
    * Label: `✨ Immediate Action:`.
    * Action Title & detailed instructions.
  * **Footer Action Bar**:
    * `🔊 Listen` button with active speaking animation state.
    * Next Stage preview label (`Next: Stage 3...`).
    * `Ask Sakhi Advice` button (opens Screen 15 pre-scoped to this stage).
* **Complete 7-Stage Interactive Roadmap List**:
  * **Stage 1: Stabilize Cashflow** (Income > Expenses).
  * **Stage 2: Build Emergency Shield** (3 months expenses in safe bank account).
  * **Stage 3: Eliminate High-Interest Debt** (Clear moneylender loans).
  * **Stage 4: Micro-Insurance Protection** (PMSBY & PMJJBY family safety).
  * **Stage 5: Goal-Based Savings** (Recurring deposits for education/business).
  * **Stage 6: Enterprise & Livelihood Expansion** (SHG & MUDRA credit).
  * **Stage 7: Retirement & Future Dignity** (Atal Pension Yojana).
  * **Row Item Indicators**:
    * Left: Green Checkmark (Completed), Pulsing Stage Number (In Progress), Lock Icon (Locked).
    * Center: Stage Title and Description.
    * Right Status Pill: `Completed`, `In Progress`, or `Locked`.
* **Floating Action**: "Ask Sakhi" AI button.

---

## Screen 8 — Goals & Dreams Overview (`Goals`)

* **Screen Type**: Scrollable tab view (Tab 4 of Bottom Navigation).
* **Header**:
  * Title: `My Goals & Dreams`.
  * Subtitle: `Set a target, and Sakhi calculates the exact monthly savings needed`.
  * Action Button: `+ New Goal` button (opens **Screen 9**).
* **Goal Cards Feed (`GoalCard`)**:
  * **Empty State**: Target icon, `No Goals Created Yet`, prompt description, and `Create My First Goal` button.
  * **Goal Card Structure**:
    * Top Row: Category tag (e.g., `Education`), Time horizon tag (e.g., `12 months left`).
    * Goal Title in bold text.
    * Highlighted Banner: `₹{amount}/mo required` monthly savings calculation.
    * Affordability Badge: `Very Achievable` (when required $\le$ surplus) vs. `Needs Attention` (when required $>$ surplus).
    * Visual Progress Bar (Saved vs. Target).
    * Metric Row: `Saved: ₹{current}` vs. `Target: ₹{target}`.
    * Action Row:
      * `+ Add Money` button (opens **Screen 10**).
      * Delete trash icon button with confirmation prompt.
* **Floating Action**: "Ask Sakhi" AI button.

---

## Screen 9 — Create Savings Goal Modal (`Goals` Modal)

* **Screen Type**: Modal dialog with backdrop blur.
* **Trigger**: Tapping `+ New Goal` on Screen 8.
* **Header**: Title `Create Savings Goal`, Subtitle `What are you saving for?`, Close action.
* **Form Inputs**:
  1. **Goal Name Input**: Text field (e.g., `Daughter's College Fees`).
  2. **Category Dropdown**: `Education`, `Emergency Fund`, `Business`, `House`, `Healthcare`, `Other Personal Goal`.
  3. **Target Amount Input (₹)**: Number field (minimum ₹100).
  4. **Saved So Far Input (₹)**: Current amount already set aside.
  5. **Time Horizon Input (Months)**: Number field (1 to 120 months).
* **Footer Actions**:
  * `Cancel` button.
  * `Calculate & Save` primary button (instantly generates monthly required savings and adds card).

---

## Screen 10 — Add Money to Goal / Savings Allocation Modal (`Goals` Modal)

* **Screen Type**: Modal dialog with backdrop blur.
* **Trigger**: Tapping `+ Add Money` on any Goal Card in Screen 8.
* **Header**: Title `Add Money to Goal`, displays Goal Title and current saved total.
* **Form Inputs**:
  1. **Amount to Allocate Input (₹)**: Large number field.
  2. **Clear Explanatory Note**:
     `ℹ️ This moves ₹{amount} into this goal from your savings.`
     *(Explicitly informs the user that this allocates existing savings rather than generating new income).*
* **Special Event**: If adding this amount meets or exceeds the target, a full confetti celebration is triggered.
* **Footer Actions**:
  * `Cancel` button.
  * `Confirm` primary button (updates goal progress and unallocated savings immediately).

---

## Screen 11 — Government Benefits & Schemes Catalog (`Benefits`)

* **Screen Type**: Scrollable tab view (Tab 5 of Bottom Navigation).
* **Header & Hero Banner**:
  * Badge: `Verified Government Programs`.
  * Title: `Government Benefits & Schemes`.
  * Subtitle: `Official central and state initiatives for women, SHGs, and micro businesses`.
  * **Smart Matcher Hero Banner**:
    * Sparkles icon + Title: `Find Schemes You May Be Eligible For`.
    * Subtitle: `Answer 5 quick questions. Sakhi evaluates your age, state, and work to find the best programs.`
    * `Start Matching` button (opens **Screen 12**).
* **Search & Filter Bar**:
  * Search input field with magnifying glass icon (searches title, description, category).
  * Horizontal scrollable category filter chips (`All`, `Women entrepreneurship`, `SHG / livelihood`, `Insurance`, `Pension`, `Education`, `Housing`, `State-specific benefits`).
* **Scheme Cards Feed (`SchemeCard`)**:
  * Card Header: Category badge, State tag (`Central` vs. `Telangana`), Match Score badge (e.g., `100% Match`).
  * Scheme Name in bold.
  * Scheme 2-line summary.
  * "What It Provides" Box: Details loans, grants, interest rates, or insurance sums.
  * "Why You Match" Bullets: Specific match criteria (e.g., `Dedicated program empowering women`, `Age 28 satisfies bracket`, `Telangana resident`).
  * Footer: Preliminary guidance note + `Details & Source →` button (opens **Screen 13**).
* **Floating Action**: "Ask Sakhi" AI button.

---

## Screen 12 — Full-Screen Guided Scheme Matcher (`FullWindowSchemeMatcher`)

* **Screen Type**: Full-screen sequential wizard with backdrop blur.
* **Trigger**: Tapping `Start Matching` on Screen 11.
* **Header & Progress**:
  * Title: `Government Scheme Matcher`.
  * Subtitle: `Step-by-step preliminary eligibility check`.
  * Close icon button.
  * Question progress indicator (e.g., `Question 2 of 5` + progress bar).
* **Sequential 1-Question-at-a-Time Flow**:
  * **Question 1 • Target Profile**:
    * Question: `Are you a woman?`
    * Subtitle: Explains exclusive women-targeted grants and reduced loan interest rates.
    * Cards: `Yes` (with checkmark) / `No`.
  * **Question 2 • Eligibility**:
    * Question: `What is your age?`
    * Subtitle: Explains age bracket eligibility for pensions and insurance.
    * Number input field + Quick preset chips (`25`, `28`, `35`, `45`, `55`).
  * **Question 3 • Location**:
    * Question: `Which state do you live in?`
    * Subtitle: Unlocks state-specific schemes alongside Central schemes.
    * Cards: `Telangana`, `Andhra Pradesh`, `Maharashtra`, `Other / All India`.
  * **Question 4 • Community Livelihood**:
    * Question: `Are you a member of a Self-Help Group (SHG / Bachat Gat)?`
    * Subtitle: Explains Lakhpati Didi, Stree Nidhi, and group credit linkages.
    * Cards: `Yes, active in an SHG` / `No, not a member`.
  * **Question 5 • Business & Livelihood**:
    * Question: `Do you want to start or expand a small business, tailoring, or shop?`
    * Subtitle: Explains collateral-free MUDRA loans, PM Vishwakarma toolkits, and Stand-Up India.
    * Cards: `Yes` / `No`.
* **Results View (Upon completion)**:
  * Header: `You may want to explore {total} Schemes` (e.g., `14 Schemes`).
  * Subtitle: `Based on your age ({age}), location ({state}), and profile.`
  * **Mandatory Government Disclaimer Callout**:
    `"This is a preliminary match based on the information you provided. Final eligibility is decided by the official authority."`
  * Matched scheme cards list with match percentages, reasons, and direct links.
  * Footer: `Retake Matcher` button and `Done` button.

---

## Screen 13 — Scheme Details & Official Portal Modal (`SchemeDetailsModal`)

* **Screen Type**: Modal dialog with backdrop blur.
* **Trigger**: Tapping `Details & Source` on any scheme card.
* **Header**: Category tag, State location tag, Scheme Title, Close button.
* **Structured Content Sections**:
  1. **Mandatory Notice Box**: Disclaimer stating Sakhi provides preliminary matching and official verification is required.
  2. **What this program provides**: Detailed financial grants, loan tranches, subsidies, or coverage amounts.
  3. **Target beneficiaries**: Specific intended demographic and community groups.
  4. **Basic Eligibility**: Age limits, income ceilings, and operational requirements.
  5. **Documents Needed**: Exhaustive list of required documents (Aadhaar, Ration Card, Bank Passbook, SHG resolution).
  6. **How to Apply**: Clear instructions on where to apply (Gram Panchayat, Anganwadi, Bank Branch, CSC, or Online Portal).
* **Footer Actions**:
  * `Close` button.
  * `View official source →` button opening the authentic verified government portal in a new browser tab.

---

## Screen 14 — Learn / Financial Education Guides (`Learn`)

* **Screen Type**: Scrollable tab view (Tab 6 of Bottom Navigation).
* **Header**:
  * Badge: `Financial Guidance`.
  * Title: `What do you want to learn?`.
  * Subtitle: `Simple guides to protect your family and grow your savings`.
* **4 Progressive Disclosure Topic Cards**:
  1. **Emergency Fund Card**:
     * Icon: Shield alert.
     * Title: `Emergency Fund`.
     * Subtitle: `Build your safety net against hospital visits & emergencies`.
     * Collapsed State: Tap anywhere on header to expand.
     * Expanded State:
       * Summary box: Plain explanation of emergency funds preventing high-interest debt during medical crises.
       * Bullet points: 3-month expense target, Post Office/bank accounts, avoiding 36%-60% private debt.
       * `🔊 Listen` button: Speaks the lesson aloud in active language with animated active state.
       * `Ask Sakhi how this applies to you →` direct AI shortcut.
  2. **Managing Loans Card**:
     * Icon: Downward debt trend.
     * Title: `Managing Loans`.
     * Subtitle: `Pay off high-interest loans faster and keep your surplus`.
     * Expanded State: Paying highest-interest debt first, allocating surplus, low-interest SHG credit, `🔊 Listen` button.
  3. **Disciplined Saving Card**:
     * Icon: Piggy bank.
     * Title: `Disciplined Saving`.
     * Subtitle: `Put aside ₹500 to ₹1,000 the day money arrives`.
     * Expanded State: Recurring Deposits (RD), auto-saving on market day, Mahila Samman certificate (MSSC 7.5%), `🔊 Listen` button.
  4. **Micro-Insurance Card**:
     * Icon: Handshake shield.
     * Title: `Micro-Insurance`.
     * Subtitle: `Protect your family for less than the cost of a cup of tea`.
     * Expanded State: PMSBY (₹20/yr for ₹2 Lakh accident cover), PMJJBY (₹436/yr for ₹2 Lakh life cover), simple enrollment at bank, `🔊 Listen` button.
* **Floating Action**: "Ask Sakhi" AI button.

---

## Screen 15 — Ask Sakhi AI Companion Chat & Voice Modal (`AskSakhiModal`)

* **Screen Type**: Full-screen on mobile / centered modal on desktop with backdrop blur.
* **Trigger**: Tapping any "Talk to Sakhi" or "Ask Sakhi" floating button.
* **Top Header**:
  * Robot Mascot Icon with glowing border.
  * Title: `Ask Sakhi`.
  * Badge: `AI Companion`.
  * Subtitle: `Simple answers about your money & schemes`.
  * Close icon button.
* **Live Context Banner Strip**:
  * Displays authoritative real-time numbers: `Surplus: ₹{surplus} | Debt: ₹{debt} | Savings: ₹{savings}`.
* **Message Feed Container**:
  * Initial welcome bubble from Sister Sakhi in the active language (English, Hindi, or Telugu).
  * User Message bubbles (right-aligned).
  * Sakhi Response bubbles (left-aligned):
    * Response text formatted in plain, reassuring language with verified calculations.
    * Sub-row: `Verified calculations` badge + `🔊 Listen` / `Stop Voice` toggle button.
  * Thinking / Loading indicator: Pulsing emblem + `Sakhi is understanding your finances...`.
* **Quick Suggestion Prompt Chips (Horizontal scrollable)**:
  * Localized chips:
    * *"How much should I save every month?"*
    * *"I have debt. What is the best way to clear it?"*
    * *"What government support can help my work?"*
    * *"What is my Emergency Fund safety target?"*
* **Bottom Input Bar**:
  * **Microphone Button**: Voice input trigger (uses `en-IN`, `hi-IN`, `te-IN`). If unsupported by the browser, displays an inline subtle notice without disruptive alert popups.
  * **Text Input Field**: `Ask about savings, debt, schemes...`.
  * **Send Button**: Arrow icon button.

---

## Screen 16 — View-Only Profile Modal (`ProfileModal`)

* **Screen Type**: Centered modal with backdrop blur.
* **Trigger**: Tapping user avatar or name in the Top Header.
* **Core Architecture**: **100% View-Only. Contains ZERO editable input fields and ZERO settings controls.**
* **Header**:
  * Large circular profile picture or avatar color style with fallback initial.
  * User Name in bold.
  * Location: Map pin icon + State name (e.g., `Telangana`).
  * Close icon button.
* **Information Cards Grid**:
  * Card 1: `Monthly Income` label + `₹{income}` amount.
  * Card 2: `Age` label + `{age} years`.
  * Card 3: `State` label + State name.
  * Card 4: `SHG Member` label + `Yes` / `No`.
  * Card 5: `Active Dream & Roadmap` + Goal Name (`🎯 Daughter's Education`) + Current Stage (`🗺️ Stage 2: Emergency Shield`).
* **Navigation Link**:
  * Bottom Action Button: `Open Settings (☰) to Edit Details →` (closes Profile view and immediately opens **Screen 17: Settings Drawer**).

---

## Screen 17 — Settings & Personal Information Drawer (`SettingsDrawer`)

* **Screen Type**: Mobile-first vertically scrollable drawer / sheet.
* **Trigger**: Tapping the `☰` (Three-Line Hamburger Menu) button in the Top Header.
* **Header**:
  * Icon + Title: `Settings`.
  * Subtitle: `Edit Information & App Preferences`.
  * Close icon button.
* **Scrollable Content Sections**:
  1. **👤 Section 1: Personal Information (Editable)**:
     * **Profile Picture Picker**: Avatar image preview with camera upload button (stores locally) + 4 avatar color preset style circles.
     * **Full Name Input**: Text field.
     * **Monthly Income Input (₹)**: Number field.
     * **Age Input**: Number field.
     * **State Select**: Dropdown of Indian states.
     * **SHG Membership Toggle**: `Yes` vs. `No` segmented buttons.
  2. **🌐 Section 2: Language & Appearance Preferences**:
     * **Language Selector**: 3 large buttons: `English`, `हिन्दी` (Hindi), `తెలుగు` (Telugu). Tapping immediately switches all application text and AI responses without browser reload.
     * **App Appearance Mode**: 2 large buttons: `Light Mode ☀️` vs. `Dark Mode 🌙`. Tapping immediately toggles the full application theme.
  3. **🎓 Section 3: Help & Guided Tour**:
     * Subtitle: `Need a reminder on how to use Sakhi?`
     * Action Button: `Replay Interactive App Tour` (closes Settings and starts Screen 2).
  4. **🔊 Section 4: Voice Assistance Status**:
     * Information on Indian-accented audio guidance features.
  5. **⚙️ Section 5: App Information & Security**:
     * Version info (`Sakhi 1.0`), deterministic privacy guarantee (calculations computed securely without data leakage).
  6. **💾 Primary Action: Save Changes Button**:
     * Prominent full-width button: `Save Changes`.
     * Action: Submits all edits to the backend API, updates global state, and recalculates financial health immediately with a green `✓ Updated!` confirmation banner.
  7. **⚠️ Destructive Action: Log Out**:
     * Placed at the very bottom, AFTER Save Changes.
     * Styled with **red text** and **red border**.
     * Initial State: `Log Out` button.
     * Confirmation State: Reveals `Are you sure you want to log out?` with `Cancel` and `Confirm Log Out` buttons.
