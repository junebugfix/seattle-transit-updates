const realtimeFeedUrl =
  "https://s3.amazonaws.com/kcm-alerts-realtime-prod/tripupdates_pb.json";

// 107 bus - routeId 100006
// Carkeek & 40th stop - stopId 31130

async function getArrivalTimes({ routeId, stopId }) {
  const res = await fetch(realtimeFeedUrl);
  const data = await res.json();

  const dataTime = data.header.timestamp;
  const updates = getRelevantUpdates({ data, routeId, stopId });
  const arrivalTimes = updates
    .map((update) => update.arrival.time)
    .filter(isInFuture);

  return { dataTime, arrivalTimes };
}

function getRelevantUpdates({ data, routeId, stopId }) {
  const updatesForRoute = data.entity.filter(
    (update) => update.trip_update.trip.route_id === routeId
  );

  let allUpdatesForStop = [];

  for (const update of updatesForRoute) {
    const updatesForStop = update.trip_update.stop_time_update.filter(
      (update) => update.stop_id === stopId
    );
    allUpdatesForStop = allUpdatesForStop.concat(updatesForStop);
  }

  console.log(allUpdatesForStop);

  return allUpdatesForStop;
}

function isInFuture(timestamp) {
  return timestamp > Date.now() / 1000;
}

module.exports = { getArrivalTimes };
