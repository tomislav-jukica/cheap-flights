using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SQLite;
using System.Linq;
using WebAPI.Models;

namespace WebAPI {
    public class Database {
        private static Database instance = null;
        private SQLiteConnection conn = null;

        private Database() {
            if (conn == null) {
                OpenConnection();
            }
        }

        public static Database Instance {
            get {
                if (instance == null) {
                    instance = new Database();
                }
                return instance;
            }
        }

        private void OpenConnection() {
            if (conn == null) {
                conn = new SQLiteConnection("Data Source=db.db;Version=3;New=True;Compress=True;");
            }
            if (conn.State != System.Data.ConnectionState.Open) {
                try {
                    conn.Open();
                }
                catch (Exception) { }
            }

        }
        private void CloseConnection() {
            conn.Close();
        }

        public DataTable GetFilters(string filter) {
            DataTable table = new DataTable();

            //OpenConnection();
            using (SQLiteConnection con = new SQLiteConnection("Data Source=db.db;Version=3;New=True;Compress=True;")) {
                con.Open();
                string commandText = "SELECT * FROM Filters WHERE Filters.filter ='" + filter + "'";
                using (SQLiteCommand cmd = new SQLiteCommand(commandText, con)) {
                    using(SQLiteDataReader reader = cmd.ExecuteReader()) {
                        table.Load(reader);
                    }
                }
            }
            //SQLiteCommand command = conn.CreateCommand();
  
            //SQLiteDataReader reader;
            //reader = command.ExecuteReader();
            //table.Load(reader);
            //CloseConnection();

            return table;
        }

        public void InsertFilter(string filter) {
            OpenConnection();
            SQLiteCommand command = conn.CreateCommand();
            command.CommandText = "INSERT INTO Filters VALUES(NULL, '" + filter + "')";
            command.ExecuteNonQuery();
            CloseConnection();
        }

        public int GetFilterId(string filter) {
            int retVal = -1;
            DataTable table = new DataTable();

            OpenConnection();
            SQLiteCommand command = conn.CreateCommand();
            command.CommandText = "SELECT Id FROM Filters WHERE Filters.Filter = '" + filter + "'";
            SQLiteDataReader reader = command.ExecuteReader();
            table.Load(reader);
            //while(reader.Read()) {
            //    if(reader.RecordsAffected > 0) {
            //        retVal = int.Parse(reader.GetString(0));
            //    }                
            //}
            if (table.Rows.Count > 0) {
                retVal = (int)(long)table.Rows[0].ItemArray[0];
            }

            return retVal;
        }

        public void InsertFlight(Flight flight) {
            //OpenConnection();

            using (SQLiteConnection con = new SQLiteConnection("Data Source=db.db;Version=3;New=True;Compress=True;")) {
                con.Open();
                string commandText = "INSERT INTO Flights VALUES(NULL, "
                + flight.Filter + ", '"
                + flight.Origin + "','"
                + flight.Destination + "','"
                + flight.Date + "',"
                + flight.NumberOfSeats
                + "," + flight.NumberOfStops
                + ",'" + flight.Currency + "','"
                + flight.TotalPrice + "')";
                using (SQLiteCommand cmd = new SQLiteCommand(commandText, con)) {
                    cmd.ExecuteNonQuery();
                }
            }

            //SQLiteCommand command = conn.CreateCommand();
            //command.CommandText = "INSERT INTO Flights VALUES(NULL, "
            //    + flight.Filter + ", '" 
            //    + flight.Origin + "','" 
            //    + flight.Destination + "','" 
            //    + flight.Date + "'," 
            //    + flight.NumberOfSeats 
            //    + "," + flight.NumberOfStops 
            //    + ",'" + flight.Currency + "','" 
            //    + flight.TotalPrice + "')";
            //command.ExecuteNonQuery();
            //CloseConnection();
        }

        public List<Flight> GetFlights(int filterId) {
            List<Flight> retVal = new List<Flight>();

            OpenConnection();
            SQLiteCommand command = conn.CreateCommand();
            command.CommandText = "SELECT * FROM Flights WHERE Flights.Filter = " + filterId;
            SQLiteDataReader reader = command.ExecuteReader();
            while(reader.Read()) {
                string origin = reader.GetString(2);
                string date = reader.GetString(4);
                string destination = reader.GetString(3);
                int numberOfStops = reader.GetInt32(6);
                int numberOfSeats = reader.GetInt32(5);
                string currency = reader.GetString(7);
                string totalPrice = reader.GetString(8);
                int filter = reader.GetInt32(1);
                Flight flight = new Flight(
                    reader.GetString(2),
                    reader.GetString(4),
                    reader.GetString(3),
                    reader.GetInt32(6),
                    reader.GetInt32(5),
                    reader.GetString(7),
                    reader.GetString(8),
                    reader.GetInt32(1));
                retVal.Add(flight);
            }
            return retVal;
        }
    }
}
