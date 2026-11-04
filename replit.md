# بن خلدون — القائمة

Arabic-first café menu and staff menu-management app.

## Run & Operate

- The `artifacts/ibn-khaldoun-menu: web` workflow runs the customer menu.
- `pnpm --filter @workspace/ibn-khaldoun-menu run typecheck` checks the app.
- `pnpm run typecheck` checks all workspace packages.
- `pnpm run build` typechecks and builds workspace packages.
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables, then restart the web workflow.
- Run `artifacts/ibn-khaldoun-menu/supabase/schema.sql` in the Supabase SQL Editor.
- Create and confirm an Auth user in Supabase, then insert that user's ID into `public.admin_users` using the bootstrap query in the app README.
- Staff access the menu manager by entering `/admin` directly; the customer site has no link to it.

The menu app uses Supabase Auth and the public anon key. RLS and security-definer functions restrict menu changes and image uploads to allowlisted staff. Never expose a `service_role` key in browser code or a `VITE_` variable. The legacy API server and Drizzle package remain scaffolding and are not required by the menu.

## Where things live

- `artifacts/ibn-khaldoun-menu/src/App.tsx` — Arabic customer menu, ordering flow, and `/admin` route.
- `artifacts/ibn-khaldoun-menu/src/pages/AdminPanel.tsx` — staff login and menu management.
- `artifacts/ibn-khaldoun-menu/src/lib/supabase.ts` and `src/lib/admin.ts` — Supabase client and menu/admin operations.
- `artifacts/ibn-khaldoun-menu/supabase/schema.sql` — Supabase tables, security policies, menu/order functions, storage bucket, and starter menu rows.
- `artifacts/ibn-khaldoun-menu/README.md` — setup steps and operating notes.

## Product and operating notes

- QR links can include `?table=12`; otherwise customers enter a table number before submitting.
- Customer orders and item/price/variant/exclusion snapshots are saved in `public.orders` and `public.order_items`. Order management remains deferred; staff can review orders in the Supabase dashboard.
- Menu items support core/excludable ingredients and optional variants with price and image overrides.
- The SQL file seeds six sample dishes and prices. Replace them with the café's real menu before accepting customer orders.
- `DATABASE_URL` is not needed by the menu app.
