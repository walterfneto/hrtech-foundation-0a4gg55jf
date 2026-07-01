-- Caminho HRTech — Database Schema with RLS for Multi-Tenancy
-- All tables include empresa_id for logical isolation and deleted_at for soft deletes

CREATE TABLE IF NOT EXISTS empresa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  plano TEXT DEFAULT 'free',
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS usuario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresa(id),
  auth_user_id UUID REFERENCES auth.users(id),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  papel_sistema TEXT NOT NULL DEFAULT 'Colaborador' CHECK (papel_sistema IN ('Super Admin','Admin RH','Gestor','Colaborador')),
  cargo TEXT,
  departamento TEXT,
  manager_id UUID REFERENCES usuario(id),
  time_id UUID,
  avatar_url TEXT,
  status TEXT DEFAULT 'Ativo',
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS time (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresa(id),
  nome TEXT NOT NULL,
  time_pai_id UUID REFERENCES time(id),
  manager_id UUID REFERENCES usuario(id),
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE usuario ADD COLUMN IF NOT EXISTS time_id UUID REFERENCES time(id);

CREATE TABLE IF NOT EXISTS avaliacao_modelo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresa(id),
  nome TEXT NOT NULL,
  descricao TEXT,
  questoes JSONB NOT NULL DEFAULT '[]',
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS avaliacao_ciclo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresa(id),
  modelo_id UUID NOT NULL REFERENCES avaliacao_modelo(id),
  nome TEXT NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  participantes TEXT DEFAULT 'empresa',
  status TEXT DEFAULT 'rascunho' CHECK (status IN ('rascunho','ativo','fechado')),
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS avaliacao_resposta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ciclo_id UUID NOT NULL REFERENCES avaliacao_ciclo(id),
  avaliador_id UUID NOT NULL REFERENCES usuario(id),
  avaliado_id UUID NOT NULL REFERENCES usuario(id),
  tipo TEXT NOT NULL CHECK (tipo IN ('auto','gestor','par')),
  respostas JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente','em_andamento','concluida')),
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for multi-tenancy queries
CREATE INDEX IF NOT EXISTS idx_usuario_empresa ON usuario(empresa_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_time_empresa ON time(empresa_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_modelo_empresa ON avaliacao_modelo(empresa_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_ciclo_empresa ON avaliacao_ciclo(empresa_id) WHERE deleted_at IS NULL;

-- Row Level Security: Tenant Isolation
ALTER TABLE usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE time ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacao_modelo ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacao_ciclo ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacao_resposta ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see data from their own empresa
CREATE POLICY usuario_tenant_isolation ON usuario
  USING (empresa_id = (SELECT empresa_id FROM usuario WHERE auth_user_id = auth.uid() AND deleted_at IS NULL));

CREATE POLICY time_tenant_isolation ON time
  USING (empresa_id = (SELECT empresa_id FROM usuario WHERE auth_user_id = auth.uid() AND deleted_at IS NULL));

CREATE POLICY modelo_tenant_isolation ON avaliacao_modelo
  USING (empresa_id = (SELECT empresa_id FROM usuario WHERE auth_user_id = auth.uid() AND deleted_at IS NULL));

CREATE POLICY ciclo_tenant_isolation ON avaliacao_ciclo
  USING (empresa_id = (SELECT empresa_id FROM usuario WHERE auth_user_id = auth.uid() AND deleted_at IS NULL));

-- LGPD: Only HR Admins and Super Admins can access full employee lists
CREATE POLICY usuario_full_list_lgpd ON usuario
  FOR SELECT USING (
    empresa_id = (SELECT empresa_id FROM usuario WHERE auth_user_id = auth.uid() AND deleted_at IS NULL)
    AND (
      papel_sistema IN ('Super Admin', 'Admin RH')
      OR id = (SELECT id FROM usuario WHERE auth_user_id = auth.uid())
      OR manager_id = (SELECT id FROM usuario WHERE auth_user_id = auth.uid())
    )
  );

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_usuario BEFORE UPDATE ON usuario FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_time BEFORE UPDATE ON time FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_modelo BEFORE UPDATE ON avaliacao_modelo FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_ciclo BEFORE UPDATE ON avaliacao_ciclo FOR EACH ROW EXECUTE FUNCTION update_updated_at();
