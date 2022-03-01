//search phone
document.getElementById('search-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const phoneKeyword = document.querySelector(".search-phone").value;
    if (phoneKeyword !== '') {
        try {
            toggleSpinner('block'); //show loader
            toggleSearchResults('none'); //hide search results

            //get data
            const res = await fetch(`https://openapi.programming-hero.com/api/phones?search=${phoneKeyword}`);
            const data = await res.json();
            if(data.status) {
                displayPhones(data.data);
            } else {
                toggleSpinner('none'); //hide loader
                showErrorMessage('No phone found');
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        showErrorMessage("Please enter your desired phone name");
    }

    document.querySelector(".search-phone").value = ''; //clear input
});


const displayPhones = phones => {
    const phoneGrid = document.querySelector("#phone-grid");
    phoneGrid.textContent = "";

    hideErrorMessage(); //hide error message
    toggleSpinner('none'); //hide loader
    toggleSearchResults('flex'); //show search results

    phones?.forEach(phone => {
        const phoneCard = document.createElement("div");
        phoneCard.classList.add('col', 'phone-card');
        phoneCard.innerHTML = `
            <div class="card shadow-sm border-0 p-2">
                <div class="card-image text-center">
                    <img src="${phone.image}" alt="${phone.phone_name}" class="img-fluid">
                </div>
                <div class="card-body">
                    <h5 class="card-title font-bold">${phone.phone_name}</h5>
                    <p class="card-text">Brand: ${phone.brand}</p>
                    <button data-bs-toggle="modal" data-bs-target="#phone-details" onclick="phoneDetails('${phone.slug}')" class="btn-default thin-btn">View Details</button>
                </div>
            </div>`;
        phoneGrid.appendChild(phoneCard);
    })
}

const phoneDetails = async phoneSlug => {
    try {
        const res = await fetch(`https://openapi.programming-hero.com/api/phone/${phoneSlug}`);
        const data = await res.json();
        if(data.status) {
            displayPhoneDetails(data.data);
        } else {
            alert("Phone not found");
        }
    } catch (error) {
        console.log(error);
    }
}

const displayPhoneDetails = phoneDetails => {
    const phoneDetailsModal = document.querySelector("#phone-details-content");
    phoneDetailsModal.textContent = "";
    const {chipSet, displaySize, memory, sensors, storage} = phoneDetails.mainFeatures;
    phoneDetailsModal.innerHTML = `
        <div class="modal-body">
            <div class="row">
                <div class="col-md-5">
                    <img src="${phoneDetails.image}" alt="${phoneDetails.name}" class="img-fluid">
                </div>
                <div class="col-md-7">
                    <button type="button" class="close btn-default" data-bs-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h3>${phoneDetails.name}</h3>
                    <h4>Main Features</h4>
                    <ul class="mainFeatures">
                        <li>Chipset: ${chipSet}</li>
                        <li>Display Size: ${displaySize}</li>
                        <li>Memory: ${memory}</li>
                        <li>Sensors: ${sensors}</li>
                        <li>Storage: ${storage}</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

const toggleSpinner = displayStyle => {
    const spinner = document.querySelector('.spinner-border');
    spinner.style.display = displayStyle;
}

const toggleSearchResults = displayStyle => {
    const phoneGrid = document.querySelector('#phone-grid');
    const errorMessage = document.querySelector('.error-message');
    phoneGrid.style.display = displayStyle;
    errorMessage.style.display = displayStyle;
}

const showErrorMessage = message => {
    const errorMessage = document.querySelector('.error-message');
    errorMessage.textContent = ''; //clear error message
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('alert', 'alert-danger');
    errorDiv.innerHTML = message;
    errorMessage.appendChild(errorDiv);
    errorMessage.style.display = 'block';
    // setTimeout(() => {
    //     errorMessage.style.display = 'none';
    //     errorMessage.textContent = ''; //clear error message
    // }, 3000);
}

const hideErrorMessage = () => {
    const errorMessage = document.querySelector('.error-message');
    errorMessage.style.display = 'none';
    errorMessage.textContent = ''; //clear error message
}





