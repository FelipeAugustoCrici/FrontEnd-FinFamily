import { Button } from '@/components/ui/Button';
import { Save, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTokens } from '@/hooks/useTokens';

export function RecordFormHeader({ isEdit, isLoading }: { isEdit: boolean; isLoading: boolean }) {
  const navigate = useNavigate();
  const t = useTokens();

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: t.text.primary, marginBottom: 2 }}>
          {isEdit ? 'Editar Lançamento' : 'Novo Lançamento'}
        </h2>
        <p style={{ fontSize: 13, color: t.text.muted }}>
          {isEdit
            ? 'Atualize os dados do lançamento'
            : 'Preencha as informações do novo lançamento'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
          <X size={16} style={{ marginRight: 6 }} />
          Cancelar
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 size={16} style={{ marginRight: 6 }} className="animate-spin" />
          ) : (
            <Save size={16} style={{ marginRight: 6 }} />
          )}
          {isEdit ? 'Atualizar' : 'Salvar'}
        </Button>
      </div>
    </div>
  );
}
