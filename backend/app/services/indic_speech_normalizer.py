"""
Sakhi Indic Speech Normalizer.

Transforms written financial markdown and abbreviations into fluent,
natural phonetic speech text tailored for Telugu, Hindi, and Indian English TTS engines.
"""

import re


class IndicSpeechNormalizer:
    """Pre-processing engine for text-to-speech prosody and Indic phonetic normalization."""

    @classmethod
    def normalize_for_speech(cls, text: str, language: str = "en") -> str:
        """
        Clean markdown formatting, expand currency symbols, percentages, and financial acronyms.
        """
        if not text:
            return ""

        lang = language.lower()[:2] if language else "en"
        cleaned = text

        # 1. Strip Markdown Formatting (bold, italics, headers, code, bullet points)
        cleaned = re.sub(r"(\*\*|\*|__|_|`|#+)", "", cleaned)
        cleaned = re.sub(r"^\s*[-*•]\s*", "", cleaned, flags=re.MULTILINE)
        cleaned = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", cleaned)  # Convert [text](url) -> text

        # 2. Expand Financial Acronyms based on Language
        cleaned = cls._expand_acronyms(cleaned, lang)

        # 3. Expand Currency
        cleaned = cls._expand_currency(cleaned, lang)

        # 4. Expand Percentages
        cleaned = cls._expand_percentages(cleaned, lang)

        # 5. Expand Rates and Frequencies (e.g. /mo, /year)
        cleaned = cls._expand_frequencies(cleaned, lang)

        # 6. Normalize Whitespace and Linebreaks for smooth pause cadence
        cleaned = re.sub(r"\n+", ". ", cleaned)
        cleaned = re.sub(r"\s+", " ", cleaned)
        cleaned = re.sub(r"\.+", ".", cleaned)
        cleaned = cleaned.strip()

        return cleaned

    @classmethod
    def _expand_currency(cls, text: str, lang: str) -> str:
        """Convert ₹ and Rs. notations into localized words."""
        if lang == "te":
            # Replace ₹ or రూ. or Rs. followed by amount with amount + రూపాయలు
            text = re.sub(r"(?:₹|రూ\.?|Rs\.?)\s*([0-9,]+(?:\.[0-9]+)?)", r"\1 రూపాయలు", text)
        elif lang == "hi":
            text = re.sub(r"(?:₹|रु\.?|Rs\.?)\s*([0-9,]+(?:\.[0-9]+)?)", r"\1 रुपये", text)
        else:
            text = re.sub(r"(?:₹|Rs\.?)\s*([0-9,]+(?:\.[0-9]+)?)", r"\1 rupees", text)
        return text

    @classmethod
    def _expand_percentages(cls, text: str, lang: str) -> str:
        """Convert % symbols into spoken words."""
        if lang == "te":
            text = re.sub(r"([0-9]+(?:\.[0-9]+)?)\s*%", r"\1 శాతం", text)
        elif lang == "hi":
            text = re.sub(r"([0-9]+(?:\.[0-9]+)?)\s*%", r"\1 प्रतिशत", text)
        else:
            text = re.sub(r"([0-9]+(?:\.[0-9]+)?)\s*%", r"\1 percent", text)
        return text

    @classmethod
    def _expand_acronyms(cls, text: str, lang: str) -> str:
        """Expand common Indian financial and welfare scheme abbreviations."""
        if lang == "te":
            replacements = {
                r"\bSHG\b": "ఎస్.హెచ్.జి సంఘం",
                r"\bPMSBY\b": "పి.ఎం సురక్షా బీమా యోజన",
                r"\bPMJJBY\b": "పి.ఎం జీవన్ జ్యోతి బీమా యోజన",
                r"\bRD\b": "రికరింగ్ డిపాజిట్",
                r"\bFD\b": "ఫిక్స్‌డ్ డిపాజిట్",
                r"\bAPR\b": "వార్షిక వడ్డీ రేటు",
                r"\bCSP\b": "బ్యాంక్ మిత్ర",
                r"\bVO\b": "గ్రామ సంఘం",
            }
        elif lang == "hi":
            replacements = {
                r"\bSHG\b": "स्वयं सहायता समूह",
                r"\bPMSBY\b": "प्रधानमंत्री सुरक्षा बीमा योजना",
                r"\bPMJJBY\b": "प्रधानमंत्री जीवन ज्योति बीमा योजना",
                r"\bRD\b": "आवर्ती जमा",
                r"\bFD\b": "सावधि जमा",
                r"\bAPR\b": "वार्षिक ब्याज दर",
                r"\bCSP\b": "बैंक मित्र",
                r"\bVO\b": "ग्राम संगठन",
            }
        else:
            replacements = {
                r"\bSHG\b": "Self Help Group",
                r"\bPMSBY\b": "P M Suraksha Bima Yojana",
                r"\bPMJJBY\b": "P M Jeevan Jyoti Bima Yojana",
                r"\bRD\b": "Recurring Deposit",
                r"\bFD\b": "Fixed Deposit",
                r"\bAPR\b": "Annual Percentage Rate",
            }

        for pattern, repl in replacements.items():
            text = re.sub(pattern, repl, text, flags=re.IGNORECASE)
        return text

    @classmethod
    def _expand_frequencies(cls, text: str, lang: str) -> str:
        """Convert frequency tokens like /mo, /year to spoken natural cadence."""
        if lang == "te":
            text = re.sub(r"/(?:mo|month|నెల)\b", " నెలకు", text, flags=re.IGNORECASE)
            text = re.sub(r"/(?:yr|year|సంవత్సరం)\b", " సంవత్సరానికి", text, flags=re.IGNORECASE)
        elif lang == "hi":
            text = re.sub(r"/(?:mo|month|महीना)\b", " प्रति माह", text, flags=re.IGNORECASE)
            text = re.sub(r"/(?:yr|year|वर्ष)\b", " प्रति वर्ष", text, flags=re.IGNORECASE)
        else:
            text = re.sub(r"/(?:mo|month)\b", " per month", text, flags=re.IGNORECASE)
            text = re.sub(r"/(?:yr|year)\b", " per year", text, flags=re.IGNORECASE)
        return text
