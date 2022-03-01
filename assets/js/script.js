//search phone
document.getElementById('search-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const phoneKeyword = document.querySelector(".search-phone").value;
    if (phoneKeyword !== '') {
        try {
            const res = await fetch(`https://openapi.programming-hero.com/api/phones?search=${phoneKeyword}`);
            const data = await res.json();
            displayPhones(data.data);
        } catch (error) {
            console.log(error);
        }
    } else {
        alert("Please enter a keyword");
    }
});


const displayPhones = phones => {
    const phoneGrid = document.querySelector("#phone-grid");
    phoneGrid.textContent = "";
    phones.forEach(phone => {
        console.log(phone);
        const phoneCard = document.createElement("div");
        phoneCard.classList.add('col', 'phone-card');
        phoneCard.innerHTML = `
            <div class="card shadow-sm border-0 p-2">
                <div class="card-image text-center">
                    <img src="${phone.image}" alt="${phone.phone_name}" class="img-fluid">
                </div>
                <div class="card-body">
                    <h5 class="card-title">${phone.phone_name}</h5>
                    <p class="card-text">Brand: ${phone.brand}</p>
                    <button data-bs-toggle="modal" data-bs-target="#phone-details" onclick="phoneDetails(${phone.slug})" class="btn-default">View More</button>
                </div>
            </div>`;
        phoneGrid.appendChild(phoneCard);
    })
}

const phoneDetails = async phoneSlug => {
    try {
        const res = await fetch(`https://openapi.programming-hero.com/api/phone/${phoneSlug}`);
        const data = await res.json();
        displayPhoneDetails(data.data);
    } catch (error) {
        console.log(error);
    }
}









