const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("styles"));

// Läser data från users.json om filen finns
let users = [];
try {
  const data = fs.readFileSync("users.json", "utf8");
  if (data) {
    users = JSON.parse(data);
  }
} catch (err) {
  console.error("Fel vid läsning av filen:", err);
}

// Route för att skicka HTML-formuläret till klient
app.get("/", (req, res) => {
  let output = "";
  if (users && users.length > 0) {
    for (let i = 0; i < users.length; i++) {
      output += `<p><b>
      Name: ${users[i].Name}<br>  
      Email: ${users[i].Email}<br>
      Tel: ${users[i].Tel}<br>
      Lärosäte: ${users[i].Lärosäte }  <br>
      Comment: ${users[i].Comment}</p>`;
    }
  }
  let html = fs.readFileSync(__dirname + "/index.html").toString();
  html = html.replace("GÄSTER", output);
  res.send(html);
});

// Route för att hantera POST-förfrågningar 
app.post("/submit", (req, res) => {
  const { Name, Email, Lärosäte, Tel, Comment } = req.body;
  users.push({ Name, Email, Lärosäte, Tel, Comment });

  // Skriv användarinformationen till users.json-filen
  fs.writeFile("users.json", JSON.stringify(users), (err) => {
    if (err) {
      console.error("Fel vid skrivning till filen:", err);
      return res.status(500).send("Serverfel");
    }
    res.redirect("/");
  });
});

// Route för att visa alla användare
app.get("/users", (req, res) => {
  res.json(users);
});

// Starta servern på port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
