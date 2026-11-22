(() => {
  "use strict";
  const settings = { price: 32, capacity: 6, days: [2, 4, 6], times: ["09:00", "15:00"], zone: "America/Panama" };
  const key = "local-voices-tours.demo.v1";
  const memory = [];
  function today() {
    const parts = new Intl.DateTimeFormat("en-CA", {timeZone: settings.zone, year:"numeric", month:"2-digit", day:"2-digit"}).formatToParts();
    const get = type => parts.find(part => part.type === type).value;
    return [get("year"), get("month"), get("day")].join("-");
  }
  function dateAt(date) { return new Date(date + "T12:00:00Z"); }
  function shift(date, amount) {
    const day = dateAt(date);
    day.setUTCDate(day.getUTCDate() + amount);
    return day.toISOString().slice(0,10);
  }
  function bookable(date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < today() || date > shift(today(),90)) return false;
    const day = dateAt(date);
    return Number.isFinite(+day) && day.toISOString().startsWith(date) && settings.days.includes(day.getUTCDay());
  }
  function usableTime(date, time) {
    return bookable(date) && settings.times.includes(time) && Date.parse(date + "T" + time + ":00-05:00") > Date.now();
  }
  function list() {
    try { return JSON.parse(localStorage.getItem(key) || "[]"); }
    catch { return [...memory]; }
  }
  function store(records) {
    memory.splice(0,memory.length,...records);
    try { localStorage.setItem(key, JSON.stringify(records)); return true; }
    catch { return false; }
  }
  function seats(tour,date,time,records=list()) {
    return settings.capacity - records.filter(r => r.status === "confirmed" && r.tour === tour && r.date === date && r.time === time)
      .reduce((total,r) => total + r.guests,0);
  }
  async function reserve(input) {
    const execute = () => {
      const records = list();
      const tour = window.LVT.tours.find(t => t.id === input.tour && t.open);
      if (!tour || !usableTime(input.date,input.time)) throw Error("Choose an available tour and departure.");
      if (!Number.isInteger(input.guests) || input.guests < 1 || input.guests > seats(input.tour,input.date,input.time,records))
        throw Error("There are not enough seats left for this group.");
      if (!input.accepted) throw Error("Please accept the demo policy.");
      let id;
      do { id = "LVT-" + Math.random().toString(36).slice(2,10).toUpperCase(); } while (records.some(r => r.id === id));
      const record = { id, tour:input.tour, date:input.date, time:input.time, guests:input.guests, total:input.guests * settings.price, status:"confirmed" };
      return {record, saved:store([...records,record])};
    };
    return typeof navigator !== "undefined" && navigator.locks ? navigator.locks.request(key,execute) : execute();
  }
  async function cancel(id) {
    const execute = () => store(list().map(r => r.id === id ? {...r,status:"cancelled"} : r));
    return typeof navigator !== "undefined" && navigator.locks ? navigator.locks.request(key,execute) : execute();
  }
  window.LVTBooking = {settings, today, shift, dateAt, bookable, usableTime, list, seats, reserve, cancel};
})();