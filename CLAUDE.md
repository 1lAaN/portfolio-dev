# CLAUDE.md — Portfolio Dev

## Stack

- **Framework** : Nuxt 3 (SSR désactivé, SPA)
- **Style** : UnoCSS + Tailwind utilities + Montserrat (Google Fonts)
- **Base de données** : Supabase (PostgreSQL)
- **Auth** : Supabase Auth (`supabase.auth.signInWithPassword`) — ne jamais revenir à l'auth maison
- **Images** : Cloudinary (upload uniquement, pas de suppression en free tier)
- **PDF** : Supabase Storage, bucket `documents`
- **Déploiement** : Cloudflare Pages (preset `cloudflare-pages-static`)

## Variables d'environnement

```
NUXT_PUBLIC_SUPABASE_URL
NUXT_PUBLIC_SUPABASE_KEY        # anon key publique
NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME
NUXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
```

## Structure clé

```
composables/
  useAuth.ts          # login/logout/checkAuth via Supabase Auth
  useSupabase.ts      # singleton Supabase client
  useSupabaseStorage.js  # upload/delete PDF dans Supabase Storage
  useCloudinary.js    # upload images Cloudinary
  useRSSFeed.js       # agrégation RSS pour la veille techno

pages/
  index.vue           # portfolio public
  projects/index.vue  # liste projets publique
  veille.vue          # veille techno publique
  synthese.vue        # page synthèse publique
  admin/
    login.vue         # connexion (email + mot de passe)
    index.vue         # dashboard
    projects.vue      # CRUD projets
    skills.vue        # CRUD compétences
    categories.vue    # CRUD catégories
    veille.vue        # CRUD articles + sync RSS

middleware/
  auth.ts             # protège toutes les routes /admin/*

layouts/
  admin.vue           # layout avec AdminNav
```

## Sécurité — points importants

- **Supabase Auth obligatoire** : l'auth passe par `supabase.auth`, pas par des requêtes directes sur `admin_users`
- **RLS à activer** sur toutes les tables Supabase (projets, skills, catégories, tech_watch, documents)
- **La anon key est publique** par nature — le RLS est la seule protection côté données
- Ne jamais stocker de mot de passe en clair ni exposer de token sensible côté client

## Conventions

- Commits en français
- Composables = logique réutilisable, pages = orchestration uniquement
- Pas de SSR → tout le code client-only est safe sans `process.client` guard (sauf dans les composables appelés côté serveur)
- Langue de l'interface : français
