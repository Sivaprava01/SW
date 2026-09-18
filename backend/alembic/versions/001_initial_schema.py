"""initial_schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-09-18 12:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # 1. Users Table
    op.create_table(
        'users',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=True),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('password_hash', sa.String(length=255), nullable=True),
        sa.Column('role', sa.String(length=20), nullable=False, server_default='USER'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('1')),
        sa.Column('age', sa.Integer(), nullable=False),
        sa.Column('state', sa.String(length=100), nullable=False),
        sa.Column('gender', sa.String(length=20), nullable=False, server_default='women'),
        sa.Column('is_shg_member', sa.Boolean(), nullable=False, server_default=sa.text('0')),
        sa.Column('has_business_interest', sa.Boolean(), nullable=False, server_default=sa.text('0')),
        sa.Column('is_rural', sa.Boolean(), nullable=False, server_default=sa.text('1')),
        sa.Column('occupation', sa.String(length=100), nullable=True),
        sa.Column('monthly_income', sa.Numeric(precision=12, scale=2, asdecimal=False), nullable=False, server_default='0.0'),
        sa.Column('monthly_expenses', sa.Numeric(precision=12, scale=2, asdecimal=False), nullable=False, server_default='0.0'),
        sa.Column('savings', sa.Numeric(precision=12, scale=2, asdecimal=False), nullable=False, server_default='0.0'),
        sa.Column('debt', sa.Numeric(precision=12, scale=2, asdecimal=False), nullable=False, server_default='0.0'),
        sa.Column('financial_goal', sa.String(length=200), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_phone'), 'users', ['phone'], unique=True)

    # 2. Goals Table
    op.create_table(
        'goals',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('target_amount', sa.Numeric(precision=12, scale=2, asdecimal=False), nullable=False),
        sa.Column('current_amount', sa.Numeric(precision=12, scale=2, asdecimal=False), nullable=False, server_default='0.0'),
        sa.Column('target_date', sa.String(length=20), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_goals_user_id'), 'goals', ['user_id'], unique=False)

    # 3. Transactions Table
    op.create_table(
        'transactions',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('amount', sa.Numeric(precision=12, scale=2, asdecimal=False), nullable=False),
        sa.Column('type', sa.String(length=20), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('date', sa.String(length=20), nullable=False),
        sa.Column('description', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_transactions_user_id'), 'transactions', ['user_id'], unique=False)
    op.create_index('ix_transactions_user_id_date', 'transactions', ['user_id', 'date'], unique=False)
    op.create_index('ix_transactions_user_id_created_at', 'transactions', ['user_id', 'created_at'], unique=False)

    # 4. Government Schemes Table
    op.create_table(
        'government_schemes',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('what_it_provides', sa.Text(), nullable=False),
        sa.Column('target_users', sa.Text(), nullable=False),
        sa.Column('basic_eligibility', sa.Text(), nullable=False),
        sa.Column('required_documents', sa.Text(), nullable=False),
        sa.Column('application_process', sa.Text(), nullable=False),
        sa.Column('official_source', sa.String(length=500), nullable=False),
        sa.Column('state', sa.String(length=100), nullable=False, server_default='Central'),
        sa.Column('category', sa.String(length=100), nullable=False),
        sa.Column('min_age', sa.Integer(), nullable=True),
        sa.Column('max_age', sa.Integer(), nullable=True),
        sa.Column('gender_target', sa.String(length=20), nullable=True, server_default='all'),
        sa.Column('max_income', sa.Numeric(precision=12, scale=2, asdecimal=False), nullable=True),
        sa.Column('is_rural_relevant', sa.Boolean(), nullable=True, server_default=sa.text('1')),
        sa.Column('is_shg_related', sa.Boolean(), nullable=True, server_default=sa.text('0')),
        sa.Column('is_business_related', sa.Boolean(), nullable=True, server_default=sa.text('0')),
        sa.PrimaryKeyConstraint('id')
    )

    # 5. User Scheme Matches Table
    op.create_table(
        'user_scheme_matches',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('scheme_id', sa.String(length=36), nullable=False),
        sa.Column('match_score', sa.Integer(), nullable=True, server_default='100'),
        sa.Column('match_reasons', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=True, server_default='matched'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['scheme_id'], ['government_schemes.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_scheme_matches_scheme_id'), 'user_scheme_matches', ['scheme_id'], unique=False)
    op.create_index(op.f('ix_user_scheme_matches_user_id'), 'user_scheme_matches', ['user_id'], unique=False)
    op.create_index('ix_user_scheme_matches_user_scheme', 'user_scheme_matches', ['user_id', 'scheme_id'], unique=False)

    # 6. Refresh Tokens Table (Authentication Sessions)
    op.create_table(
        'refresh_tokens',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('token_hash', sa.String(length=255), nullable=False),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('revoked', sa.Boolean(), nullable=False, server_default=sa.text('0')),
        sa.Column('revoked_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('user_agent', sa.String(length=255), nullable=True),
        sa.Column('ip_address', sa.String(length=45), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_refresh_tokens_expires_at'), 'refresh_tokens', ['expires_at'], unique=False)
    op.create_index(op.f('ix_refresh_tokens_token_hash'), 'refresh_tokens', ['token_hash'], unique=True)
    op.create_index(op.f('ix_refresh_tokens_user_id'), 'refresh_tokens', ['user_id'], unique=False)

def downgrade() -> None:
    op.drop_table('refresh_tokens')
    op.drop_table('user_scheme_matches')
    op.drop_table('government_schemes')
    op.drop_table('transactions')
    op.drop_table('goals')
    op.drop_table('users')
