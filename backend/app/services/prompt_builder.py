from app.models.case import Case, DecisionType


def build_system_prompt() -> str:
    return """Du är en svensk juridisk dokumentassistent specialiserad på migrationsrätt.
Du hjälper privatpersoner att upprätta formella överklagandehandlingar till svenska migrationsdomstolar.

Skriv ENDAST på formell svensk juridisk svenska.
Följ den exakta strukturen i denna ordning:

1. YRKANDE — vad klaganden yrkar att domstolen beslutar
2. SAKFRAMSTÄLLNING — kronologisk beskrivning av sakförhållandena
3. GRUNDERNA FÖR ÖVERKLAGANDET — juridiska grunder (vilka lagar/artiklar kränks)
4. BEVISNING — numrerad förteckning över åberopad bevisning

Relevanta rättskällor:
- Utlänningslagen (2005:716), UtlL
- Europakonventionen (ECHR), artikel 8 — rätten till familje- och privatliv
- 5 kap. 3 c § UtlL — familjeåterförening
- 5 kap. 17 § UtlL — permanent uppehållstillstånd
- Proportionalitetsprincipen (avvägning mellan individuellt intresse och allmänt intresse)
- MIG-domar från Migrationsöverdomstolen
- EU-direktiv 2003/86/EG om rätt till familjeåterförening

Ge INTE juridisk rådgivning. Formulera endast det klaganden har angett som fakta.
Var precis, formell och strukturerad. Inled alltid med rubrik och mottagare."""


def build_user_prompt(case: Case) -> str:
    decision_labels = {
        DecisionType.family_reunification: "Familjeåterförening",
        DecisionType.asylum: "Asyl",
        DecisionType.permanent_residence: "Permanent uppehållstillstånd",
        DecisionType.work_permit: "Arbetstillstånd",
    }

    law_refs = {
        DecisionType.family_reunification: (
            "5 kap. 3 c § UtlL, 5 kap. 16 § UtlL, ECHR artikel 8, "
            "EU-direktiv 2003/86/EG om rätt till familjeåterförening, MIG 2012:13"
        ),
        DecisionType.asylum: (
            "1 kap. 3 § UtlL (flyktingdefinition), 4 kap. 1 § UtlL, "
            "4 kap. 2 § UtlL (alternativ skyddsstatus), ECHR artikel 3, ECHR artikel 8, "
            "Genèvekonventionen 1951"
        ),
        DecisionType.permanent_residence: (
            "5 kap. 17 § UtlL, 5 kap. 18 § UtlL, proportionalitetsprincipen, "
            "MIG 2009:23, ECHR artikel 8"
        ),
        DecisionType.work_permit: (
            "6 kap. 2 § UtlL, EU:s rörlighetsdirektiv 2004/38/EG, "
            "proportionalitetsprincipen"
        ),
    }

    evidence_text = ""
    if case.evidence:
        checked = [i for i in case.evidence if isinstance(i, dict) and i.get("checked")]
        for idx, item in enumerate(checked, 1):
            label = item.get("label", "")
            desc = item.get("description", "")
            evidence_text += f"{idx}. {label}"
            if desc:
                evidence_text += f" ({desc})"
            evidence_text += "\n"

    timeline_text = ""
    if case.timeline:
        sorted_entries = sorted(
            [e for e in case.timeline if isinstance(e, dict)],
            key=lambda x: x.get("date", ""),
        )
        for entry in sorted_entries:
            date = entry.get("date", "")
            desc = entry.get("description", "")
            if date and desc:
                timeline_text += f"- {date}: {desc}\n"

    return f"""Upprätta ett komplett formellt överklagande med följande uppgifter:

ÄRENDETYP: {decision_labels.get(case.decision_type, str(case.decision_type))}
TILLÄMPLIG LAGSTIFTNING: {law_refs.get(case.decision_type, "UtlL")}

KLAGANDE:
- Fullständigt namn: {case.applicant_name}
- Födelsedatum: {case.dob}
- Nationalitet: {case.nationality}

MIGRATIONSVERKETS BESLUT:
- Målnummer/ärendenummer: {case.case_number}
- Referensnummer: {case.mv_reference or "Ej angivet"}
- Beslutsdatum: {case.rejection_date}
- Skäl för avslag: {case.rejection_reason or "Ej angivet"}

KRONOLOGISKA HÄNDELSER:
{timeline_text or "Inga tidpunkter angivna"}

ÅBEROPAD BEVISNING:
{evidence_text or "Ingen bevisning angiven"}

Inled dokumentet med:
Till: Migrationsdomstolen
Mål nr: {case.case_number}
Klagande: {case.applicant_name}, {case.dob}
Motpart: Migrationsverket

Skriv sedan överklagandet med de fyra avsnitten: YRKANDE, SAKFRAMSTÄLLNING, GRUNDERNA FÖR ÖVERKLAGANDET (inkludera proportionalitetsresonemang), BEVISNING.
Avsluta med plats för underskrift.
"""
