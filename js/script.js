/* Constantes ----------------------------------------------------- */
const BOUTON = document.getElementById("commencer");
const STATUS = document.getElementById("label_status");

const NOM_BOUTON_TRAVAIL = "commencer";
const NOM_BOUTON_PAUSE = "réinitialiser";

const TEMPS_PAUSE = 5;      // Temps en minutes
const TEMPS_TRAVAIL = 25;   // Temps en minutes

/* Evenements ----------------------------------------------------- */
BOUTON.addEventListener("click", pomodoro);

/* Variables globales ----------------------------------------------------- */
let minutes = 0;
let secondes = 0;
let ilTravail = true;

/* Fonctions ----------------------------------------------------- */

/**
 * Renvoies un nombre avec un 0 devant si il n'a qu'un seule chiffre
 * @param {*} nombre 
 * @returns le nombre en format textuel
 */
function formatNombreText(nombre) {
    let string = nombre.toString();
    string = (string.length < 2) ? '0' + string : string;
    return string;
}

/**
 * Affiche le temps
 */
function afficherTemps() {
    document.getElementById("temps").textContent = `${formatNombreText(minutes)} : ${formatNombreText(secondes)}`;
}

/**
 * Décrémente la durée
 */
function compteARebour() {
    if (secondes == 0) {
        if (minutes == 0) {
            if (ilTravail) {
                ilTravail = false;
                STATUS.textContent = "Pause";

                minutes = TEMPS_PAUSE;
                secondes = 0;
            } else {
                ilTravail = true;
                STATUS.textContent = "Travail";

                minutes = TEMPS_TRAVAIL;
                secondes = 0;
            }
            return;
        }
        minutes--;
        secondes = 59;

        return;
    }
    secondes--;
}

/**
 * Lance le pomodoro ou redèmare le pomodoro
 */
function pomodoro() {
    if (BOUTON.textContent === NOM_BOUTON_TRAVAIL) {
        BOUTON.textContent = NOM_BOUTON_PAUSE;
        
        minutes = TEMPS_TRAVAIL;

        setInterval(() => {
            afficherTemps();
            compteARebour();
        }, 1000);
    } else if (BOUTON.textContent === NOM_BOUTON_PAUSE) {
        location.reload();  // Redémare l'application
    } else {
        console.log("contenue textuel du bouton invalide (fonction pomodoro)");
    }
}