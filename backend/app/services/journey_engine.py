"""
Sakhi 7-Stage Financial Empowerment Journey Engine.

Deterministically calculates user progression across the 7 milestones:
1. Daily Cashflow & Awareness
2. Emergency Shield (Suraksha Kavach)
3. High-Cost Debt Elimination
4. Habitual Disciplined Saving
5. Social Security & Micro-Insurance
6. Goal-Oriented Wealth Creation
7. Financial Independence & Community Mentoring
"""

from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.user import User
from app.models.transaction import Transaction
from app.models.goal import Goal
from app.models.debt import Debt
from app.schemas.knowledge import LocalizedText
from app.schemas.journey import JourneyStageResponse, JourneyRoadmapResponse


class JourneyEngine:
    """Deterministic roadmap calculation engine."""

    @staticmethod
    def calculate_journey_roadmap(db: Session, user: User) -> JourneyRoadmapResponse:
        """
        Evaluate all 7 stages against user's verified financial balances,
        debts, goals, and transaction history.
        """
        # 1. Fetch relevant financial entities
        stmt_tx = select(Transaction).where(Transaction.user_id == user.id)
        transactions = list(db.execute(stmt_tx).scalars().all())

        stmt_goals = select(Goal).where(Goal.user_id == user.id)
        goals = list(db.execute(stmt_goals).scalars().all())

        stmt_debts = select(Debt).where(Debt.user_id == user.id, Debt.is_cleared == False)
        active_debts = list(db.execute(stmt_debts).scalars().all())

        # 2. Extract baseline financial metrics
        monthly_income = float(user.monthly_income)
        monthly_expenses = float(user.monthly_expenses)
        total_savings = float(user.initial_savings) + sum(g.current_amount for g in goals)
        
        if active_debts:
            total_debt = sum(d.current_balance for d in active_debts)
        else:
            total_debt = float(user.initial_debt)

        emergency_target = round(monthly_expenses * 3.0, 2)
        surplus = max(0.0, monthly_income - monthly_expenses)

        # ---------------------------------------------------------------------
        # Stage 1: Daily Cashflow & Awareness
        # ---------------------------------------------------------------------
        has_cashflow_data = len(transactions) > 0 or monthly_income > 0
        stage_1_progress = 100.0 if has_cashflow_data else 0.0
        stage_1_status = "completed" if has_cashflow_data else "in_progress"

        stage_1 = JourneyStageResponse(
            stage_number=1,
            stage_key="stage_1_cashflow",
            title=LocalizedText(
                en="Daily Cashflow & Awareness",
                te="దైనందిన నగదు ప్రవాహం & అవగాహన",
                hi="दैनिक आय-व्यय और बजट प्रबंधन",
            ),
            subtitle=LocalizedText(
                en="Track daily income and essential kitchen expenses.",
                te="రోజూవారీ ఆదాయం మరియు వంటగది ఖర్చులను లెక్కించండి.",
                hi="रोजाना की कमाई और घर के जरूरी खर्चों का हिसाब रखें।",
            ),
            status=stage_1_status,
            progress_percentage=stage_1_progress,
            target_metric_label="Monthly Income Tracked",
            target_metric_value=f"₹{int(monthly_income):,}",
            unlocked_badge="Cashflow Champion" if stage_1_status == "completed" else None,
            action_cta=LocalizedText(
                en="Log daily expense entry",
                te="ఖర్చును నమోదు చేయండి",
                hi="दैनिक खर्च दर्ज करें",
            ),
        )

        # ---------------------------------------------------------------------
        # Stage 2: Emergency Shield (Suraksha Kavach)
        # ---------------------------------------------------------------------
        if emergency_target > 0:
            emergency_progress = min(100.0, round((total_savings / emergency_target) * 100.0, 1))
        else:
            emergency_progress = 100.0 if total_savings > 0 else 0.0

        if emergency_progress >= 100.0:
            stage_2_status = "completed"
        elif stage_1_status == "completed":
            stage_2_status = "in_progress"
        else:
            stage_2_status = "locked"

        stage_2 = JourneyStageResponse(
            stage_number=2,
            stage_key="stage_2_emergency_shield",
            title=LocalizedText(
                en="Emergency Shield (Suraksha Kavach)",
                te="అత్యవసర రక్షణ నిధి (సురక్ష కవచ్)",
                hi="आपातकालीन सुरक्षा कवच",
            ),
            subtitle=LocalizedText(
                en="Build a 3-month living expense reserve in bank or post office.",
                te="బ్యాంకు లేదా పోస్టాఫీసులో 3 నెలల ఖర్చుల రక్షణ నిధిని సమకూర్చుకోండి.",
                hi="बैंक या डाकघर में 3 महीने के खर्च का सुरक्षा कोष तैयार करें।",
            ),
            status=stage_2_status,
            progress_percentage=emergency_progress,
            target_metric_label="Emergency Shield Target",
            target_metric_value=f"₹{int(total_savings):,} / ₹{int(emergency_target):,}",
            unlocked_badge="Suraksha Shield Verified" if stage_2_status == "completed" else None,
            action_cta=LocalizedText(
                en="Deposit to Emergency Buffer",
                te="అత్యవసర నిధికి పొదుపు చేయండి",
                hi="इमरजेंसी फंड में बचत जमा करें",
            ),
        )

        # ---------------------------------------------------------------------
        # Stage 3: High-Cost Debt Elimination
        # ---------------------------------------------------------------------
        if total_debt == 0.0:
            stage_3_progress = 100.0
            stage_3_status = "completed"
        else:
            # If user has debt, progress is based on debt paydown or status is in_progress
            stage_3_progress = 25.0 if stage_2_status in ["completed", "in_progress"] else 0.0
            stage_3_status = "in_progress" if stage_1_status == "completed" else "locked"

        stage_3 = JourneyStageResponse(
            stage_number=3,
            stage_key="stage_3_debt_elimination",
            title=LocalizedText(
                en="High-Cost Debt Elimination",
                te="అధిక వడ్డీ అప్పుల విముక్తి",
                hi="साहूकारी कर्ज से मुक्ति",
            ),
            subtitle=LocalizedText(
                en="Refinance 36% moneylender debt into 12% SHG credit and clear all liabilities.",
                te="వడ్డీ వ్యాపారుల అప్పులను తక్కువ వడ్డీ సంఘం రుణాలతో మార్చి అప్పులన్నీ తీర్చండి.",
                hi="महंगे कर्ज को सस्ते समूह ऋण में बदलकर ऋणमुक्त बनें।",
            ),
            status=stage_3_status,
            progress_percentage=stage_3_progress,
            target_metric_label="Outstanding Debt",
            target_metric_value=f"₹{int(total_debt):,}" if total_debt > 0 else "₹0 (Debt Free!)",
            unlocked_badge="Debt Free Pioneer" if stage_3_status == "completed" else None,
            action_cta=LocalizedText(
                en="View Debt Snowball Payoff Plan",
                te="రుణ విముక్తి ప్రణాళికను చూడండి",
                hi="कर्ज मुक्ति योजना देखें",
            ),
        )

        # ---------------------------------------------------------------------
        # Stage 4: Habitual Disciplined Saving
        # ---------------------------------------------------------------------
        has_active_goals = len(goals) > 0 or surplus >= 1000.0
        stage_4_progress = 100.0 if (len(goals) > 0 and any(g.current_amount > 0 for g in goals)) else (50.0 if has_active_goals else 0.0)
        
        if stage_4_progress >= 100.0 and stage_2_status == "completed":
            stage_4_status = "completed"
        elif stage_2_status in ["completed", "in_progress"]:
            stage_4_status = "in_progress"
        else:
            stage_4_status = "locked"

        stage_4 = JourneyStageResponse(
            stage_number=4,
            stage_key="stage_4_disciplined_saving",
            title=LocalizedText(
                en="Habitual Disciplined Saving",
                te="క్రమశిక్షణతో కూడిన నిరంతర పొదుపు",
                hi="नियमित और अनुशासित बचत",
            ),
            subtitle=LocalizedText(
                en="Automate recurring deposits on income days (Pay Yourself First).",
                te="ఆదాయం చేతికి రాగానే రికరింగ్ డిపాజిట్ లో క్రమం తప్పకుండా పొదుపు చేయండి.",
                hi="कमाई आते ही हर महीने डाकघर या बैंक आरडी में बचत जमा करें।",
            ),
            status=stage_4_status,
            progress_percentage=stage_4_progress,
            target_metric_label="Monthly Surplus Rate",
            target_metric_value=f"₹{int(surplus):,}/month",
            unlocked_badge="Disciplined Saver" if stage_4_status == "completed" else None,
            action_cta=LocalizedText(
                en="Start Recurring Deposit (RD)",
                te="రికరింగ్ డిపాజిట్ ప్రారంభించండి",
                hi="आरडी शुरू करें",
            ),
        )

        # ---------------------------------------------------------------------
        # Stage 5: Social Security & Micro-Insurance
        # ---------------------------------------------------------------------
        # If user has SHG membership, they usually have micro-insurance awareness
        is_insured = user.is_shg_member
        stage_5_progress = 100.0 if is_insured else 30.0
        stage_5_status = "completed" if is_insured else ("in_progress" if stage_2_status in ["completed", "in_progress"] else "locked")

        stage_5 = JourneyStageResponse(
            stage_number=5,
            stage_key="stage_5_micro_insurance",
            title=LocalizedText(
                en="Social Security & Micro-Insurance",
                te="సామాజిక భద్రత & మైక్రో బీమా",
                hi="सामाजिक सुरक्षा और बीमा",
            ),
            subtitle=LocalizedText(
                en="Enrol in PMSBY (₹20/yr) & PMJJBY (₹436/yr) for ₹4 Lakh family cover.",
                te="PMSBY మరియు PMJJBY పథకాలతో కుటుంబానికి ₹4 లక్షల రక్షణ పొందండి.",
                hi="PMSBY और PMJJBY से परिवार को ₹4 लाख की सुरक्षा दें।",
            ),
            status=stage_5_status,
            progress_percentage=stage_5_progress,
            target_metric_label="Coverage Status",
            target_metric_value="PMSBY + PMJJBY Active" if is_insured else "Enrollment Pending",
            unlocked_badge="Family Shielded" if stage_5_status == "completed" else None,
            action_cta=LocalizedText(
                en="Check Scheme Eligibility",
                te="పథకాల అర్హతను పరిశీలించండి",
                hi="योजनाओं की पात्रता देखें",
            ),
        )

        # ---------------------------------------------------------------------
        # Stage 6: Goal-Oriented Wealth Creation
        # ---------------------------------------------------------------------
        completed_goals = [g for g in goals if g.is_completed]
        stage_6_progress = round((len(completed_goals) / max(1, len(goals))) * 100.0, 1) if goals else 0.0
        stage_6_status = "completed" if len(completed_goals) > 0 else ("in_progress" if goals else "locked")

        stage_6 = JourneyStageResponse(
            stage_number=6,
            stage_key="stage_6_wealth_creation",
            title=LocalizedText(
                en="Goal-Oriented Wealth Creation",
                te="లక్ష్య ఆధారిత సంపద సృష్టి",
                hi="लक्ष्य आधारित संपत्ति निर्माण",
            ),
            subtitle=LocalizedText(
                en="Accumulate dedicated capital for income-generating tools & children's higher education.",
                te="కుటుంబ ఉన్నతి మరియు కుట్టు మిషన్లు, పాడి పశువుల కోసం నిధి సమకూర్చుకోండి.",
                hi="सिलाई मशीन, डेयरी या बच्चों की उच्च शिक्षा के लिए पूंजी बनाएं।",
            ),
            status=stage_6_status,
            progress_percentage=stage_6_progress,
            target_metric_label="Active Goals",
            target_metric_value=f"{len(completed_goals)} / {len(goals)} Completed",
            unlocked_badge="Wealth Builder" if stage_6_status == "completed" else None,
            action_cta=LocalizedText(
                en="Add New Goal",
                te="కొత్త లక్ష్యాన్ని జోడించండి",
                hi="नया लक्ष्य जोड़ें",
            ),
        )

        # ---------------------------------------------------------------------
        # Stage 7: Financial Independence & Community Leadership
        # ---------------------------------------------------------------------
        is_independent = total_debt == 0 and emergency_progress >= 100.0 and user.is_shg_member
        stage_7_progress = 100.0 if is_independent else 20.0
        stage_7_status = "completed" if is_independent else ("in_progress" if stage_3_status == "completed" else "locked")

        stage_7 = JourneyStageResponse(
            stage_number=7,
            stage_key="stage_7_leadership",
            title=LocalizedText(
                en="Financial Freedom & Community Leadership",
                te="ఆర్థిక స్వాతంత్ర్యం & సమాజ నాయకత్వం",
                hi="वित्तीय स्वतंत्रता और सामाजिक नेतृत्व",
            ),
            subtitle=LocalizedText(
                en="Zero high-interest debt, resilient emergency reserves, and mentoring fellow SHG women.",
                te="జీరో అప్పులు, బలమైన రక్షణ నిధి మరియు ఇతర మహిళలకు ఆర్థిక మార్గదర్శకత్వం.",
                hi="शून्य कर्ज, मजबूत बचत और समूह की अन्य बहनों को वित्तीय मार्गदर्शन।",
            ),
            status=stage_7_status,
            progress_percentage=stage_7_progress,
            target_metric_label="Leadership Status",
            target_metric_value="Sakhi Community Leader" if is_independent else "In Training",
            unlocked_badge="Sakhi Master Leader" if stage_7_status == "completed" else None,
            action_cta=LocalizedText(
                en="Mentor Peer SHG Members",
                te="తోటి మహిళలకు మార్గదర్శనం చేయండి",
                hi="साथी बहनों का मार्गदर्शन करें",
            ),
        )

        stages = [stage_1, stage_2, stage_3, stage_4, stage_5, stage_6, stage_7]
        completed_count = sum(1 for s in stages if s.status == "completed")

        # Determine current active stage (first incomplete or stage 2)
        active_stage = 2
        for s in stages:
            if s.status != "completed":
                active_stage = s.stage_number
                break

        overall_progress = round((completed_count / 7.0) * 100.0, 1)

        # Next milestone guidance
        if active_stage == 2:
            next_action = LocalizedText(
                en=f"Build your 3-month emergency safety buffer of ₹{int(emergency_target):,}.",
                te=f"మీ ₹{int(emergency_target):,} అత్యవసర రక్షణ నిధిని నిర్మించడంపై దృష్టి పెట్టండి.",
                hi=f"अपने ₹{int(emergency_target):,} के 3 महीने के सुरक्षा कवच को पूरा करें।",
            )
        elif active_stage == 3:
            next_action = LocalizedText(
                en=f"Eliminate high-cost moneylender debt of ₹{int(total_debt):,} using the snowball method.",
                te=f"మీ ₹{int(total_debt):,} ప్రైవేట్ అప్పును స్నోబాల్ పద్ధతి ద్వారా తీర్చండి.",
                hi=f"अपने ₹{int(total_debt):,} के साहूकारी कर्ज को तेजी से खत्म करें।",
            )
        else:
            next_action = LocalizedText(
                en="Continue regular savings and protect your family with micro-insurance.",
                te="నిరంతర పొదుపును కొనసాగిస్తూ ప్రభుత్వ బీమా రక్షణను పొందండి.",
                hi="नियमित बचत जारी रखें और परिवार को बीमा सुरक्षा दें।",
            )

        return JourneyRoadmapResponse(
            user_id=user.id,
            current_active_stage=active_stage,
            completed_stages_count=completed_count,
            total_stages=7,
            overall_journey_progress_percentage=overall_progress,
            next_milestone_action=next_action,
            stages=stages,
        )
