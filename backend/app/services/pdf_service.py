from pathlib import Path
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML

TEMPLATES_DIR = Path(__file__).parent.parent / "templates"

_jinja_env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))


def _decision_type_label(decision_type) -> str:
    labels = {
        "family_reunification": "Familjeåterförening",
        "asylum": "Asyl",
        "permanent_residence": "Permanent uppehållstillstånd",
        "work_permit": "Arbetstillstånd",
    }
    val = decision_type.value if hasattr(decision_type, "value") else str(decision_type)
    return labels.get(val, str(decision_type))


def generate_pdf(case, document_text: str) -> bytes:
    template = _jinja_env.get_template("appeal_document.html")
    html_content = template.render(
        case=case,
        document_text=document_text,
        decision_type_label=_decision_type_label(case.decision_type),
    )
    pdf_bytes = HTML(
        string=html_content,
        base_url=str(TEMPLATES_DIR),
    ).write_pdf()
    return pdf_bytes
