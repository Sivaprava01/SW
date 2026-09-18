"""create government_schemes and user_scheme_bookmarks tables

Revision ID: d4e5f6a7b8c9
Revises: c3d4e5f6a7b8
Create Date: 2026-09-18 23:42:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd4e5f6a7b8c9'
down_revision: Union[str, None] = 'c3d4e5f6a7b8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Government Schemes table
    op.create_table(
        'government_schemes',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('slug', sa.String(length=100), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('short_name', sa.String(length=50), nullable=False),
        sa.Column('category', sa.String(length=100), nullable=False),
        sa.Column('jurisdiction', sa.String(length=100), nullable=False, server_default='Central'),
        sa.Column('benefit_amount_display', sa.String(length=150), nullable=False),
        sa.Column('cost_or_premium', sa.String(length=150), nullable=False),
        sa.Column('min_age', sa.Integer(), nullable=False, server_default='18'),
        sa.Column('max_age', sa.Integer(), nullable=False, server_default='70'),
        sa.Column('gender_eligibility', sa.String(length=20), nullable=False, server_default='all'),
        sa.Column('rural_urban', sa.String(length=20), nullable=False, server_default='all'),
        sa.Column('requires_shg', sa.Boolean(), nullable=False, server_default='0'),
        sa.Column('max_annual_income', sa.Float(), nullable=True),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('what_it_provides', sa.Text(), nullable=False),
        sa.Column('target_beneficiaries', sa.String(length=255), nullable=False),
        sa.Column('required_documents_json', sa.Text(), nullable=False, server_default='[]'),
        sa.Column('offline_application_process', sa.Text(), nullable=False),
        sa.Column('official_portal_url', sa.String(length=255), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_government_schemes_id'), 'government_schemes', ['id'], unique=False)
    op.create_index(op.f('ix_government_schemes_slug'), 'government_schemes', ['slug'], unique=True)
    op.create_index(op.f('ix_government_schemes_category'), 'government_schemes', ['category'], unique=False)
    op.create_index(op.f('ix_government_schemes_jurisdiction'), 'government_schemes', ['jurisdiction'], unique=False)

    # 2. User Scheme Bookmarks table
    op.create_table(
        'user_scheme_bookmarks',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('scheme_id', sa.Integer(), nullable=False),
        sa.Column('is_bookmarked', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('application_status', sa.String(length=50), nullable=False, server_default='discovered'),
        sa.Column('notes', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.ForeignKeyConstraint(['scheme_id'], ['government_schemes.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'scheme_id', name='uq_user_scheme_bookmark')
    )
    op.create_index(op.f('ix_user_scheme_bookmarks_id'), 'user_scheme_bookmarks', ['id'], unique=False)
    op.create_index(op.f('ix_user_scheme_bookmarks_user_id'), 'user_scheme_bookmarks', ['user_id'], unique=False)
    op.create_index(op.f('ix_user_scheme_bookmarks_scheme_id'), 'user_scheme_bookmarks', ['scheme_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_user_scheme_bookmarks_scheme_id'), table_name='user_scheme_bookmarks')
    op.drop_index(op.f('ix_user_scheme_bookmarks_user_id'), table_name='user_scheme_bookmarks')
    op.drop_index(op.f('ix_user_scheme_bookmarks_id'), table_name='user_scheme_bookmarks')
    op.drop_table('user_scheme_bookmarks')

    op.drop_index(op.f('ix_government_schemes_jurisdiction'), table_name='government_schemes')
    op.drop_index(op.f('ix_government_schemes_category'), table_name='government_schemes')
    op.drop_index(op.f('ix_government_schemes_slug'), table_name='government_schemes')
    op.drop_index(op.f('ix_government_schemes_id'), table_name='government_schemes')
    op.drop_table('government_schemes')
