```
          e("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:10}},
            e("span",{style:{fontSize:28}},"🚚"),
            e("div",null,
              e("div",{style:{fontWeight:900,fontSize:14,color:"#1a2456"}},myTruck.unit+" — "+myTruck.make+" "+myTruck.model),
              e("div",{style:{fontSize:11,color:"#6b7280",fontWeight:600}},myTruck.year+" · "+myTruck.plate)
            )
          ),
          e("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}},
            e("div",{style:{textAlign:"center",background:"#fff",borderRadius:8,padding:"10px 8px",border:"1px solid #e5e7eb"}},
              e("div",{style:{fontSize:8,fontWeight:800,color:"#9ca3af",letterSpacing:2,textTransform:"uppercase",marginBottom:4}},"Total Millas"),
              e("div",{style:{fontWeight:900,fontSize:18,color:"#1a2456"}},myTruck.totalMiles.toLocaleString())
            ),
            e("div",{style:{textAlign:"center",background:"#fff",borderRadius:8,padding:"10px 8px",border:"1px solid "+oilColor+"40"}},
              e("div",{style:{fontSize:8,fontWeight:800,color:"#9ca3af",letterSpacing:2,textTransform:"uppercase",marginBottom:4}},"Desde Aceite"),
              e("div",{style:{fontWeight:900,fontSize:18,color:oilColor}},mso.toLocaleString())
            )
          ),
          e("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:5}},
            e("span",{style:{fontSize:10,fontWeight:800,color:oilColor}},"🛢️ Cambio de aceite"),
            e("span",{style:{fontSize:10,fontWeight:700,color:oilColor}},mso>=OIL_INTERVAL?"⚠️ ¡VENCIDO!":"Faltan "+(OIL_INTERVAL-mso).toLocaleString()+" mi")
          ),
          e("div",{className:"oil-bar-wrap"},
            e("div",{className:"oil-bar-inner",style:{width:Math.min(mso/OIL_INTERVAL*100,100)+"%",background:oilColor}})
          )
        )
      ),
      e("label",null,"Contraseña"),
      e("input",{type:"password",value:pass,onChange:ev=>setPass(ev.target.value),placeholder:"Ingresa tu contraseña",onKeyDown:ev=>ev.key==="Enter"&&login()}),
      e("button",{className:"btn btn-navy",onClick:login},"ENTRAR")
    )
  )
);
```

}

// ── MAIN APP ───────────────────────────────────────────────
return e(“div”,{style:{display:“flex”,flexDirection:“column”,minHeight:“100vh”}},

```
// TOPBAR
e("div",{className:"topbar"},
  e("div",{className:"topbar-logo"},e("span",null,"JFX "),e("span",{style:{color:"#9b1b1b"}},"CARRIER")),
  e("div",{style:{display:"flex",alignItems:"center",gap:10}},
    e("div",{style:{textAlign:"right"}},
      e("div",{style:{fontSize:11,fontWeight:800,color:"#1a2456",lineHeight:1}},user.name),
      e("span",{className:"badge badge-"+user.role,style:{marginTop:3,display:"inline-block"}},user.role)
    ),
    e("button",{className:"icon-btn",onClick:()=>{setUser(null);setPass("");}},e("span",null,"⬅"))
  )
),

// CONTENT
e("div",{className:"main"},

  // ── DASHBOARD ──
  tab==="dashboard" && e("div",null,
    e("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}},
      e("div",{className:"week-badge",style:{marginBottom:0}},"📅 "+getWeek()),
      user?.driver && e("div",{style:{fontSize:11,fontWeight:700,color:"#1a2456",background:"rgba(26,36,86,0.08)",padding:"5px 10px",borderRadius:6,border:"1px solid rgba(26,36,86,0.15)"}},"👤 "+user.driver)
    ),
    e("div",{className:"stats-grid"},
      e("div",{className:"stat-card s-yellow"},e("div",{className:"stat-label"},"Gross Revenue"),e("div",{className:"stat-value sv-yellow"},fmt(gross))),
      e("div",{className:"stat-card s-green"},e("div",{className:"stat-label"},"Net Profit"),e("div",{className:"stat-value sv-green"},fmt(net))),
      e("div",{className:"stat-card s-navy"},e("div",{className:"stat-label"},"Total Loads"),e("div",{className:"stat-value sv-navy"},myLoads.length)),
      e("div",{className:"stat-card s-red"},e("div",{className:"stat-label"},"Diesel"),e("div",{className:"stat-value sv-red"},fmt(totD)))
    ),
    e("div",{className:"card"},
      e("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}},
        e("div",null,e("div",{className:"card-title"},"Weekly Breakdown"),e("div",{className:"card-sub"},"Mon → Mon · Auto-calculado"))
      ),
      e("div",{className:"sum-row"},e("span",{className:"sum-label"},"Gross Revenue"),e("span",{className:"sum-val sum-yellow"},fmt(gross))),
      e("div",{className:"sum-row"},e("span",{className:"sum-label"},"Dispatch (10%)"),e("span",{className:"sum-val sum-red"},"-"+fmt(d10))),
      e("div",{className:"sum-row"},e("span",{className:"sum-label"},"Driver Pay (30%)"),e("span",{className:"sum-val sum-red"},"-"+fmt(d30))),
      e("div",{className:"sum-row"},e("span",{className:"sum-label"},"Insurance"),e("span",{className:"sum-val sum-red"},"-$250.00")),
      e("div",{className:"sum-row"},e("span",{className:"sum-label"},"Diesel"),e("span",{className:"sum-val sum-red"},"-"+fmt(totD))),
      e("div",{className:"divider"}),
      e("div",{className:"sum-row"},e("span",{className:"sum-label sum-total-label"},"NET PROFIT"),e("span",{className:"sum-val sum-green"},fmt(net)))
    ),
    e("div",{className:"sec-title"},"Recent Loads"),
    myLoads.slice(-3).reverse().map(l=>e("div",{key:l.id,className:"load-item"},
      e("div",{className:"load-icon"},"🚛"),
      e("div",{className:"load-info"},e("div",{className:"load-route"},l.from+" → "+l.to),e("div",{className:"load-meta"},l.driver+" · "+l.date+(l.createdBy?" · ✏️ "+l.createdBy:""))),
      e("div",null,e("div",{className:"load-amount"},fmt(l.rate)),e("div",{className:"load-miles"},l.miles+" MI"))
    ))
  ),

  // ── LOADS ──
  tab==="loads" && canAdd && e("div",null,
    e("div",{className:"card"},
      e("div",{className:"card-title",style:{marginBottom:16}},"+ Add New Load"),
      e("div",{className:"form-row"},
        e("div",null,e("label",null,"From City"),e("input",{value:form.from,onChange:ev=>setForm({...form,from:ev.target.value}),placeholder:"Chicago, IL"})),
        e("div",null,e("label",null,"To City"),e("input",{value:form.to,onChange:ev=>setForm({...form,to:ev.target.value}),placeholder:"Dallas, TX"}))
      ),
      e("div",{className:"form-row"},
        e("div",null,e("label",null,"Miles"),e("input",{type:"number",value:form.miles,onChange:ev=>setForm({...form,miles:ev.target.value}),placeholder:"917"})),
        e("div",null,e("label",null,"Load Rate ($)"),e("input",{type:"number",value:form.rate,onChange:ev=>setForm({...form,rate:ev.target.value}),placeholder:"2400"}))
      ),
      e("div",{className:"form-row"},
        e("div",null,e("label",null,"Diesel ($)"),e("input",{type:"number",value:form.diesel,onChange:ev=>setForm({...form,diesel:ev.target.value}),placeholder:"310"})),
        e("div",null,e("label",null,"Driver"),e("select",{value:form.driver,onChange:ev=>setForm({...form,driver:ev.target.value})},DRIVERS.map(d=>e("option",{key:d},d))))
      ),
      e("button",{className:"btn btn-red",onClick:()=>{
        if(!form.from||!form.to||!form.miles||!form.rate){alert("Completa todos los campos");return;}
        setLoads([...loads,{id:Date.now(),from:form.from,to:form.to,miles:+form.miles,rate:+form.rate,diesel:+form.diesel||0,driver:form.driver,date:new Date().toISOString().split("T")[0],createdBy:user?.name||""}]);
        setForm({from:"",to:"",miles:"",rate:"",diesel:"",driver:DRIVERS[0]});
      }},"+ Add Load")
    ),
    e("div",{className:"sec-title"},"All Loads ("+loads.length+")"),
    loads.map(l=>e("div",{key:l.id,className:"load-item"},
      e("div",{className:"load-icon"},"📦"),
      e("div",{className:"load-info"},
        e("div",{className:"load-route"},l.from+" → "+l.to),
        e("div",{className:"load-meta"},e("span",{className:"chip chip-navy"},l.driver)," · "+l.miles+" mi · ⛽ "+fmt(l.diesel)),
        l.createdBy && e("div",{style:{fontSize:9,color:"#9ca3af",marginTop:2,fontWeight:600}},"✏️ "+l.createdBy)
      ),
      e("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}},
        e("div",{className:"load-amount"},fmt(l.rate)),
        e("button",{style:{padding:"6px 10px",background:"rgba(155,27,27,0.1)",border:"1px solid rgba(155,27,27,0.25)",borderRadius:5,color:"#b52020",cursor:"pointer"},onClick:()=>setLoads(loads.filter(x=>x.id!==l.id))},"✕")
      )
    ))
  ),

  // ── WEEKLY ──
  tab==="weekly" && e("div",null,
    e("div",{className:"week-badge"},"📅 "+getWeek()),
    e("div",{className:"card"},
      e("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}},
        e("div",null,e("div",{className:"card-title"},"Weekly Summary"),e("div",{className:"card-sub"},myLoads.length+" loads")),
        canPDF && e("div",{style:{display:"flex",gap:8}},
          e("button",{className:"btn btn-outline btn-sm",onClick:()=>{exportCSV([["JFX CARRIER - Weekly Report"],["Week:",getWeek()],[""],["FROM","TO","MILES","RATE","DIESEL","DRIVER","CREATED BY"],...myLoads.map(l=>[l.from,l.to,l.miles,l.rate,l.diesel,l.driver,l.createdBy||""])],  "JFX_Weekly")}},"📊 Excel"),
          e("button",{className:"btn btn-outline btn-sm",onClick:()=>printReport(myLoads,"weekly","")},"📄 PDF")
        )
      ),
      e("div",{className:"sum-row"},e("span",{className:"sum-label"},"Total Gross"),e("span",{className:"sum-val sum-yellow"},fmt(gross))),
      e("div",{className:"sum-row"},e("span",{className:"sum-label"},"− Dispatch (10%)"),e("span",{className:"sum-val sum-red"},"-"+fmt(d10))),
      e("div",{className:"sum-row"},e("span",{className:"sum-label"},"− Driver Pay (30%)"),e("span",{className:"sum-val sum-red"},"-"+fmt(d30))),
      e("div",{className:"sum-row"},e("span",{className:"sum-label"},"− Insurance"),e("span",{className:"sum-val sum-red"},"-$250.00")),
      e("div",{className:"sum-row"},e("span",{className:"sum-label"},"− Diesel"),e("span",{className:"sum-val sum-red"},"-"+fmt(totD))),
      e("div",{className:"divider"}),
      e("div",{className:"sum-row"},e("span",{className:"sum-label sum-total-label"},"NET UTILITY"),e("span",{className:"sum-val sum-green"},fmt(net)))
    ),
    e("div",{className:"sec-title"},"Load Detail"),
    myLoads.map(l=>e("div",{key:l.id,className:"load-item"},
      e("div",{className:"load-icon"},"🗺️"),
      e("div",{className:"load-info"},e("div",{className:"load-route"},l.from+" → "+l.to),e("div",{className:"load-meta"},l.miles+" mi · Diesel: "+fmt(l.diesel))),
      e("div",null,e("div",{className:"load-amount"},fmt(l.rate)),e("div",{className:"load-miles"},"DRV: "+fmt(l.rate*0.30)))
    ))
  ),

  // ── REPORTS ──
  tab==="reports" && canPDF && e("div",null,
    e("div",{className:"card"},
      e("div",{className:"card-title",style:{marginBottom:14}},"Generate Reports"),
      e("div",{style:{display:"flex",gap:8,marginBottom:10}},
        e("button",{className:"btn btn-navy",style:{flex:1},onClick:()=>printReport(loads,"weekly","")},"📄 PDF Semanal"),
        e("button",{className:"btn btn-outline",style:{flex:1},onClick:()=>{exportCSV([["JFX CARRIER - Weekly"],["Week:",getWeek()],[""],["FROM","TO","MILES","RATE","DIESEL","DRIVER"],...loads.map(l=>[l.from,l.to,l.miles,l.rate,l.diesel,l.driver])],"JFX_Weekly")}},"📊 Excel")
      ),
      e("div",{className:"divider"}),
      e("label",{style:{marginTop:10}},"Seleccionar Driver"),
      e("select",{value:pdfDriver,onChange:ev=>setPdfDriver(ev.target.value)},DRIVERS.map(d=>e("option",{key:d},d))),
      e("div",{style:{display:"flex",gap:8}},
        e("button",{className:"btn btn-red",style:{flex:1},onClick:()=>printReport(loads,"driver",pdfDriver)},"📄 PDF Driver"),
        e("button",{className:"btn btn-outline",style:{flex:1},onClick:()=>{const dl=loads.filter(l=>l.driver===pdfDriver);exportCSV([["JFX CARRIER - Driver: "+pdfDriver],["Week:",getWeek()],[""],["FROM","TO","MILES","RATE","EARNINGS 30%","DATE"],...dl.map(l=>[l.from,l.to,l.miles,l.rate,(l.rate*0.30).toFixed(2),l.date])],"JFX_Driver_"+pdfDriver.replace(/ /g,"_"))}},"📊 Excel")
      )
    ),
    e("div",{className:"sec-title"},"Driver Overview"),
    DRIVERS.map(d=>{const dl=loads.filter(l=>l.driver===d),dg=dl.reduce((s,l)=>s+l.rate,0);return e("div",{key:d,className:"load-item"},
      e("div",{className:"load-icon"},"👤"),
      e("div",{className:"load-info"},e("div",{className:"load-route"},d),e("div",{className:"load-meta"},dl.length+" loads · Gross: "+fmt(dg))),
      e("div",null,e("div",{className:"load-amount"},fmt(dg*0.30)),e("div",{className:"load-miles"},"30% PAY"))
    );})
  ),

  // ── DRIVERS ──
  tab==="drivers" && e("div",null,
    DRIVERS.map(d=>{
      const dl=loads.filter(l=>l.driver===d),dg=dl.reduce((s,l)=>s+l.rate,0),dm=dl.reduce((s,l)=>s+l.miles,0);
      return e("div",{key:d,className:"card"},
        e("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}},
          e("div",null,e("div",{className:"card-title"},d),e("div",{className:"card-sub"},dl.length+" loads · "+dm.toLocaleString()+" miles")),
          e("span",{className:"chip chip-red"},"Driver")
        ),
        e("div",{className:"stats-grid",style:{marginBottom:0}},
```
