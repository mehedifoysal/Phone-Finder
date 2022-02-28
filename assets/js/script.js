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
            <div class="card shadow border-0 p-2">
                <div class="card-image text-center">
                    <img src="${phone.image}" alt="${phone.phone_name}" class="img-fluid">
                </div>
                <div class="card-body">
                    <h5 class="card-title">${phone.phone_name}</h5>
                    <p class="card-text">Brand: ${phone.brand}</p>
                    <a href="#" class="btn-default">View More</a>
                </div>
            </div>`;
        phoneGrid.appendChild(phoneCard);
    })
}









