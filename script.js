// =====================================================
// 1. LES DONNÉES
// Source : Defra, Family Food 2024/25 (fichiers ConsEIDHH et EIDExp)
// Valeurs reprises de mon tableur (feuilles Nettoye_Quantites et Nettoye_Depenses).
// titreQuantite / titreDepense = titre du graphique selon le mode choisi
// (chaque titre a été vérifié avec les chiffres ci-dessous).
// Chaque tableau contient 10 valeurs : du groupe 1 (les 10 % les plus pauvres)
// au groupe 10 (les 10 % les plus riches), par personne et par semaine.
// quantite = grammes achetés ; depense = livres (£) dépensées.
// =====================================================
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

// Noms des 10 groupes, affichés sous les barres
const groupes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

// Couleurs (les mêmes que dans le CSS et le carrousel)
const BLEU = "#1F6FB2";       // groupe 1 (les plus pauvres)
const ORANGE = "#C2540A";     // groupe 10 (les plus riches)
const GRIS = "#BDBDBD";       // les autres groupes
const BORDEAUX = "#8B1A4A";   // barre sélectionnée par un clic

// Ce qui est affiché en ce moment
let alimentActuel = "fruit";
let modeActuel = "quantite";
let barreSelectionnee = null; // aucune barre sélectionnée au départ


// =====================================================
// 2. PETITES FONCTIONS UTILES
// =====================================================

// Calcule la moyenne d'un tableau de nombres
function calculerMoyenne(tableau) {
    let total = 0;
    for (let i = 0; i < tableau.length; i++) {
        total = total + tableau[i];
    }
    return total / tableau.length;
}

// Écrit une valeur avec la bonne unité : "842 g" ou "£3.23"
function formaterValeur(valeur) {
    if (modeActuel === "quantite") {
        return Math.round(valeur) + " g";
    } else {
        return "£" + valeur.toFixed(2);
    }
}

// Donne le nom d'un groupe en toutes lettres
function nomDuGroupe(index) {
    if (index === 0) {
        return "Group 1 (poorest 10%)";
    } else if (index === 9) {
        return "Group 10 (richest 10%)";
    } else {
        return "Group " + (index + 1);
    }
}

// Crée la liste des 10 couleurs de barres
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

// Crée une ligne de 10 valeurs identiques (la moyenne), pour la ligne pointillée
function ligneDeMoyenne(valeurs) {
    const moyenne = calculerMoyenne(valeurs);
    const ligne = [];
    for (let i = 0; i < 10; i++) {
        ligne.push(moyenne);
    }
    return ligne;
}


// =====================================================
// 3. CRÉATION DU GRAPHIQUE AVEC CHART.JS
// =====================================================
const valeursDeDepart = donnees[alimentActuel][modeActuel];
const canvas = document.getElementById("graphique");

const graphique = new Chart(canvas, {
    type: "bar",
    data: {
        labels: groupes,
        datasets: [
            {
                // Série 1 : les barres
                label: "Income group",
                data: valeursDeDepart,
                backgroundColor: couleursDesBarres(),
                order: 2
            },
            {
                // Série 2 : la ligne de moyenne (affichable / masquable avec la légende)
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

        // Animation des barres au chargement et à chaque mise à jour
        animation: {
            duration: 800
        },

        // INTERACTION INTERNE 3 : clic sur une barre
        onClick: function (evenement, elements) {
            // "elements" contient la barre cliquée (vide si on clique à côté)
            if (elements.length > 0) {
                barreSelectionnee = elements[0].index;
                mettreAJourChiffreCle();
                mettreAJourGraphique();
            }
        },

        plugins: {
            // INTERACTION INTERNE 2 : la légende est cliquable par défaut dans Chart.js
            // (un clic sur "Average of all groups" masque ou affiche la ligne)
            legend: {
                position: "top",
                labels: {
                    font: { family: "Inter", size: 13 },
                    // On affiche seulement la ligne de moyenne dans la légende :
                    // le sens des couleurs des barres est expliqué sous le graphique
                    filter: function (element) {
                        return element.datasetIndex === 1;
                    }
                }
            },

            // INTERACTION INTERNE 1 : infobulle au survol
            tooltip: {
                callbacks: {
                    // Titre de l'infobulle : le nom du groupe
                    title: function (items) {
                        return nomDuGroupe(items[0].dataIndex);
                    },
                    // Texte de l'infobulle : la valeur avec son unité
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
                beginAtZero: true, // l'axe commence à 0 pour ne pas déformer les écarts
                title: {
                    display: true,
                    text: "Grams per person per week"
                }
            }
        }
    }
});


// =====================================================
// 4. MISE À JOUR DU GRAPHIQUE ET DE L'ENCADRÉ
// =====================================================

// Recharge les données selon l'aliment et le mode choisis
function mettreAJourGraphique() {
    const valeurs = donnees[alimentActuel][modeActuel];

    graphique.data.datasets[0].data = valeurs;
    graphique.data.datasets[0].backgroundColor = couleursDesBarres();
    graphique.data.datasets[1].data = ligneDeMoyenne(valeurs);

    // Le titre de l'axe Y change selon le mode
    if (modeActuel === "quantite") {
        graphique.options.scales.y.title.text = "Grams per person per week";
    } else {
        graphique.options.scales.y.title.text = "Pounds (£) per person per week";
    }

    mettreAJourTitre();

    graphique.update(); // Chart.js redessine le graphique avec une animation
}

// Change le titre et le sous-titre du graphique
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

// Écrit la phrase de l'encadré "Key figure"
function mettreAJourChiffreCle() {
    const zoneTexte = document.getElementById("chiffre-cle");

    // Si aucune barre n'est sélectionnée, on affiche la consigne
    if (barreSelectionnee === null) {
        zoneTexte.textContent = "Click on a bar to compare an income group with the average.";
        return;
    }

    const valeurs = donnees[alimentActuel][modeActuel];
    const valeur = valeurs[barreSelectionnee];
    const moyenne = calculerMoyenne(valeurs);
    const ecart = Math.round((valeur - moyenne) / moyenne * 100);

    // "more" ou "less" selon le signe de l'écart
    let comparaison = "";
    if (ecart > 0) {
        comparaison = ecart + "% more than the average of all groups.";
    } else if (ecart < 0) {
        comparaison = Math.abs(ecart) + "% less than the average of all groups.";
    } else {
        comparaison = "the same as the average of all groups.";
    }

    // Verbe selon le mode
    let verbe = "";
    if (modeActuel === "quantite") {
        verbe = " of " + donnees[alimentActuel].nom + " bought";
    } else {
        verbe = " spent on " + donnees[alimentActuel].nom;
    }

    zoneTexte.textContent = "Key figure – " + nomDuGroupe(barreSelectionnee) + ": " +
        formaterValeur(valeur) + verbe + " per person per week, " + comparaison;
}


// =====================================================
// 5. INTERACTIONS EXTERNES (boutons HTML)
// =====================================================

// INTERACTION EXTERNE 1 : boutons des aliments
const boutonsAliments = document.querySelectorAll(".bouton-aliment");

boutonsAliments.forEach(function (bouton) {
    bouton.addEventListener("click", function () {
        // On enlève la classe "actif" de tous les boutons...
        boutonsAliments.forEach(function (b) {
            b.classList.remove("actif");
        });
        // ...et on la met sur le bouton cliqué
        bouton.classList.add("actif");

        // On lit l'aliment écrit dans l'attribut data-aliment du bouton
        alimentActuel = bouton.dataset.aliment;
        mettreAJourGraphique();
        mettreAJourChiffreCle();
    });
});

// INTERACTION EXTERNE 2 : interrupteur quantité / dépense
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

// Au chargement de la page : on écrit le premier titre
mettreAJourTitre();
