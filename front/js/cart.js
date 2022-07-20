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
        constructor(id, name, color, qty, alttxt, description, imageurl, price) {
            this.id = id;
            this.name = name;
            this.color = color;
            this.qty = qty;
            this.alttxt = alttxt;
            this.description = description;
            this.imageurl = imageurl;
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




});