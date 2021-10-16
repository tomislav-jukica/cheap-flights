using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models {
    public class Flight {
        public Flight(string origin, string date, string destination, int numberOfStops, int numberOfSeats, string currency, string totalPrice, int filter) {
            Origin = origin;
            Date = date;
            Destination = destination;
            NumberOfStops = numberOfStops;
            NumberOfSeats = numberOfSeats;
            Currency = currency;
            TotalPrice = totalPrice;
            Filter = filter;
        }

        public string Origin { get; set; }
        public string Date { get; set; }
        public string Destination { get; set; }
        public int NumberOfStops { get; set; }
        public int NumberOfSeats { get; set; }
        public string Currency { get; set; }
        public string TotalPrice { get; set; }
        public int Filter { get; set; }
    }
}
