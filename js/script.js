/* Constantes ---------------------------------------------------------- */
/* Entrées */
const BOUTON = document.getElementById("bouton");
const INPUT_TEMPS_TRAVAIL = document.getElementById("input_travail");
const INPUT_TEMPS_PAUSE = document.getElementById("input_pause");

/* Affichage */
const STATUS = document.getElementById("status");
const MINUTES = document.getElementById("minutes");
const SECONDES = document.getElementById("secondes");

/* Code */
const NOM_BOUTON_TRAVAIL = "Commencer";
const NOM_BOUTON_PAUSE = "Réinitialiser";

/* Evenements ------------------------------------------------------------ */
BOUTON.addEventListener("click", pomodoro);
INPUT_TEMPS_TRAVAIL.addEventListener("input", changerDuree);
INPUT_TEMPS_PAUSE.addEventListener("input", changerDuree);


/* Variables globales ----------------------------------------------------- */
let tempsTravail = 25;     // Temps en minutes
let tempsPause = 5;        // Temps en minutes

let applicationEnFonctionnement = false;
let ilTravail = true;

/* Lancement de l'application ---------------------------------------------- */
BOUTON.textContent = NOM_BOUTON_TRAVAIL;

// Affectation possible des variables "temps_travail" et "temps_pause" par le local storage
try {
    tempsTravail = parseInt(localStorage.getItem("temps_travail")) 
    || INPUT_TEMPS_TRAVAIL.value;

    tempsPause = parseInt(localStorage.getItem("temps_pause"))
    || INPUT_TEMPS_PAUSE.value;
} catch (exception) {
    console.error(exception);
}

// Modification des valeurs des variables affichées
MINUTES.textContent = formatNombreText(tempsTravail);
document.getElementById("temps_travail").textContent = formatNombreText(tempsTravail);
document.getElementById("temps_pause").textContent = formatNombreText(tempsPause);

/* Fonctions --------------------------------------------------------------- */

/**
 * Récupère et change les durée de travail et de pause
 */
function changerDuree() {
    if (applicationEnFonctionnement) {
        INPUT_TEMPS_TRAVAIL.value = tempsTravail;
        INPUT_TEMPS_PAUSE.value = tempsPause;
        return;

    } else if (
        tempsTravail == INPUT_TEMPS_TRAVAIL.value
        && tempsPause == INPUT_TEMPS_PAUSE.value
    ) {
        return;
    }

    // Récupération des valeurs
    tempsTravail = INPUT_TEMPS_TRAVAIL.value;
    tempsPause = INPUT_TEMPS_PAUSE.value;

    // Sauvegarde des données dans le local storage
    try {
        localStorage.setItem("temps_travail", JSON.stringify(tempsTravail));
        localStorage.setItem("temps_pause", JSON.stringify(tempsPause));
    } catch(exception) {
        console.error(exception);
    }

    // Modification des valeurs affichées
    MINUTES.textContent = formatNombreText(tempsTravail);
    document.getElementById("temps_travail").textContent = formatNombreText(tempsTravail);
    document.getElementById("temps_pause").textContent = formatNombreText(tempsPause);
}

/**
 * Renvoies un nombre avec un 0 devant si il n'a qu'un seule chiffre
 * @param {*} nombre 
 * @returns le nombre en format textuel
 */
function formatNombreText(nombre) {
    const string = nombre.toString();
    return (string.length < 2) ? '0' + string : string;
}

/**
 * Affiche le temps
 */
function afficherTemps(tempsRestant) {
    MINUTES.textContent = formatNombreText(Math.floor(tempsRestant / (1000 * 60)));
    SECONDES.textContent = formatNombreText(Math.floor((tempsRestant % (1000 * 60)) / 1000));
}

/**
 * Retourne la date de fin
 * @param {*} date date actuelle
 * @param {*} duree durée en minutes
 * @returns 
 */
function calculerDateFin(date, duree) {
    return date + duree * 60 * 1000 + 1000;
}

/**
 * Gère le temps et l'affichage
 */
function cycle(dateFin) {
    let progression;
    let dateActuelle = Date.now();

    tempsRestant = dateFin - dateActuelle;
    if (tempsRestant <= 0 ) {
        // Changement du status
        if (ilTravail) {
            ilTravail = false;
            STATUS.textContent = "Pause";
            dateFin = calculerDateFin(dateActuelle, tempsPause);
        } else {
            ilTravail = true;
            STATUS.textContent = "Travail";
            dateFin = calculerDateFin(dateActuelle, tempsTravail);
        }
    } else {
        // Affiche le temps et augmente la progression
        afficherTemps(tempsRestant);
        progression = 1 - tempsRestant / (60 * 1000 * (ilTravail? tempsTravail: tempsPause) + 1000);
        document.documentElement.style.setProperty('--progression', Math.round(100 * 100 * progression) / 100 + "%");
    }

    window.requestAnimationFrame(function () {
        cycle(dateFin);
    });
}

/**
 * Lance le pomodoro ou recharge la page
 */
function pomodoro() {
    if (BOUTON.textContent === NOM_BOUTON_TRAVAIL) {
        applicationEnFonctionnement = true;
        BOUTON.textContent = NOM_BOUTON_PAUSE;

        cycle(calculerDateFin(Date.now(), tempsTravail));

    } else if (BOUTON.textContent === NOM_BOUTON_PAUSE) {
        location.reload();  // Redémare l'application
    } else {
        console.log("contenue textuel du bouton invalide (fonction pomodoro)");
    }
}
