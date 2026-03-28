/**
 * Blocs MakeCode pour piloter le Grove Motor Driver TB6612FNG
 * via I2C depuis un BBC micro:bit.
 * 
 * Basé sur la librairie Arduino Seeed Studio.
 * Adresse I2C par défaut : 0x14
 */

//% weight=90 color=#cb6d3f icon="\uf1b9"
//% block="Moteur Grove"
//% groups="['Moteur CC', 'Contrôle']"
namespace groveMoteur {

    // Commandes I2C du TB6612FNG
    const CMD_BRAKE = 0x00
    const CMD_STOP = 0x01
    const CMD_CW = 0x02
    const CMD_CCW = 0x03
    const CMD_STANDBY = 0x04
    const CMD_NOT_STANDBY = 0x05

    // Adresse I2C par défaut
    let adresseI2C = 0x14

    /**
     * Choix du moteur (canal A ou B)
     */
    export enum Moteur {
        //% block="moteur A"
        A = 0,
        //% block="moteur B"
        B = 1
    }

    /**
     * Sens de rotation
     */
    export enum Sens {
        //% block="horaire ↻"
        Horaire = 0,
        //% block="anti-horaire ↺"
        AntiHoraire = 1
    }

    // Envoie 2 octets : [commande, donnée]
    function envoyerCommande(cmd: number, data: number): void {
        let buf = pins.createBuffer(2)
        buf.setNumber(NumberFormat.UInt8LE, 0, cmd)
        buf.setNumber(NumberFormat.UInt8LE, 1, data)
        pins.i2cWriteBuffer(adresseI2C, buf)
        basic.pause(1)
    }

    // Envoie 3 octets : [commande, canal, vitesse]
    function envoyerMoteur(cmd: number, canal: number, vitesse: number): void {
        let buf = pins.createBuffer(3)
        buf.setNumber(NumberFormat.UInt8LE, 0, cmd)
        buf.setNumber(NumberFormat.UInt8LE, 1, canal)
        buf.setNumber(NumberFormat.UInt8LE, 2, vitesse)
        pins.i2cWriteBuffer(adresseI2C, buf)
        basic.pause(1)
    }

    /**
     * Initialise le driver moteur (à appeler au démarrage).
     * Sort le driver du mode veille.
     */
    //% block="initialiser le driver moteur"
    //% group="Contrôle"
    //% weight=100
    export function initialiser(): void {
        envoyerCommande(CMD_NOT_STANDBY, 0)
    }

    /**
     * Fait tourner un moteur dans un sens à une vitesse donnée.
     * @param moteur choix du moteur A ou B
     * @param sens sens de rotation
     * @param vitesse vitesse de 0 à 255, eg: 150
     */
    //% block="faire tourner $moteur $sens à vitesse $vitesse"
    //% group="Moteur CC"
    //% vitesse.min=0 vitesse.max=255 vitesse.defl=150
    //% weight=90
    //% inlineInputMode=inline
    export function tourner(moteur: Moteur, sens: Sens, vitesse: number): void {
        vitesse = Math.constrain(vitesse, 0, 255)
        if (sens == Sens.Horaire) {
            envoyerMoteur(CMD_CW, moteur, vitesse)
        } else {
            envoyerMoteur(CMD_CCW, moteur, vitesse)
        }
    }

    /**
     * Freine un moteur (arrêt immédiat).
     * @param moteur choix du moteur A ou B
     */
    //% block="freiner $moteur"
    //% group="Moteur CC"
    //% weight=80
    export function freiner(moteur: Moteur): void {
        envoyerCommande(CMD_BRAKE, moteur)
    }

    /**
     * Stoppe un moteur (arrêt progressif, roue libre).
     * @param moteur choix du moteur A ou B
     */
    //% block="stopper $moteur"
    //% group="Moteur CC"
    //% weight=70
    export function stopper(moteur: Moteur): void {
        envoyerCommande(CMD_STOP, moteur)
    }

    /**
     * Met le driver en veille (coupe tous les moteurs).
     */
    //% block="mettre en veille"
    //% group="Contrôle"
    //% weight=50
    export function veille(): void {
        envoyerCommande(CMD_STANDBY, 0)
    }

    /**
     * Sort le driver du mode veille.
     */
    //% block="réveiller le driver"
    //% group="Contrôle"
    //% weight=49
    export function reveiller(): void {
        envoyerCommande(CMD_NOT_STANDBY, 0)
    }

    /**
     * Change l'adresse I2C du driver (défaut: 0x14).
     * @param nouvelleAdresse nouvelle adresse I2C entre 1 et 127, eg: 20
     */
    //% block="changer adresse I2C à $nouvelleAdresse"
    //% group="Contrôle"
    //% weight=10
    //% advanced=true
    export function changerAdresse(nouvelleAdresse: number): void {
        if (nouvelleAdresse < 1 || nouvelleAdresse > 127) return
        let buf = pins.createBuffer(2)
        buf.setNumber(NumberFormat.UInt8LE, 0, 0x11)
        buf.setNumber(NumberFormat.UInt8LE, 1, nouvelleAdresse)
        pins.i2cWriteBuffer(adresseI2C, buf)
        adresseI2C = nouvelleAdresse
        basic.pause(100)
    }
}
