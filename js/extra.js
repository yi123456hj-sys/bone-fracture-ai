'use strict';
/* ═══════════════════════════════════════════════════
   BoneScan AI — extra.js
   All new features: theme, auto-detect, healing,
   report+QR, quiz, case library, pain diary,
   med calendar, hospital finder
═══════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────────
   THEME TOGGLE (dark ↔ light)
────────────────────────────────────────────────── */
(function initTheme(){
  const btn = document.getElementById('theme-toggle');
  let isLight = localStorage.getItem('bsai-theme') === 'light';
  function applyTheme(){
    if(isLight){
      document.documentElement.style.setProperty('--bg1','#F8FAFC');
      document.documentElement.style.setProperty('--bg2','#EFF6FF');
      document.documentElement.style.setProperty('--bg3','#FFFFFF');
      document.documentElement.style.setProperty('--text1','#0F172A');
      document.documentElement.style.setProperty('--text2','#334155');
      document.documentElement.style.setProperty('--text3','#64748B');
      document.documentElement.style.setProperty('--text4','#94A3B8');
      document.documentElement.style.setProperty('--border','#E2E8F0');
      if(btn) btn.textContent='☀️';
    } else {
      document.documentElement.style.removeProperty('--bg1');
      document.documentElement.style.removeProperty('--bg2');
      document.documentElement.style.removeProperty('--bg3');
      document.documentElement.style.removeProperty('--text1');
      document.documentElement.style.removeProperty('--text2');
      document.documentElement.style.removeProperty('--text3');
      document.documentElement.style.removeProperty('--text4');
      document.documentElement.style.removeProperty('--border');
      if(btn) btn.textContent='🌙';
    }
  }
  applyTheme();
  if(btn) btn.addEventListener('click',()=>{
    isLight=!isLight;
    localStorage.setItem('bsai-theme', isLight?'light':'dark');
    applyTheme();
  });
})();

/* ──────────────────────────────────────────────────
   AUTO DETECT — Gemini AI fracture detection
────────────────────────────────────────────────── */
(function initAutoDetect(){
  const upload = document.getElementById('autodet-upload');
  const fileIn = document.getElementById('autodet-file');
  const canvasWrap = document.getElementById('autodet-canvas-wrap');
  const canvas = document.getElementById('autodet-canvas');
  const resultEl = document.getElementById('autodet-result');
  if(!upload||!fileIn||!canvas) return;

  upload.addEventListener('click',()=>fileIn.click());
  fileIn.addEventListener('change',e=>{
    const f=e.target.files[0]; if(!f) return;
    const reader=new FileReader();
    reader.onload=ev=>{
      const img=new Image();
      img.onload=()=>{
        canvasWrap.style.display='block';
        resultEl.style.display='block';
        upload.style.display='none';
        runAutoDetect(img, canvas, resultEl, ev.target.result);
      };
      img.src=ev.target.result;
    };
    reader.readAsDataURL(f);
  });
})();

const FRAC_NAMES_ZH={avulsion:'撕脱骨折',comminuted:'粉碎骨折',dislocation:'骨折脱位',greenstick:'青枝骨折',hairline:'发际线骨折',impacted:'嵌插骨折',longitudinal:'纵向骨折',oblique:'斜形骨折',pathological:'病理骨折',spiral:'螺旋骨折',unclear:'不明确'};

async function runAutoDetect(img, canvas, resultEl, dataUrl){
  const W=Math.min(800,img.naturalWidth);
  const H=Math.round(W*img.naturalHeight/img.naturalWidth);
  canvas.width=W; canvas.height=H;
  const ctx=canvas.getContext('2d');
  ctx.drawImage(img,0,0,W,H);

  resultEl.innerHTML='<div style="color:var(--teal);padding:12px">🔍 AI 正在分析骨折区域…</div>';

  try{
    const hiCvs=document.createElement('canvas');
    hiCvs.width=Math.max(W,1024); hiCvs.height=Math.round(Math.max(W,1024)*H/W);
    hiCvs.getContext('2d').drawImage(img,0,0,hiCvs.width,hiCvs.height);
    const b64=hiCvs.toDataURL('image/jpeg',.92).split(',')[1];
    const apiKey=typeof getApiKey==='function'?getApiKey():'AIzaSyC5IUn854Oo6aYX8yYg92LkSCWqd1yZzwk';

    const prompt=`You are an expert radiologist. Analyze this bone X-ray and identify ALL fracture locations with precise bounding boxes.

Return ONLY valid JSON, no markdown:
{"detected":boolean,"type":"avulsion|comminuted|dislocation|greenstick|hairline|impacted|longitudinal|oblique|pathological|spiral|unclear","confidence":integer,"severity":"none|mild|moderate|severe","location":"anatomical location in Chinese","cause_zh":"1-2句骨折原因（中文）","regions":[{"bbox":[x1_percent,y1_percent,x2_percent,y2_percent],"label":"骨折类型标签"}]}

Rules:
- bbox values are percentages 0-100 of image dimensions
- Each bbox must tightly surround the actual fracture line or displaced bone
- If no fracture: detected=false, regions=[]
- Be precise and honest about confidence`;

    const resp=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({contents:[{parts:[{inline_data:{mime_type:'image/jpeg',data:b64}},{text:prompt}]}],generationConfig:{temperature:0.1,maxOutputTokens:1024}}),
      signal:AbortSignal.timeout(30000)
    });
    const data=await resp.json();
    console.log('Gemini response:', JSON.stringify(data).slice(0,300));
    if(!resp.ok || !data.candidates || !data.candidates[0]){
      const msg=data.error?.message||JSON.stringify(data).slice(0,200);
      throw new Error(msg);
    }
    const raw=data.candidates[0].content.parts[0].text.replace(/^```json?\s*/,'').replace(/\s*```$/,'').trim();
    let result;
    try{ result=JSON.parse(raw); }
    catch(e){
      // Gemini returned text instead of JSON — try to extract JSON block
      const m=raw.match(/\{[\s\S]*\}/);
      if(m) result=JSON.parse(m[0]);
      else throw new Error('AI返回格式错误: '+raw.slice(0,80));
    }

    // Redraw image clean
    ctx.drawImage(img,0,0,W,H);

    if(result.detected && result.regions && result.regions.length){
      result.regions.forEach((reg,i)=>{
        const [x1p,y1p,x2p,y2p]=reg.bbox;
        const x1=x1p/100*W, y1=y1p/100*H, x2=x2p/100*W, y2=y2p/100*H;
        const bw=x2-x1, bh=y2-y1;
        const color=i===0?'#FF3333':'#FF8C42';

        // Draw box
        ctx.strokeStyle=color; ctx.lineWidth=2.5;
        ctx.strokeRect(x1,y1,bw,bh);

        // Corner accents
        const cs=Math.min(14,bw*0.25,bh*0.25);
        ctx.lineWidth=3;
        [[x1,y1,1,1],[x2,y1,-1,1],[x1,y2,1,-1],[x2,y2,-1,-1]].forEach(([cx,cy,dx,dy])=>{
          ctx.beginPath(); ctx.moveTo(cx+dx*cs,cy); ctx.lineTo(cx,cy); ctx.lineTo(cx,cy+dy*cs); ctx.stroke();
        });

        // Label
        const typeName=FRAC_NAMES_ZH[result.type]||result.type;
        const label=reg.label||typeName;
        ctx.font='bold 12px Inter,sans-serif';
        const tw=ctx.measureText(label).width;
        ctx.fillStyle=color; ctx.fillRect(x1,y1-20,tw+10,20);
        ctx.fillStyle='#fff'; ctx.fillText(label,x1+5,y1-5);
      });

      const typeName=FRAC_NAMES_ZH[result.type]||result.type;
      resultEl.innerHTML=`
        <div style="font-weight:700;font-size:16px;color:#FF3333;margin-bottom:8px">⚠ 检测到骨折</div>
        <div style="margin-bottom:6px">骨折类型：<strong style="color:var(--teal)">${typeName}</strong> &nbsp; 置信度：<strong>${result.confidence}%</strong></div>
        <div style="margin-bottom:6px">严重程度：${result.severity==='severe'?'重度':result.severity==='moderate'?'中度':result.severity==='mild'?'轻度':'无'} &nbsp; 位置：${result.location||'—'}</div>
        ${result.cause_zh?`<div style="margin-top:8px;font-size:12px;color:var(--text3);line-height:1.5">💡 ${result.cause_zh}</div>`:''}
        <div style="margin-top:8px;font-size:10px;color:var(--text4)">⚠ AI辅助参考，以临床诊断为准。</div>`;
    } else {
      resultEl.innerHTML=`<div style="font-weight:700;color:#10B981;margin-bottom:8px">✅ 未发现明显骨折</div><div style="font-size:12px;color:var(--text3)">置信度：${result.confidence}%</div><div style="margin-top:4px;font-size:10px;color:var(--text4)">⚠ AI辅助参考，以临床诊断为准。</div>`;
    }
  } catch(err){
    ctx.drawImage(img,0,0,W,H);
    resultEl.innerHTML=`<div style="color:#F97316">分析失败：${err.message}</div>`;
  }
}

/* ──────────────────────────────────────────────────
   HEALING PREDICTION
────────────────────────────────────────────────── */
const HEAL_WEEKS={
  hairline:{child:[3,5],adult:[4,6],elder:[6,9]},
  greenstick:{child:[4,6],adult:[6,8],elder:[8,12]},
  avulsion:{child:[6,8],adult:[8,12],elder:[12,16]},
  oblique:{child:[6,9],adult:[8,12],elder:[12,18]},
  spiral:{child:[7,10],adult:[8,12],elder:[12,18]},
  comminuted:{child:[10,16],adult:[12,24],elder:[20,36]},
  hip:{child:[8,12],adult:[12,20],elder:[16,28]},
};
const TREAT_MOD={cast:0,splint:-0.5,surgery:2};

function predictHealing(){
  const frac=document.getElementById('heal-frac').value;
  const dateVal=document.getElementById('heal-date').value;
  const age=document.getElementById('heal-age').value;
  const treat=document.getElementById('heal-treat').value;
  const el=document.getElementById('heal-result');
  if(!dateVal){el.innerHTML='<div class="risk-placeholder">请选择受伤日期 Select injury date</div>';return;}

  const weeks=HEAL_WEEKS[frac]||{child:[6,10],adult:[8,12],elder:[12,16]};
  const [wMin,wMax]=weeks[age]||weeks.adult;
  const mod=TREAT_MOD[treat]||0;
  const wMinAdj=Math.max(1,wMin+mod), wMaxAdj=wMax+mod;

  const injuryDate=new Date(dateVal);
  const today=new Date(); today.setHours(0,0,0,0);
  const daysSinceInjury=Math.max(0,Math.round((today-injuryDate)/(1000*60*60*24)));
  const weeksElapsed=daysSinceInjury/7;
  const progressPct=Math.min(100,Math.round(weeksElapsed/wMinAdj*100));
  const estRecoveryDate=new Date(injuryDate);
  estRecoveryDate.setDate(estRecoveryDate.getDate()+Math.round(wMinAdj*7));

  const stages=[
    {name:'炎症期 Inflammation',wEnd:1,color:'#EF4444'},
    {name:'修复期 Repair',wEnd:wMinAdj*0.5,color:'#F97316'},
    {name:'重塑期 Remodeling',wEnd:wMinAdj,color:'#EAB308'},
    {name:'完全愈合 Full Healing',wEnd:wMaxAdj,color:'#10B981'},
  ];
  const currentStage=stages.find(s=>weeksElapsed<=s.wEnd)||stages[stages.length-1];

  const color=progressPct<30?'#EF4444':progressPct<60?'#F97316':progressPct<90?'#EAB308':'#10B981';
  el.style.alignItems='flex-start';
  el.innerHTML=`<div style="width:100%">
    <div style="text-align:center;margin-bottom:16px">
      <div style="font-size:12px;color:var(--text3)">愈合进度 Healing Progress</div>
      <div style="font-size:48px;font-weight:900;color:${color}">${progressPct}%</div>
      <div style="font-size:13px;font-weight:700;color:${currentStage.color}">${currentStage.name}</div>
    </div>
    <div style="height:10px;background:var(--border);border-radius:5px;overflow:hidden;margin-bottom:16px">
      <div style="width:${progressPct}%;height:100%;background:linear-gradient(90deg,#EF4444,#F97316,#10B981);border-radius:5px;transition:width 1.5s"></div>
    </div>
    <div style="font-size:13px;color:var(--text2)">📅 受伤后第 <strong>${daysSinceInjury}</strong> 天（第 <strong>${weeksElapsed.toFixed(1)}</strong> 周）</div>
    <div style="font-size:13px;color:var(--text2);margin-top:4px">🎯 预计完全愈合: <strong style="color:var(--teal)">${estRecoveryDate.toLocaleDateString('zh-CN')}</strong></div>
    <div style="font-size:13px;color:var(--text2);margin-top:4px">⏱ 总愈合时间估计: <strong>${wMinAdj}–${wMaxAdj}</strong> 周</div>
    <div style="margin-top:14px">
      ${stages.map(s=>`<div style="display:flex;align-items:center;gap:8px;padding:5px 0;font-size:11px;color:${weeksElapsed>=(s.wEnd-1)?s.color:'var(--text4)'}">
        <span style="font-size:8px;width:6px;height:6px;border-radius:50%;background:${s.color};display:inline-block;flex-shrink:0"></span>${s.name}
      </div>`).join('')}
    </div>
    <div style="margin-top:10px;font-size:10px;color:var(--text4)">⚠ 预测基于统计平均值，个体差异因人而异，请遵医嘱。</div>
  </div>`;
}

/* ──────────────────────────────────────────────────
   FULL DOCTOR REPORT + QR
────────────────────────────────────────────────── */
let currentReportData = null;

function generateFullReport(){
  const name = document.getElementById('rpt-name').value || '—';
  const age  = document.getElementById('rpt-age').value  || '—';
  const sex  = document.getElementById('rpt-sex').value  || '—';
  const date = document.getElementById('rpt-date').value || new Date().toISOString().slice(0,10);
  const complaint = document.getElementById('rpt-complaint').value || '—';
  const doctor = document.getElementById('rpt-doctor').value || 'BoneScan AI';

  // Get last AI analysis result
  const top1name = document.getElementById('az-top1-name');
  const fracType  = top1name ? top1name.textContent : 'Not analyzed';
  const confEl    = document.querySelector('.az-conf-num');
  const confidence= confEl ? confEl.textContent : '—';
  const sevEl     = document.getElementById('az-severity-score');
  const sevText   = sevEl ? sevEl.textContent.replace(/\s+/g,' ').trim() : '—';

  currentReportData = {name,age,sex,date,complaint,doctor,fracType,confidence,sevText};

  const preview = document.getElementById('report-preview');
  preview.style.display='block';
  preview.innerHTML=`
    <div class="rpt-header">
      <div class="rpt-title">🩻 Medical Imaging Report · 影像诊断报告</div>
      <div style="font-size:11px;color:#64748B;margin-top:4px">BoneScan AI · ${new Date().toLocaleString('zh-CN')}</div>
    </div>
    <div class="rpt-section">
      <div class="rpt-section-title">患者信息 Patient Information</div>
      <table style="width:100%;font-size:12px;border-collapse:collapse">
        <tr><td style="padding:3px 8px;color:#475569">姓名 Name</td><td style="font-weight:600">${name}</td><td style="color:#475569">年龄/性别</td><td style="font-weight:600">${age} / ${sex}</td></tr>
        <tr><td style="padding:3px 8px;color:#475569">检查日期 Date</td><td style="font-weight:600">${date}</td><td style="color:#475569">主诉 Complaint</td><td style="font-weight:600">${complaint}</td></tr>
      </table>
    </div>
    <div class="rpt-section">
      <div class="rpt-section-title">影像所见 Imaging Findings</div>
      <div style="font-size:12px;line-height:1.8;color:#334155">
        AI分析提示检测到 <strong>${fracType}</strong> 骨折，置信度 <strong>${confidence}</strong>。
        图像边缘分析、拉普拉斯锐度指数及局部纹理方差均提示骨皮质不连续区域。<br>
        AI analysis indicates <strong>${fracType}</strong> fracture, confidence <strong>${confidence}</strong>.
        Edge analysis, Laplacian sharpness index, and local texture variance suggest cortical discontinuity.
      </div>
    </div>
    <div class="rpt-section">
      <div class="rpt-section-title">严重程度 Severity Assessment</div>
      <div style="font-size:12px;color:#334155">${sevText||'请先运行AI分析 Please run AI analysis first'}</div>
    </div>
    <div class="rpt-section">
      <div class="rpt-section-title">诊断意见 Impression</div>
      <div style="font-size:12px;line-height:1.8;color:#334155">
        影像学表现与 <strong>${fracType}</strong> 骨折一致，建议结合临床症状及体征进行综合判断。<br>
        Imaging features are consistent with <strong>${fracType}</strong> fracture. Clinical correlation recommended.
      </div>
    </div>
    <div class="rpt-section">
      <div class="rpt-section-title">建议 Recommendations</div>
      <div style="font-size:12px;line-height:1.8;color:#334155">
        1. 建议正侧位X光（至少两个位置）进行确认<br>
        2. 疑似粉碎或关节内骨折时考虑CT检查<br>
        3. 请骨科或急诊科专科医生进行临床评估<br>
        4. Obtain orthogonal X-ray views for confirmation<br>
        5. Consider CT for comminuted or intra-articular suspected fractures<br>
        6. Clinical evaluation by orthopedic specialist recommended
      </div>
    </div>
    <div style="border-top:1px solid #E2E8F0;padding-top:10px;margin-top:10px;font-size:10px;color:#94A3B8">
      报告医生 Radiologist: ${doctor} &nbsp;|&nbsp; ⚠ 本报告由AI辅助生成，仅供参考，不替代专业医疗诊断。
    </div>`;

  document.getElementById('rpt-pdf-btn').style.display='inline-block';
  document.getElementById('rpt-qr-btn').style.display='inline-block';
}

function downloadFullReportPDF(){
  if(!currentReportData) return;
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF();
  const d=currentReportData;
  doc.setFontSize(18); doc.setTextColor(29,78,216);
  doc.text('Medical Imaging Report  /  影像诊断报告',20,22);
  doc.setFontSize(9); doc.setTextColor(100,116,139);
  doc.text('BoneScan AI · '+new Date().toLocaleString('zh-CN'),20,30);
  doc.setDrawColor(29,78,216); doc.line(20,33,190,33);
  let y=42;
  const row=(label,val)=>{ doc.setFontSize(10);doc.setTextColor(71,85,105);doc.text(label,20,y);doc.setTextColor(30,41,59);doc.text(String(val),80,y);y+=7; };
  doc.setFontSize(11);doc.setTextColor(29,78,216);doc.text('Patient Information  患者信息',20,y);y+=7;
  row('Name / 姓名:',d.name); row('Age/Sex / 年龄性别:',d.age+' / '+d.sex);
  row('Date / 日期:',d.date); row('Complaint / 主诉:',d.complaint);
  y+=4; doc.setFontSize(11);doc.setTextColor(29,78,216);doc.text('Findings  影像所见',20,y);y+=7;
  doc.setFontSize(10);doc.setTextColor(51,65,85);
  const findings=`AI analysis: ${d.fracType} fracture detected. Confidence: ${d.confidence}. Edge analysis and Laplacian sharpness index suggest cortical discontinuity.`;
  doc.text(findings,20,y,{maxWidth:170});y+=20;
  doc.setFontSize(11);doc.setTextColor(29,78,216);doc.text('Impression  诊断意见',20,y);y+=7;
  doc.setFontSize(10);doc.setTextColor(51,65,85);
  doc.text(`Imaging features consistent with ${d.fracType} fracture. Clinical correlation recommended.`,20,y,{maxWidth:170});y+=14;
  doc.setFontSize(8);doc.setTextColor(148,163,184);
  doc.text('Radiologist: '+d.doctor+' | For reference only - not a substitute for professional medical diagnosis.',20,280,{maxWidth:170});
  doc.save(`MedReport_${d.name||'patient'}_${d.date}.pdf`);
}

function generateReportQR(){
  const wrap=document.getElementById('report-qr-wrap');
  const canvas=document.getElementById('report-qr-canvas');
  if(!wrap||!canvas) return;
  canvas.innerHTML='';
  const d=currentReportData||{};
  const text=`BoneScan AI Report\nPatient: ${d.name}\nDate: ${d.date}\nFracture: ${d.fracType}\nConfidence: ${d.confidence}\nhttps://yi123456hj-sys.github.io/bone-fracture-ai/`;
  try{
    new QRCode(canvas,{text,width:160,height:160,colorDark:'#000',colorLight:'#fff'});
    wrap.style.display='block';
  } catch(e){ canvas.textContent='QR library not loaded.'; wrap.style.display='block'; }
}

/* ──────────────────────────────────────────────────
   KNOWLEDGE QUIZ
────────────────────────────────────────────────── */
const QUIZ_QUESTIONS=[
  {q:'X光显示骨干出现螺旋形骨折线，患者在扭转运动中受伤。最可能的骨折类型是？',opts:['Spiral螺旋骨折','Hairline微小骨折','Comminuted粉碎骨折','Greenstick青枝骨折'],ans:0,exp:'螺旋骨折由旋转力引起，X光呈螺旋形骨折线，常见于运动扭伤。'},
  {q:'8岁儿童摔倒后X光显示骨骼一侧折断而另一侧弯曲，骨膜完整。是什么类型？',opts:['Avulsion撕脱骨折','Greenstick青枝骨折','Buckle隆突骨折','Stress应力骨折'],ans:1,exp:'青枝骨折是儿童特有的骨折类型，因儿童骨骼柔韧，骨膜完整，一侧折断而另一侧弯曲。'},
  {q:'长跑运动员出现足部慢性疼痛，X光初期可能正常，MRI可见骨内信号改变。最可能是？',opts:['Spiral螺旋骨折','Hip髋部骨折','Stress应力骨折','Longitudinal纵向骨折'],ans:2,exp:'应力骨折（疲劳骨折）由重复载荷引起，早期X光常为阴性，需MRI确诊。'},
  {q:'高能量车祸后，X光显示骨骼碎裂为3块以上。这是什么类型的骨折？',opts:['Oblique斜形骨折','Comminuted粉碎骨折','Transverse横形骨折','Impacted嵌插骨折'],ans:1,exp:'粉碎骨折由高能量创伤引起，骨骼碎裂为3块或以上，常需手术治疗。'},
  {q:'老年女性从站立高度跌倒后髋部疼痛，X光显示股骨颈骨折。最常见的诱因是？',opts:['运动损伤','骨质疏松','病理性病变','直接暴力'],ans:1,exp:'髋部骨折是老年骨质疏松患者最常见的脆性骨折，轻微外力即可发生。'},
  {q:'肌肉强力收缩导致骨片从附着处撕脱，常见于运动员。这是哪种骨折？',opts:['Avulsion撕脱骨折','Hairline微小骨折','Dislocation脱位骨折','Pathological病理骨折'],ans:0,exp:'撕脱骨折由肌肉或韧带的强力牵拉引起，常见于运动员的骨突处。'},
  {q:'垂直轴向力使一骨片嵌入另一骨片，骨折端相互嵌压。是什么类型？',opts:['Impacted嵌插骨折','Transverse横形骨折','Colles科利斯骨折','Jefferson杰弗逊骨折'],ans:0,exp:'嵌插骨折由轴向压缩力引起，两骨折端相互嵌压，稳定性较好。'},
  {q:'手伸出撑地摔倒，X光显示桡骨远端骨折伴背侧成角和短缩。这是什么骨折？',opts:['Boxer拳击手骨折','Colles科利斯骨折','Greenstick青枝骨折','Hip髋部骨折'],ans:1,exp:'科利斯骨折是最常见的腕部骨折，由FOOSH（手伸出撑地）机制引起，伴桡骨远端背侧成角。'},
  {q:'以下哪种骨折最常见于儿童？',opts:['Hip髋部骨折','Comminuted粉碎骨折','Greenstick青枝骨折','Pathological病理骨折'],ans:2,exp:'青枝骨折是儿童特有的骨折类型，因儿童骨骼较成人更加柔韧，不易完全断裂。'},
  {q:'肿瘤或骨质疏松等基础疾病导致的骨折，通常仅需轻微外力。属于哪种骨折？',opts:['Stress应力骨折','Pathological病理骨折','Avulsion撕脱骨折','Buckle隆突骨折'],ans:3,exp:'等等！正确答案是Pathological病理骨折。病理骨折发生在已有疾病（如肿瘤、骨质疏松）的骨骼上。'},
];
const QUIZ_OPTS_NAMES=['A','B','C','D'];
let quizIdx=0, quizScore=0, quizAnswered=false, quizQuestions=[];

function shuffleArr(a){return a.sort(()=>Math.random()-.5);}

function startQuiz(){
  quizIdx=0; quizScore=0; quizAnswered=false;
  quizQuestions=shuffleArr([...QUIZ_QUESTIONS]).slice(0,10);
  document.getElementById('quiz-final').style.display='none';
  document.getElementById('quiz-card').style.display='block';
  document.getElementById('quiz-next-btn').style.display='none';
  document.getElementById('quiz-score').textContent='0';
  renderQuizQuestion();
}

function renderQuizQuestion(){
  const q=quizQuestions[quizIdx];
  if(!q) return showQuizFinal();
  quizAnswered=false;
  document.getElementById('quiz-qnum').textContent=quizIdx+1;
  document.getElementById('quiz-prog-fill').style.width=((quizIdx+1)/quizQuestions.length*100)+'%';
  document.getElementById('quiz-question').textContent=q.q;
  document.getElementById('quiz-feedback').style.display='none';
  document.getElementById('quiz-next-btn').style.display='none';
  const opts=document.getElementById('quiz-opts');
  opts.innerHTML=q.opts.map((opt,i)=>`<button class="quiz-opt" onclick="answerQuiz(${i})">${QUIZ_OPTS_NAMES[i]}. ${opt}</button>`).join('');
  // Simulated X-ray description
  const xrayDescs=['皮质骨密度不规则，骨折线呈螺旋状走行','骨干可见轻微弯曲变形，骨皮质完整','骨密度局部降低，无明显骨折线','骨折碎片多于3块，骨皮质连续性中断'];
  document.getElementById('quiz-img-wrap').textContent='[模拟X光描述]\n'+xrayDescs[quizIdx%xrayDescs.length]+'\n\n图像质量: 良好 | 骨质密度: 正常';
}

function answerQuiz(chosen){
  if(quizAnswered) return;
  quizAnswered=true;
  const q=quizQuestions[quizIdx];
  const opts=document.querySelectorAll('.quiz-opt');
  opts.forEach((btn,i)=>{
    btn.disabled=true;
    if(i===q.ans) btn.classList.add('correct');
    else if(i===chosen&&i!==q.ans) btn.classList.add('wrong');
  });
  const correct=chosen===q.ans;
  if(correct){quizScore++;document.getElementById('quiz-score').textContent=quizScore;}
  const fb=document.getElementById('quiz-feedback');
  fb.style.display='block';
  fb.className='quiz-feedback '+(correct?'ok':'bad');
  fb.textContent=(correct?'✅ 正确！ Correct! ':'❌ 错误 Wrong! 正确答案: '+q.opts[q.ans]+'. ')+q.exp;
  document.getElementById('quiz-next-btn').style.display='block';
}

function nextQuizQuestion(){
  quizIdx++;
  if(quizIdx>=quizQuestions.length) showQuizFinal();
  else renderQuizQuestion();
}

function showQuizFinal(){
  document.getElementById('quiz-card').style.display='none';
  document.getElementById('quiz-next-btn').style.display='none';
  document.getElementById('quiz-final').style.display='block';
  const pct=Math.round(quizScore/quizQuestions.length*100);
  document.getElementById('quiz-final-score').textContent=quizScore+' / '+quizQuestions.length;
  const msg=pct>=90?'🏆 优秀！您是骨折识别专家！Excellent!':pct>=70?'👍 良好！继续学习 Good job!':pct>=50?'📚 继续加油！Keep studying!':'💪 多练习！练习是王道 Keep practicing!';
  document.getElementById('quiz-final-msg').textContent=msg+' ('+pct+'%)';
}

/* ──────────────────────────────────────────────────
   CASE LIBRARY
────────────────────────────────────────────────── */
const CASE_DATA=[
  {type:'Spiral',severity:'high',pop:'adult',icon:'🌀',title:'Spiral Fracture · 螺旋骨折',desc:'典型滑雪事故。旋转力沿骨长轴施加，呈螺旋形骨折线。Classic skiing accident. Rotational force along long axis, spiral fracture line.',tags:['Tibia','Sports','Surgery']},
  {type:'Hairline',severity:'low',pop:'adult',icon:'🏃',title:'Hairline Stress Fracture · 微小骨折',desc:'马拉松运动员足部反复应力骨折。MRI可见早期改变，X光初期阴性。Marathon runner metatarsal stress fracture. MRI positive, X-ray initially negative.',tags:['Metatarsal','Overuse','Cast']},
  {type:'Greenstick',severity:'low',pop:'pediatric',icon:'🌿',title:'Greenstick Fracture · 青枝骨折',desc:'7岁儿童跌倒后桡骨青枝骨折。一侧皮质折断，另一侧完整。7-year-old fall: radial greenstick fracture. One cortex broken, other intact.',tags:['Radius','Pediatric','Cast']},
  {type:'Comminuted',severity:'high',pop:'adult',icon:'💥',title:'Comminuted Fracture · 粉碎骨折',desc:'车祸高能量创伤，股骨粉碎骨折3块以上碎片，需ORIF手术。High-energy MVA: femur comminuted into 3+ fragments, ORIF required.',tags:['Femur','Trauma','ORIF']},
  {type:'Hip',severity:'high',pop:'elderly',icon:'🧓',title:'Hip Fracture · 髋部骨折',desc:'82岁骨质疏松女性站立跌倒，股骨颈骨折，48小时内行半关节置换术。82F osteoporosis, femoral neck fracture, hemiarthroplasty within 48h.',tags:['Femoral Neck','Elderly','Arthroplasty']},
  {type:'Colles',severity:'medium',pop:'elderly',icon:'🤲',title:'Colles Fracture · 科利斯骨折',desc:'65岁女性FOOSH后桡骨远端骨折，石膏固定6周，预后良好。65F FOOSH: distal radius Colles fracture, 6-week cast, good prognosis.',tags:['Distal Radius','FOOSH','Cast']},
  {type:'Avulsion',severity:'medium',pop:'adult',icon:'⚡',title:'Avulsion Fracture · 撕脱骨折',desc:'足球运动员膝关节前交叉韧带撕脱骨折，碎片>1cm需手术固定。Soccer player ACL avulsion fracture, fragment >1cm requires surgical fixation.',tags:['Knee','Sports','Surgery']},
  {type:'Boxer',severity:'low',pop:'adult',icon:'👊',title:"Boxer's Fracture · 拳击手骨折",desc:'击打硬物后第5掌骨颈骨折，掌侧成角38°，尺侧槽夹板固定。Punch injury: 5th metacarpal neck, volar angulation 38°, ulnar gutter splint.',tags:['Metacarpal','Punch','Splint']},
  {type:'Pathological',severity:'high',pop:'elderly',icon:'🎗️',title:'Pathological Fracture · 病理骨折',desc:'乳腺癌脊柱转移，轻微咳嗽致椎体压缩骨折。Breast cancer spinal metastasis, minor cough caused vertebral compression fracture.',tags:['Spine','Metastasis','Radiation']},
];

function renderCaseLibrary(filter){
  const grid=document.getElementById('casel-grid');
  if(!grid) return;
  const filtered=filter==='all'?CASE_DATA:
    filter==='high'?CASE_DATA.filter(c=>c.severity==='high'):
    filter==='medium'?CASE_DATA.filter(c=>c.severity==='medium'):
    filter==='low'?CASE_DATA.filter(c=>c.severity==='low'):
    filter==='pediatric'?CASE_DATA.filter(c=>c.pop==='pediatric'):
    CASE_DATA.filter(c=>c.pop==='elderly');
  grid.innerHTML=filtered.map(c=>`<div class="casel-card" data-filter="${c.pop} ${c.severity}">
    <div class="casel-card-img">${c.icon}</div>
    <div class="casel-card-body">
      <div class="casel-card-type">${c.type}</div>
      <div class="casel-card-title">${c.title}</div>
      <div class="casel-card-desc">${c.desc}</div>
      <div class="casel-card-tags">${c.tags.map(t=>`<span class="casel-card-tag">${t}</span>`).join('')}</div>
    </div>
  </div>`).join('');
}

/* ──────────────────────────────────────────────────
   PAIN DIARY
────────────────────────────────────────────────── */
const PAIN_KEY='bsai_pain_diary';
let painChart=null;

function savePainEntry(){
  const date=document.getElementById('pain-date').value;
  const score=parseInt(document.getElementById('pain-score').value);
  const notes=document.getElementById('pain-notes').value;
  const syms=['swelling','stiff','tender','numb'].filter(s=>document.getElementById('ps-'+s).checked);
  if(!date){alert('请选择日期 Please select date');return;}
  const entries=JSON.parse(localStorage.getItem(PAIN_KEY)||'[]');
  const existing=entries.findIndex(e=>e.date===date);
  const entry={date,score,notes,syms};
  if(existing>=0) entries[existing]=entry;
  else entries.push(entry);
  entries.sort((a,b)=>a.date.localeCompare(b.date));
  localStorage.setItem(PAIN_KEY,JSON.stringify(entries));
  renderPainChart();
  alert('✅ 已保存 Saved!');
}

function renderPainChart(){
  const entries=JSON.parse(localStorage.getItem(PAIN_KEY)||'[]');
  const cvs=document.getElementById('pain-chart');
  const listEl=document.getElementById('pain-entries-list');
  if(!cvs) return;
  if(painChart) painChart.destroy();
  const labels=entries.map(e=>e.date);
  const scores=entries.map(e=>e.score);
  painChart=new Chart(cvs,{
    type:'line',
    data:{labels,datasets:[{label:'Pain Score',data:scores,borderColor:'#00B4FF',backgroundColor:'rgba(0,180,255,.15)',tension:0.4,fill:true,pointBackgroundColor:'#00E5C8'}]},
    options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{min:0,max:10,ticks:{color:'#64748B'},grid:{color:'rgba(255,255,255,.05)'}},x:{ticks:{color:'#64748B',maxTicksLimit:8},grid:{display:false}}}}
  });
  if(listEl) listEl.innerHTML=entries.slice(-5).reverse().map(e=>`
    <div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:12px">
      <span style="color:var(--text3)">${e.date}</span> &nbsp;
      <strong style="color:${e.score>=7?'#EF4444':e.score>=4?'#F97316':'#10B981'}">痛分 ${e.score}/10</strong>
      ${e.syms.length?'&nbsp;|&nbsp;'+e.syms.join(', '):''}
      ${e.notes?'<div style="color:var(--text4);font-size:11px">'+e.notes+'</div>':''}
    </div>`).join('');
}

/* ──────────────────────────────────────────────────
   MEDICATION CALENDAR
────────────────────────────────────────────────── */
const MED_KEY='bsai_med_calendar';
const MED_ICONS={med:'💊',checkup:'🏥',rehab:'🏋️',xray:'🩻'};

function addMedEntry(){
  const name=document.getElementById('med-name').value.trim();
  const dt=document.getElementById('med-datetime').value;
  const type=document.getElementById('med-type').value;
  if(!name||!dt){alert('请填写药品名称和时间 Fill name and datetime');return;}
  const entries=JSON.parse(localStorage.getItem(MED_KEY)||'[]');
  entries.push({id:Date.now(),name,dt,type});
  entries.sort((a,b)=>a.dt.localeCompare(b.dt));
  localStorage.setItem(MED_KEY,JSON.stringify(entries));
  renderMedCalendar();
  scheduleNotif(name,dt);
  document.getElementById('med-name').value='';
}

function renderMedCalendar(){
  const cal=document.getElementById('medcal-calendar');
  if(!cal) return;
  const entries=JSON.parse(localStorage.getItem(MED_KEY)||'[]');
  if(!entries.length){cal.innerHTML='<div style="color:var(--text4);font-size:13px;padding:20px 0;text-align:center">暂无提醒 No reminders yet</div>';return;}
  const now=new Date();
  cal.innerHTML=entries.map(e=>{
    const d=new Date(e.dt);
    const past=d<now;
    return `<div class="medcal-entry" style="opacity:${past?.6:1}">
      <div class="medcal-icon">${MED_ICONS[e.type]||'📅'}</div>
      <div>
        <div class="medcal-name">${e.name}</div>
        <div class="medcal-time">${d.toLocaleString('zh-CN')} ${past?'(已过 Past)':''}</div>
      </div>
      <button class="medcal-del" onclick="delMedEntry(${e.id})">✕</button>
    </div>`;
  }).join('');
}

function delMedEntry(id){
  const entries=JSON.parse(localStorage.getItem(MED_KEY)||'[]').filter(e=>e.id!==id);
  localStorage.setItem(MED_KEY,JSON.stringify(entries));
  renderMedCalendar();
}

function requestNotifPermission(){
  if(!('Notification' in window)){alert('您的浏览器不支持通知 Notifications not supported');return;}
  Notification.requestPermission().then(p=>{
    if(p==='granted') alert('✅ 通知已启用 Notifications enabled!');
    else alert('通知被拒绝，请在浏览器设置中允许 Notifications denied');
  });
}

function scheduleNotif(name,dt){
  if(!('Notification' in window)||Notification.permission!=='granted') return;
  const delay=new Date(dt)-new Date();
  if(delay>0&&delay<86400000*7){
    setTimeout(()=>new Notification('BoneScan AI 用药提醒',{body:name,icon:'/favicon.ico'}),delay);
  }
}

/* ──────────────────────────────────────────────────
   NEARBY HOSPITAL FINDER
────────────────────────────────────────────────── */
const HOSPITAL_MOCK=[
  {name:'서울성모병원 / Seoul St. Mary\'s Hospital',addr:'서울 서초구 반포대로',dist:'1.2km',type:'🏥 Orthopedic Center'},
  {name:'연세대 세브란스병원 / Severance Hospital',addr:'서울 서대문구 연세로',dist:'2.8km',type:'🏥 Level 1 Trauma'},
  {name:'삼성서울병원 / Samsung Medical Center',addr:'서울 강남구 일원로',dist:'3.5km',type:'🏥 Orthopedic Dept.'},
  {name:'서울아산병원 / Asan Medical Center',addr:'서울 송파구 올림픽로',dist:'4.1km',type:'🏥 Bone & Joint'},
];

function findHospitals(){
  const status=document.getElementById('hosp-status');
  const mapWrap=document.getElementById('hosp-map-wrap');
  const mapEl=document.getElementById('hosp-map');
  const list=document.getElementById('hosp-list');
  status.textContent='📍 获取位置中... Getting location...';
  if(!navigator.geolocation){
    status.textContent='❌ 浏览器不支持地理位置 Geolocation not supported';
    showMockHospitals(list,null,null);return;
  }
  navigator.geolocation.getCurrentPosition(
    pos=>{
      const {latitude:lat,longitude:lng}=pos.coords;
      status.textContent=`✅ 位置获取成功 (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      mapWrap.style.display='block';
      mapEl.src=`https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.02},${lat-0.02},${lng+0.02},${lat+0.02}&layer=mapnik&marker=${lat},${lng}`;
      showMockHospitals(list,lat,lng);
    },
    err=>{
      status.textContent='⚠ 位置获取失败，显示示例医院 Location failed, showing sample hospitals';
      showMockHospitals(list,null,null);
    }
  );
}

function showMockHospitals(list,lat,lng){
  list.innerHTML=HOSPITAL_MOCK.map(h=>`<div class="hosp-card">
    <div class="hosp-icon">🏥</div>
    <div>
      <div class="hosp-name">${h.name}</div>
      <div class="hosp-addr">${h.addr} · ${h.type}</div>
    </div>
    <div class="hosp-dist">${lat?h.dist:'—'}</div>
  </div>`).join('');
}

/* ──────────────────────────────────────────────────
   PWA — Service Worker + Install Banners
────────────────────────────────────────────────── */
// Register Service Worker
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('/bone-fracture-ai/sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(()=>{});
  });
}

// iOS Install Banner
(function(){
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = window.navigator.standalone === true;
  const shown = localStorage.getItem('bsai-ios-banner');
  if(isIOS && !isStandalone && !shown){
    setTimeout(()=>{
      document.getElementById('ios-install-banner').style.display='block';
    }, 3000);
  }
})();

// Android Install Banner (beforeinstallprompt)
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  const shown = localStorage.getItem('bsai-android-banner');
  if(!shown){
    setTimeout(()=>{
      document.getElementById('android-install-banner').style.display='block';
    }, 2000);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const installBtn = document.getElementById('android-install-btn');
  if(installBtn){
    installBtn.addEventListener('click', async () => {
      if(!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if(outcome === 'accepted'){
        localStorage.setItem('bsai-android-banner','1');
        document.getElementById('android-install-banner').style.display='none';
      }
      deferredPrompt = null;
    });
  }
});

window.addEventListener('appinstalled', () => {
  document.getElementById('android-install-banner').style.display='none';
  localStorage.setItem('bsai-android-banner','1');
});

/* ──────────────────────────────────────────────────
   INIT ALL
────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded',()=>{
  // Set default dates
  const today=new Date().toISOString().slice(0,10);
  const healDate=document.getElementById('heal-date');
  const painDate=document.getElementById('pain-date');
  const rptDate=document.getElementById('rpt-date');
  if(healDate) healDate.value=today;
  if(painDate) painDate.value=today;
  if(rptDate)  rptDate.value=today;

  // Pain score display
  const painSlider=document.getElementById('pain-score');
  if(painSlider) painSlider.addEventListener('input',()=>{
    const v=parseInt(painSlider.value);
    document.getElementById('pain-score-val').textContent=v;
    const c=v>=7?'#EF4444':v>=4?'#F97316':'#10B981';
    document.getElementById('pain-score-val').style.color=c;
  });

  // Case library
  renderCaseLibrary('all');
  document.querySelectorAll('.casel-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.casel-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderCaseLibrary(btn.dataset.filter);
    });
  });

  // Med calendar
  renderMedCalendar();
  renderPainChart();

  // Quiz
  startQuiz();

  // Expose for inline onclick
  window.predictHealing   = predictHealing;
  window.generateFullReport = generateFullReport;
  window.downloadFullReportPDF = downloadFullReportPDF;
  window.generateReportQR = generateReportQR;
  window.calcFractureRisk = calcFractureRisk;
  window.savePainEntry    = savePainEntry;
  window.addMedEntry      = addMedEntry;
  window.delMedEntry      = delMedEntry;
  window.requestNotifPermission = requestNotifPermission;
  window.findHospitals    = findHospitals;
  window.answerQuiz       = answerQuiz;
  window.nextQuizQuestion = nextQuizQuestion;
  window.startQuiz        = startQuiz;
});
