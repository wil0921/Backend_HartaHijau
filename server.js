const app = requre("./api");

// sebaiknya kalo untuk backend pake port selain 3000, karna biasanya port 3000 udah dipake sama frontend
const PORT = process.env.PORT !== undefined ? process.env.PORT : 88;

app.listen(PORT, () => {
  console.log(`Server sedang berjalan di http://localhost:${PORT}`);
});
