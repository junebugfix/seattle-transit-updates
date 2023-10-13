const Koa = require("koa");
const app = new Koa();
const { getTransitArrivalTimes } = require("./lib");

app.use(async (ctx) => {
  console.log(ctx.request.path);
  if (ctx.request.path !== "/arrival") {
    ctx.status = 404;
    return;
  }

  const { stopId } = ctx.request.query;
  if (!stopId) {
    ctx.status = 400;
  }

  const res = await getTransitArrivalTimes({ stopId });
  ctx.body = JSON.stringify(res);
});

const port = process.env.PORT || 3000;
console.log(`Starting server on port ${port}`);
app.listen(port);
