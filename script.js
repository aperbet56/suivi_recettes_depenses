const balance = document.querySelector("#balance");
const moneyPlus = document.querySelector("#money-plus");
const moneyMinus = document.querySelector("#money-minus");
const list = document.querySelector("#list");
const text = document.querySelector("#text");
const amount = document.querySelector("#amount");
const button = document.querySelector(".btn");

// Fonction generateId permettant de générer un ID pour une transaction de manière aléatoire
const generateId = () => {
  return Math.floor(Math.random() * 100000000);
};

// Initialisation du localStorage
let localStorageTransactions = JSON.parse(localStorage.getItem("transactions"));

// La méthode getItem() de l'interface Storage renvoie la valeur associée à la clé passée en paramètre.
let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// Fonction addTransaction qui va permettre d'ajouter une transaction.
const addTransaction = (e) => {
  e.preventDefault();

  if (text.value === "" || amount.value === "") {
    alert(
      "Veuillez ajouter s'il-vous-plait le nom de la transaction et/ou le montant."
    );
  } else {
    // Création de l'objet transaction
    const transaction = {
      id: generateId(), // Appel de la fonction generateId
      text: text.value,
      amount: +amount.value,
    };
    //console.log(transaction);

    transactions.push(transaction);
    //console.table(transactions);

    // Appel de la fonction displayTranssactionInLS
    displayTransactionInLS(transaction);

    // Appel de la fonction updateValues
    updateValues();

    // Mise à jour du local storage avec la méthode setItem()
    localStorage.setItem("transactions", JSON.stringify(transactions));

    text.value = "";
    amount.value = "";
  }
};

// Fonction displayTransactionInLS ayant pour paramètre transaction
const displayTransactionInLS = (transaction) => {
  // variable sign + ou - qui change suivant le montant renseigné per l'internaute
  let sign = transaction.amount < 0 ? "-" : "+";

  // Création de l'élément <li> dans le DOM
  const item = document.createElement("li");

  // Ajout de la classe minus ou plus suivant le montant renseigné (négatif = minus ou positif = plus) grâce à une ternaire
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span> <button class="delete__btn" onclick="removeTransaction(${
    transaction.id
  })">x</button>
  `;
  // Insertion de l'élément <li> créé dans le DOM
  list.appendChild(item);
};

// Fonction updateValues pour mettre à jour le solde, les recettes et les dépenses
const updateValues = () => {
  // création de la constante amounts qui va récupérer les différents montants
  const amounts = transactions.map((transaction) => transaction.amount);

  // Création de la constante income pour calculer le total des recettes
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  // Création de la constante expense pour calculer le toatl des dépenses
  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  // Création de la constante total pour le calcul du solde
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  // Affichage du solde, des dépenses et des recettes de manière dynamique dans le DOM
  balance.textContent = `${total}€`;
  moneyPlus.textContent = `${income}€`;
  moneyMinus.textContent = `${expense}€`;
};

// Fonction removeTransaction ayant pour paramètre l'ID de la transaction à supprimer
const removeTransaction = (id) => {
  // Sélection des transactions à conserver avec la méthode filter et suppression de la transaction souhaitée avec la logique inversée !==
  transactions = transactions.filter((transaction) => transaction.id !== id);

  // Mise à jour du local storage
  localStorage.setItem("transactions", JSON.stringify(transactions));
  //console.table(transactions);

  // Appel de la fonction init
  init();
};

// Fonction init pour initialiser et mettre à jour la page
const init = () => {
  list.textContent = "";

  // Pour chaque transaction, appel de la fonction displayTransactionInLS
  transactions.forEach(displayTransactionInLS);

  // Appel de la fonction updateValues
  updateValues();
};
// Appel de la fonction init
init();

// Ecoute des événements et appel de la fontion addTransaction
button.addEventListener("click", addTransaction);
