// Données reprises de mon tableur (Defra, Family Food 2024/25)
// 10 valeurs par aliment : du groupe 1 (les plus pauvres) au groupe 10 (les plus riches)
// quantite = grammes achetés par personne et par semaine, depense = en livres
// Il y a un titre par mode parce que le message n'est pas le même en g et en £
const donnees = {
    fruit: {
        titreQuantite: "The richest buy the most fresh fruit",
        titreDepense: "The richest spend the most on fresh fruit",
        nom: "fresh fruit",
        quantite: [666, 662, 630, 678, 697, 693, 697, 700, 781, 842],
        depense: [1.71, 1.89, 1.75, 1.83, 2.06, 2.03, 2.13, 2.06, 2.66, 3.23]
    },
    legumes: {
        titreQuantite: "The richest buy the most green vegetables",
        titreDepense: "The richest spend the most on green vegetables",
        nom: "fresh green vegetables",
        quantite: [126, 110, 160, 136, 144, 173, 145, 179, 179, 183],
        depense: [0.43, 0.38, 0.47, 0.41, 0.47, 0.58, 0.55, 0.63, 0.72, 0.81]
    },
    poisson: {
        titreQuantite: "The richest buy the most fish",
        titreDepense: "The richest spend the most on fish",
        nom: "fish",
        quantite: [105, 110, 117, 118, 130, 121, 121, 118, 131, 170],
        depense: [1.15, 1.19, 1.27, 1.33, 1.51, 1.40, 1.53, 1.50, 1.98, 2.47]
    },
    sucre: {
        titreQuantite: "The richest buy the least sugar",
        titreDepense: "Every group spends 30p or less a week on sugar",
        nom: "sugar and preserves",
        quantite: [83, 102, 79, 80, 88, 76, 73, 70, 82, 51],
        depense: [0.18, 0.27, 0.29, 0.24, 0.28, 0.21, 0.22, 0.21, 0.30, 0.22]
    },
    graisses: {
        titreQuantite: "The richest buy the least fats",
        titreDepense: "Every group spends between 62p and 85p a week on fats",
        nom: "fats",
        quantite: [153, 137, 121, 143, 156, 138, 154, 145, 126, 110],
        depense: [0.72, 0.63, 0.62, 0.72, 0.82, 0.76, 0.76, 0.83, 0.85, 0.72]
    },
    pommesdeterre: {
        titreQuantite: "The richest buy the fewest processed potatoes",
        titreDepense: "The richest spend the least on processed potatoes",
        nom: "processed potatoes",
        quantite: [232, 276, 223, 261, 243, 233, 246, 207, 202, 164],
        depense: [1.06, 1.41, 1.08, 1.26, 1.35, 1.22, 1.40, 1.25, 1.30, 0.99]
    }
};

// les numéros sous les barres
const groupes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

// mêmes couleurs que dans le CSS
const BLEU = "#1F6FB2";       // groupe 1
const ORANGE = "#C2540A";     // groupe 10
const GRIS = "#BDBDBD";       // les autres
const BORDEAUX = "#8B1A4A";   // barre cliquée

// ce qui est affiché au départ
let alimentActuel = "fruit";
let modeActuel = "quantite";
let barreSelectionnee = null; // pas encore de barre cliquée


// moyenne d'un tableau
function calculerMoyenne(tableau) {
    let total = 0;
    for (let i = 0; i < tableau.length; i++) {
        total = total + tableau[i];
    }
    return total / tableau.length;
}

// ajoute l'unité : "842 g" ou "£3.23"
function formaterValeur(valeur) {
    if (modeActuel === "quantite") {
        return Math.round(valeur) + " g";
    } else {
        return "£" + valeur.toFixed(2);
    }
}

// nom du groupe à partir de sa position (0 à 9)
function nomDuGroupe(index) {
    if (index === 0) {
        return "Group 1 (poorest 10%)";
    } else if (index === 9) {
        return "Group 10 (richest 10%)";
    } else {
        return "Group " + (index + 1);
    }
}

// une couleur par barre
function couleursDesBarres() {
    const couleurs = [];
    for (let i = 0; i < 10; i++) {
        if (i === barreSelectionnee) {
            couleurs.push(BORDEAUX);
        } else if (i === 0) {
            couleurs.push(BLEU);
        } else if (i === 9) {
            couleurs.push(ORANGE);
        } else {
            couleurs.push(GRIS);
        }
    }
    return couleurs;
}

// pour tracer la ligne de moyenne il faut 10 fois la même valeur
function ligneDeMoyenne(valeurs) {
    const moyenne = calculerMoyenne(valeurs);
    const ligne = [];
    for (let i = 0; i < 10; i++) {
        ligne.push(moyenne);
    }
    return ligne;
}


// création du graphique
const valeursDeDepart = donnees[alimentActuel][modeActuel];
const canvas = document.getElementById("graphique");

const graphique = new Chart(canvas, {
    type: "bar",
    data: {
        labels: groupes,
        datasets: [
            {
                // les barres
                label: "Income group",
                data: valeursDeDepart,
                backgroundColor: couleursDesBarres(),
                order: 2
            },
            {
                // la ligne de moyenne en pointillés
                type: "line",
                label: "Average of all groups",
                data: ligneDeMoyenne(valeursDeDepart),
                borderColor: "#222222",
                borderWidth: 2,
                borderDash: [8, 6],
                pointRadius: 0,
                order: 1
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,

        animation: {
            duration: 800
        },

        // interaction interne 3 : clic sur une barre
        onClick: function (evenement, elements) {
            // elements est vide si on clique à côté des barres
            if (elements.length > 0) {
                barreSelectionnee = elements[0].index;
                mettreAJourChiffreCle();
                mettreAJourGraphique();
            }
        },

        plugins: {
            // interaction interne 2 : Chart.js masque/affiche une série quand on clique dans la légende
            legend: {
                position: "top",
                labels: {
                    font: { family: "Inter", size: 13 },
                    // je garde seulement la moyenne dans la légende, les couleurs sont expliquées sous le graphique
                    filter: function (element) {
                        return element.datasetIndex === 1;
                    }
                }
            },

            // interaction interne 1 : l'infobulle au survol
            tooltip: {
                callbacks: {
                    title: function (items) {
                        return nomDuGroupe(items[0].dataIndex);
                    },
                    label: function (item) {
                        if (item.datasetIndex === 1) {
                            return "Average: " + formaterValeur(item.raw);
                        }
                        return formaterValeur(item.raw) + " per person per week";
                    }
                }
            }
        },

        scales: {
            x: {
                title: {
                    display: true,
                    text: "Income group (1 = poorest 10%, 10 = richest 10%)"
                }
            },
            y: {
                beginAtZero: true, // sinon les écarts paraissent plus grands qu'ils ne sont
                title: {
                    display: true,
                    text: "Grams per person per week"
                }
            }
        }
    }
});


// recharge le graphique avec l'aliment et le mode choisis
function mettreAJourGraphique() {
    const valeurs = donnees[alimentActuel][modeActuel];

    graphique.data.datasets[0].data = valeurs;
    graphique.data.datasets[0].backgroundColor = couleursDesBarres();
    graphique.data.datasets[1].data = ligneDeMoyenne(valeurs);

    if (modeActuel === "quantite") {
        graphique.options.scales.y.title.text = "Grams per person per week";
    } else {
        graphique.options.scales.y.title.text = "Pounds (£) per person per week";
    }

    mettreAJourTitre();

    graphique.update(); // sans ça rien ne change à l'écran
}

// titre et sous-titre au-dessus du graphique
function mettreAJourTitre() {
    const titre = document.getElementById("titre-graphique");
    const sousTitre = document.getElementById("sous-titre-graphique");

    if (modeActuel === "quantite") {
        titre.textContent = donnees[alimentActuel].titreQuantite;
        sousTitre.textContent = "Amount of " + donnees[alimentActuel].nom + " bought per person per week, by income group, UK, 2024/25";
    } else {
        titre.textContent = donnees[alimentActuel].titreDepense;
        sousTitre.textContent = "Money spent on " + donnees[alimentActuel].nom + " per person per week, by income group, UK, 2024/25";
    }
}

// phrase de l'encadré sous le graphique
function mettreAJourChiffreCle() {
    const zoneTexte = document.getElementById("chiffre-cle");

    if (barreSelectionnee === null) {
        zoneTexte.textContent = "Click on a bar to compare an income group with the average.";
        return;
    }

    const valeurs = donnees[alimentActuel][modeActuel];
    const valeur = valeurs[barreSelectionnee];
    const moyenne = calculerMoyenne(valeurs);
    const ecart = Math.round((valeur - moyenne) / moyenne * 100);

    let comparaison = "";
    if (ecart > 0) {
        comparaison = ecart + "% more than the average of all groups.";
    } else if (ecart < 0) {
        comparaison = Math.abs(ecart) + "% less than the average of all groups.";
    } else {
        comparaison = "the same as the average of all groups.";
    }

    let verbe = "";
    if (modeActuel === "quantite") {
        verbe = " of " + donnees[alimentActuel].nom + " bought";
    } else {
        verbe = " spent on " + donnees[alimentActuel].nom;
    }

    zoneTexte.textContent = "Key figure: " + nomDuGroupe(barreSelectionnee) + ", " +
        formaterValeur(valeur) + verbe + " per person per week, " + comparaison;
}


// interaction externe 1 : les boutons des aliments
const boutonsAliments = document.querySelectorAll(".bouton-aliment");

boutonsAliments.forEach(function (bouton) {
    bouton.addEventListener("click", function () {
        // on enlève "actif" partout puis on le remet sur le bouton cliqué
        boutonsAliments.forEach(function (b) {
            b.classList.remove("actif");
        });
        bouton.classList.add("actif");

        // data-aliment dans le HTML = nom de l'aliment dans l'objet donnees
        alimentActuel = bouton.dataset.aliment;
        mettreAJourGraphique();
        mettreAJourChiffreCle();
    });
});

// interaction externe 2 : quantité ou dépense
const boutonsMode = document.querySelectorAll(".bouton-mode");

boutonsMode.forEach(function (bouton) {
    bouton.addEventListener("click", function () {
        boutonsMode.forEach(function (b) {
            b.classList.remove("actif");
        });
        bouton.classList.add("actif");

        modeActuel = bouton.dataset.mode;
        mettreAJourGraphique();
        mettreAJourChiffreCle();
    });
});

// premier titre au chargement de la page
mettreAJourTitre();
