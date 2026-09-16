const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const client = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

async function syncResult(record) {
  if (!client) return { ok: false, pending: true, reason: 'Supabase no configurado' };

  const { error } = await client.from('resultados').insert({
    nombre: record.nombre,
    grado: record.grado,
    mision: record.mision,
    nota: record.nota,
    aciertos: record.aciertos,
    total: record.total,
    puntaje: record.puntaje,
    mejor_racha: record.mejorRacha,
    fecha: record.fecha
  });

  if (error) return { ok: false, pending: true, reason: error.message };
  return { ok: true, pending: false };
}

module.exports = { syncResult };
