# Mūra — Funnel (Quiz + Landing)

## Estructura
```
/                → Quiz React (captura datos, determina perfil)
/plan            → Landing de venta (pricing, checkout Shopify)
```

## URLs del funnel
```
somosmura.com/          → Quiz
somosmura.com/plan      → Landing (recibe params del quiz)
Shopify checkout        → mura-7596.myshopify.com/cart/...
```

## Deploy en Vercel

### Opción A: Con GitHub (recomendada)
1. Creá un repo en GitHub y subí esta carpeta
2. Andá a vercel.com → New Project → Import desde GitHub
3. Vercel detecta Vite automáticamente, dejá todo default
4. Click en Deploy

### Opción B: Sin GitHub
1. Instalá Vercel CLI: `npm i -g vercel`
2. Desde esta carpeta: `vercel --prod`
3. Seguí las instrucciones en pantalla

### Conectar dominio
1. En Vercel → Settings → Domains → agregá `somosmura.com`
2. Vercel te da registros DNS (CNAME o A records)
3. En Cloudflare → DNS → agregá los registros que te dio Vercel
4. Esperá propagación (~5-30 min con Cloudflare)

## Desarrollo local
```bash
npm install
npm run dev
```
Abre http://localhost:5173 (quiz) y http://localhost:5173/plan.html (landing)

## Shopify Variant IDs
- 4 Semanas: 47380658618598
- 8 Semanas: 47380661043430
- 12 Semanas: 47380663042278
- Pack Alivio: 47384149524710
- Tienda: mura-7596.myshopify.com
