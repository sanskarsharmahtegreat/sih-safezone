import React,{useMemo,useState} from "react";
import {MapContainer,TileLayer,Marker,Popup,Polygon,Polyline} from "react-leaflet";
import L from "leaflet";
import {Shield,AlertTriangle,Waves,Building2,Hospital,Ambulance,Users,Navigation,Plus,X,CheckCircle2,Siren,Radio} from "lucide-react";

const center=[26.2183,78.1828];

const shelters0=[
 {id:1,name:"Govt. School No. 2",pos:[26.2255,78.1888],capacity:500,occupied:210},
 {id:2,name:"Community Hall",pos:[26.2075,78.1928],capacity:350,occupied:120},
 {id:3,name:"ABV-IIITM Relief Centre",pos:[26.2428,78.1962],capacity:700,occupied:315}
];

const hospitals=[
 {name:"JAH Hospital",pos:[26.2152,78.1807]},
 {name:"Birla Hospital",pos:[26.2057,78.1697]},
 {name:"District Hospital",pos:[26.2236,78.1798]}
];

const flood=[
 [26.205,78.166],[26.214,78.159],[26.229,78.165],
 [26.238,78.181],[26.230,78.196],[26.213,78.199],[26.202,78.187]
];

const marker=(bg,text)=>L.divIcon({
 className:"marker",
 html:`<div style="background:${bg}">${text}</div>`,
 iconSize:[34,34],iconAnchor:[17,17]
});

const icons={
 shelter:marker("#16a34a","⛺"),
 hospital:marker("#dc2626","✚"),
 disaster:marker("#dc2626","⚠"),
 team:marker("#2563eb","🚑")
};

export default function App(){
 const [role,setRole]=useState("admin");
 const [active,setActive]=useState(false);
 const [shelters,setShelters]=useState(shelters0);
 const [modal,setModal]=useState(false);
 const [route,setRoute]=useState(false);
 const [toast,setToast]=useState("");
 const [form,setForm]=useState({name:"",capacity:300});

 const available=useMemo(()=>shelters.reduce((n,s)=>n+s.capacity-s.occupied,0),[shelters]);

 function notify(t){
  setToast(t);setTimeout(()=>setToast(""),2500);
 }

 function simulate(){
  setActive(true);
  notify("Flood simulated — emergency response activated.");
 }

 function addShelter(e){
  e.preventDefault();
  if(!form.name.trim())return;
  setShelters([...shelters,{
   id:Date.now(),name:form.name,
   capacity:Number(form.capacity)||300,occupied:0,
   pos:[26.218+(Math.random()-.5)*.035,78.183+(Math.random()-.5)*.035]
  }]);
  setForm({name:"",capacity:300});
  setModal(false);
  notify("Emergency shelter opened.");
 }

 return <div className="app">
  <header>
   <div className="brand">
    <div className="logo"><Shield size={22}/></div>
    <div><b>SAFEZONE</b><small>DISASTER RESPONSE PLATFORM</small></div>
   </div>
   <div className="system"><i className={active?"redDot":""}></i>{active?"INCIDENT ACTIVE":"SYSTEM OPERATIONAL"}</div>
   <div className="roles">
    <button className={role==="admin"?"selected":""} onClick={()=>setRole("admin")}>Admin</button>
    <button className={role==="citizen"?"selected":""} onClick={()=>setRole("citizen")}>Citizen</button>
   </div>
  </header>

  {active&&<div className="alert"><Siren size={18}/><b>FLOOD ALERT</b> — High-risk zone detected in central Gwalior.<span>Severity: HIGH</span></div>}

  <main>
   {role==="admin"?
   <>
    <div className="heading">
     <div><label>COMMAND CENTRE / GWALIOR</label><h1>Disaster Response Dashboard</h1><p>Monitor incidents, coordinate resources and guide citizens to safety.</p></div>
     <div className="buttons">
      <button className="danger" onClick={simulate}><Waves size={17}/>Simulate Flood</button>
      <button className="dark" onClick={()=>setModal(true)}><Plus size={17}/>Open Shelter</button>
     </div>
    </div>

    <div className="stats">
     <Stat icon={<Users/>} title="Affected Population" value={active?"12,450":"0"}/>
     <Stat icon={<Building2/>} title="Active Shelters" value={shelters.length}/>
     <Stat icon={<Shield/>} title="Available Capacity" value={available.toLocaleString()}/>
     <Stat icon={<AlertTriangle/>} title="Blocked Roads" value={active?"13":"0"}/>
     <Stat icon={<Ambulance/>} title="Response Teams" value={active?"9":"2"}/>
    </div>

    <div className="grid">
     <div className="card mapCard">
      <div className="cardTop"><div><h2>Live Situation Map</h2><p>Gwalior, Madhya Pradesh</p></div><div className="legend"><span>🔴 Risk</span><span>🟢 Shelter</span><span>🔵 Response</span></div></div>
      <Map active={active} shelters={shelters} route={false}/>
     </div>

     <aside>
      <section className="card">
       <div className="sectionTitle">Incident Status <em className={active?"activePill":"okPill"}>{active?"ACTIVE":"NORMAL"}</em></div>
       {active?<div className="incident"><div className="bigIcon"><Waves/></div><div><b>Urban Flood</b><p>Central Gwalior</p><small>Confidence 94% · detected just now</small></div></div>
       :<div className="normal"><CheckCircle2/><div><b>No active emergency</b><p>Use Simulate Flood to demonstrate the workflow.</p></div></div>}
      </section>

      <section className="card">
       <div className="sectionTitle">Emergency Shelters <span>{shelters.length} active</span></div>
       {shelters.map(s=><div className="shelter" key={s.id}><div className="sIcon"><Building2 size={16}/></div><div><b>{s.name}</b><small>{s.capacity-s.occupied} spaces available</small></div><div className="bar"><i style={{width:`${s.occupied/s.capacity*100}%`}}></i></div></div>)}
      </section>

      <section className="card">
       <div className="sectionTitle">Response Activity <Radio size={16}/></div>
       <Activity text="Flood alert issued" time={active?"Now":"—"} active={active}/>
       <Activity text="Rescue teams deployed" time={active?"1 min ago":"—"}/>
       <Activity text="Shelter capacity synced" time="3 min ago"/>
       <Activity text="Citizen notifications ready" time={active?"Now":"—"}/>
      </section>
     </aside>
    </div>
   </>
   :
   <Citizen active={active} shelters={shelters} route={route} setRoute={setRoute} simulate={simulate}/>
   }
  </main>

  {modal&&<div className="overlay"><div className="modal">
   <div className="modalHead"><h2>Open Emergency Shelter</h2><button onClick={()=>setModal(false)}><X/></button></div>
   <form onSubmit={addShelter}>
    <label>Shelter name<input autoFocus value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Govt School No. 5"/></label>
    <label>Capacity<input type="number" min="50" value={form.capacity} onChange={e=>setForm({...form,capacity:e.target.value})}/></label>
    <button className="dark full"><Plus size={17}/>Create Shelter</button>
   </form>
  </div></div>}

  {toast&&<div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
 </div>
}

function Stat({icon,title,value}){return <div className="stat"><div className="statIcon">{icon}</div><div><small>{title}</small><strong>{value}</strong></div></div>}

function Activity({text,time,active}){return <div className="activity"><div className={active?"activityIcon active":"activityIcon"}><Radio size={14}/></div><div><b>{text}</b><small>{time}</small></div></div>}

function Map({active,shelters,route}){return <div className="map"><MapContainer center={center} zoom={13} scrollWheelZoom><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
 {active&&<><Polygon positions={flood} pathOptions={{color:"#dc2626",fillColor:"#ef4444",fillOpacity:.22,weight:2}}/><Marker position={center} icon={icons.disaster}><Popup><b>Flood Incident</b><br/>High severity</Popup></Marker><Polyline positions={[[26.213,78.17],[26.222,78.185]]} pathOptions={{color:"#b91c1c",weight:6,dashArray:"8 8"}}/></>}
 {shelters.map(s=><Marker key={s.id} position={s.pos} icon={icons.shelter}><Popup><b>{s.name}</b><br/>Available: {s.capacity-s.occupied}</Popup></Marker>)}
 {hospitals.map(h=><Marker key={h.name} position={h.pos} icon={icons.hospital}><Popup><b>{h.name}</b><br/>Emergency medical facility</Popup></Marker>)}
 {active&&[[26.216,78.177],[26.226,78.193],[26.210,78.189]].map((p,i)=><Marker key={i} position={p} icon={icons.team}><Popup>Rescue Team {i+1}<br/>Deployed</Popup></Marker>)}
 {route&&<Polyline positions={[center,[26.221,78.183],[26.224,78.186],shelters[0].pos]} pathOptions={{color:"#2563eb",weight:7}}/>}
 </MapContainer></div>}

function Citizen({active,shelters,route,setRoute,simulate}){
 const s=shelters[0];
 return <><div className="citizenHead"><div><label>CITIZEN SAFETY PORTAL</label><h1>{active?"You may be in a high-risk area.":"Check your disaster safety status."}</h1><p>{active?"A flood incident is active in central Gwalior. Follow the recommended evacuation route.":"Run the simulation to see the citizen emergency workflow."}</p></div>{!active&&<button className="danger" onClick={simulate}><Waves size={17}/>Simulate Flood</button>}</div>
 {active&&<div className="citizenGrid"><div className="card warning"><div className="warningHead"><div className="warningIcon"><AlertTriangle/></div><div><label>EMERGENCY ALERT</label><h2>Flood · HIGH SEVERITY</h2></div></div><p>Your demo location is inside the affected zone. Move to the nearest safe shelter.</p><div className="routeCard"><Navigation/><div><label>RECOMMENDED SHELTER</label><b>{s.name}</b><small>1.8 km · {s.capacity-s.occupied} spaces available</small></div><button className="dark" onClick={()=>setRoute(true)}>{route?"Route Active":"Find Safe Route"}</button></div>{route&&<div className="steps"><div>1&nbsp; Leave the affected zone</div><div>2&nbsp; Follow the blue evacuation corridor</div><div>3&nbsp; Check in at {s.name}</div></div>}</div><div className="card mapCard"><div className="cardTop"><div><h2>Evacuation Map</h2><p>Live safety guidance</p></div></div><Map active shelters={shelters} route={route}/></div></div>}
 </>}
