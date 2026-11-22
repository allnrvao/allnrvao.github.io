(() => {
"use strict";
const {tours, places, faq} = window.LVT;
const B = window.LVTBooking;
const main = document.querySelector("main");
const get = id => document.getElementById(id);
const find = id => tours.find(t => t.id === id);
const safe = value => String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const button = (url,label,kind="") => '<a class="button '+kind+'" href="'+safe(url)+'">'+safe(label)+'</a>';
const external = (url,label) => '<a class="text-link" href="'+safe(url)+'" target="_blank" rel="noopener noreferrer">'+safe(label)+'</a>';
const map = query => "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(query+", Panama");
const wa = message => "https://wa.me/50763119179?text="+encodeURIComponent(message);
const usd = amount => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(amount);
const dateLabel = date => new Intl.DateTimeFormat("en-US",{dateStyle:"full",timeZone:"UTC"}).format(B.dateAt(date));
const timeLabel = time => time === "09:00" ? "9:00 AM" : "3:00 PM";
const photo = (n,extra="") => '<div class="photo photo-'+n+' '+extra+'" aria-hidden="true"></div>';
const list = items => "<ul>"+items.map(i=>"<li>"+safe(i)+"</li>").join("")+"</ul>";
function page(label,title,intro,body) {
  return '<section class="wrap page"><div class="intro"><p class="eyebrow">'+label+'</p><h1>'+safe(title)+'</h1><p>'+intro+'</p></div>'+body+'</section>';
}
function tourCard(t) {
  return '<article class="card"><a class="cover" aria-label="Explore '+safe(t.title)+'" href="#tour/'+t.id+'">'+photo(t.photo)+'<span class="price">$32'+(["panama-viejo","amador-causeway","ancon-hill"].includes(t.id)?" + entrance*":"")+'</span></a><div class="card-body"><p class="eyebrow">'+(t.id==="panama-viejo"?"3":"2.5")+' hrs · Morning'+(t.open?'':' · Coming soon')+'</p><h3><a href="#tour/'+t.id+'">'+safe(t.title)+'</a></h3><p>'+safe(t.short)+'</p><div class="actions">'+button("#tour/"+t.id,"Tour details","outline")+(t.open?button("#book/"+t.id,"Book now"):"")+'</div></div></article>';
}
function home() {
  main.innerHTML = '<section class="hero">'+photo(0,"hero-photo")+'<div class="wrap hero-copy"><p class="eyebrow">Small groups · Local guides</p><h1>See the real Panama City, <em>on foot.</em></h1><p>Small-group walking tours in English with certified local student guides. Tastings, water, and photos included.</p><div class="actions">'+button("#tours","See our tours")+button("#book","Try a demo booking","light")+'</div><div class="slides" aria-label="Featured images">'+[1,2,3].map((n,i)=>'<button type="button" aria-label="Show image '+n+'" aria-pressed="'+(i===0)+'" data-slide="'+i+'"><span></span></button>').join("")+'</div></div></section><section class="facts"><div class="wrap metrics"><div><strong>$32</strong><span>Per person</span></div><div><strong>6 guests</strong><span>Maximum group size</span></div><div><strong>ATP-certified</strong><span>English-speaking guides</span></div></div></section><section class="wrap page"><div class="intro"><p class="eyebrow">Walking tours in Panama City</p><h2>Find your walk</h2><p>Explore the Old Quarter, taste local chocolate, or walk from the historic streets to the bay.</p></div><div class="grid">'+tours.map(tourCard).join("")+'</div></section><section class="panel"><div class="wrap feature">'+photo(3)+'<div><p class="eyebrow">Included on every walk</p><h2>A local guide and a taste of Panama</h2>'+list(["Certified bilingual student guide","Local tastings and cold bottled water","Digital photos and a Panama City guide"])+button("#guides","Meet Local Voices","outline")+'</div></div></section>';
  main.querySelectorAll("[data-slide]").forEach(btn=>btn.onclick=()=>{
    main.querySelector(".hero-photo").className="photo hero-photo photo-"+btn.dataset.slide;
    main.querySelectorAll("[data-slide]").forEach(b=>b.setAttribute("aria-pressed",String(b===btn)));
  });
}
function tourPage(t) {
  const coordinates = t.stops.map(s=>s.match(/\(([-.\d]+, [-.\d]+)\)/)?.[1].replace(" ","")).filter(Boolean);
  const maps = coordinates.length>1 ? "https://www.google.com/maps/dir/?api=1&travelmode=walking&origin="+encodeURIComponent(coordinates[0])+"&destination="+encodeURIComponent(coordinates.at(-1))+"&waypoints="+encodeURIComponent(coordinates.slice(1,-1).join("|")) : map(t.meet);
  main.innerHTML=page(t.open?"Walking tour":"Coming soon",t.title,safe(t.short),
  '<div class="feature detail">'+photo(t.photo)+'<aside class="panel pad"><h2>Tour at a glance</h2>'+list(t.facts)+(t.open?button("#book/"+t.id,"Book now"):"")+'</aside></div><div class="detail-layout"><article><h2>Overview</h2><p>'+safe(t.overview)+'</p><h2>Highlights</h2>'+list(t.highlights)+'<h2>Itinerary</h2><ol class="itinerary">'+t.itinerary.map(i=>"<li>"+safe(i)+"</li>").join("")+'</ol><h2>Route</h2>'+list(t.stops)+external(maps,coordinates.length>1?"Open route in Google Maps":"Open meeting point in Google Maps")+'</article><aside><h2>Included</h2>'+list(t.included)+'<h2>Not included</h2>'+list(t.excluded)+'<h2>What to bring</h2>'+list(t.bring)+'<h2>Good to know</h2>'+list(t.tips)+'</aside></div>');
}
function placesPage() {
  const cats=[...new Set(places.map(p=>p.cat))];
  main.innerHTML=page("Plan your visit","Places to Visit in Panama City","Panama City has history, nature, food, and the Panama Canal, all close to each other. Here are our favorite places to visit. Some are part of our walking tours, and others are great for your free time.",
  '<p class="notice">Prices are approximate and are for foreign visitors. They can change, so please check the official website before you go. Entrance fees are not included in our tour price.</p><div class="filters" aria-label="Filter places">'+cats.map((c,i)=>'<button class="button outline" type="button" data-category="'+i+'" aria-pressed="'+(i===0)+'">'+safe(c)+'</button>').join("")+'</div><div class="grid" id="place-list"></div><p>'+button("#book","Book a tour")+'</p>');
  function select(i) {
    main.querySelectorAll("[data-category]").forEach(b=>b.setAttribute("aria-pressed",String(+b.dataset.category===i)));
    get("place-list").innerHTML=places.filter(p=>p.cat===cats[i]).map(p=>'<article class="card card-body">'+(p.tour?'<p class="eyebrow">Part of our tours</p>':'')+'<h3>'+safe(p.name)+'</h3><p>'+safe(p.description)+'</p><p class="muted">'+safe([p.duration,p.price,p.hours].join(" · "))+'</p><div class="actions">'+external(map(p.name),"Open in Google Maps")+(p.tour?button("#book/"+p.tour,"Book this tour","outline"):'')+'</div></article>').join("");
  }
  main.querySelectorAll("[data-category]").forEach(b=>b.onclick=()=>select(+b.dataset.category));
  select(0);
}
function booking(tourId,date) {
  const firstDate = B.today();
  const dates = Array.from({length:91},(_,i)=>B.shift(firstDate,i)).filter(d=>B.settings.times.some(t=>B.usableTime(d,t)));
  main.innerHTML=page("Demo reservations","Book a walking tour","Try the full reservation flow with sample details. Departures are shown in Panama time.",
  '<div class="feature booking-layout"><form id="booking" class="panel pad"><div class="form-grid"><label>Tour<select name="tour">'+tours.filter(t=>t.open).map(t=>'<option value="'+t.id+'"'+(tourId===t.id?" selected":"")+'>'+safe(t.title)+'</option>').join("")+'</select></label><label>Date<select name="date">'+dates.map(d=>'<option value="'+d+'"'+(date===d?" selected":"")+'>'+dateLabel(d)+'</option>').join("")+'</select></label><label>Departure<select name="time"></select></label><label>Guests<select name="guests"></select></label><label>Sample name<input name="name" maxlength="80" placeholder="Alex Rivera" required></label><label>Sample email<input name="email" type="email" placeholder="alex@example.com" required></label><label>Sample WhatsApp<input name="phone" type="tel" placeholder="+1 202 555 0145" minlength="7" maxlength="25" required></label><label>Payment simulation<select name="payment"><option>Card</option><option>Yappy / bank transfer</option><option>Cash</option></select></label><label class="wide">Sample dietary notes <span class="muted">(optional)</span><textarea name="notes" maxlength="250" rows="2"></textarea></label></div><button id="sample" class="text-button" type="button">Fill sample details</button><label class="check"><input type="checkbox" name="accepted" required><span>I accept the <a href="#policies">demo booking policy</a>.</span></label><p id="form-message" role="alert"></p><button type="submit" class="button">Confirm demo booking</button></form><aside class="panel pad summary"><p class="eyebrow">Your reservation</p><h2 id="summary-tour"></h2><p id="summary-meet"></p><p id="stock" aria-live="polite"></p><p class="total" id="total" aria-live="polite"></p><p class="muted">USD · No real charge. Sample contact details are used only to preview the confirmation.</p>'+button("#calendar","View demo calendar","outline")+'</aside></div>');
  const form=get("booking");
  const field = name => form.elements.namedItem(name);
  function updateTotal() {
    get("total").textContent = usd(Number(field("guests").value)*B.settings.price);
  }
  function availability() {
    const t=find(field("tour").value), day=field("date").value;
    const oldTime=field("time").value, oldGuests=Number(field("guests").value);
    const times=B.settings.times.filter(time=>B.usableTime(day,time));
    field("time").innerHTML=times.map(time=>{
      const sold=B.seats(t.id,day,time) < 1;
      return '<option value="'+time+'" '+(sold?"disabled":"")+'>'+timeLabel(time)+(sold?" · Sold out":"")+'</option>';
    }).join("");
    if(times.includes(oldTime) && B.seats(t.id,day,oldTime)>0) field("time").value=oldTime;
    const remaining=field("time").value ? B.seats(t.id,day,field("time").value) : 0;
    field("guests").innerHTML=Array.from({length:remaining},(_,i)=>'<option>'+(i+1)+'</option>').join("");
    if(remaining) field("guests").value=Math.min(oldGuests||1,remaining);
    form.querySelector("[type=submit]").disabled=!remaining;
    get("summary-tour").textContent=t.title;
    get("summary-meet").textContent="Meeting point · "+t.meet;
    get("stock").textContent=remaining ? remaining+" of 6 seats available" : "No seats available. Choose another date.";
    updateTotal();
  }
  ["tour","date","time"].forEach(name=>field(name).onchange=availability);
  field("guests").onchange=updateTotal;
  get("sample").onclick=()=>{
    field("name").value="Alex Rivera";
    field("email").value="alex@example.com";
    field("phone").value="+1 202 555 0145";
  };
  form.onsubmit=async event=>{
    event.preventDefault();
    const input=Object.fromEntries(new FormData(form));
    form.querySelector("[type=submit]").disabled=true;
    try {
      const result=await B.reserve({...input,guests:Number(input.guests)});
      if(form.isConnected) confirmation(result,input);
    } catch(error) {
      get("form-message").textContent=error.message;
      availability();
    }
  };
  availability();
}
function confirmation({record:r,saved},input) {
  const t=find(r.tour), when=dateLabel(r.date)+" at "+timeLabel(r.time)+" (Panama time)", url=map(t.meet);
  const messages=[
    ["Guest confirmation","To: "+input.email+"\n\nHi "+input.name+", your demo reservation "+r.id+" is confirmed.\n"+t.title+"\n"+when+" · "+r.guests+" guest(s)\nMeeting point: "+t.meet+"\n"+url+"\nTotal: "+usd(r.total)+" · "+input.payment+" (simulated)."],
    ["Operator alert","New demo reservation "+r.id+"\n"+t.title+"\n"+when+" · "+r.guests+" guest(s)\nContact: "+input.name+" / "+input.phone+"\nNotes: "+(input.notes||"None")],
    ["Reminder preview","Your walking tour is tomorrow. Meet us at "+t.meet+" by "+timeLabel(r.time)+".\n"+url],
    ["After-tour preview","Thanks for walking with Local Voices Tours! We’ll share your tour photos and review link when available."]
  ];
  main.innerHTML=page("Booking confirmed · Demo","You’re on the list","Reference <strong>"+safe(r.id)+"</strong> · "+safe(when),
    '<div class="feature booking-layout"><article class="panel pad"><h2>'+safe(t.title)+'</h2><p>'+r.guests+' guest(s) · '+usd(r.total)+' USD</p><p>Meeting point · '+safe(t.meet)+'</p><p>'+external(url,"Open meeting point in Google Maps")+'</p><p class="notice">'+(saved?"Saved in this browser.":"Storage is unavailable. This reservation lasts until the page is reloaded.")+' No automatic messages or charges.</p><div class="actions">'+button("#calendar/"+r.date,"View in calendar")+button("#book","New booking","outline")+'</div></article><section><h2>Message previews</h2>'+messages.map(([title,body],i)=>'<details '+(i===0?"open":"")+'><summary>'+safe(title)+'</summary><p class="message">'+safe(body)+'</p></details>').join("")+'<p>'+external(wa("Hi Local Voices Tours! I tested your website demo. Reference: "+r.id+". This is a test, not a real reservation."),"Open demo message in WhatsApp")+'</p></section></div>');
  main.querySelector('a[href="#book"]').onclick=event=>{
    if(location.hash==="#book"){event.preventDefault();booking();}
  };
  main.focus();
  window.scrollTo(0,0);
}
function calendar(date) {
  let selected=/^\d{4}-\d{2}-\d{2}$/.test(date||"")&&Number.isFinite(+B.dateAt(date))?date:B.today();
  let month=selected.slice(0,7)+"-01";
  main.innerHTML=page("Demo reservations","Booking calendar","View, inspect and cancel demo reservations saved in this browser.",
    '<div class="feature booking-layout"><div class="panel pad"><div class="calendar-head"><button id="prev" class="button outline" aria-label="Previous month">‹</button><h2 id="month"></h2><button id="next" class="button outline" aria-label="Next month">›</button></div><div class="calendar" id="days"></div></div><section class="panel pad"><h2 id="picked" tabindex="-1"></h2><div id="records"></div><div id="date-actions"></div></section></div>');
  function render() {
    const records=B.list();
    const counts=new Map();
    records.filter(r=>r.status==="confirmed").forEach(r=>counts.set(r.date,(counts.get(r.date)||0)+1));
    get("month").textContent=new Intl.DateTimeFormat("en-US",{month:"long",year:"numeric",timeZone:"UTC"}).format(B.dateAt(month));
    const leading=B.dateAt(month).getUTCDay();
    const weekdays=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const days=[];
    for(let day=month;day.slice(0,7)===month.slice(0,7);day=B.shift(day,1)){
      const count=counts.get(day)||0;
      days.push('<button class="day" aria-pressed="'+(day===selected)+'" aria-label="'+safe(dateLabel(day)+", "+count+" confirmed bookings")+'" data-day="'+day+'">'+Number(day.slice(8))+(count?'<small>'+count+'</small>':'')+'</button>');
    }
    get("days").innerHTML=weekdays.map(d=>'<span class="weekday">'+d+'</span>').join("")+"<span></span>".repeat(leading)+days.join("");
    get("picked").textContent=dateLabel(selected);
    const matching=records.filter(r=>r.date===selected).sort((a,b)=>a.time.localeCompare(b.time));
    get("records").innerHTML=matching.length?matching.map(r=>'<article class="reservation"><p class="eyebrow">'+safe(r.status)+' · '+safe(r.id)+'</p><h3>'+safe(find(r.tour)?.title||r.tour)+'</h3><p>'+timeLabel(r.time)+' · '+r.guests+' guest(s) · '+usd(r.total)+'</p>'+(r.status==="confirmed"?'<button class="text-button" data-cancel="'+safe(r.id)+'">Cancel demo reservation</button>':'')+'</article>').join(""):'<p class="muted">No demo reservations on this date.</p>';
    get("date-actions").innerHTML=B.settings.times.some(t=>B.usableTime(selected,t))?button("#book//"+selected,"Book this date"):"";
    main.querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{
      selected=b.dataset.day;render();main.querySelector('[data-day="'+selected+'"]').focus();
    });
    main.querySelectorAll("[data-cancel]").forEach(b=>b.onclick=async()=>{
      if(window.confirm("Cancel this demo reservation and release its seats?")){await B.cancel(b.dataset.cancel);render();get("picked").focus();}
    });
  }
  function move(amount){
    const day=B.dateAt(month);
    day.setUTCMonth(day.getUTCMonth()+amount);
    selected=month=day.toISOString().slice(0,10);
    render();
  }
  get("prev").onclick=()=>move(-1);
  get("next").onclick=()=>move(1);
  render();
}
const info={
  guides:["Our guides","Local Voices Tours is run by Panamanian university English students. We want you to discover the real Panama through the voices of the people who live here.",'<div class="feature">'+photo(0)+'<div><h2>Certified local student guides</h2><p>Our guide program requires ATP credentials and first-aid certification. Individual profiles will be added when available.</p>'+button("#tours","Explore the tours")+'</div></div>'],
  faq:["Safety & FAQ","What to know before your walk.",faq.map(([q,a])=>'<details><summary>'+safe(q)+'</summary><p>'+safe(a)+'</p></details>').join("")],
  reviews:["Reviews","Guest reviews will appear here after the first public tours.",'<p>'+button("#tours","Explore the tours","outline")+'</p>'],
  policies:["Policies","Demo reservations, weather and privacy.",'<div class="prose"><h2>Demo reservations</h2><p>All bookings and payments on this site are simulations. Cancel a demo reservation from the calendar to release its seats.</p><h2>Rain</h2><p>Our planned rain policy includes covered stops, umbrellas and free rescheduling.</p><h2>Privacy</h2><p>Use sample contact information. The reservation calendar keeps the reference, tour, date, time, party size, total and status in this browser. Contact details and notes appear only in the current confirmation preview.</p><h2>Public tour terms</h2><p>Cancellation and payment terms for paid tours will be confirmed before launch.</p></div>'],
  contact:["Contact","Ask about walking tours and meeting points in Panama City.",'<div class="panel pad"><h2>Local Voices Tours</h2><p>'+external(wa("Hi! I’d like to learn more about Local Voices Tours."),"WhatsApp · +507 6311-9179")+'</p><p>'+external("https://www.instagram.com/localvoicestours/","Instagram · @localvoicestours")+'</p><h3>Meeting points</h3><ul>'+tours.filter(t=>t.open).map(t=>'<li>'+external(map(t.meet),t.meet)+'</li>').join("")+'</ul></div>']
};
function route(focus=false) {
  const [name,id,date]=location.hash.slice(1).split("/");
  if(name==="main") return;
  get("menu").setAttribute("aria-expanded","false");
  get("navlinks").classList.remove("open");
  document.querySelectorAll("#navlinks a").forEach(a=>{
    if(a.hash==="#"+name || (name==="tour" && a.hash==="#tours")) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current");
  });
  let title="";
  switch(name){
    case "home": case "": home();break;
    case "tours":
      title="Walking tours";
      main.innerHTML=page("Find your walk",title,"Eight ways to explore Panama City. Three are available for demo reservations.",'<div class="grid">'+tours.map(tourCard).join("")+'</div><p class="muted">* Check the tour details for separate or optional entrance fees.</p>');break;
    case "tour":
      if(find(id)){title=find(id).title;tourPage(find(id));break;}
      main.innerHTML=page("Tours","Tour not found","Choose a walking tour from the collection.",button("#tours","Browse tours"));break;
    case "places": title="Places to visit";placesPage();break;
    case "book": title="Book a tour";booking(id,date);break;
    case "calendar": title="Booking calendar";calendar(id);break;
    default:
      if(Object.hasOwn(info,name)){const [heading,intro,body]=info[name];title=heading;main.innerHTML=page("Local Voices Tours",heading,safe(intro),body);}
      else home();
  }
  document.title=(title?title+" | ":"")+"Local Voices Tours · Panama City";
  if(focus){main.focus({preventScroll:true});window.scrollTo(0,0);}
}
get("menu").onclick=()=>{
  const open=get("menu").getAttribute("aria-expanded")==="true";
  get("menu").setAttribute("aria-expanded",String(!open));
  get("navlinks").classList.toggle("open",!open);
};
window.addEventListener("hashchange",()=>route(true));
window.addEventListener("storage",()=>{if(location.hash.startsWith("#calendar"))route();});
route();
})();