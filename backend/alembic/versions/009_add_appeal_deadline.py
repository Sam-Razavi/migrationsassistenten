"""Add appeal_deadline column to cases

Revision ID: 009
Revises: 008
Create Date: 2026-04-01 09:00:00

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "009"
down_revision: Union[str, None] = "008"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("cases") as batch_op:
        batch_op.add_column(sa.Column("appeal_deadline", sa.String(20), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table("cases") as batch_op:
        batch_op.drop_column("appeal_deadline")
