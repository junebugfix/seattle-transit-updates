const Koa = require("koa");
const app = new Koa();
const { getArrivalTimes } = require("./lib");

app.use(async (ctx) => {
  console.log(ctx.request.path);
  if (ctx.request.path !== "/arrival") {
    ctx.status = 404;
    return;
  }

  const { routeId, stopId } = ctx.request.query;
  if (!routeId || !stopId) {
    ctx.status = 400;
  }

  const res = await getArrivalTimes({ routeId, stopId });
  ctx.body = JSON.stringify(res);
});

const port = process.env.PORT || 3000;
console.log(`Starting server on port ${port}`);
app.listen(port);
