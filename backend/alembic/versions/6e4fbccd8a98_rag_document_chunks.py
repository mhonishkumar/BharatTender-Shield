"""rag_document_chunks

Revision ID: 6e4fbccd8a98
Revises: e9c80d2f845b
Create Date: 2026-09-20 13:10:00.299439

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6e4fbccd8a98'
down_revision: Union[str, Sequence[str], None] = 'e9c80d2f845b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Check if we're on PostgreSQL, and if so, enable vector extension and use vector column
    bind = op.get_bind()
    is_postgres = bind.dialect.name == "postgresql"
    
    if is_postgres:
        op.execute("CREATE EXTENSION IF NOT EXISTS vector;")

    op.create_table(
        'document_chunks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('document_id', sa.Integer(), nullable=False),
        sa.Column('application_id', sa.Integer(), nullable=True),
        sa.Column('tender_id', sa.Integer(), nullable=True),
        sa.Column('bidder_id', sa.Integer(), nullable=True),
        sa.Column('chunk_text', sa.Text(), nullable=False),
        sa.Column('page_number', sa.Integer(), default=1),
        sa.Column('chunk_index', sa.Integer(), default=0),
        sa.Column('source_filename', sa.String(255), nullable=True),
        sa.Column('doc_type', sa.String(50), nullable=True),
        sa.Column('embedding', sa.Text(), nullable=True),
        sa.Column('chunk_metadata', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['document_id'], ['documents.id']),
        sa.ForeignKeyConstraint(['application_id'], ['applications.id']),
        sa.ForeignKeyConstraint(['tender_id'], ['tenders.id']),
        sa.ForeignKeyConstraint(['bidder_id'], ['bidder_profiles.id']),
    )
    op.create_index(op.f('ix_document_chunks_document_id'), 'document_chunks', ['document_id'])
    op.create_index(op.f('ix_document_chunks_application_id'), 'document_chunks', ['application_id'])
    op.create_index(op.f('ix_document_chunks_tender_id'), 'document_chunks', ['tender_id'])
    op.create_index(op.f('ix_document_chunks_bidder_id'), 'document_chunks', ['bidder_id'])
    
    # If postgres, we want the column to actually be vector type
    if is_postgres:
        op.execute("ALTER TABLE document_chunks ALTER COLUMN embedding TYPE vector(768) USING embedding::vector")


def downgrade() -> None:
    op.drop_table('document_chunks')
