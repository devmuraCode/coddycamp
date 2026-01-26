const express = require("express");
const app = express();

app.use(express.json());

let idCounter = 3;
let students = [
  { id: 1, name: "Murat", age: 15 },
  { id: 2, name: "Murat2", age: 14 },
];

const stats = {
  totalRequests: 0,
  studentsCount: students.length,
  lastRequestTime: null,
};

app.use((req, res, next) => {
  stats.totalRequests++;
  stats.lastRequestTime = new Date().toISOString();
  stats.studentsCount = students.length;

  console.log(`[REQUEST] ${req.method} ${req.originalUrl}`);
  next();
});

app.get("/students", (req, res) => {
  res.json(students);
});

app.get("/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const found = students.find((s) => s.id === id);
  if (!found) return res.status(404).json({ message: "Student topilmadi" });
  res.json(found);
});

app.post("/students", (req, res) => {
  const { name, age } = req.body;

  if (!name || typeof name !== "string")
    return res.status(400).json({ message: "name majburiy (string)" });

  const ageNum = Number(age);
  if (!Number.isFinite(ageNum))
    return res.status(400).json({ message: "age majburiy (number)" });

  const newStudent = { id: idCounter++, name, age: ageNum };
  students.push(newStudent);

  res.status(201).json(newStudent);
});

app.put("/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = students.findIndex((s) => s.id === id);
  if (idx === -1) return res.status(404).json({ message: "Student topilmadi" });

  const { name, age } = req.body;

  if (name !== undefined) {
    if (typeof name !== "string")
      return res.status(400).json({ message: "name string bolishi kerak" });
    students[idx].name = name;
  }

  if (age !== undefined) {
    const ageNum = Number(age);
    if (!Number.isFinite(ageNum))
      return res.status(400).json({ message: "age number bolishi kerak" });
    students[idx].age = ageNum;
  }

  res.json(students[idx]);
});

app.delete("/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = students.length;
  students = students.filter((s) => s.id !== id);
  if (students.length === before)
    return res.status(404).json({ message: "Student topilmadi" });

  res.json({ message: "Ochirildi", id });
});
app.get("/stats", (req, res) => {
  res.json(stats);
});

app.get("/trace", (req, res) => {
  const order = [];

  order.push("1) sync start");

  process.nextTick(() => order.push("2) nextTick"));
  Promise.resolve().then(() => order.push("3) promise then"));
  setTimeout(() => order.push("5) setTimeout 0ms"), 0);
  setImmediate(() => order.push("6) setImmediate"));

  order.push("4) sync end");

  setTimeout(() => {
    res.json({
      order,
    });
  }, 10);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
