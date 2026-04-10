const {useState, useEffect} = React;
const e = React.createElement;

// ── DATA ──────────────────────────────────────────────────────
const LOGO_SVG = “data:image/svg+xml,%3Csvg xmlns=‘http://www.w3.org/2000/svg’ viewBox=‘0 0 300 120’%3E%3Crect width=‘300’ height=‘120’ fill=‘white’/%3E%3Ctext x=‘10’ y=‘90’ font-family=‘Arial Black’ font-size=‘90’ font-weight=‘900’ fill=’%231a2456’%3EJ%3C/text%3E%3Ctext x=‘80’ y=‘90’ font-family=‘Arial Black’ font-size=‘90’ font-weight=‘900’ fill=’%239b1b1b’%3EFX%3C/text%3E%3C/svg%3E”;
const DRIVERS = [“Carlos Mendez”,“John Williams”,“Maria Lopez”,“David Chen”];
const MANAGERS = [“Luis Fernandez”,“Sandra Gomez”,“Robert King”];
const DISPATCHERS = [“Ana Martinez”,“Pedro Salinas”,“Kevin Torres”];
const OIL_INTERVAL = 13000;

const INIT_LOADS = [
{id:1,from:“Chicago, IL”,to:“Dallas, TX”,miles:917,rate:2400,diesel:310,driver:“Carlos Mendez”,date:“2025-06-02”,createdBy:“Ana Martinez”},
{id:2,from:“Atlanta, GA”,to:“Miami, FL”,miles:662,rate:1850,diesel:220,driver:“John Williams”,date:“2025-06-03”,createdBy:“Pedro Salinas”},
{id:3,from:“Los Angeles, CA”,to:“Phoenix, AZ”,miles:372,rate:1100,diesel:130,driver:“Maria Lopez”,date:“2025-06-04”,createdBy:“Ana Martinez”},
];

const INIT_TRUCKS = [
{id:1,unit:“T-101”,make:“Freightliner”,model:“Cascadia”,year:2020,plate:“JFX-101”,driver:“Carlos Mendez”,totalMiles:124500,lastOilMiles:112800,maintenances:[],weeklyLogs:[]},
{id:2,unit:“T-102”,make:“Kenworth”,model:“T680”,year:2019,plate:“JFX-102”,driver:“John Williams”,totalMiles:98300,lastOilMiles:89200,maintenances:[],weeklyLogs:[]},
{id:3,unit:“T-103”,make:“Peterbilt”,model:“579”,year:2021,plate:“JFX-103”,driver:“Maria Lopez”,totalMiles:76400,lastOilMiles:70100,maintenances:[],weeklyLogs:[]},
{id:4,unit:“T-104”,make:“Volvo”,model:“VNL 860”,year:2022,plate:“JFX-104”,driver:“David Chen”,totalMiles:45200,lastOilMiles:43900,maintenances:[],weeklyLogs:[]},
];

const fmt = n => “$” + Number(n).toLocaleString(“en-US”,{minimumFractionDigits:2,maximumFractionDigits:2});
const getWeek = () => {
const now=new Date(), mon=new Date(now);
mon.setDate(now.getDate()-((now.getDay()+6)%7));
const sun=new Date(mon); sun.setDate(mon.getDate()+6);
return mon.toLocaleDateString(“en-US”,{month:“short”,day:“numeric”})+” – “+sun.toLocaleDateString(“en-US”,{month:“short”,day:“numeric”,year:“numeric”});
};

// ── HELPERS ────────────────────────────────────────────────────
function exportCSV(rows, filename) {
const csv = rows.map(r=>r.map(c=>’”’+String(c).replace(/”/g,’””’)+’”’).join(”,”)).join(”\n”);
const blob = new Blob([”\uFEFF”+csv],{type:“text/csv;charset=utf-8;”});
const url = URL.createObjectURL(blob);
const a = document.createElement(“a”);
a.href=url; a.download=filename+”.csv”; a.click();
URL.revokeObjectURL(url);
}

function printReport(loads, type, driver) {
const dl = type===“driver” ? loads.filter(l=>l.driver===driver) : loads;
const gross=dl.reduce((s,l)=>s+l.rate,0), diesel=dl.reduce((s,l)=>s+l.diesel,0);
const d10=gross*0.10, d30=gross*0.30, ins=250, net=gross-d10-d30-ins-diesel;
const w = window.open(””,”_blank”);
w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>JFX Carrier Report</title>

  <style>body{font-family:Montserrat,Arial,sans-serif;padding:32px;max-width:700px;margin:0 auto}
  h1{font-size:32px;font-weight:900;letter-spacing:5px;color:#111}h1 span{color:#9b1b1b}
  .bar{height:3px;background:linear-gradient(90deg,#1a2456 50%,#9b1b1b 50%);margin:12px 0}
  table{width:100%;border-collapse:collapse;font-size:12px;margin:12px 0}
  th{background:#1a2456;color:#fff;padding:8px;text-align:left;font-size:10px;letter-spacing:1px;text-transform:uppercase}
  td{padding:8px;border-bottom:1px solid #f0f0f0}
  .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0}
  .total{display:flex;justify-content:space-between;background:#eef0f6;padding:12px;border-radius:6px;font-weight:900;font-size:16px;border-left:4px solid #1a2456;margin-top:8px}
  .green{color:#16a34a}.red{color:#9b1b1b}
  @media print{.nobtn{display:none}}</style></head><body>

  <h1>JFX <span>CARRIER</span></h1>
  <div class="bar"></div>
  <p style="font-size:11px;color:#888;margin-bottom:16px">📅 ${getWeek()} ${type==="driver"?"· 👤 "+driver:""}</p>
  <button class="nobtn" onclick="window.print()" style="padding:10px 20px;background:#1a2456;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:800;margin-bottom:16px">🖨️ Imprimir / PDF</button>
  <h3 style="font-size:13px;background:#1a2456;color:#fff;padding:6px 10px;border-radius:4px;margin-bottom:8px">CARGAS</h3>
  <table><thead><tr><th>Ruta</th><th>Millas</th><th>Tarifa</th>${type==="driver"?"<th>Ganancia</th>":"<th>Driver</th>"}</tr></thead><tbody>
  ${dl.map(l=>`<tr><td>${l.from} → ${l.to}</td><td>${l.miles}</td><td>${fmt(l.rate)}</td><td>${type==="driver"?'<span class="green">+'+fmt(l.rate*0.30)+'</span>':l.driver}</td></tr>`).join("")}
  </tbody></table>
  ${type!=="driver"?`
  <div class="row"><span>Gross Revenue</span><span style="color:#d97706;font-weight:700">${fmt(gross)}</span></div>
  <div class="row"><span>Dispatch (10%)</span><span class="red">-${fmt(d10)}</span></div>
  <div class="row"><span>Driver Pay (30%)</span><span class="red">-${fmt(d30)}</span></div>
  <div class="row"><span>Insurance</span><span class="red">-${fmt(ins)}</span></div>
  <div class="row"><span>Diesel</span><span class="red">-${fmt(diesel)}</span></div>
  <div class="total"><span>NET PROFIT</span><span class="green">${fmt(net)}</span></div>`
  :`<div class="total"><span>TOTAL PAY (30%)</span><span class="green">${fmt(gross*0.30)}</span></div>`}
  <p style="text-align:center;font-size:10px;color:#aaa;margin-top:32px;border-top:1px solid #eee;padding-top:16px">JFX CARRIER INC · FREIGHT TRANSPORTATION SERVICES · USA</p>
  </body></html>`);
  w.document.close();
}

// ── MAIN APP ───────────────────────────────────────────────────
function App() {
const [user,setUser] = useState(null);
const [role,setRole] = useState(“manager”);
const [pass,setPass] = useState(””);
const [selDriver,setSelDriver] = useState(DRIVERS[0]);
const [selManager,setSelManager] = useState(MANAGERS[0]);
const [selDispatcher,setSelDispatcher] = useState(DISPATCHERS[0]);
const [tab,setTab] = useState(“dashboard”);
const [loads,setLoads] = useState(INIT_LOADS);
const [trucks,setTrucks] = useState(INIT_TRUCKS);
const [mileageRecords,setMileageRecords] = useState([]);
const [showMileEntry,setShowMileEntry] = useState(false);
const [entryMiles,setEntryMiles] = useState(””);
const [showPDF,setShowPDF] = useState(null);
const [showMaint,setShowMaint] = useState(null);
const [showAddTruck,setShowAddTruck] = useState(false);
const [weeklyMiles,setWeeklyMiles] = useState({start:””,end:””});
const [form,setForm] = useState({from:””,to:””,miles:””,rate:””,diesel:””,driver:DRIVERS[0]});
const [truckForm,setTruckForm] = useState({unit:””,make:””,model:””,year:””,plate:””,driver:DRIVERS[0],totalMiles:””,lastOilMiles:””});
const [maintForm,setMaintForm] = useState({type:””,date:””,miles:””,cost:””,notes:””});
const [pdfDriver,setPdfDriver] = useState(DRIVERS[0]);

const login = () => {
if(!pass){alert(“Ingresa tu contraseña”);return;}
if(role===“driver”){setUser({role:“driver”,name:selDriver,driver:selDriver});setShowMileEntry(true);}
else if(role===“manager”){setUser({role:“manager”,name:selManager,driver:null});setTab(“dashboard”);}
else if(role===“dispatch”){setUser({role:“dispatch”,name:selDispatcher,driver:null});setTab(“dashboard”);}
else{setUser({role,name:“JFX “+role,driver:null});setTab(“dashboard”);}
};

const myLoads = user?.role===“driver” ? loads.filter(l=>l.driver===user.driver) : loads;
const gross = myLoads.reduce((s,l)=>s+l.rate,0);
const totD = myLoads.reduce((s,l)=>s+l.diesel,0);
const d10=gross*0.10, d30=gross*0.30, ins=250, net=gross-d10-d30-ins-totD;
const canAdd = [“manager”,“dispatch”].includes(user?.role);
const canPDF = [“manager”,“billing”].includes(user?.role);
const canTrucks = user?.role===“manager”;

const navItems = [
{id:“dashboard”,icon:“📊”,label:“Dashboard”},
…(canAdd?[{id:“loads”,icon:“📦”,label:“Loads”}]:[]),
{id:“weekly”,icon:“📅”,label:“Weekly”},
…(canPDF?[{id:“reports”,icon:“📄”,label:“Reports”}]:[]),
{id:“drivers”,icon:“🚛”,label:“Drivers”},
…(canTrucks?[{id:“trucks”,icon:“🚚”,label:“Camiones”}]:[]),
];

// ── MILEAGE ENTRY SCREEN ──────────────────────────────────
if(showMileEntry && user?.role===“driver”) {
const myTruck = trucks.find(t=>t.driver===user.driver);
const now = new Date();
const timeStr = now.toLocaleTimeString(“en-US”,{hour:“2-digit”,minute:“2-digit”});
const dateStr = now.toLocaleDateString(“en-US”,{weekday:“long”,month:“short”,day:“numeric”});
return e(“div”,{className:“mile-screen”},
e(“div”,{className:“mile-card”},
e(“div”,{className:“mile-header”},
e(“div”,{style:{fontSize:42,marginBottom:8}},“🚚”),
e(“div”,{style:{fontFamily:”‘Bebas Neue’,sans-serif”,fontSize:24,letterSpacing:3,marginBottom:4}},
myTruck ? myTruck.unit+” — “+myTruck.make : “Mi Camión”),
e(“div”,{style:{fontSize:11,opacity:0.7}},“Bienvenido, “+user.name),
e(“div”,{style:{fontSize:11,opacity:0.5,marginTop:4}},dateStr+” · “+timeStr)
),
myTruck && e(“div”,{style:{display:“flex”,justifyContent:“space-around”,padding:“14px 20px”,borderBottom:“1px solid #f0f0f0”,background:”#fafbff”}},
e(“div”,{style:{textAlign:“center”}},e(“div”,{style:{fontSize:8,fontWeight:800,color:”#9ca3af”,letterSpacing:2,textTransform:“uppercase”}},“Unidad”),e(“div”,{style:{fontWeight:900,fontSize:16,color:”#1a2456”}},myTruck.unit)),
e(“div”,{style:{textAlign:“center”}},e(“div”,{style:{fontSize:8,fontWeight:800,color:”#9ca3af”,letterSpacing:2,textTransform:“uppercase”}},“Placa”),e(“div”,{style:{fontWeight:900,fontSize:16,color:”#1a2456”}},myTruck.plate)),
e(“div”,{style:{textAlign:“center”}},e(“div”,{style:{fontSize:8,fontWeight:800,color:”#9ca3af”,letterSpacing:2,textTransform:“uppercase”}},“Odómetro”),e(“div”,{style:{fontWeight:900,fontSize:16,color:”#1a2456”}},myTruck.totalMiles.toLocaleString()))
),
e(“div”,{style:{padding:“24px 20px”}},
e(“div”,{style:{textAlign:“center”,marginBottom:20}},
e(“div”,{style:{fontSize:13,fontWeight:800,color:”#111”,marginBottom:4}},“📍 Ingresa tus millas de entrada”),
e(“div”,{style:{fontSize:11,color:”#6b7280”}},“Obligatorio al iniciar cada jornada”)
),
e(“label”,null,“Millas actuales del odómetro”),
e(“input”,{type:“number”,value:entryMiles,onChange:ev=>setEntryMiles(ev.target.value),
placeholder:myTruck?myTruck.totalMiles.toString():“Ej: 124500”,
style:{fontSize:22,fontWeight:900,textAlign:“center”,padding:16,marginBottom:16}}),
e(“button”,{className:“btn btn-navy”,onClick:()=>{
if(!entryMiles){alert(“⚠️ Ingresa tus millas para continuar”);return;}
const miles=+entryMiles;
const rec={id:Date.now(),driver:user.name,truck:myTruck?.unit||”—”,plate:myTruck?.plate||”—”,miles,type:“entrada”,date:now.toLocaleDateString(“en-US”),time:timeStr,week:getWeek(),dayOfWeek:now.toLocaleDateString(“en-US”,{weekday:“long”})};
setMileageRecords(prev=>[…prev,rec]);
if(myTruck) setTrucks(prev=>prev.map(t=>t.id===myTruck.id?{…t,totalMiles:Math.max(t.totalMiles,miles)}:t));
setEntryMiles(””);setShowMileEntry(false);setTab(“dashboard”);
}},“✅ CONFIRMAR Y ENTRAR”)
)
)
);
}

// ── LOGIN ──────────────────────────────────────────────────
if(!user) {
const myTruck = trucks.find(t=>t.driver===selDriver);
const mso = myTruck ? myTruck.totalMiles-myTruck.lastOilMiles : 0;
const oilColor = mso>=OIL_INTERVAL?”#9b1b1b”:mso>=OIL_INTERVAL-500?”#d97706”:”#16a34a”;
return e(“div”,{className:“login-screen”},
e(“div”,{className:“login-box”},
e(“div”,{className:“logo-block”},
e(“img”,{src:LOGO_SVG,className:“logo-img”,alt:“JFX Carrier”}),
e(“div”,{className:“logo-tagline”},“Freight Transportation Management”)
),
e(“div”,{className:“login-card”},
e(“div”,{style:{fontSize:9,fontWeight:800,color:”#9ca3af”,letterSpacing:3,textTransform:“uppercase”,marginBottom:10}},“Selecciona tu rol”),
e(“div”,{className:“role-grid”},
[
{id:“manager”,label:“Manager”,icon:“👔”},
{id:“billing”,label:“Billing”,icon:“💳”},
{id:“dispatch”,label:“Dispatch”,icon:“📡”},
{id:“driver”,label:“Driver”,icon:“🚛”},
].map(r=>e(“button”,{key:r.id,className:“role-btn”+(role===r.id?” active”:””),onClick:()=>setRole(r.id)},
e(“span”,{className:“role-icon”},r.icon), r.label
))
),
role===“manager” && e(“div”,null,
e(“label”,null,“Selecciona tu nombre”),
e(“select”,{value:selManager,onChange:ev=>setSelManager(ev.target.value)},
MANAGERS.map(m=>e(“option”,{key:m},m)))
),
role===“dispatch” && e(“div”,null,
e(“label”,null,“Selecciona tu nombre”),
e(“select”,{value:selDispatcher,onChange:ev=>setSelDispatcher(ev.target.value)},
DISPATCHERS.map(d=>e(“option”,{key:d},d)))
),
role===“driver” && e(“div”,null,
e(“label”,null,“Selecciona tu nombre”),
e(“select”,{value:selDriver,onChange:ev=>setSelDriver(ev.target.value)},
DRIVERS.map(d=>e(“option”,{key:d},d))),
myTruck && e(“div”,{style:{background:“rgba(26,36,86,0.05)”,border:“1.5px solid rgba(26,36,86,0.15)”,borderRadius:10,padding:14,marginBottom:12}},
