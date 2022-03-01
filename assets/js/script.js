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


const displayPhones = (phones, offset = 20) => {
    const phoneGrid = document.querySelector("#phone-grid");
    phoneGrid.textContent = "";

    hideErrorMessage(); //hide error message
    toggleSpinner('none'); //hide loader
    toggleSearchResults('flex'); //show search results

    //load more button
    if(phones.length > offset){
        const loadMoreBtnContainer = document.getElementById('load-more-btn-container');
        const loadMoreBtn = document.createElement("button");
        loadMoreBtnContainer.textContent = ''; //remove if already exists
        loadMoreBtn.classList.add('btn-default', 'load-more');
        loadMoreBtn.innerHTML = `<i class="fas fa-chevron-down"></i> Load More`;
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.remove();
            displayPhones(phones, offset + 20); //increase offset
        });
        loadMoreBtnContainer.appendChild(loadMoreBtn);
    }

    const slicedPhones = phones.slice(0, offset); //display only 20 phones
    slicedPhones?.forEach(phone => {
        const phoneCard = document.createElement("div");
        phoneCard.classList.add('col', 'phone-card', 'text-center');
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
    });

}

const phoneDetails = async phoneSlug => {
    try {
        const res = await fetch(`https://openapi.programming-hero.com/api/phone/${phoneSlug}`);
        const data = await res.json();
        if(data.status) {
            displayPhoneDetails(data.data);
        } else {
            showErrorMessage("Phone not found");
        }
    } catch (error) {
        console.log(error);
    }
}

const displayPhoneDetails = phoneDetails => {
    const phoneDetailsModal = document.querySelector("#phone-details-content");
    phoneDetailsModal.textContent = "";

    const {chipSet, displaySize, memory, sensors, storage} = phoneDetails.mainFeatures;
    const sensorText = sensors.join(', ');

    phoneDetailsModal.innerHTML = `
        <div class="modal-body position-relative">
            <div class="text-center mb-4">
                <img src="${phoneDetails.image}" alt="${phoneDetails.name}" class="img-fluid">
            </div>
            <button type="button" class="close modal-close position-absolute top-0 end-0" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="fw-semi-bold pf-secondary-color text-center mb-4">${phoneDetails.name}</h4>
            <div class="phone-specification">
                <div class="specifications">
                    <div class="row">
                        <div class="col-md-3">
                            <div class="specification-header">
                                <h5 class="fw-medium">Overview</h5>
                            </div>
                        </div>
                        <div class="col-md-9">
                            <div class="specification-list">
                                <div class="sp-wrap">
                                    <div class="specification-label">Brand</div>
                                    <div class="specification-value">${phoneDetails.brand}</div>
                                </div>
                                <div class="sp-wrap">
                                    <div class="specification-label">Model</div>
                                    <div class="specification-value">${phoneDetails.name}</div>
                                </div>
                                <div class="sp-wrap">
                                    <div class="specification-label">Release Date</div>
                                    <div class="specification-value">${phoneDetails.releaseDate ? phoneDetails.releaseDate : 'Not published yet'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="specifications">
                    <div class="row">
                        <div class="col-md-3">
                            <div class="specification-header">
                                <h5 class="fw-medium">Main Features</h5>
                            </div>
                        </div>
                        <div class="col-md-9">
                            <div class="specification-list">
                                <div class="sp-wrap">
                                    <div class="specification-label">Chipset</div>
                                    <div class="specification-value">${chipSet}</div>
                                </div>
                                <div class="sp-wrap">
                                    <div class="specification-label">Display Size</div>
                                    <div class="specification-value">${displaySize}</div>
                                </div>
                                <div class="sp-wrap">
                                    <div class="specification-label">Memoy</div>
                                    <div class="specification-value">${memory}</div>
                                </div>
                                <div class="sp-wrap">
                                    <div class="specification-label">Sensors</div>
                                    <div class="specification-value">${sensorText}</div>
                                </div>
                                <div class="sp-wrap">
                                    <div class="specification-label">Storage</div>
                                    <div class="specification-value">${storage}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ${phoneOtherDetails(phoneDetails)}
            </div>
        </div>
    `;
}

const phoneOtherDetails = phoneDetails => {
    if(phoneDetails.others){
        let otherFeatures = "";
        otherFeatures += `<div class="specifications">
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="specification-header">
                                        <h5 class="fw-medium">Others</h5>
                                    </div>
                                </div>
                                <div class="col-md-9">
                                    <div class="specification-list">`;
        for (const other in phoneDetails.others) {
            otherFeatures += `<div class="sp-wrap">
                                    <div class="specification-label">${other}</div>
                                    <div class="specification-value">${phoneDetails.others[other]}</div>
                                </div>`;
        }
        otherFeatures += `</div></div></div></div>`;
        return otherFeatures
    }
    return '';
}

const toggleSpinner = displayStyle => {
    const spinner = document.querySelector('.spinner-border');
    spinner.style.display = displayStyle;
}

const toggleSearchResults = displayStyle => {
    const phoneGrid = document.querySelector('#phone-grid');
    const loadMoreBtn = document.querySelector('#load-more-btn-container');
    phoneGrid.style.display = displayStyle;
    loadMoreBtn.style.display = displayStyle;
}

const showErrorMessage = message => {
    const toastMessage = document.getElementById('toast-message');
    const toastMessageContent = document.querySelector('.toast-body');
    toastMessageContent.textContent = message;
    const toast = new bootstrap.Toast(toastMessage)
    toast.show();
}

const hideErrorMessage = () => {
    const toastMessage = document.getElementById('toast-message');
    const toastMessageContent = document.querySelector('.toast-body');
    toastMessageContent.textContent = '';
    const toast = new bootstrap.Toast(toastMessage)
    toast.hide();
}





