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
    }
    //The on click will gather weather data and render it on the div section. 
    $("#search-button").on('click', function () {
        const searchVal = $('#search-value').val();
        searchClickHandler(searchVal);
    })

    $('.history').on('click', 'button', function () {
        searchClickHandler($(event.target).text());
    })

    const searchClickHandler = function (inputVal) {

        // Ensures user input is in string format. 
        let caseFix = inputVal.split(' ').map(letterArr => {
            let newWord = letterArr[0].toUpperCase() + letterArr.substring(1, letterArr.length).toLowerCase();
            return newWord;
        }).join(' ');

        const apiKey = `ddc712d52e341f57dda017abe0554647`;
        // Constructs a query URL (template literal). 
        const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${caseFix}&appid=${apiKey}&units=imperial`;
        //Ajax is used to get the current weather. 
        $.ajax({
            url: queryURL,
            method: "GET",
            dataType: "json",
            success: function (res) {
                console.log("success! AJax1:")
                console.log(res)
                
                const currentWeatherHTML =
                    `
                        <h3 class="card-title">${res.name} ${new Date().toLocaleDateString()}</h3>
                        <div class="card">
                            <div class="card-body" id="currentWeather">
                                <h3 class="card-title">${res.name} (${new Date().toLocaleDateString()})
                                    <img src="https://openweathermap.org/img/w/${res.weather[0].icon}.png"/>
                                </h3>
                                <p class="card-text">Temperature: ${res.main.temp} °F</p>
                                <p class="card-text">Humidity: ${res.main.humidity}%</p>
                                <p id="endajax1" class="card-text">Wind Speed: ${res.wind.speed} MPH</p>
                            </div>
                        </div>
                    `;
                    //Create a Button with the city name and prepends to search history. 
                    history.includes(caseFix) ? '' : history.push(caseFix); // ternay
                    renderBtns();
                    localStorage.setItem('search-history', JSON.stringify(history));
                    $("#today").html(currentWeatherHTML);
                    
                    var latitude = res.coord.lat;
                    var longitude = res.coord.lon;

                    const queryUVIndex = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${latitude}&lon=${longitude}`
                    //This is the second Ajax to get UV Index. 
                    $.ajax({
                        url: queryUVIndex,
                        method: "GET",
                        dataType: "json",
                        success: function (uv) {
                            const uvIndex = uv.value;
                            console.log("success! AJax2:")
                            console.log(uv)
                            $("#currentWeather").append(`<p class="uvDiv card-text">UV Index: ${uvIndex}</p>`)
                            
                            const fiveDayForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`
                            //The third Ajax to get a 5 day forecast. 
                            $.ajax({
                                url: fiveDayForecastUrl,
                                method: "GET",
                                dataType: "json",
                                success: function (forecast) {
                                    console.log(forecast);
                                    $('#forecast').empty();
                                    var day = 1;                                    
                                    for (i = 7; i < forecast.list.length; i = i + 7) {                                    
                                        //Sets the dates on five day forecast. 
                                        console.log("before:")
                                        console.log(day) 
                                        const forecastDates = moment().add(day, 'days').format("MMM D");
                                        const fiveDayForecastHtml =
                                        `
                                        <div class="forecastCards card-body col-2 shadow bg-primary text-white">
                                        <h3 class="card-title forecastDate">${forecast.city.name} 
                                        <img src="https://openweathermap.org/img/w/${forecast.list[i].weather[0].icon}.png"/>
                                        </h3>
                                        <h5>${forecastDates}</h5>
                                        <p class="card-text">Temperature: ${forecast.list[i].main.temp} °F</p>
                                        <p class="card-text">Humidity: ${forecast.list[i].main.humidity}%</p>
                                        <p class="card-text">Wind Speed: ${forecast.list[i].wind.speed} MPH</p>
                                        <p class="uvDiv card-text">UV Index: ${uvIndex}</p>
                                        </div>
                                        `;
                                        //Set increments for 1 day at a time.  
                                        day++;
                                        console.log("after:")
                                        console.log(day) 
                                        //Sets the UV color index. 
                                        $("#forecast").append(fiveDayForecastHtml);
                                        if (uvIndex < 3) {
                                            $(".uvDiv").addClass("bg-success");
                                        }
                                        else if (uvIndex > 2 && uvIndex < 6) {
                                            $(".uvDiv").addClass("bg-warning");
                                        }
                                        else if (uvIndex > 5 && uvIndex < 8) {
                                        $(".uvDiv").css("background-color", "darkorange");
                                    }
                                    else {
                                        $(".uvDiv").addClass("bg-danger");
                                    }
                                }
                            }
                        });
                    }
                });
                //Clears the search input container. 
                $('#search-value').val('');
            },
            error: function () {
                $('#search-value').val('');
                return;
            }
        });
    }
    if(history === []) {
        return false;
    } else {
        searchClickHandler(historyLastValue);
    }  
});