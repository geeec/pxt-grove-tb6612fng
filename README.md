# Grove Motor Driver TB6612FNG — Extension MakeCode pour micro:bit

Extension MakeCode permettant de piloter le **Grove Motor Driver TB6612FNG** (réf. 108020103) depuis un BBC micro:bit via I2C.

## Blocs disponibles

### Contrôle
- **Initialiser le driver moteur** — à appeler au démarrage (sort le driver du mode veille)
- **Mettre en veille** — coupe tous les moteurs
- **Réveiller le driver** — sort du mode veille

### Moteur CC
- **Faire tourner [moteur A/B] [horaire/anti-horaire] à vitesse [0-255]** — commande un moteur
- **Freiner [moteur A/B]** — arrêt immédiat (court-circuit moteur)
- **Stopper [moteur A/B]** — arrêt progressif (roue libre)

## Utilisation

### Installation dans MakeCode
1. Ouvrir MakeCode pour micro:bit (https://makecode.microbit.org)
2. Créer un nouveau projet
3. Cliquer sur **Extensions** (dans le menu à gauche)
4. Coller l'URL de ce dépôt GitHub dans la barre de recherche
5. Cliquer sur le résultat pour installer l'extension

### Exemple : ouvrir et fermer une porte

```blocks
input.onButtonPressed(Button.A, function () {
    groveMoteur.tourner(groveMoteur.Moteur.A, groveMoteur.Sens.Horaire, 150)
})
input.onButtonPressed(Button.B, function () {
    groveMoteur.tourner(groveMoteur.Moteur.A, groveMoteur.Sens.AntiHoraire, 150)
})
input.onButtonPressed(Button.AB, function () {
    groveMoteur.freiner(groveMoteur.Moteur.A)
})
groveMoteur.initialiser()
```

## Câblage
- Le module se branche sur le **port I2C** du shield Grove (BitMaker V2 ou Grove Shield).
- Adresse I2C par défaut : **0x14**
- Alimentation moteur : brancher une source 5V externe sur les borniers VM+ et GND du driver.

## Crédits
Basé sur la librairie Arduino [Grove_Motor_Driver_TB6612FNG](https://github.com/Seeed-Studio/Grove_Motor_Driver_TB6612FNG) de Seeed Studio (licence MIT).

## Licence
MIT
