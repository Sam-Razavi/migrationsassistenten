"""Create cases table

Revision ID: 001
Revises:
Create Date: 2026-01-06 14:22:00

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "cases",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("case_number", sa.String(length=100), nullable=False),
        sa.Column("applicant_name", sa.String(length=200), nullable=False),
        sa.Column("dob", sa.String(length=20), nullable=False),
        sa.Column("nationality", sa.String(length=100), nullable=False),
        sa.Column("rejection_date", sa.String(length=20), nullable=False),
        sa.Column("mv_reference", sa.String(length=200), nullable=True),
        sa.Column(
            "decision_type",
            sa.Enum(
                "family_reunification",
                "asylum",
                "permanent_residence",
                "work_permit",
                name="decisiontype",
            ),
            nullable=False,
        ),
        sa.Column("rejection_reason", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_cases_id"), "cases", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_cases_id"), table_name="cases")
    op.drop_table("cases")
