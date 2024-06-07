// Get Inputs from user
var productName = document.getElementById('productName');
var productPrice = document.getElementById('productPrice');
var productCategory = document.getElementById('productCategory');
var productDescription = document.getElementById('productDescription');
var productImage = document.getElementById('productImage');


var productsRow = document.getElementById('productsRow');
var addBtn = document.getElementById('addBtn');
var updateBtn = document.getElementById('updateBtn');
var noMatchAlert = document.getElementById("no-match");

var adddLabel = document.getElementById("staticBackdropLabel");
var updateLabel = document.getElementById("staticBackdropLabel2");

var updateNumber;

var productList;


if (localStorage.getItem('productList') != null) {
    productList = JSON.parse(localStorage.getItem('productList'));
    displayProduct(productList);
} else {
    productList = [];
}

function addProduct() {
    var product = {
        name: productName.value,
        price: productPrice.value,
        category: productCategory.value,
        description: productDescription.value,
        image: `./images/${productImage.files[0].name}`
    }

    // Check validation
    if (productName.classList.contains('is-valid')
        && productPrice.classList.contains('is-valid')
        && productCategory.classList.contains('is-valid')
        && productDescription.classList.contains('is-valid')) {


            addBtn.disabled = true;
        // Add Product to our Array
        productList.push(product);
        localStorage.setItem('productList', JSON.stringify(productList));

        // Display our data
        displayProduct(productList);

        // Clear the inputs and reassign classes over it
        clearForm();
        reset();

    } 

    addBtn.removeAttribute('data-bs-dismiss');
    updateBtn.removeAttribute('data-bs-dismiss');
}

function clearForm() {
    productName.value = '';
    productPrice.value = '';
    productCategory.value = '';
    productDescription.value = '';
    productImage.value = '';
}

function deleteProduct(index) {
    // Delete from our array
    productList.splice(index, 1);

    // Refresh product list
    localStorage.setItem('productList', JSON.stringify(productList));

    // Check if product list is empty
    if (productList.length == 0) {
        var bBox = '';
        productsRow.innerHTML = bBox;
    } else {
        displayProduct(productList);
    }

}

function searchProduct(inputElement) {

    var search = document.getElementById(inputElement.id);
    var keyWord = search.value;

    var searchWay = inputElement.id.includes("Name") ? "name" : "caterory";


    var matchedSearch = [];

    if (searchWay == "name") {
        for (let i = 0; i < productList.length; i++) {
            if (productList[i].name.toLowerCase().includes(search.value.toLowerCase()) == true) {
                productList[i].newName = productList[i].name.toLowerCase().replace(keyWord , `<span class = "text-danger">${keyWord}</span>`);
                matchedSearch.push(productList[i]);
            }
        }
    }
    else{
        for (let i = 0; i < productList.length; i++) {
            if (productList[i].category.toLowerCase().includes(search.value.toLowerCase()) == true) {

                let cat = productList[i].category.toLowerCase();

                if(keyWord.charAt(0) === cat.charAt(0)){
                    let highlightedCat = cat.replace(keyWord, `<span class="text-danger">${keyWord.charAt(0).toUpperCase() + keyWord.slice(1)}</span>`);
                    productList[i].newCategory = highlightedCat.charAt(0).toUpperCase() + highlightedCat.slice(1);
                }
                else if(keyWord.length == 0){
                    productList[i].newCategory = "";
                }
                else{
                    let highlightedCat = cat.replace(keyWord, `<span class="text-danger">${keyWord}</span>`);
                    productList[i].newCategory = highlightedCat.charAt(0).toUpperCase() + highlightedCat.slice(1);
                }

                matchedSearch.push(productList[i]);
            }
        }
    }

    if (matchedSearch.length == 0) {
        noMatchAlert.classList.remove("d-none");
        noMatchAlert.classList.add("d-block");

        productsRow.innerHTML = "";
    }
    else{
        noMatchAlert.classList.remove("d-block");
        noMatchAlert.classList.add("d-none");

        displayProduct(matchedSearch);
    }
}


  

function setAdd() {
    productName.classList.add('nodalBlock');
    productPrice.classList.add('nodalBlock');
    productCategory.classList.add('nodalBlock');
    productDescription.classList.add('nodalBlock');
    addBtn.classList.remove('d-none');
    updateBtn.classList.add('d-none');
    clearForm();
}

function editProduct(updateIndex) {
    // Hide add button and display update button
    addBtn.classList.add('d-none');
    updateBtn.classList.remove('d-none');

    adddLabel.classList.add("d-none");
    updateLabel.classList.remove("d-none");

    // Retrive selected product
    productName.value = productList[updateIndex].name;
    productPrice.value = productList[updateIndex].price;
    productCategory.value = productList[updateIndex].category;
    productDescription.value = productList[updateIndex].description;
    updateNumber = updateIndex;

    updateProduct();
}

function updateProduct() {
    var indexToReplace = updateNumber;

    var newObject = {
        name: productName.value,
        price: productPrice.value,
        category: productCategory.value,
        description: productDescription.value,
        image: `./images/${productImage?.files[0].name}`
    }

    if (!productName.classList.contains('is-invalid') 
        && !productPrice.classList.contains('is-invalid') 
        && !productCategory.classList.contains('is-invalid') 
        && !productDescription.classList.contains('is-invalid')) {

            updateBtn.disabled = false;

        productList.splice(indexToReplace, 1, newObject);

        localStorage.setItem('productList', JSON.stringify(productList));


        displayProduct(productList);
        clearForm();
        reset();
    }

}

// Subscripe to change event
productName.addEventListener('change', updateButtonState);
productPrice.addEventListener('change', updateButtonState);
productCategory.addEventListener('change', updateButtonState);
productDescription.addEventListener('change', updateButtonState);

function updateButtonState(){
    if (!productName.classList.contains('is-invalid') 
        && !productPrice.classList.contains('is-invalid') 
        && !productCategory.classList.contains('is-invalid') 
        && !productDescription.classList.contains('is-invalid')) {

            addBtn.disabled = false;
            updateBtn.disabled = false;
        }
        else{
            addBtn.disabled = true;
            updateBtn.disabled = true;
        }
}


function displayProduct(array) {
    var bBox = '';

    for (let i = 0; i < array.length; i++) {
        bBox += `<div class="col-md-4 col-lg-3">
                        <div class="card mt-5" >
                            <img src="${array[i].image}" class="card-img-top"/>
                            <div class="card-body d-flex flex-column justify-content-center align-items-center">
                                <h2 class="card-text">${array[i].newName ? array[i].newName : array[i].name}</h2>
                                <h3 class="card-text h5 text-muted ">${array[i].description}</h3>
                                <h3 class="card-text h5">Category: ${array[i].newCategory ? array[i].newCategory : array[i].category}</h3>
                                <h3 class="card-text h5">Price: ${array[i].price} L.E</h3>

                                <button class="btn btn-danger w-100" onclick="deleteProduct(${i})" >Delete</button>
                                <button data-bs-toggle="modal"data-bs-target="#staticBackdrop" onclick="editProduct(${i})" class="btn btn bg-warning mt-2 w-100">Update</button>
                            </div>
                        </div>
                    </div>`

        productsRow.innerHTML = bBox;
    }
}


function validateInputs(element) {

    var regex = {
        productName: /^[A-Z]\w{3,10}\s?\w{0,5}$/,
        productPrice: /^[1-9][0-9][0-9][0-9][0-9]?$/,
        productCategory: /^(Mobile|TV|Laptop|Smart Watch)$/,
        productDescription: /^.{4,300}$/
    }


    if (regex[element.id].test(element.value)) {
        element.classList.add('is-valid');
        element.classList.remove('is-invalid');
        element.nextElementSibling.classList.add('d-none');
        element.classList.remove('nodalBlock');
    } else {
        element.classList.remove('is-valid');
        element.nextElementSibling.classList.remove('d-none');
        element.classList.add('is-invalid');
        element.classList.add('nodalBlock');
    }

    if (element.classList.contains('is-valid') && !productName.classList.contains('nodalBlock') && !productPrice.classList.contains('nodalBlock') && !productDescription.classList.contains('nodalBlock') && !productCategory.classList.contains('nodalBlock')) {
        addBtn.setAttribute("data-bs-dismiss", "modal");
        updateBtn.setAttribute("data-bs-dismiss", "modal");
    } else {
        addBtn.removeAttribute('data-bs-dismiss');
        updateBtn.removeAttribute('data-bs-dismiss');
    }
}

function reset() {
    productName.classList.remove('is-valid');
    productName.classList.remove('is-invalid');
    productName.classList.remove('nodalBlock');
    productName.nextElementSibling.classList.add('d-none');

    productPrice.classList.remove('is-valid');
    productPrice.classList.remove('is-invalid');
    productPrice.classList.remove('nodalBlock');
    productPrice.nextElementSibling.classList.add('d-none');

    productCategory.classList.remove('is-valid');
    productCategory.classList.remove('is-invalid');
    productCategory.classList.remove('nodalBlock');
    productCategory.nextElementSibling.classList.add('d-none');

    productDescription.classList.remove('is-valid');
    productDescription.classList.remove('is-invalid');
    productDescription.classList.remove('nodalBlock');
    productDescription.nextElementSibling.classList.add('d-none');
}

function deleteAll(){
    productList.length = 0;

    // Refresh product list
    localStorage.setItem('productList', JSON.stringify(productList));

    productsRow.innerHTML = "";
}

