# Relazione

Progetto _"Social Network for Music (SNM)"_ di Provini Martin a(02492A) e Zagheno Matteo (matricola)

- [Requisiti](#requisiti)
- [Installazione](#installazione)
- [Struttura del Progetto](#struttura-progetto)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Organizzazione](#organizzazione)
- [Struttura del sito web](#struttura-sito)
- [Scelte implementative](#scelte)
  - [Autenticazione](#autenticazione)
  - [Token Spotify](#token)
  - [Gestione Community](#community)
  
## Requisiti


## Installazione



## Struttura del Progetto

Frontend e Backend sono separati:

## Frontend

Abbiamo utilizzato i seguenti framework

- Pagine: svelte, sveltekit, vite
- Per lo stile: flowbite svelte, tailwind css

La parte di frontend è gestita con Svelte, un framework che permette di creare _componenti_ e costruire le pagine dinamicamente. La sua caratteristica principale è quella di svolgere la maggior parte del lavoro durante la fase di compilazione del codice, generando un'esperienza utente più leggera e performante.
Vite garantisce avvio veloce del server.
Grazie a Flowbite e Tailwindcss tutti i componenti dell'interfaccia sono reponsive ed adatti anche a dispositivi mobili.

## Backend

Il database è MongoDB

- DB: MongoClient
- Express
- Autenticazione: jsonwebtoken
- Password: bcrypt

## Organizzazione

Frontend:

- contiene i file di configurazione di svelte, tailwind, vite
- 'static': componenti statici per le pagine 
- 'src': contiene la paggina .html principale dell'applicazione
  - 'lib': componenti importabili per la costruzione delle pagine o l'utilizzo di funzioni javasciprt
  - 'routes': contiene la homepage e tutte le altre pagine del sito

Backend:

- lo swagger e l'app nodejs
- 'service': esporta funzionalità di gestione del sito
  - 'repositories': esporta funzionalità degli oggetti

## Struttura del sito

![SchemaPagine](SchemaPagine.png)

## Scelte implementative

## Autenticazione

## Token Spotify

## Gestione Community

Il concetto di cominutà e gruppi nelle piattaforme sociali può essere molto esteso. Noi abbiamo deciso di rendere le nostre community più un "luogo" che un gurppo, dove poter condividere le playlist di interesse. Di fatti l'unica funzionalità attiva a cui hanno accesso i membri del gruppo è `sharePlaylist`

```javascript
async function sharePlaylist(userId, communityId, playlistId) {
    let res;
    let community = await getCommunity(userId, communityId);
    if (community.error !== undefined) {
        return community;
    }
    community.sharedPlaylists.unshift({user: userId, playlist: playlistId})
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Communities').updateOne({_id: new mongodb.ObjectId(communityId)}, {
            $set: {sharedPlaylists: community.sharedPlaylists}
        });
    });

    return res;
}
```

Tuttavia l'impostazione che abbiamo dato al progetto lascia apposta molti aggangi per espandere le funionalità e rendere più interattivo il concetto di community di SNM