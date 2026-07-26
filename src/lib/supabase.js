import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create client only if credentials are present
const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Records a new game session start to Supabase.
 * Silently fails if Supabase is unavailable or not configured —
 * so the game always works regardless of connectivity.
 *
 * Expected table schema:
 *   monopoly_sessions (
 *     id          uuid  primary key default gen_random_uuid(),
 *     started_at  timestamptz default now(),
 *     player_names text[]
 *   )
 */
export const recordGameStart = async (playerNames) => {
  if (!supabase) {
    console.info('[Supabase] Not configured — skipping game session record.');
    return;
  }

  try {
    const { error } = await supabase
      .from('monopoly_sessions')
      .insert([{ player_names: playerNames }]);

    if (error) {
      console.warn('[Supabase] Could not record game session:', error.message);
    } else {
      console.info('[Supabase] Game session recorded:', playerNames);
    }
  } catch (err) {
    // Network failure, timeout, etc. — never crash the game
    console.warn('[Supabase] Offline or unreachable — game session not recorded.', err);
  }
};
