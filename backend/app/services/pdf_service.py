from pathlib import Path

TEMPLATES_DIR = Path(__file__).parent.parent / "templates"


def generate_pdf(case, document_text: str) -> bytes:
    raise NotImplementedError("PDF rendering not yet implemented — see next commit")
