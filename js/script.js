/* Constantes ----------------------------------------------------- */
const BOUTON = document.getElementById("commencer");
const STATUS = document.getElementById("status");
const TEMPS_PAUSE = 5;
const TEMPS_TRAVAIL = 25;

/* Fonctions ----------------------------------------------------- */
BOUTON.addEventListener("click", pomodoro);

/* Variables globales ----------------------------------------------------- */
let dmc_setInterval;
let minutes = 0;
let secondes = 0;
let ilTravail = true;

/* Fonctions ----------------------------------------------------- */

/**
 * Renvoies un nombre avec un 0 devant si il n'a qu'un seule chiffre
 * @param {*} nombre 
 * @returns 
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
    document.getElementById("label_temps").textContent = `${formatNombreText(minutes)} : ${formatNombreText(secondes)}`;
}

/**
 * Décrémente la durée
 */
function compteARebour() {
    if (secondes == 0) {
        if (minutes == 0) {
            if (ilTravail) {
                ilTravail = false;
                STATUS.textContent = "pause";

                minutes = TEMPS_PAUSE;
                secondes = 0;
            } else {
                ilTravail = true;
                STATUS.textContent = "travail";

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
    if (BOUTON.textContent === "commencer") {
        BOUTON.textContent = "recommencer";
        
        minutes = TEMPS_TRAVAIL;

        clearInterval(dmc_setInterval);
        dmc_setInterval = setInterval(() => {
            afficherTemps();
            compteARebour();
        }, 1000);
    } else if (BOUTON.textContent === "recommencer") {
        location.reload();  // Redémare l'application
    } else {
        console.log("contenue textuel du bouton invalide (fonction pomodoro)");
    }
}