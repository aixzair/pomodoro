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
const NOM_BOUTON_TRAVAIL = "commencer";
const NOM_BOUTON_PAUSE = "réinitialiser";

/* Evenements ------------------------------------------------------------ */
BOUTON.addEventListener("click", pomodoro);
INPUT_TEMPS_TRAVAIL.addEventListener("input", changerDuree);
INPUT_TEMPS_PAUSE.addEventListener("input", changerDuree);


/* Variables globales ----------------------------------------------------- */
let tempsTravail = 25;     // Temps en minutes
let tempsPause = 5;        // Temps en minutes

let dateFin;
let dateActuelle;

let ilTravail = true;
let applicationEnFonctionnement = false;

/* Lancement de l'application ---------------------------------------------- */
// Affectation possible des variables "temps_travail" et "temps_pause" par le local storage
try {
    tempsTravail = parseInt(localStorage.getItem("temps_travail")) || INPUT_TEMPS_TRAVAIL.value;
    tempsPause = parseInt(localStorage.getItem("temps_pause")) || INPUT_TEMPS_PAUSE.value;
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
function afficherTemps() {
    const tempsRestant = dateFin - dateActuelle;
    MINUTES.textContent = formatNombreText(Math.floor(tempsRestant / (1000 * 60)));
    SECONDES.textContent = formatNombreText(Math.floor((tempsRestant % (1000 * 60)) / 1000));
}

function creerDateFin(duree) {
    return Date.now() + duree * 60 * 1000;
}

/**
 * Décrémente la durée
 */
function compteARebour() {
    // Changement du status
    if ((dateFin - dateActuelle) <= 0 ) {
        if (ilTravail) {
            ilTravail = false;
            STATUS.textContent = "Pause";
            dateFin = creerDateFin(tempsPause);
        } else {
            ilTravail = true;
            STATUS.textContent = "Travail";
            dateFin = creerDateFin(tempsTravail);
        }
    }
}

/**
 * Lance le pomodoro ou redèmare le pomodoro
 */
function pomodoro() {
    if (BOUTON.textContent === NOM_BOUTON_TRAVAIL) {
        applicationEnFonctionnement = true;
        BOUTON.textContent = NOM_BOUTON_PAUSE;
        
        dateFin = creerDateFin(tempsTravail);

        setInterval(() => {
            dateActuelle = Date.now();
            afficherTemps();
            compteARebour();
        }, 1000);
    } else if (BOUTON.textContent === NOM_BOUTON_PAUSE) {
        location.reload();  // Redémare l'application
    } else {
        console.log("contenue textuel du bouton invalide (fonction pomodoro)");
    }
}
