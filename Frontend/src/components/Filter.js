import React, { useState } from "react";
import "./Filter.css";

const Filter = (props) => {
  const [authToken, setAuthToken] = useState("");
  if (authToken === "") {
    authorization();
  }

  function authorization() {
    const req = new XMLHttpRequest();
    req.onreadystatechange = function () {
      if (req.readyState === XMLHttpRequest.DONE) {
        const data = JSON.parse(req.response);
        setAuthToken(data.access_token);
      }
    };
    req.open("POST", "https://test.api.amadeus.com/v1/security/oauth2/token");
    req.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    req.send(
      "grant_type=client_credentials&client_id=ZvyFrKgnZtySWdpWIShXHhE5pwJC7YB9&client_secret=15pspHzvAVGHIYGm"
    );
  }

  const [originLocation, setOriginLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adultsNumber, setAdultsNumber] = useState("");
  //   const [maxPrice, setMaxPrice] = useState("");
  const [currency, setCurrency] = useState("HRK");

  const originChangeHandler = (event) => {
    setOriginLocation(event.target.value);
  };
  const destinationChangeHandler = (event) => {
    setDestinationLocation(event.target.value);
  };
  const departureDateChangeHandler = (event) => {
    setDepartureDate(event.target.value);
  };
  const returnDateChangeHandler = (event) => {
    setReturnDate(event.target.value);
  };
  const adultSNumberChangeHandler = (event) => {
    setAdultsNumber(event.target.value);
  };
  //   const maxPriceChangeHandler = (event) => {
  //       setMaxPrice(event.target.value);
  //   }
  const currencyChangeHandler = (event) => {
    setCurrency(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    // const filterData = {
    //   origin: originLocation,
    //   destination: destinationLocation,
    //   departure: new Date(departureDate),
    //   return: new Date(returnDate),
    //   adults: +adultsNumber,
    //   //   price: +maxPrice,
    //   currency: currency,
    // };

    const req = new XMLHttpRequest();
    let reqString = "https://test.api.amadeus.com/v2/shopping/flight-offers?";
    reqString += "originLocationCode=" + originLocation;
    reqString += "&destinationLocationCode=" + destinationLocation;
    reqString += "&departureDate=" + departureDate;
    if (returnDate != "") {
      reqString += "&returnDate=" + returnDate;
    }
    reqString += "&adults=" + adultsNumber;
    // if(maxPrice != "") {
    //     reqString += "&maxPrice=" + maxPrice;
    // }
    reqString += "&currencyCode=" + currency;

    //----------------------------------------------//

    //PROVJERI PRVO U BAZI
    checkForFilter(reqString).then(function (filterId) {
      const filterObject = filterId.split("_");

      if (filterObject[0] == "o") {
        const request =
          "http://localhost:5000/api/results?filter=" + filterObject[1];
        req.open("GET", request);
        req.onload = function (event) {
          if (req.readyState === 4) {
            if (req.status === 200) {
              props.onFilter(JSON.parse(req.responseText));
            } else {
              console.log(req.statusText);
            }
          }
        };
        req.send();
      } else {
        req.open("GET", reqString);
        req.setRequestHeader("authorization", "Bearer " + authToken);
        req.onload = function (event) {
          if (req.readyState === 4) {
            if (req.status === 200) {
              saveResults(JSON.parse(req.responseText).data, filterObject[1]);
              console.log(JSON.parse(req.responseText).data);
            } else {
              console.log(req.statusText);
            }
          }
        };
        req.send();
      }
    });

    
  };

  function saveResults(data, filterId) {
    let flights = [];
    for (let i = 0; i < data.length; i++) {
      const origin = data[i].itineraries[0].segments[0].departure.iataCode;
      let originDate = new Date(
        data[i].itineraries[0].segments[0].departure.at
      );
      originDate =
        originDate.getDate() +
        "/" +
        (originDate.getMonth() + 1) +
        "/" +
        originDate.getFullYear();
      const destination = data[i].itineraries[0].segments[0].arrival.iataCode;
      const destinationDate = data[i].itineraries[0].segments[0].arrival.at; //ovo ne triba
      const numberOfStops = data[i].itineraries[0].segments[0].numberOfStops;
      const numberOfSeats = data[i].numberOfBookableSeats;
      const currency = data[i].price.currency;
      const totalPrice = data[i].price.total;

      const flightData = {
        origin: origin,
        date: originDate,
        destination: destination,
        numberOfStops: numberOfStops,
        numberOfSeats: numberOfSeats,
        currency: currency,
        totalPrice: totalPrice,
        filter: filterId,
      };
      flights.push(flightData);
    }
    console.log(JSON.stringify(flights));
    const req = new XMLHttpRequest();
    req.open("POST", "http://localhost:5000/api/results");
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(flights));
  }

  //Request to local API
  function checkForFilter(filter) {
    return new Promise((resolve) => {
      filter = encodeURIComponent(filter);
      const req = new XMLHttpRequest();
      req.open("GET", "http://localhost:5000/api/filters?filter=" + filter);
      let postoji = null;
      req.onload = function (event) {
        if (req.status === 200) {
          resolve(req.responseText);
        } else {
          console.log(req.statusText);
        }
      };
      req.send();
    });
  }

  return (
    <form className="filter" onSubmit={submitHandler}>
      <div className="filter__controls">
        <div className="filter__control">
          <label>Polazišni aerodrom</label>
          <input type="text" required onChange={originChangeHandler} />
        </div>
        <div className="filter__control">
          <label>Odredišni aerodrom</label>
          <input type="text" required onChange={destinationChangeHandler} />
        </div>
      </div>
      <div className="filter__controls">
        <div className="filter__control">
          <label>Datum polaska</label>
          <input type="date" required onChange={departureDateChangeHandler} />
        </div>
        <div className="filter__control">
          <label>Datum povratka</label>
          <input type="date" onChange={returnDateChangeHandler} />
        </div>
      </div>
      <div className="filter__controls">
        <div className="filter__control">
          <label>Broj putnika</label>
          <input
            type="number"
            min="1"
            step="1"
            required
            onChange={adultSNumberChangeHandler}
          />
        </div>
        <div className="filter__control">
          <label>Valuta</label>
          <select title="currency" onChange={currencyChangeHandler}>
            <option value="HRK">HRK</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>
      <div>
        <button type="submit">Pretraži</button>
      </div>
    </form>
  );
};

export default Filter;
