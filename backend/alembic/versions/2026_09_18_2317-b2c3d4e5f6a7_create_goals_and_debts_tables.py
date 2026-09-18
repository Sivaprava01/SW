"""create goals and debts tables

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2026-09-18 23:17:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b2c3d4e5f6a7'
down_revision: Union[str, None] = 'a1b2c3d4e5f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create goals table
    op.create_table(
        'goals',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=150), nullable=False),
        sa.Column('target_amount', sa.Float(), nullable=False),
        sa.Column('current_amount', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('target_months', sa.Integer(), nullable=False, server_default='12'),
        sa.Column('target_date', sa.Date(), nullable=True),
        sa.Column('category', sa.String(length=50), nullable=False, server_default='General Savings'),
        sa.Column('priority', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('is_completed', sa.Boolean(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_goals_id'), 'goals', ['id'], unique=False)
    op.create_index(op.f('ix_goals_user_id'), 'goals', ['user_id'], unique=False)

    # Create debts table
    op.create_table(
        'debts',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('lender_name', sa.String(length=150), nullable=False),
        sa.Column('lender_type', sa.String(length=50), nullable=False, server_default='moneylender'),
        sa.Column('principal_amount', sa.Float(), nullable=False),
        sa.Column('current_balance', sa.Float(), nullable=False),
        sa.Column('monthly_interest_rate', sa.Float(), nullable=False, server_default='3.0'),
        sa.Column('annual_interest_rate', sa.Float(), nullable=False, server_default='36.0'),
        sa.Column('monthly_emi_payment', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('is_cleared', sa.Boolean(), nullable=False, server_default='0'),
        sa.Column('notes', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_debts_id'), 'debts', ['id'], unique=False)
    op.create_index(op.f('ix_debts_user_id'), 'debts', ['user_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_debts_user_id'), table_name='debts')
    op.drop_index(op.f('ix_debts_id'), table_name='debts')
    op.drop_table('debts')
    op.drop_index(op.f('ix_goals_user_id'), table_name='goals')
    op.drop_index(op.f('ix_goals_id'), table_name='goals')
    op.drop_table('goals')
