const baseUrl = 'http://api.sl.se/api2';
const fetchOptions = {
  method: 'GET',
};

const lineNumberColors = {
  '7': 'gray',
  '10': '#1C7F2A', // blue
  '11': '#1C7F2A',
  '12': 'gray',
  '13': '#D51427', // red
  '14': '#D51427',
  '17': '#60A42B', // green
  '18': '#60A42B',
  '19': '#60A42B',
  '21': 'brown',
  '22': 'orange',
  '25': 'turquoise',
  '26': 'turquoise',
  '27': 'purple',
  '28': 'purple',
  '29': 'purple',
  '40': 'pink',
  '41': 'pink',
  '42': 'pink',
  '43': 'pink',
  '44': 'pink',
  '45': 'pink',
  '48': 'pink',
};
function getColorFromLineNo(lineNo) {
  return lineNumberColors[lineNo] || '#A4A5A7'; // gray
}

function transformStop(stop) {
  return {
    ...stop,
    HafasId: stop.id,
    id: stop.id.substr(-4),
    region: 'SL',
  };
}

function getClosestStops({ lat, lng }, limit = 5) {
  const key = process.env.SL_NEARBY_STOPS_KEY;
  const url = `nearbystops.json?key=${key}&originCoordLat=${lat}&originCoordLong=${lng}&maxresults=${limit}`;
  return makeRequest(url).then((json) => {
    const stops = Array.from(json.LocationList.StopLocation);
    return stops.map(transformStop);
  });
}

function getClosestStop(pos) {
  return getClosestStops(pos, 1)[0];
}

function findStops(term) {
  const key = process.env.SL_TYPE_AHEAD_KEY;
  const url = `typeahead.json?key=${key}&searchstring=${encodeURIComponent(term)}&maxresults=5`;
  return makeRequest(url)
    .then((json) => asArray(json.ResponseData))
    .then((stops) =>
      stops
        .filter((stop, idx) => {
          const firstIndex = stops.findIndex(({ SiteId }) => SiteId === stop.SiteId);
          return firstIndex >= idx;
        })
        .slice(0, 5)
        .map((stop) => ({
          ...stop,
          name: stop.Name,
          id: stop.SiteId,
          region: 'SL',
        }))
    );
}

const vehicules = {
  BUS: 'Buss',
  METRO: 'T-bana',
  SHIP: 'Båt',
  TRAIN: 'Tåg',
  TRAM: 'Spårvagn',
};
function vehicule(key) {
  return vehicules[key] || key;
}

function getDeparturesFrom(siteId) {
  const key = process.env.SL_REALTIME_DEPARTURES_KEY;
  const url = `realtimedeparturesV4.json?key=${key}&siteid=${siteId}&timewindow=30`;
  return makeRequest(url).then((json) =>
    [
      ...json.ResponseData.Buses,
      ...json.ResponseData.Metros,
      ...json.ResponseData.Ships,
      ...json.ResponseData.Trains,
      ...json.ResponseData.Trams,
    ].map((trip) => ({
      ...trip,
      fgColor: getColorFromLineNo(trip.LineNumber),
      bgColor: 'white',
      direction: trip.Destination,
      timestamp: new Date(trip.ExpectedDateTime || trip.TimeTabledDateTime).getTime(),
      time: trip.TimeTabledDateTime.substr(11, 5),
      rtTime: trip.ExpectedDateTime.substr(11, 5),
      name: `${vehicule(trip.TransportMode)} ${trip.LineNumber}`,
      sname: trip.LineNumber,
      track: trip.StopPointDesignation || trip.JourneyDirection,
      region: 'SL',
      href: '#',
      isLate: Boolean(trip.ExpectedDateTime && trip.TimeTabledDateTime !== trip.ExpectedDateTime),
    }))
  );
}

function getTrafficSituations(siteId) {
  const key = process.env.SL_DEVIATIONS_KEY;
  const url = `deviations.json?key=${key}&siteId=${siteId}`;
  return makeRequest(url)
    .then((json) => asArray(json.ResponseData))
    .then((json) => {
      return {
        messages: json.map(({ Details }) => Details),
      };
    });
}

function fetchMiddleware(response) {
  if (response.ok && response.status !== 204) {
    return response.json();
  }

  if (!response.ok) {
    return response.json().then((err) => Promise.reject(err));
  }

  console.log('fetchMiddleware: not json and no error');
  return response;
}

function asArray(arg) {
  return (arg && [].concat(arg)) || [];
}

function makeRequest(path) {
  const url = `${baseUrl}/${path}`;
  const requestUrl = `https://request-proxy.herokuapp.com/?url=${encodeURIComponent(url)}`;
  return fetch(requestUrl, fetchOptions)
    .then(fetchMiddleware)
    .catch((err) => console.error(err));
}

export default {
  getClosestStop,
  getClosestStops,
  getDeparturesFrom,
  getTrafficSituations,
  findStops,
  init() {
    return Promise.resolve();
  },
};
