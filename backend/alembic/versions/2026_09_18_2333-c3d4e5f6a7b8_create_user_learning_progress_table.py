"""create user_learning_progress table

Revision ID: c3d4e5f6a7b8
Revises: b2c3d4e5f6a7
Create Date: 2026-09-18 23:33:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c3d4e5f6a7b8'
down_revision: Union[str, None] = 'b2c3d4e5f6a7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'user_learning_progress',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('module_id', sa.String(length=50), nullable=False),
        sa.Column('lesson_id', sa.String(length=50), nullable=False),
        sa.Column('is_completed', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('quiz_score', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'lesson_id', name='uq_user_lesson_progress')
    )
    op.create_index(op.f('ix_user_learning_progress_id'), 'user_learning_progress', ['id'], unique=False)
    op.create_index(op.f('ix_user_learning_progress_user_id'), 'user_learning_progress', ['user_id'], unique=False)
    op.create_index(op.f('ix_user_learning_progress_module_id'), 'user_learning_progress', ['module_id'], unique=False)
    op.create_index(op.f('ix_user_learning_progress_lesson_id'), 'user_learning_progress', ['lesson_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_user_learning_progress_lesson_id'), table_name='user_learning_progress')
    op.drop_index(op.f('ix_user_learning_progress_module_id'), table_name='user_learning_progress')
    op.drop_index(op.f('ix_user_learning_progress_user_id'), table_name='user_learning_progress')
    op.drop_index(op.f('ix_user_learning_progress_id'), table_name='user_learning_progress')
    op.drop_table('user_learning_progress')
