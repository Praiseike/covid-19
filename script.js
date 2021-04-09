// Email:praiseike123@gmail.com
// Send bug fixes to the above email
// And sorry for the terrible comments


// Declare global variables


var COVID_DATA;
var table = document.querySelector('table');
var data;
var id_array;
var CASES_DATA = [];
var fields;
var time =0;
var isDone = false;
var display;
var countryList = [];
var countryObj = {};
var total_cases = 0,total_deaths = 0,total_recoveries = 0;



let generateTableHead = (table,obj) =>
{   
    let count = 0;
    for(let i = 0;i<countryList.length;i++)
    {
        let row = table.insertRow();
        let temp = countryObj[countryList[i]];
        let tmpList = [countryList[i],temp.cases,temp.recoveries,temp.deaths]
        for(var z of tmpList)
        {    
            var cell = row.insertCell()
            var text = document.createTextNode(z);
            cell.appendChild(text);
            row.appendChild(cell);
        }
    }
}


let generateCountryData = () => {
    // loop through all elements in the cases_data
    // and add the country names in a list 
    for(var i = 0;i<CASES_DATA.length;i++)
    {
        if(countryList.includes(CASES_DATA[i]["country"]) === false)
            countryList.push(CASES_DATA[i]["country"]);
    }

    // loop through all the countries in the list and creates objects 
    // with them and using the names as the object entry point
    for(var i = 0;i < countryList.length;i++)
    {
        countryObj[countryList[i]] = {cases:0,recoveries:0,deaths:0}
    }

}




// creating new XMLHttpRequest instance
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;


// callback on state change
xhr.addEventListener("readystatechange", function () {
	if (this.readyState === this.DONE) {

        // store the response
        COVID_DATA = this.response;


        // do filtering and extraction
        if(COVID_DATA != null)
        {
            // Access the relevant data object pointer
            data = COVID_DATA["data"]["covid19Stats"];
            id_array = Object.keys(data);
            // generate relevant list of stuff 
            for(var key of id_array)
            {
                CASES_DATA.push(data[key]);
            }
            // stuff
            generateCountryData();
            for(var line of CASES_DATA)
            {
                var {city,confirmed,country,deaths,keyID,lastUpdate,province,recovered} = line;
                //console.log(`Country: ${country} cases: ${confirmed} deaths: ${deaths} recovered: ${recovered} `);
                total_cases += confirmed;
                total_deaths += deaths;
                total_recoveries += recovered;

                // Populating the countryObj data structure
                if(country in countryObj)
                {
                    countryObj[country].cases += confirmed;
                    countryObj[country].recoveries += recovered;
                    countryObj[country].deaths += deaths;
                }
            }

            // Well the rest is pretty obvious
            console.log(`Confirmed cases: ${total_cases} Deaths: ${total_deaths} recoveries: ${total_recoveries}`);

            fields = countryObj[countryList[0]];
            generateTableHead(table,fields);
            isDone = true;
            display = `<div class = 'summary-data'><div class = 'summary'><p class ='head'>Latest Updates</p><p>Global Number of Cases:</p><span  class = 'cases'>${total_cases}</span><p>Recovered:</p><span class = 'recovered'>${total_recoveries}</span><p>Deaths:</p><span class = 'deaths'>${total_deaths}</span></div></div>`
            var center = document.querySelectorAll('center')[0];
            center.innerHTML = display;
            time = COVID_DATA['data']['lastChecked'];
            time = time.replace('T',' ');
            time = time.split(' ');
            var tlist = time[0];
            tlist = tlist.split('-');
            var t = new Date(tlist[0],tlist[1]-1,tlist[2]);
            t = t.toDateString();
            time = "<b>Last updated </b>"+time[1].substr(0,8)+" "+t+"";
            console.log(time)
            lastUpdated.innerHTML = time
        }
        else
        {
            console.log("Unable to fetch resource");
        }
    }
});

xhr.ontimeout = () => 
{
    var target = document.querySelector(".loader");
    var response = "<p style = \"font:200 1.3em 'Raleway',sans-seriff;\">Sorry... Check Your internet Connection or reload<p>"
    stuff.innerHTML = response;
}



xhr.open("GET", "https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats");
xhr.setRequestHeader("x-rapidapi-host", "covid-19-coronavirus-statistics.p.rapidapi.com");
xhr.setRequestHeader("x-rapidapi-key", "7ed4783c58msh6ed9717b1c81995p133974jsna858f8424f37");
xhr.setRequestHeader("Access-Control-Allow-Origin","*")
xhr.setRequestHeader("Access-Control-Allow-Methods", "GET,POST")
xhr.responseType = "json";
xhr.send(null);




