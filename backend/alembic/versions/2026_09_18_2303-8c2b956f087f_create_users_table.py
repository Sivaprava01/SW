"""create users table

Revision ID: 8c2b956f087f
Revises: 
Create Date: 2026-09-18 23:03:16.757658

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8c2b956f087f'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('phone_number', sa.String(length=20), nullable=True),
        sa.Column('age', sa.Integer(), nullable=False, server_default='25'),
        sa.Column('gender', sa.String(length=20), nullable=False, server_default='female'),
        sa.Column('state', sa.String(length=100), nullable=False, server_default='Telangana'),
        sa.Column('district', sa.String(length=100), nullable=True),
        sa.Column('locality_type', sa.String(length=50), nullable=False, server_default='rural'),
        sa.Column('primary_language', sa.String(length=10), nullable=False, server_default='te'),
        sa.Column('is_shg_member', sa.Boolean(), nullable=False, server_default='0'),
        sa.Column('shg_name', sa.String(length=150), nullable=True),
        sa.Column('occupation', sa.String(length=100), nullable=True, server_default='Tailoring'),
        sa.Column('monthly_income', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('monthly_expenses', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('initial_savings', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('initial_debt', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_phone_number'), 'users', ['phone_number'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_users_phone_number'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')
