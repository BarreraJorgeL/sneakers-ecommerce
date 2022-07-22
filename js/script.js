
const sneakers = {
    id: 1,
    brand: 'SNEAKER COMPANY',
    product: 'Fall Limited Edition Sneakers',
    description: 'These low-profile sneakers are your perfect casual wear companion. Featuring a durable rubber outer sole, they’ll withstand everything the weather can offer.',
    price: 250,
    percentDiscount: 50,
    images: {
        large: ['image-product-1.jpg', 'image-product-2.jpg', 'image-product-3.jpg', 'image-product-4.jpg'],
        thumbnail: ['image-product-1-thumbnail.jpg', 'image-product-2-thumbnail.jpg', 'image-product-3-thumbnail.jpg', 'image-product-4-thumbnail.jpg'],
    },
    getCurrentPrice: function(){
        return this.price - (this.price * (this.percentDiscount/100))
    }
}

const main = document.querySelector('[data-main-state]')
const navBar = document.querySelector('[data-menu-state]');

const carousel = document.querySelector('[data-name="carousel"]');
const slider = document.querySelector('[data-name="slider"]');

const plusButton = document.querySelector('[data-name = "increaseAmount"]');
const minusButton = document.querySelector('[data-name = "decreaseAmount"]');

const shopCart = document.querySelector('[data-name = "shopCart"]');

const brandContainer = document.querySelector('[data-container="brand"]');
const productContainer = document.querySelector('[data-container="product"]');
const descriptionContainer = document.querySelector('[data-container="description"]');
const priceContainer = document.querySelector('[data-container="price"]');
const currentPriceContainer = document.querySelector('[data-container="currentPrice"]');
const discountContainer = document.querySelector('[data-container="currentDiscount"]');

function fillContent(object, brandContainer, productContainer, descriptionContainer, priceContainer, discountContainer, currentPriceContainer){
    brandContainer.innerText = object.brand;
    productContainer.innerText = object.product;
    descriptionContainer.innerText = object.description;
    priceContainer.innerText = `$${object.price}`;
    discountContainer.innerText = `${object.percentDiscount}%`;
    currentPriceContainer.innerText = `$${object.getCurrentPrice()}`;
}
function setSlidePosition(slide, index){
    slide.style.left = 100 * index +'%';
}
function showMobileCarousel(slider, images){
    slider.innerHTML='';
    let preview = document.querySelector('.preview');
    console.log(preview)
    if(preview){
        preview.parentNode.removeChild(preview);
        console.log('eliminado')
    }
    images.forEach((image, index) => {
        let firstSlide = (index === 0 ? 'currentSlide' : '');
        slider.insertAdjacentHTML('beforeend',`<li class="[ slide ]" data-slide-order="${firstSlide}"><img src="images/${image}" alt=""></li>`);
    })
    let slides = Array.from(document.querySelectorAll('[data-slide-order]'));
    slides.forEach(setSlidePosition);
    let currentSlide = document.querySelector('[data-slide-order = "currentSlide"]');
    hideArrows(currentSlide);
}
function showDesktopCarousel(slider, images){
    slider.innerHTML = '';
    slider.insertAdjacentHTML('beforebegin',`<figure class="[ preview ]"><img src="images/image-product-1.jpg" alt="" data-name="slidePreview"></figure>`)
    images.forEach((image, index) => {
        let firstSlide = (index === 0 ? 'currentSlide' : '');
        slider.insertAdjacentHTML('beforeend',`<li class="[ slide ]" data-slide-order="${firstSlide}"><img src="images/${image}" alt="" data-name="slideImage"></li>`);
    })
}
function showResponsiveCarousel(mql, slider, largeImages, thumbnails){
    if(mql.matches){
        slider.style.transform = 'translateX(0%)'; //makes the slider returns to it's original position
        showDesktopCarousel(slider, thumbnails)
        return;
    }
    showMobileCarousel(slider, largeImages)
}
let mql = window.matchMedia('(min-width:900px)');
mql.addEventListener('change', ()=>{
    showResponsiveCarousel(mql, slider, sneakers.images.large, sneakers.images.thumbnail);
});

showResponsiveCarousel(mql, slider, sneakers.images.large, sneakers.images.thumbnail);

fillContent(sneakers, brandContainer, productContainer, descriptionContainer, priceContainer, discountContainer, currentPriceContainer, slider);

function showPreviewImage(previewContainer, targetSlide, slides, largeImages){
    slides.forEach((slide,index)=>{
        if(slide.firstElementChild === targetSlide){
            let large = largeImages[index]
            previewContainer.firstElementChild.src = `images/${large}`
        }
    })
    let currentSlide = document.querySelector('[data-slide-order="currentSlide"]')
    currentSlide.dataset.slideOrder = '';
    targetSlide.parentElement.dataset.slideOrder = 'currentSlide';
}

function moveToSlide(slider, currentSlide ,targetSlide){
    slider.style.transform = `translateX(-${targetSlide.style.left})`;
    currentSlide.dataset.slideOrder = '';
    targetSlide.dataset.slideOrder = 'currentSlide';
}

function hideArrows(currentSlide){
    const nextArrow = document.querySelector('[data-name = "nextArrow"]');
    const previousArrow = document.querySelector('[data-name = "previousArrow"]');
    let slides = Array.from(document.querySelectorAll('[data-slide-order]'));
    switch(currentSlide){
        case slides[0]:
            previousArrow.dataset.displayArrow = 'hidden';
            nextArrow.dataset.displayArrow = 'visible';
            break
        case slides[slides.length - 1]:
            nextArrow.dataset.displayArrow = 'hidden';
            previousArrow.dataset.displayArrow = 'visible';
            break
        default:
            previousArrow.dataset.displayArrow = 'visible';
            nextArrow.dataset.displayArrow = 'visible';
            break
    }
}
function toggleNavBar(main, navBar){
    switch(navBar.dataset.menuState){
        case 'closed':
            navBar.style.transform = 'translateX(100%)';
            navBar.dataset.menuState = 'open';
            main.dataset.mainState = 'disable';
            break
        case 'open':
            navBar.style.transform = 'translateX(0)';
            navBar.dataset.menuState = 'closed';
            main.dataset.mainState = 'enable';
            break
    }
}
function updateAmount(amount){
    let currentAmount = document.querySelector('[data-name = "currentAmount"]');
    let newAmount = parseInt(currentAmount.innerText) + amount;
    if(newAmount >= 0){
        currentAmount.innerText = newAmount;
    }
}
function toggleShopCart(shopCart){
    switch(shopCart.dataset.shopCartState){
        case 'hidden':
            shopCart.dataset.shopCartState = 'visible';
            break
        case 'visible':
            shopCart.dataset.shopCartState = 'hidden';
            break
    }
}
document.addEventListener('click', e => {
    switch(e.target.dataset.name){
        case 'toggleMenu':
            toggleNavBar(main, navBar);
            break
        case 'nextArrow':
            currentSlide = document.querySelector('[data-slide-order = "currentSlide"]');
            let nextSlide = currentSlide.nextElementSibling;
            moveToSlide(slider, currentSlide, nextSlide);
            hideArrows(nextSlide);
            break
        case 'previousArrow':
            currentSlide = document.querySelector('[data-slide-order = "currentSlide"]');
            let previousSlide = currentSlide.previousElementSibling;
            moveToSlide(slider, currentSlide, previousSlide);
            hideArrows(previousSlide);
            break
        case 'increaseAmount':
            updateAmount(1);
            break
        case 'decreaseAmount':
            updateAmount(-1);
            break
        case 'toggleShopCart':
            toggleShopCart(shopCart);
            break
        case 'slideImage':
            let previewContainer = document.querySelector('.preview')
            let slides = Array.from(document.querySelectorAll('[data-slide-order]'));
            showPreviewImage(previewContainer, e.target, slides, sneakers.images.large)
    }
})
