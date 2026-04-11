/**
 * Blocs MakeCode pour piloter le Grove Motor Driver TB6612FNG
 * via I2C depuis un BBC micro:bit.
 *
 * Basé sur la librairie Arduino Seeed Studio.
 * Adresse I2C par défaut : 0x14
 */

//% weight=90 color=#cb6d3f icon="\uf1b9"
//% block="Moteur Grove"
//% groups="['Moteur', 'Contrôle', 'Diagnostic']"
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
     * Reproduit I2Cdev::writeByte(addr, reg, data)
     * Trame I2C : [START, addr+W, reg, data, STOP]
     */
    function envoyerCommande(cmd: number, data: number): void {
        let buf = pins.createBuffer(2)
        buf[0] = cmd
        buf[1] = data
        pins.i2cWriteBuffer(ADRESSE_I2C, buf)
        basic.pause(5)
    }

    /**
     * Envoie une commande moteur I2C avec canal et vitesse.
     * Reproduit I2Cdev::writeBytes(addr, cmd, 2, [canal, vitesse])
     * Trame I2C : [START, addr+W, cmd, canal, vitesse, STOP]
     */
    function envoyerMoteur(cmd: number, canal: number, vitesse: number): void {
        let buf = pins.createBuffer(3)
        buf[0] = cmd
        buf[1] = canal
        buf[2] = vitesse
        pins.i2cWriteBuffer(ADRESSE_I2C, buf)
        basic.pause(5)
    }

    /**
     * Initialise le driver moteur. A placer dans "au démarrage".
     * Reproduit la séquence Arduino : standby puis notStandby.
     */
    //% block="initialiser le driver moteur"
    //% group="Contrôle"
    //% weight=100
    export function initialiser(): void {
        // Séquence identique à la librairie Arduino :
        // 1) standby pour état connu
        envoyerCommande(CMD_STANDBY, 0)
        basic.pause(100)
        // 2) sortir du standby pour activer le driver
        envoyerCommande(CMD_NOT_STANDBY, 0)
        basic.pause(100)
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

    /**
     * Scanne le bus I2C et affiche les adresses détectées
     * sur l'écran du micro:bit (en défilant).
     * Utile pour vérifier que le module moteur est bien détecté.
     */
    //% block="scanner le bus I2C"
    //% group="Diagnostic"
    //% weight=10
    export function scannerI2C(): void {
        let trouve = false
        for (let addr = 1; addr <= 127; addr++) {
            let buf = pins.createBuffer(1)
            buf[0] = 0
            let ok = true
            // Tente d'écrire 0 octet à cette adresse
            // Si le device répond (ACK), il est présent
            pins.i2cWriteBuffer(addr, buf, false)
            // Tente de lire 1 octet pour vérifier la présence
            let result = pins.i2cReadBuffer(addr, 1, false)
            if (result.length > 0) {
                basic.showString("0x" + convertToHex(addr))
                basic.pause(500)
                trouve = true
            }
        }
        if (!trouve) {
            basic.showString("Rien")
        }
    }

    function convertToHex(n: number): string {
        let hex = ""
        let digits = "0123456789ABCDEF"
        if (n == 0) return "00"
        while (n > 0) {
            hex = digits.charAt(n % 16) + hex
            n = Math.idiv(n, 16)
        }
        if (hex.length == 1) hex = "0" + hex
        return hex
    }
}
