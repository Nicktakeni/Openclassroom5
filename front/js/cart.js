document.addEventListener("DOMContentLoaded", function (event) {
    // 1 Différencier la page product et panier => Si URL=== CART => On récupère les infos de l'api via productId
    // 2 Récupérer les produits de l'api à l'aide de la même function utilisé dans script js et l'appeler si l'on est sur la page CART
    // 3 Si ProductClass != de empty on renvoit les informations de ce dernier à CART création d'une function ShowCart(ProductClass)
    // 4 Cette dernière possédant toute les informations Necessaire =>



    async function main() {
        let localstoragearray = Getlocalstorage();

        let apiarray = [];

        for (let i = 0; i < localstoragearray.length; i++) {
            apiarray.push(await GetProducts(localstoragearray[i].id));
        }

        let allproducts = concatarray(localstoragearray, apiarray);

        displayCart(allproducts);

        displayPrice(allproducts);

        Listen(allproducts);

        console.log(allproducts);
    };


    main();

    function Getlocalstorage() {
        // Initialisation variable
        let ProductLocalStorage = [];
        // Boucle for à la longueur du localStorage avec récuperation des informations du localstorage.
        for (let i = 0; i < localStorage.length; i++) {
            ProductLocalStorage[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));
        }
        return ProductLocalStorage;
    };

    //-------------------Fonction d'intérrogation de notre api avec product-------------------//
    //-----------------------------------------------------------------------------------------//
    async function GetProducts(Productid) {
        return fetch("http://localhost:3000/api/products/" + Productid)
            .then(function (res) {
                return res.json();
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    //------------------------Récupération du LocalStorage -----------------------//
    //-------------------------------------------------------------------------//
    class ProductClass {
        constructor(id, name, color, qty, altTxt, description, imageUrl, price) {
            this.id = id;
            this.name = name;
            this.color = color;
            this.qty = qty;
            this.altTxt = altTxt;
            this.description = description;
            this.imageUrl = imageUrl;
            this.price = price;
        }
    }

    function concatarray(localstoragearray, apiarray) {
        let allproducts = [];
        for (let i = 0; i < localstoragearray.length; i++) {
            let objectproduct = new ProductClass(
                localstoragearray[i].id,
                localstoragearray[i].name,
                localstoragearray[i].color,
                localstoragearray[i].qty,
                apiarray[i].altTxt,
                apiarray[i].description,
                apiarray[i].imageUrl,
                apiarray[i].price,

            )
            allproducts.push(objectproduct);



        }
        return allproducts;
    }

    function displayCart(allproducts) {

        const Dom = document.getElementById("cart__items");

        for (const product of allproducts) {
            Dom.insertAdjacentHTML(
                "beforeend",
                `
                    <article class="cart__item" data-id="${product._id}" data-color="${product.color}">
                        <div class="cart__item__img">
                            <img src="${product.imageUrl}" alt="${product.altTxt}"> 
                        </div>
                        <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${product.name}</h2>
                                <p>${product.color}</p>
                                <p>${product.price}</p>
                            </div>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">
                                    <p>Qté : </p>
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.qty}">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                </div>
                            </div>
                        </div>
                    </article>
                `
            );
        }
    }


    function displayPrice(allproducts) {
        let totalquantity = 0;
        let totalprice = 0;

        for (const product of allproducts) {
            totalquantity += parseInt(product.qty);
            totalprice += parseInt(product.qty * product.price);
        }
        const DtotalQuantity = document.getElementById("totalQuantity");
        const DtotalPrice = document.getElementById("totalPrice");


        DtotalQuantity.innerText = totalquantity;
        DtotalPrice.innerText = totalprice;

    }

    //-------------------Fonction principal d'écoute-------------------//
    //----------------------------------------------------------------//
    function Listen(allProducts) {
        // Fonction si changement dans notre input quantity.
        ecoutequantity(allProducts);
        // Fonction si on veux supprimer un éléments de la liste.
        ecoutedeleteProduct(allProducts);
    }


    //-------------------Fonction d'écoute de quantité-------------------//
    //-------------------------------------------------------------------//
    function ecoutequantity(allProducts) {

        let qtyinput = document.querySelectorAll(".itemQuantity");

        qtyinput.forEach(function (input) {
            input.addEventListener("change", function (inputevent) {

                let inputvalue = inputevent.target.value;

                if (inputvalue >= 1 && inputvalue <= 100) {
                    const Name = input
                        .closest("div.cart__item__content")
                        .querySelector("div.cart__item__content__description > h2").innerText;

                    const color = input
                        .closest("div.cart__item__content")
                        .querySelector("div.cart__item__content__description > p").innerText;

                    const productKey = Name + " " + color;

                    let productlocal = JSON.parse(localStorage.getItem(productKey));

                    productlocal.qty = inputvalue;

                    localStorage.setItem(productKey, JSON.stringify(productlocal));

                    const result = allProducts.find(product => product.name === productlocal.name && product.color === productlocal.color);

                    result.qty = inputvalue;

                    displayPrice(allProducts)

                } else {
                    alert("Veuillez choisir une bonne quantité")
                }
            })
        })


    }



    //-------------------Fonction ecoute produit supprimé-------------------//
    //-----------------------------------------------------------------------//

    function ecoutedeleteProduct(allProducts) {

        let deleteLink = document.querySelectorAll(".deleteItem");

        deleteLink.forEach(function (input) {
            input.addEventListener("click", function () {
                const Name = input
                    .closest("div.cart__item__content")
                    .querySelector("div.cart__item__content__description > h2").innerText;

                const color = input
                    .closest("div.cart__item__content")
                    .querySelector("div.cart__item__content__description > p").innerText;

                const productKey = Name + " " + color;

                let productlocal = JSON.parse(localStorage.getItem(productKey));

                localStorage.removeItem(productKey);

                input.closest("article.cart__item").remove();


                allProducts = allProducts.filter(product => product.name !== productlocal.name && product.color !== productlocal.color);
                ecoutequantity(allProducts);
                displayPrice(allProducts)
            })
        })


    };

    //---------------------Validation formulaire------------------------//
    //------------------------------------------------------------------//

    function ValidationForm(form) {

        // Initialisation de nos variables de test.
        const stringRegex = /^[a-zA-Z-\s']+$/;
        const emailRegex = /^\w+([.-]?\w+)@\w+([.-]?\w+).(.\w{2,3})+$/;
        const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/;
        let control = true;

        // Si une des valeurs dans nos inputs de notre Form on affiche un méssage d'érreur.
        if (!form.firstName.value.match(stringRegex)) {
            document.getElementById("firstNameErrorMsg").innerText = "Mauvais prénom";
            control = false;
            // Sinon on affiche rien
        } else {
            document.getElementById("firstNameErrorMsg").innerText = "";
        }


        if (control) {
            return true;
        } else {
            return false;
        }
    }


    function validation() {
        let orderButton = document.getElementById("order");

        orderButton.addEventListener("click", function (event) {
            let form = document.querySelector(".cart__order__form");
            event.preventDefault();

            if (localStorage.length !== 0) {
                if (ValidationForm(form)) {
                    console.log("tout ce passe bien")


                    // // Méthode Appel Ajax en POST en inculant notre commande(order). 
                    // const options = {
                    //     method: "POST",
                    //     body: JSON.stringify(order),
                    //     headers: {
                    //         Accept: "application/json",
                    //         "Content-Type": "application/json",
                    //     },
                    // };



                } else {
                    event.preventDefault();
                    alert("Le formulaire est mal remplis.")
                }
            } else {
                event.preventDefault();
                alert("Votre panier est vide.");
            }
        })
    }

});