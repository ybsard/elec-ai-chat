# Configuration Supabase pour Voltia

## 1. Creer le projet

1. Va sur https://supabase.com/
2. Cree un compte ou connecte-toi.
3. Clique sur `New project`.
4. Choisis un nom, par exemple `voltia`.
5. Choisis un mot de passe de base de donnees fort.
6. Choisis une region proche de tes clients, par exemple Europe.

## 2. Creer la table

Dans Supabase, ouvre `SQL Editor`, puis colle et execute ce code :

```sql
create table if not exists public.app_state (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
```

## 3. Recuperer les cles

Dans Supabase :

1. Va dans `Project Settings`.
2. Va dans `API`.
3. Copie `Project URL`.
4. Copie la cle `service_role`.

Important : la cle `service_role` est secrete. Ne la mets jamais dans le code, jamais sur GitHub, jamais dans le navigateur.

## 4. Ajouter les variables sur Render

Dans Render, ouvre ton service Voltia, puis `Environment`.

Ajoute :

```env
SUPABASE_URL=colle_ici_le_project_url
SUPABASE_SERVICE_ROLE_KEY=colle_ici_la_cle_service_role
SUPABASE_STATE_TABLE=app_state
```

Garde aussi tes autres variables deja existantes :

```env
OPENAI_API_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_PRICE_ID=...
STRIPE_WEBHOOK_SECRET=...
ACCESS_CODE=...
```

## 5. Redeployer

Dans Render :

1. Clique sur `Save changes`.
2. Va dans `Manual Deploy`.
3. Clique sur `Deploy latest commit`.

Quand Supabase est configure, Voltia utilise la base en ligne pour les comptes et sessions. Si Supabase n'est pas configure, Voltia continue d'utiliser `data/users.json` en local.
