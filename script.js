const playersContainer = document.getElementById('players');
const pitch = document.querySelector('.pitch');
let selectedPlayer = null;

// Generate Players
document.getElementById('generatePlayers').addEventListener('click', () => {
    const playerCount = parseInt(document.getElementById('playerCount').value);
    playersContainer.innerHTML = '';

    for (let i = 0; i < playerCount; i++) {
        const player = document.createElement('div');
        player.classList.add('player');
        player.dataset.id = i;
        player.textContent = `P${i + 1}`;
        player.style.left = `${Math.random() * 70 + 15}%`;
        player.style.top = `${Math.random() * 80 + 10}%`;
        playersContainer.appendChild(player);

        makeDraggable(player);
        player.addEventListener('dblclick', () => openEditModal(player));
    }
});

// Drag-and-Drop with Boundary Constraints
function makeDraggable(element) {
    element.onmousedown = (event) => {
        let shiftX = event.clientX - element.getBoundingClientRect().left;
        let shiftY = event.clientY - element.getBoundingClientRect().top;

        const moveAt = (pageX, pageY) => {
            const pitchRect = pitch.getBoundingClientRect();
            const elemRect = element.getBoundingClientRect();

            let left = pageX - shiftX - pitchRect.left;
            let top = pageY - shiftY - pitchRect.top;

            left = Math.max(0, Math.min(left, pitchRect.width - elemRect.width));
            top = Math.max(0, Math.min(top, pitchRect.height - elemRect.height));

            element.style.left = `${left}px`;
            element.style.top = `${top}px`;
        };

        const onMouseMove = (event) => moveAt(event.pageX, event.pageY);
        document.addEventListener('mousemove', onMouseMove);

        element.onmouseup = () => {
            document.removeEventListener('mousemove', onMouseMove);
            element.onmouseup = null;
        };
    };

    element.ondragstart = () => false;
}

// Load Affiliate Products
const products = [
    { name: 'Football Shoes', img: 'shoes.jpg', link: '#' },
    { name: 'Training Kit', img: 'kit.jpg', link: '#' },
    { name: 'Football', img: 'football.jpg', link: '#' },
];

function loadAffiliateProducts() {
    const affiliateProducts = document.getElementById('affiliateProducts');
    affiliateProducts.innerHTML = '';
    products.forEach((product) => {
        affiliateProducts.innerHTML += `
            <div class="col-md-4">
                <div class="product-card">
                    <img src="${product.img}" alt="${product.name}" class="product-image">
                    <h5>${product.name}</h5>
                    <a href="${product.link}" class="product-link">Buy Now</a>
                </div>
            </div>
        `;
    });
}

loadAffiliateProducts();

// Player Edit Modal
function openEditModal(player) {
    selectedPlayer = player;
    document.getElementById('playerName').value = player.textContent;
    new bootstrap.Modal(document.getElementById('playerEditModal')).show();
}

document.getElementById('playerEditForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('playerName').value;
    const image = document.getElementById('playerImage').files[0];

    if (name) selectedPlayer.textContent = name;

    if (image) {
        const reader = new FileReader();
        reader.onload = () => {
            selectedPlayer.innerHTML = `<img src="${reader.result}" alt="${name}">`;
        };
        reader.readAsDataURL(image);
    }

    bootstrap.Modal.getInstance(document.getElementById('playerEditModal')).hide();
});
