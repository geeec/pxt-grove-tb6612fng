# Grove Motor Driver TB6612FNG — Extension MakeCode

Extension MakeCode pour piloter le module Grove I2C Motor Driver TB6612FNG (108020103) depuis un BBC micro:bit.

## Blocs disponibles

### Contrôle
- **Initialiser le driver moteur** — à placer dans "au démarrage"

### Moteur
- **Allumer moteur** — choisir moteur A/B, sens horaire/anti-horaire, puissance 0-100%
- **Freiner moteur** — arrêt immédiat du moteur
- **Stopper moteur** — arrêt progressif (roue libre)

## Utilisation dans MakeCode

Dans l'éditeur MakeCode (https://makecode.microbit.org) :
1. Cliquer sur **Extensions**
2. Coller l'URL du dépôt GitHub de cette extension
3. Les blocs "Moteur Grove" apparaissent dans la palette

## Adresse I2C

L'adresse I2C par défaut du module est **0x14**.

## Licence

MIT
