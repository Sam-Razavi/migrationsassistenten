"""Add user_id foreign key to cases

Revision ID: 007
Revises: 006
Create Date: 2026-03-04 10:05:00

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "007"
down_revision: Union[str, None] = "006"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("cases") as batch_op:
        batch_op.add_column(
            sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
        )
        batch_op.create_index("ix_cases_user_id", ["user_id"])


def downgrade() -> None:
    with op.batch_alter_table("cases") as batch_op:
        batch_op.drop_index("ix_cases_user_id")
        batch_op.drop_column("user_id")
