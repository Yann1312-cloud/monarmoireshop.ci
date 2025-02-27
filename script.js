// script.js
document.addEventListener('DOMContentLoaded', function () {
    const products = [
        { id: 1, name: 'Pull', description: 'Pull chaud et confortable pour l\'hiver.', image: 'pull.jpg', price: 15000 },
        { id: 2, name: 'Jean', description: 'Jean slim fit, décontracté et élégant.', image: 'jean.jpg', price: 20000 },
        { id: 3, name: 'Tee-shirt', description: 'Tee-shirt en coton, disponible en plusieurs couleurs.', image: 'tshirt.jpg', price: 8000 },
        { id: 4, name: 'Pantalon', description: 'Pantalon droit, idéal pour le bureau.', image: 'pantalon.jpg', price: 25000 },
        { id: 5, name: 'Basquettes', description: 'Basquettes sportives pour un style urbain.', image: 'basquettes.jpg', price: 30000 },
        { id: 6, name: 'Hoodies', description: 'Hoodies avec capuche, parfait pour les soirées fraîches.', image: 'hoodie.jpg', price: 18000 },
        { id: 7, name: 'Chemise', description: 'Chemise en lin, légère et respirante.', image: 'chemise.jpg', price: 22000 }
    ];

    const productListSection = document.getElementById('productListSection');
    const registrationSection = document.getElementById('registrationSection');
    const productDetailsSection = document.getElementById('productDetailsSection');
    const cartSection = document.getElementById('cartSection');
    const productList = document.getElementById('productList');
    const productDetails = document.getElementById('productDetails');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const backToListButton = document.getElementById('backToListButton');
    const backToProductsButton = document.getElementById('backToProductsButton');
    const homeLink = document.getElementById('homeLink');
    const cartLink = document.getElementById('cartLink');
    const registrationForm = document.getElementById('registrationForm');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const user = JSON.parse(localStorage.getItem('user'));

    // Afficher la liste des produits au chargement
    displayProductList();
    updateCartCount();

    // Gestionnaire d'événement pour le clic sur un produit
    function displayProductList() {
        productList.innerHTML = '';
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product';
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="price">${product.price.toLocaleString()} FCFA</div>
                <button class="add-to-cart" data-id="${product.id}">Ajouter au panier</button>
            `;
            productElement.addEventListener('click', () => {
                if (user) {
                    showProductDetails(product);
                } else {
                    showRegistrationForm(product);
                }
            });
            productList.appendChild(productElement);
        });

        // Gestionnaire d'événement pour le bouton "Ajouter au panier"
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const productId = parseInt(button.getAttribute('data-id'));
                const product = products.find(p => p.id === productId);
                addToCart(product);
            });
        });
    }

    // Afficher le formulaire d'inscription
    function showRegistrationForm(product) {
        productListSection.style.display = 'none';
        registrationSection.style.display = 'block';
        productDetailsSection.style.display = 'none';
        cartSection.style.display = 'none';
        localStorage.setItem('selectedProduct', JSON.stringify(product));
    }

    // Gestionnaire d'événement pour le formulaire d'inscription
    registrationForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        // Enregistrer l'utilisateur dans localStorage
        const user = { name, email };
        localStorage.setItem('user', JSON.stringify(user));

        // Masquer le formulaire d'inscription
        registrationSection.style.display = 'none';

        // Afficher les détails du produit après inscription
        const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct'));
        showProductDetails(selectedProduct);
    });

    // Afficher les détails du produit
    function showProductDetails(product) {
        productDetails.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="price">${product.price.toLocaleString()} FCFA</div>
            <button class="add-to-cart" data-id="${product.id}">Ajouter au panier</button>
        `;

        productListSection.style.display = 'none';
        registrationSection.style.display = 'none';
        productDetailsSection.style.display = 'block';
        cartSection.style.display = 'none';

        // Gestionnaire d'événement pour le bouton "Ajouter au panier" dans les détails
        document.querySelector('.add-to-cart').addEventListener('click', (event) => {
            event.stopPropagation();
            addToCart(product);
        });
    }

    // Ajouter un produit au panier
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    // Mettre à jour le nombre d'articles dans le panier
    function updateCartCount() {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Afficher le panier
    cartLink.addEventListener('click', (event) => {
        event.preventDefault();
        productListSection.style.display = 'none';
        registrationSection.style.display = 'none';
        productDetailsSection.style.display = 'none';
        cartSection.style.display = 'block';
        displayCart();
    });

    // Afficher les articles du panier
    function displayCart() {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <div class="price">${item.price.toLocaleString()} FCFA</div>
                <div>Quantité: ${item.quantity}</div>
            `;
            cartItems.appendChild(cartItem);
        });
    }

    // Retour à la liste des produits
    backToListButton.addEventListener('click', () => {
        productListSection.style.display = 'block';
        registrationSection.style.display = 'none';
        productDetailsSection.style.display = 'none';
        cartSection.style.display = 'none';
    });

    // Retour aux produits depuis le panier
    backToProductsButton.addEventListener('click', () => {
        productListSection.style.display = 'block';
        registrationSection.style.display = 'none';
        productDetailsSection.style.display = 'none';
        cartSection.style.display = 'none';
    });

    // Retour à l'accueil
    homeLink.addEventListener('click', (event) => {
        event.preventDefault();
        productListSection.style.display = 'block';
        registrationSection.style.display = 'none';
        productDetailsSection.style.display = 'none';
        cartSection.style.display = 'none';
    });
});