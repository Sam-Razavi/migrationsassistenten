"""Add decision_type enum to cases

Revision ID: 002
Revises: 001
Create Date: 2026-01-13 09:30:00

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("cases") as batch_op:
        batch_op.add_column(
            sa.Column(
                "decision_type",
                sa.Enum(
                    "family_reunification",
                    "asylum",
                    "permanent_residence",
                    "work_permit",
                    name="decisiontype",
                ),
                nullable=True,
            )
        )
        batch_op.add_column(sa.Column("rejection_reason", sa.Text(), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table("cases") as batch_op:
        batch_op.drop_column("rejection_reason")
        batch_op.drop_column("decision_type")
