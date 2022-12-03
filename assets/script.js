// Ensures document is loaded, and only loads once. 
$(document).ready(function () {
    function onLoad(){

    }
    // This is the function to get search history from local storage. 
    const history = JSON.parse(localStorage.getItem('search-history')) || [];
    const historyLastValue = history[history.length - 1];
    console.log(historyLastValue);
    renderBtns();
    function renderBtns() {
        $(".history").empty();
        history.forEach(function (x) {
            const recentCityButton = $("<li><button>" + x + "</button></li>");
            $(".history").prepend(recentCityButton);
        })
    }; 