using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class FiltersController : ControllerBase {
        Database db = Database.Instance;
        private readonly IConfiguration _configuration;
        public FiltersController(IConfiguration configuration) {
            _configuration = configuration;
        }

        [HttpGet]
        public string Get(string filter) {
            DataTable table = db.GetFilters(filter);
            if(table.Rows.Count == 0 && filter != null) { // ne postoji
                db.InsertFilter(filter);
                return "n_" + db.GetFilterId(filter);
            }
            return "o_" + db.GetFilterId(filter);
        }

        [HttpPost]
        public JsonResult Post(string filter) {
            db.InsertFilter(filter);
            return new JsonResult("Added a filter");
        }
    }
}
