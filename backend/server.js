const app=require("./app.js");

const PORT = app.get("port");
const environment = app.get("env");

app.listen(PORT,() => {
    console.log(`app listening on port ${PORT}!`)
    console.log(`app is running in ${environment}`);
});