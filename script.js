// Sélectionner tous les éléments input de type number
const prices = document.querySelectorAll("input[type='number']");

// Sélectionner tous les éléments input de type checkbox
const checkboxes = document.querySelectorAll("input[type='checkbox']");

const maxAides = {
  "site-web-vitrine": 1200,
  "creations-graphiques": 2000,
  "site-web-e-commerce": 2500,
  chatbot: 2000,
  // Ajouter les autres postes de dépense avec leurs plafonds respectifs
};
function calculateTotal() {
  let total = 0;
  let eligibleTotals = {}; // objet pour stocker les totaux éligibles pour chaque poste de dépense
  let remboursement = 0;
  let prixTotal = 0;
  let prixRestant = 0;

  prices.forEach((priceInput) => {
    const checkbox = priceInput
      .closest("tr")
      .querySelector("input[type='checkbox']");
    if (checkbox && checkbox.checked) {
      const price = parseFloat(priceInput.value);
      if (!isNaN(price)) {
        total += price;
        if (priceInput.getAttribute("data-eligible") === "true") {
          const maxAideName = priceInput.getAttribute("data-max-aide");
          if (maxAideName) {
            const maxAideValue = maxAides[maxAideName];
            let eligibleAmount = Math.min(price * 0.8, maxAideValue);
            if (eligibleTotals[maxAideName]) {
              eligibleAmount = Math.min(
                eligibleAmount,
                maxAideValue - eligibleTotals[maxAideName]
              );
            }
            if (
              !eligibleTotals[maxAideName] ||
              eligibleTotals[maxAideName] + eligibleAmount <= maxAideValue
            ) {
              eligibleTotals[maxAideName] =
                (eligibleTotals[maxAideName] || 0) + eligibleAmount;
            }
          }
        }
      }
    }
  });

  // Calculer le remboursement total en prenant en compte le plafond de 3200€
  remboursement = Object.values(eligibleTotals).reduce((a, b) => a + b, 0);
  remboursement = Math.min(remboursement, 3200);

  // Calculer le prix total
  prixTotal = total;

  // Calculer le prix restant à payer
  prixRestant = prixTotal - remboursement;

  // Afficher les montants restants pour chaque aide
  const montantsRestantsAides = Object.keys(eligibleTotals)
    .map((maxAideName) => {
      const montantRestant =
        maxAides[maxAideName] - eligibleTotals[maxAideName];
      return `Montant restant pour ${maxAideName} : ${montantRestant.toFixed(
        2
      )}€`;
    })
    .join("<br/>");

  // Afficher les montants restants des aides dans l'élément HTML
  document.getElementById("montants-restants-aides").innerHTML =
    montantsRestantsAides;

  // Mettre à jour les champs
  document.getElementById("total").value = total.toFixed(2);
  document.getElementById("remboursement").value = remboursement.toFixed(2);
  document.getElementById("prix-restant").value = prixRestant.toFixed(2);
}

// Ajouter un événement pour calculer le total à chaque modification de champ
prices.forEach((priceInput) => {
  const checkbox = priceInput
    .closest("tr")
    .querySelector("input[type='checkbox']");
  if (checkbox) {
    checkbox.addEventListener("change", () => {
      priceInput.disabled = !checkbox.checked;
    });
    priceInput.disabled = true; // initialement désactiver le champ
  }
  priceInput.addEventListener("input", calculateTotal);
});

// Ajouter un événement pour calculer le total à chaque modification de case à cocher
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", calculateTotal);
});
