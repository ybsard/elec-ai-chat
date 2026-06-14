# Configuration Supabase pour Voltia

Voltia sait fonctionner avec le stockage historique `app_state` et dispose maintenant d'un
schema SQL relationnel pret pour une migration plus robuste.

## 1. Creer le projet

1. Va sur https://supabase.com/.
2. Cree un compte ou connecte-toi.
3. Clique sur `New project`.
4. Choisis un nom, par exemple `voltia`.
5. Choisis un mot de passe de base de donnees fort.
6. Choisis une region proche des utilisateurs, par exemple Europe.

## 2. Stockage actuel compatible

Le mode compatible conserve tout l'etat applicatif dans une ligne JSON. Il reste utile pour
ne pas casser une instance existante.

Dans Supabase, ouvre `SQL Editor`, puis execute:

```sql
create table if not exists public.app_state (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
```

Variables Render compatibles:

```env
SUPABASE_URL=colle_ici_le_project_url
SUPABASE_SERVICE_ROLE_KEY=colle_ici_la_cle_service_role
SUPABASE_STATE_TABLE=app_state
SUPABASE_STORAGE_MODE=state
```

## 3. Schema relationnel cible

Le schema cible se trouve dans:

```text
supabase/voltia_relational_schema.sql
```

Il cree des tables separees pour:

- `voltia_users`
- `voltia_sessions`
- `voltia_projects`
- `voltia_reports`
- `voltia_usage_events`

Objectif: eviter les ecrasements concurrents d'un blob unique, faciliter l'export/suppression
de compte, isoler les rapports et preparer le support client.

Important: n'active pas un mode relationnel en production tant que les tables ne sont pas creees
et qu'un script de migration des donnees existantes n'a pas ete execute. Le backend reste
volontairement en `SUPABASE_STORAGE_MODE=state` par defaut pour proteger la production actuelle.

Pour verifier la migration sans ecrire:

```powershell
$env:DRY_RUN="1"; npm.cmd run migrate:supabase
```

Pour migrer reellement apres creation des tables et variables Supabase:

```powershell
npm.cmd run migrate:supabase
```

## 4. Recuperer les cles

Dans Supabase:

1. Va dans `Project Settings`.
2. Va dans `API`.
3. Copie `Project URL`.
4. Copie la cle `service_role`.

Important: la cle `service_role` est secrete. Ne la mets jamais dans le code, jamais sur GitHub,
jamais dans le navigateur.

## 5. Variables Render utiles

```env
OPENAI_API_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_PRICE_ID=...
STRIPE_WEBHOOK_SECRET=...
ACCESS_CODE=...
APP_ORIGIN=https://elec-ai-chat.onrender.com
MAX_JSON_BODY_BYTES=1200000
MAX_IMAGE_JSON_BODY_BYTES=9000000
MAX_DATA_IMAGE_BYTES=6500000
```

## 6. Redeployer

Dans Render:

1. Clique sur `Save changes`.
2. Va dans `Manual Deploy`.
3. Clique sur `Deploy latest commit`.

Quand Supabase est configure, Voltia utilise la base en ligne pour les comptes et sessions.
Si Supabase n'est pas configure, Voltia continue d'utiliser `data/users.json` en local.
