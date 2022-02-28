//load api
const loadPhoneApi = async () =>{
    const res = await fetch('https://openapi.programming-hero.com/api/phones?search=oppo');
    const data = await res.json();
    return data;
}