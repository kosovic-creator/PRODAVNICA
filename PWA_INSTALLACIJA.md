# PWA i instalacija na uredjaj

PWA je ukljucen za obe aplikacije:
- `apps/prodavnica-client`
- `apps/prodavnica-admin`

## Kako instalirati aplikaciju

- Chrome/Edge (desktop): otvori aplikaciju i klikni `Install app` u address baru.
- Android (Chrome): `Add to Home screen`.
- iOS (Safari): `Share` -> `Add to Home Screen`.

## Napomena

- U development modu (`npm run dev`) service worker je iskljucen.
- PWA instalacija radi u produkcijskom buildu (`npm run build:*` + `npm run start:*`) i na HTTPS domenima.
