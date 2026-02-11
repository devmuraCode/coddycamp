const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

let users = ["Ali", "Vali", "Abbos"];

app.get("/users", (req, res) => {
  const message = req.query.message || "";

  res.send(`
    <h1>Users List</h1>

    ${message ? `<p style="color:green">${message}</p>` : ""}

    <ul>
      ${users.map((u) => `<li>${u}</li>`).join("")}
    </ul>

    <h3>Add new user</h3>

    <form method="POST" action="/users">
      <input type="text" name="name" placeholder="Enter name" />
      <button type="submit">Add</button>
    </form>

    <br/>
    <button onclick="window.location.reload()">Refresh</button>
  `);
});

app.post("/users", (req, res) => {
  const name = req.body.name?.trim();

  if (!name) return res.status(400).send("Name required");
  if (name.length < 3) return res.status(400).send("Min 3 chars");
  if (users.includes(name)) return res.status(400).send("Already exists");

  users.push(name);

  res.redirect("/users?message= Qo‘shildi (Added)");
});

app.listen(3000, () => {
  console.log("Server running: http://localhost:3000/users");
});
