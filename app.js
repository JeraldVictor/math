const createError = require("http-errors");
const express = require("express");
const path = require("path");
const session = require("express-session");

const indexRouter = require("./routes/index");
const update = require("./routes/update");
const api = require("./routes/api");
const app = express();

var MySQLStore = require("express-mysql-session")(session);

// var options = {
//     host: 'localhost',
//     port: 3306,
//     user: 'root',
//     password: '',
//     database: 'anthony'
// };
var options = {
  host: "localhost",
  port:3306,
  user: "jeraldvi_jerald",
  password: "Johnpeter@17",
  database: "jeraldvi_anthony"
};
var sessionStore = new MySQLStore(options);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.set("trust proxy", 1);
// app.use(session({
//   secret: 'JeraldVictor',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { maxAge: 10000000 }
// }));

app.use(
  session({
    key: "session_cookie_name",
    secret: "JeraldVictor",
    store: sessionStore,
    resave: false,
    saveUninitialized: false
  })
);

//bootstrap
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js")); // redirect bootstrap JS
app.use("/js", express.static(__dirname + "/node_modules/jquery/dist")); // redirect JS jQuery
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css")); // redirect CSS bootstra
app.use("/css/ui", express.static(__dirname + "/node_modules/jquery-ui-dist"));
app.use("/js/ui", express.static(__dirname + "/node_modules/jquery-ui-dist"));

app.use("/", indexRouter);
app.use("/update", update);
app.use("/api", api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
