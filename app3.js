```
          e("div",{className:"stat-card s-yellow"},e("div",{className:"stat-label"},"Gross"),e("div",{className:"stat-value sv-yellow",style:{fontSize:20}},fmt(dg))),
          e("div",{className:"stat-card s-green"},e("div",{className:"stat-label"},"Pay (30%)"),e("div",{className:"stat-value sv-green",style:{fontSize:20}},fmt(dg*0.30)))
        )
      );
    })
  ),

  // ── TRUCKS / CAMIONES ──
  tab==="trucks" && canTrucks && e("div",null,

    // Mileage Records (manager only)
    mileageRecords.length>0 && e("div",{className:"card",style:{marginBottom:14}},
      e("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}},
        e("div",null,e("div",{className:"card-title"},"📍 Registro de Millas"),e("div",{className:"card-sub"},"Solo visible para Manager")),
        e("span",{className:"chip chip-red"},"PRIVADO")
      ),
      e("div",{style:{fontSize:9,fontWeight:800,color:"#9ca3af",letterSpacing:2,textTransform:"uppercase",marginBottom:8}},"Esta Semana"),
      DRIVERS.map(d=>{
        const recs=mileageRecords.filter(r=>r.driver===d&&r.week===getWeek());
        if(!recs.length) return e("div",{key:d,style:{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f5f5f5",fontSize:11}},
          e("span",{style:{fontWeight:700}},d),e("span",{style:{color:"#d97706",fontWeight:700}},"⏳ Sin registro"));
        const first=recs[0],last=recs[recs.length-1];
        return e("div",{key:d,style:{padding:"8px 0",borderBottom:"1px solid #f5f5f5"}},
          e("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:3}},
            e("span",{style:{fontWeight:800,fontSize:12}},d),
            e("span",{style:{fontWeight:800,fontSize:12,color:"#16a34a"}},"+"+(last.miles-first.miles).toLocaleString()+" mi")
          ),
          e("div",{style:{fontSize:10,color:"#6b7280",fontWeight:600}},
            "🟢 "+first.miles.toLocaleString()+" · "+first.dayOfWeek+" · 🕐 "+first.time)
        );
      }),
      e("div",{style:{marginTop:10,fontSize:9,fontWeight:800,color:"#9ca3af",letterSpacing:2,textTransform:"uppercase",marginBottom:8}},"Historial Completo"),
      e("div",{style:{maxHeight:180,overflowY:"auto"}},
        [...mileageRecords].reverse().map(r=>e("div",{key:r.id,style:{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f5f5f5",fontSize:11}},
          e("div",null,e("div",{style:{fontWeight:800}},r.driver),e("div",{style:{fontSize:10,color:"#6b7280"}},r.truck)),
          e("div",{style:{fontWeight:800,color:"#1a2456"}},r.miles.toLocaleString()+" mi"),
          e("div",{style:{textAlign:"right"}},e("div",{style:{fontSize:10}},r.date),e("div",{style:{fontSize:10,color:"#9ca3af"}},r.time))
        ))
      ),
      e("button",{className:"btn btn-navy",style:{marginTop:12},onClick:()=>{
        exportCSV([["JFX CARRIER - REGISTRO DE MILLAS"],["Driver","Unidad","Placa","Millas","Día","Fecha","Hora","Semana"],
          ...mileageRecords.map(r=>[r.driver,r.truck,r.plate,r.miles,r.dayOfWeek||"",r.date,r.time,r.week])],"JFX_Registro_Millas");
      }},"📊 Exportar a Excel")
    ),

    // Oil alerts
    trucks.filter(t=>(t.totalMiles-t.lastOilMiles)>=OIL_INTERVAL-500).length>0 && e("div",{className:"alert-oil"},
      e("span",{style:{fontSize:28}},"⚠️"),
      e("div",null,
        e("div",{style:{fontWeight:800,fontSize:13,color:"#92400e",marginBottom:4}},"ALERTA CAMBIO DE ACEITE"),
        trucks.filter(t=>(t.totalMiles-t.lastOilMiles)>=OIL_INTERVAL-500).map(t=>{
          const ms=t.totalMiles-t.lastOilMiles,ov=ms>=OIL_INTERVAL;
          return e("div",{key:t.id,style:{fontSize:12,color:ov?"#9b1b1b":"#92400e",fontWeight:600,marginBottom:2}},
            (ov?"🔴":"🟡")+" "+t.unit+" — "+ms.toLocaleString()+" mi desde último cambio",
            ov && e("span",{style:{marginLeft:6,background:"#9b1b1b",color:"#fff",padding:"1px 6px",borderRadius:4,fontSize:10,fontWeight:800}},"VENCIDO")
          );
        })
      )
    ),

    e("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}},
      e("div",{className:"sec-title",style:{marginBottom:0,flex:1}},"Flota ("+trucks.length+")"),
      e("button",{className:"btn btn-red btn-sm",onClick:()=>setShowAddTruck(true)},"+ Agregar")
    ),

    trucks.map(t=>{
      const ms=t.totalMiles-t.lastOilMiles,pct=Math.min(ms/OIL_INTERVAL*100,100);
      const oc=ms>=OIL_INTERVAL?"#9b1b1b":ms>=OIL_INTERVAL-500?"#d97706":"#16a34a";
      return e("div",{key:t.id,className:"card"},
        e("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}},
          e("div",{style:{display:"flex",alignItems:"center",gap:10}},
            e("span",{style:{fontSize:28}},"🚚"),
            e("div",null,
              e("div",{style:{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:2}},t.unit+" — "+t.make+" "+t.model),
              e("div",{style:{fontSize:11,color:"#6b7280",fontWeight:600}},t.year+" · "+t.plate+" · "+t.driver)
            )
          ),
          e("button",{className:"btn btn-outline btn-sm",onClick:()=>setShowMaint(t.id)},"📋 Mant.")
        ),
        e("div",{className:"stats-grid",style:{marginBottom:12}},
          e("div",{className:"stat-card s-navy"},e("div",{className:"stat-label"},"Total Millas"),e("div",{className:"stat-value sv-navy",style:{fontSize:20}},t.totalMiles.toLocaleString())),
          e("div",{className:"stat-card",style:{borderBottom:"3px solid "+oc}},e("div",{className:"stat-label"},"Desde Aceite"),e("div",{className:"stat-value",style:{fontSize:20,color:oc}},ms.toLocaleString()))
        ),
        e("div",{style:{background:"rgba(0,0,0,0.03)",border:"1px solid "+oc+"30",borderRadius:8,padding:"10px 12px"}},
          e("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:6}},
            e("span",{style:{fontSize:11,fontWeight:800,color:oc}},"🛢️ CAMBIO DE ACEITE"),
            e("span",{style:{fontSize:11,fontWeight:700,color:oc}},ms>=OIL_INTERVAL?"¡VENCIDO!":"Faltan "+(OIL_INTERVAL-ms).toLocaleString()+" mi")
          ),
          e("div",{className:"oil-bar-wrap"},e("div",{className:"oil-bar-inner",style:{width:pct+"%",background:oc}}))
        ),
        e("div",{style:{display:"flex",gap:8,marginTop:10}},
          e("input",{type:"number",placeholder:"Actualizar millas",style:{flex:1,marginBottom:0},
            onBlur:ev=>{const v=parseInt(ev.target.value);if(v&&v>t.totalMiles){setTrucks(trucks.map(x=>x.id===t.id?{...x,totalMiles:v}:x));ev.target.value="";}}
          }),
          e("button",{className:"btn btn-navy btn-sm",style:{marginTop:0,whiteSpace:"nowrap"},onClick:()=>{
            setTrucks(trucks.map(x=>x.id===t.id?{...x,lastOilMiles:x.totalMiles,maintenances:[...x.maintenances,{id:Date.now(),type:"Cambio de Aceite",date:new Date().toISOString().split("T")[0],miles:x.totalMiles,cost:0,notes:"Registrado"}]}:x));
          }},"✅ Aceite OK")
        )
      );
    }),

    // Add Truck Modal
    showAddTruck && e("div",{className:"modal-overlay",onClick:ev=>ev.target===ev.currentTarget&&setShowAddTruck(false)},
      e("div",{className:"modal-sheet"},
        e("div",{className:"modal-handle"}),
        e("div",{className:"card-title",style:{marginBottom:16}},"🚚 Agregar Unidad"),
        e("div",{className:"form-row"},
          e("div",null,e("label",null,"Unidad #"),e("input",{value:truckForm.unit,onChange:ev=>setTruckForm({...truckForm,unit:ev.target.value}),placeholder:"T-105"})),
          e("div",null,e("label",null,"Placa"),e("input",{value:truckForm.plate,onChange:ev=>setTruckForm({...truckForm,plate:ev.target.value}),placeholder:"JFX-105"}))
        ),
        e("div",{className:"form-row"},
          e("div",null,e("label",null,"Marca"),e("input",{value:truckForm.make,onChange:ev=>setTruckForm({...truckForm,make:ev.target.value}),placeholder:"Freightliner"})),
          e("div",null,e("label",null,"Modelo"),e("input",{value:truckForm.model,onChange:ev=>setTruckForm({...truckForm,model:ev.target.value}),placeholder:"Cascadia"}))
        ),
        e("div",{className:"form-row"},
          e("div",null,e("label",null,"Año"),e("input",{type:"number",value:truckForm.year,onChange:ev=>setTruckForm({...truckForm,year:ev.target.value}),placeholder:"2023"})),
          e("div",null,e("label",null,"Driver"),e("select",{value:truckForm.driver,onChange:ev=>setTruckForm({...truckForm,driver:ev.target.value})},DRIVERS.map(d=>e("option",{key:d},d))))
        ),
        e("div",{className:"form-row"},
          e("div",null,e("label",null,"Millas Actuales"),e("input",{type:"number",value:truckForm.totalMiles,onChange:ev=>setTruckForm({...truckForm,totalMiles:ev.target.value}),placeholder:"50000"})),
          e("div",null,e("label",null,"Millas Ultimo Aceite"),e("input",{type:"number",value:truckForm.lastOilMiles,onChange:ev=>setTruckForm({...truckForm,lastOilMiles:ev.target.value}),placeholder:"50000"}))
        ),
        e("button",{className:"btn btn-red",onClick:()=>{
          if(!truckForm.unit||!truckForm.make){alert("Completa al menos unidad y marca");return;}
          setTrucks([...trucks,{id:Date.now(),unit:truckForm.unit,make:truckForm.make,model:truckForm.model,year:truckForm.year,plate:truckForm.plate,driver:truckForm.driver,totalMiles:+truckForm.totalMiles||0,lastOilMiles:+truckForm.lastOilMiles||0,maintenances:[],weeklyLogs:[]}]);
          setTruckForm({unit:"",make:"",model:"",year:"",plate:"",driver:DRIVERS[0],totalMiles:"",lastOilMiles:""});
          setShowAddTruck(false);
        }},"+ Agregar Camión"),
        e("button",{className:"btn btn-outline",style:{width:"100%",marginTop:8},onClick:()=>setShowAddTruck(false)},"Cancelar")
      )
    ),

    // Maintenance Modal
    showMaint && (()=>{
      const truck=trucks.find(t=>t.id===showMaint);
      if(!truck) return null;
      return e("div",{className:"modal-overlay",onClick:ev=>ev.target===ev.currentTarget&&setShowMaint(null)},
        e("div",{className:"modal-sheet"},
          e("div",{className:"modal-handle"}),
          e("div",{className:"card-title",style:{marginBottom:14}},"🔧 "+truck.unit+" — Mantenimientos"),
          e("div",{style:{background:"#f4f5f7",borderRadius:10,padding:14,marginBottom:14}},
            e("div",{style:{fontSize:10,fontWeight:800,color:"#1a2456",letterSpacing:2,textTransform:"uppercase",marginBottom:10}},"+ Registrar"),
            e("div",{className:"form-row"},
              e("div",null,e("label",null,"Tipo"),
                e("select",{value:maintForm.type,onChange:ev=>setMaintForm({...maintForm,type:ev.target.value})},
                  ["","Cambio de Aceite","Cambio de Filtros","Frenos","Neumáticos","Revisión General","Transmisión","Motor","Suspensión","Eléctrico","Otro"].map(o=>e("option",{key:o},o))
                )
              ),
              e("div",null,e("label",null,"Fecha"),e("input",{type:"date",value:maintForm.date,onChange:ev=>setMaintForm({...maintForm,date:ev.target.value})}))
            ),
            e("div",{className:"form-row"},
              e("div",null,e("label",null,"Millas"),e("input",{type:"number",value:maintForm.miles,onChange:ev=>setMaintForm({...maintForm,miles:ev.target.value}),placeholder:truck.totalMiles.toString()})),
              e("div",null,e("label",null,"Costo ($)"),e("input",{type:"number",value:maintForm.cost,onChange:ev=>setMaintForm({...maintForm,cost:ev.target.value}),placeholder:"0"}))
            ),
            e("label",null,"Notas"),
            e("input",{value:maintForm.notes,onChange:ev=>setMaintForm({...maintForm,notes:ev.target.value}),placeholder:"Descripción del trabajo"}),
            e("button",{className:"btn btn-red",onClick:()=>{
              if(!maintForm.type||!maintForm.date){alert("Completa tipo y fecha");return;}
              const nm={id:Date.now(),type:maintForm.type,date:maintForm.date,miles:+maintForm.miles||truck.totalMiles,cost:+maintForm.cost||0,notes:maintForm.notes};
              const ut={...truck,maintenances:[...truck.maintenances,nm]};
              if(maintForm.type==="Cambio de Aceite") ut.lastOilMiles=+maintForm.miles||truck.totalMiles;
              setTrucks(trucks.map(x=>x.id===showMaint?ut:x));
              setMaintForm({type:"",date:"",miles:"",cost:"",notes:""});
            }},"+ Registrar")
          ),
          e("div",{style:{fontSize:9,fontWeight:800,color:"#9ca3af",letterSpacing:2,textTransform:"uppercase",marginBottom:8}},"Historial ("+truck.maintenances.length+")"),
          truck.maintenances.length===0 && e("div",{style:{textAlign:"center",padding:"20px 0",color:"#9ca3af",fontSize:13}},"Sin mantenimientos registrados"),
          [...truck.maintenances].reverse().map(m=>e("div",{key:m.id,style:{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:8,padding:"12px 14px",marginBottom:8}},
            e("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:4}},
              e("span",{style:{fontWeight:800,fontSize:13}},m.type),
              e("span",{style:{fontWeight:700,fontSize:13,color:"#16a34a"}},m.cost?"$"+m.cost.toLocaleString():"-")
            ),
            e("div",{style:{fontSize:11,color:"#6b7280",fontWeight:600}},"📅 "+m.date+" · "+m.miles.toLocaleString()+" mi"),
            m.notes && e("div",{style:{fontSize:11,color:"#374151",marginTop:4,fontStyle:"italic"}},'"'+m.notes+'"')
          )),
          e("button",{className:"btn btn-outline",style:{width:"100%",marginTop:8},onClick:()=>setShowMaint(null)},"Cerrar")
        )
      );
    })()
  )

), // end main

// BOTTOM NAV
e("div",{className:"bottom-nav"},
  navItems.map(n=>e("button",{key:n.id,className:"nav-item"+(tab===n.id?" active":""),onClick:()=>setTab(n.id)},
    e("span",{className:"ni"},n.icon), n.label
  ))
)
```

); // end app
}

ReactDOM.createRoot(document.getElementById(‘root’)).render(React.createElement(App));
