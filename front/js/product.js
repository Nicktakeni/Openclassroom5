document.addEventListener("DOMContentLoaded", function () {


    async function main() {
        // On Récupére l'Url.
        const url = new URL(window.location.href);
        // productId = à Id récupérer en paramètre de notre Url
        let productId = url.searchParams.get("id");

        // On Appel notre fonction qui va nous retourné notre produit de l'API
        let product = await GetId(productId);

        // Fonction d'affichage du produit.
        DisplayProduct(product);

        // Fonction d'ecoute du btn ajouter au panier.
        BtnClick(product);
    }

    main();

    //-------------------Fonction d'intérrogation de notre api avec productId-------------------//
    //-----------------------------------------------------------------------------------------//
    async function GetId(productId) {

        return fetch("http://localhost:3000/api/products/" + productId)
            .then(function (response) {
                return response.json();
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    //-------------------Fonction d'affichage du produit-------------------//
    //---------------------------------------------------------------------//
    function DisplayProduct(product) {

        // Récupération des parents.
        const title = document.getElementsByTagName("title")[0];
        const parentImg = document.getElementsByClassName("item__img")[0];
        const parentName = document.getElementById("title");
        const parentPrice = document.getElementById("price");
        const parentDescription = document.getElementById("description");

        // Création de notre balise image avec les attributs.
        const productImg = document.createElement("img");
        productImg.setAttribute("src", product.imageUrl);
        productImg.setAttribute("alt", product.altTxt);
        // Push après notre balise à la fin de la liste.
        parentImg.appendChild(productImg);

        // On change les différentes valeurs à la volée.
        title.innerHTML = product.name;
        parentName.innerText = product.name;
        parentPrice.innerText = product.price;
        parentDescription.innerText = product.description;

        //* Création des choix couleur-------------------------------------------------
        const SelecteurCouleur = document.getElementById("colors");
        let options = product.colors;
        options.forEach(function (element) {
            SelecteurCouleur.appendChild(new Option(element, element));
        })

    }


    //-------------------Initialisation Class Produit-------------------//
    //---------------------------------------------------------------------//
    class ProductClass {
        constructor(id, name, color, qty) {
            this.id = id;
            this.name = name;
            this.color = color;
            this.qty = qty;
        }
    }

    //-------------------Fonction BoutonAddPanier et save LocalStorage-------------------//
    //----------------------------------------------------------------------------------//

    function BtnClick(product) {
        // Initialisation des variables.
        let colorChoosen = "";
        let qtyChoosen = "";
        let qty = "";
        let BtnPanier = document.getElementById("addToCart");

        // Sélection des couleurs avec sont comportement au change.
        let colorSelection = document.getElementById("colors");
        colorSelection.addEventListener("change", function (event) {
            colorChoosen = event.target.value;
        });

        // Sélection de la quantité avec sont comportement au change.
        let qtySelection = document.getElementById("quantity");
        qtySelection.addEventListener("change", function (event) {
            qty = event.target.value;
        });

        // Ecoute au click sur le bouton Panier.
        BtnPanier.addEventListener("click", function () {

            // Initialisation variable
            let ProductLocalStorage = [];
            let oldQty = 0;


            // Boucle for à la longueur du localStorage avec récuperation des informations du localstorage.
            for (let i = 0; i < localStorage.length; i++) {
                ProductLocalStorage[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));
                // Conditionnel si Id est la même dans localstorage et dans notre Newproduct,
                // && que si la Color de notre Newproduct est strictement = à celle qui est dans le localstorage. 
                if (product._id === ProductLocalStorage[i].id && ProductLocalStorage[i].color === colorChoosen) {
                    oldQty = ProductLocalStorage[i].qty;
                }
            }

            // On Calcul notre nouvel quantité en prenant en compte l'ancienne valeur.
            qtyChoosen = parseInt(oldQty) + parseInt(qty);

            let productChoosen = new ProductClass(
                product._id,
                product.name,
                colorChoosen,
                qtyChoosen,
            );

            if (colorChoosen != "" && qtyChoosen >= 1 && qtyChoosen <= 100) {

                localStorage.setItem(
                    product.name + " " + colorChoosen,
                    JSON.stringify(productChoosen)
                );



            } else {
                alert("Veuillez renseigner une couleur et une quantité entre 1 et 100.");
            }


        })


    }

});
