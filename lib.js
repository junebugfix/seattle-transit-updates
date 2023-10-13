const realtimeFeedUrl =
  "https://s3.amazonaws.com/kcm-alerts-realtime-prod/tripupdates_pb.json";

const transitApiKey =
  "3dd9efc82649e0c4e4c9319860cb8ee8c0bc3177195410610497d2d13e5ce6ce";

transitUrl = "https://external.transitapp.com/v3/public/stop_departures";

// 107 bus - routeId 100006
// Carkeek & 40th stop - kcm stopId 31130, transit stop id KCM:110949

async function getTransitArrivalTimes({ stopId }) {
  const res = await fetch(`${transitUrl}?global_stop_id=${stopId}`, {
    headers: {
      apiKey: transitApiKey,
    },
  });

  const data = await res.json();

  return data.route_departures[0].itineraries[0].schedule_items;
}

async function getKcmArrivalTimes({ routeId, stopId }) {
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

module.exports = { getTransitArrivalTimes, getKcmArrivalTimes };
