using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Models;

namespace WebAPI.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class ResultsController : ControllerBase {
        Database db = Database.Instance;
        private readonly IConfiguration _configuration;
        public ResultsController(IConfiguration configuration) {
            _configuration = configuration;
        }

        [HttpGet]
        public List<Flight> GetAirportData(int filter) {
            return db.GetFlights(filter);
        }

        [HttpPost]
        public void PushAirportData(List<Flight> flights) {
            for (int i = 0; i < flights.Count; i++) {
                db.InsertFlight(flights[i]);
            }
        }
        
    }
}
