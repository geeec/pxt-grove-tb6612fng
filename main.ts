/**
 * Blocs MakeCode pour piloter le Grove Motor Driver TB6612FNG
 * via I2C depuis un BBC micro:bit.
 *
 * Basé sur la librairie Arduino Seeed Studio.
 * Adresse I2C par défaut : 0x14
 */

//% weight=90 color=#cb6d3f icon="\uf1b9"
//% block="Moteur Grove"
//% groups="['Moteur', 'Contrôle']"
namespace groveMoteur {

    // Commandes I2C du TB6612FNG
    const CMD_BRAKE = 0x00
    const CMD_STOP = 0x01
    const CMD_CW = 0x02
    const CMD_CCW = 0x03
    const CMD_STANDBY = 0x04
    const CMD_NOT_STANDBY = 0x05

    // Adresse I2C par défaut
    const ADRESSE_I2C = 0x14

    /**
     * Choix du moteur
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
        //% block="horaire"
        Horaire = 0,
        //% block="anti-horaire"
        AntiHoraire = 1
    }

    /**
     * Envoie une commande I2C avec 1 octet de données.
     * Correspond à I2Cdev::writeByte(addr, reg, data)
     */
    function envoyerCommande(cmd: number, data: number): void {
        let buf = pins.createBuffer(2)
        buf.setNumber(NumberFormat.UInt8LE, 0, cmd)
        buf.setNumber(NumberFormat.UInt8LE, 1, data)
        pins.i2cWriteBuffer(ADRESSE_I2C, buf)
        basic.pause(1)
    }

    /**
     * Envoie une commande moteur I2C avec canal et vitesse.
     * Correspond à I2Cdev::writeBytes(addr, cmd, 2, [canal, vitesse])
     */
    function envoyerMoteur(cmd: number, canal: number, vitesse: number): void {
        let buf = pins.createBuffer(3)
        buf.setNumber(NumberFormat.UInt8LE, 0, cmd)
        buf.setNumber(NumberFormat.UInt8LE, 1, canal)
        buf.setNumber(NumberFormat.UInt8LE, 2, vitesse)
        pins.i2cWriteBuffer(ADRESSE_I2C, buf)
        basic.pause(1)
    }

    /**
     * Initialise le driver moteur. A placer dans "au démarrage".
     */
    //% block="initialiser le driver moteur"
    //% group="Contrôle"
    //% weight=100
    export function initialiser(): void {
        envoyerCommande(CMD_NOT_STANDBY, 0)
    }

    /**
     * Fait tourner un moteur dans le sens choisi à la puissance indiquée.
     * @param moteur choix du moteur A ou B
     * @param sens sens de rotation horaire ou anti-horaire
     * @param puissance puissance de 0 à 100%, eg: 50
     */
    //% block="allumer $moteur sens $sens puissance $puissance \\%"
    //% group="Moteur"
    //% puissance.min=0 puissance.max=100 puissance.defl=50
    //% weight=90
    //% inlineInputMode=inline
    export function allumer(moteur: Moteur, sens: Sens, puissance: number): void {
        puissance = Math.constrain(puissance, 0, 100)
        let vitesse = Math.round(puissance * 255 / 100)
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
    //% group="Moteur"
    //% weight=80
    export function freiner(moteur: Moteur): void {
        envoyerCommande(CMD_BRAKE, moteur)
    }

    /**
     * Stoppe un moteur (arrêt progressif, roue libre).
     * @param moteur choix du moteur A ou B
     */
    //% block="stopper $moteur"
    //% group="Moteur"
    //% weight=70
    export function stopper(moteur: Moteur): void {
        envoyerCommande(CMD_STOP, moteur)
    }
}
