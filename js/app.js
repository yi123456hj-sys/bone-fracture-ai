/* =====================================================
   BONE FRACTURE AI — app.js
   ===================================================== */

// ── Medical Data ───────────────────────────────────────
const MED = {
  avulsion:{
    en:{
      causes:[
        {i:'⚡',t:'Sudden forceful muscle contraction pulling a bone fragment away from its attachment'},
        {i:'🏃',t:'High-intensity athletic activities: sprinting, jumping, throwing, kicking'},
        {i:'🦴',t:'Ligament or tendon stress at bony attachment points (e.g., pelvis, knee, ankle)'},
        {i:'👶',t:'Pediatric bone apophyses are especially vulnerable due to open growth plates'}
      ],
      treatment:[
        {i:'🧊',t:'R.I.C.E protocol: Rest, Ice (20 min/session), Compression, Elevation'},
        {i:'🦯',t:'Splint or cast immobilization for 4–8 weeks depending on location'},
        {i:'💊',t:'NSAIDs (ibuprofen, naproxen) for pain and inflammation control'},
        {i:'🔧',t:'Surgical fixation (screw or tension-band wiring) if fragment displaced >1 cm'}
      ],
      recovery:[
        {i:'⏱️',t:'Phase 1 (0–4 weeks): Protected rest, gentle range-of-motion within pain limits'},
        {i:'🏋️',t:'Phase 2 (4–8 weeks): Progressive strengthening, pool therapy if available'},
        {i:'🏅',t:'Phase 3 (8–12 weeks): Sport-specific rehabilitation, functional testing'},
        {i:'✅',t:'Full recovery: 10–16 weeks; return to sport after pain-free performance test'}
      ]
    },
    zh:{
      causes:[
        {i:'⚡',t:'肌肉突然猛烈收缩，将骨片从附着处撕脱'},
        {i:'🏃',t:'高强度运动：短跑、跳跃、投掷、踢球等'},
        {i:'🦴',t:'骨性附着点（骨盆、膝、踝等）处的韧带或肌腱应力'},
        {i:'👶',t:'儿童骨骺因生长板未闭合，对牵拉损伤尤为易感'}
      ],
      treatment:[
        {i:'🧊',t:'RICE方案：休息、冰敷（每次20分钟）、加压包扎、患肢抬高'},
        {i:'🦯',t:'根据部位，夹板或石膏固定4–8周'},
        {i:'💊',t:'非甾体消炎药（布洛芬、萘普生）控制疼痛和炎症'},
        {i:'🔧',t:'骨片移位>1cm时需手术固定（螺钉或张力带钢丝）'}
      ],
      recovery:[
        {i:'⏱️',t:'第一阶段（0–4周）：保护性休息，在无痛范围内轻柔活动'},
        {i:'🏋️',t:'第二阶段（4–8周）：渐进性力量训练，条件允许可进行水中康复'},
        {i:'🏅',t:'第三阶段（8–12周）：运动专项康复，功能性测试'},
        {i:'✅',t:'完全恢复：10–16周；无痛功能测试通过后方可恢复运动'}
      ]
    },
    ko:{
      causes:[
        {i:'⚡',t:'근육의 갑작스러운 강한 수축으로 뼈 조각이 부착 부위에서 분리됨'},
        {i:'🏃',t:'고강도 운동: 단거리 달리기, 점프, 투구, 킥 동작'},
        {i:'🦴',t:'골반, 무릎, 발목 등 골성 부착 부위의 인대·힘줄 스트레스'},
        {i:'👶',t:'성장판이 열린 소아의 골단은 견인 손상에 특히 취약'}
      ],
      treatment:[
        {i:'🧊',t:'RICE 프로토콜: 안정(Rest), 냉찜질(Ice, 회당 20분), 압박(Compression), 거상(Elevation)'},
        {i:'🦯',t:'부위에 따라 부목 또는 석고붕대로 4-8주 고정'},
        {i:'💊',t:'NSAIDs(이부프로펜, 나프록센)으로 통증 및 염증 조절'},
        {i:'🔧',t:'뼈 조각 전위 >1cm 시 수술적 고정(나사 또는 장력대 와이어)'}
      ],
      recovery:[
        {i:'⏱️',t:'1단계(0-4주): 보호적 안정, 무통 범위 내 가벼운 관절 운동'},
        {i:'🏋️',t:'2단계(4-8주): 점진적 근력 강화, 가능하면 수중 재활'},
        {i:'🏅',t:'3단계(8-12주): 스포츠별 재활, 기능 평가'},
        {i:'✅',t:'완전 회복: 10-16주; 통증 없는 기능 검사 통과 후 스포츠 복귀'}
      ]
    }
  },
  comminuted:{
    en:{
      causes:[{i:'🚗',t:'High-energy trauma: vehicle collisions, falls from significant height'},{i:'💥',t:'Direct heavy impact to the bone shaft'},{i:'🧱',t:'Crush or blast injuries causing shattering into 3+ fragments'},{i:'🦴',t:'Severely osteoporotic bone may shatter with lower-energy force'}],
      treatment:[{i:'🔧',t:'Open Reduction Internal Fixation (ORIF) with plates, screws or intramedullary nail'},{i:'🏗️',t:'External fixation frame for highly unstable or contaminated fractures'},{i:'🩹',t:'Bone grafting when significant bone loss is present'},{i:'💊',t:'Post-surgical antibiotic prophylaxis and multimodal pain management'}],
      recovery:[{i:'⏱️',t:'Full recovery: 3–6 months; bone healing monitored with serial X-rays'},{i:'🦯',t:'Non-weight-bearing or partial weight-bearing 6–12 weeks post-op'},{i:'🏋️',t:'Intensive physiotherapy: joint mobilization, progressive muscle strengthening'},{i:'✅',t:'Return to full function after radiographic confirmation of union'}]
    },
    zh:{
      causes:[{i:'🚗',t:'高能量创伤：车辆碰撞、从高处坠落'},{i:'💥',t:'骨干受到重大直接撞击'},{i:'🧱',t:'挤压或爆炸伤导致骨骼碎裂为3块以上'},{i:'🦴',t:'严重骨质疏松的骨骼在较低能量下也可发生粉碎'}],
      treatment:[{i:'🔧',t:'切开复位内固定（ORIF）：钢板、螺钉或髓内钉'},{i:'🏗️',t:'高度不稳定或污染骨折使用外固定架'},{i:'🩹',t:'骨缺损明显时行骨移植'},{i:'💊',t:'术后预防性使用抗生素，多模式镇痛'}],
      recovery:[{i:'⏱️',t:'完全恢复：3–6个月，通过系列X线监测愈合'},{i:'🦯',t:'术后6–12周不负重或部分负重'},{i:'🏋️',t:'强化物理治疗：关节松动，逐步肌力训练'},{i:'✅',t:'影像学确认骨愈合后恢复完全功能'}]
    },
    ko:{
      causes:[{i:'🚗',t:'고에너지 외상: 차량 충돌, 높은 곳에서 낙상'},{i:'💥',t:'뼈간부에 대한 강한 직접 충격'},{i:'🧱',t:'압궤 또는 폭발 손상으로 3개 이상 조각으로 분쇄'},{i:'🦴',t:'심한 골다공증 뼈는 낮은 에너지로도 분쇄될 수 있음'}],
      treatment:[{i:'🔧',t:'개방적 정복 내고정(ORIF): 금속판, 나사 또는 수질정'},{i:'🏗️',t:'매우 불안정하거나 오염된 골절에 외고정틀 적용'},{i:'🩹',t:'심한 골결손 시 골이식'},{i:'💊',t:'수술 후 예방적 항생제 및 다중 방식 통증 관리'}],
      recovery:[{i:'⏱️',t:'완전 회복: 3-6개월; 연속 X선으로 골유합 모니터링'},{i:'🦯',t:'수술 후 6-12주 비체중부하 또는 부분 체중부하'},{i:'🏋️',t:'집중 물리치료: 관절 가동, 점진적 근력 강화'},{i:'✅',t:'방사선학적 유합 확인 후 완전 기능 복귀'}]
    }
  },
  dislocation:{
    en:{
      causes:[{i:'💥',t:'High-energy trauma: contact sports, vehicle accidents, significant falls'},{i:'🔄',t:'Combined axial compression and rotational loading at a joint'},{i:'🏈',t:'Common in football, rugby, martial arts, skiing'},{i:'⚠️',t:'Pre-existing joint instability or ligamentous laxity increases risk'}],
      treatment:[{i:'🏥',t:'Emergency joint reduction under sedation/anaesthesia within hours of injury'},{i:'🔧',t:'Surgical fixation of the fracture component (ORIF)'},{i:'🪢',t:'Ligament repair or reconstruction if severe joint instability persists'},{i:'🦯',t:'Post-surgical immobilization in a brace or cast for 6–8 weeks'}],
      recovery:[{i:'⏱️',t:'Full recovery: 3–6 months; high risk of post-traumatic arthritis'},{i:'🤸',t:'Early protected mobilization within days of fixation to prevent stiffness'},{i:'🏋️',t:'Proprioception and joint stability training critical for long-term outcome'},{i:'✅',t:'Functional bracing recommended for return to contact sports activities'}]
    },
    zh:{
      causes:[{i:'💥',t:'高能量创伤：接触性运动、车辆事故、大高度坠落'},{i:'🔄',t:'关节处的轴向压缩与旋转复合力'},{i:'🏈',t:'常见于足球、橄榄球、武术、滑雪'},{i:'⚠️',t:'既往关节不稳定或韧带松弛增加风险'}],
      treatment:[{i:'🏥',t:'伤后数小时内在镇静/麻醉下急诊关节复位'},{i:'🔧',t:'骨折部分切开复位内固定（ORIF）'},{i:'🪢',t:'关节严重不稳时行韧带修复或重建'},{i:'🦯',t:'术后支具或石膏固定6–8周'}],
      recovery:[{i:'⏱️',t:'完全恢复：3–6个月；创伤后关节炎风险高'},{i:'🤸',t:'固定后数日即可开始保护性早期活动，防止关节僵硬'},{i:'🏋️',t:'本体感觉和关节稳定性训练对长期预后至关重要'},{i:'✅',t:'恢复接触性运动时建议使用功能性支具'}]
    },
    ko:{
      causes:[{i:'💥',t:'고에너지 외상: 접촉 스포츠, 차량 사고, 큰 낙상'},{i:'🔄',t:'관절부에 축성 압박과 회전력의 복합 작용'},{i:'🏈',t:'풋볼, 럭비, 격투기, 스키에서 흔함'},{i:'⚠️',t:'기존 관절 불안정성 또는 인대 이완이 위험을 증가'}],
      treatment:[{i:'🏥',t:'손상 후 수 시간 내 진정/마취하 응급 관절 정복'},{i:'🔧',t:'골절 부위 개방적 정복 내고정(ORIF)'},{i:'🪢',t:'심한 관절 불안정 시 인대 봉합 또는 재건'},{i:'🦯',t:'수술 후 보조기 또는 석고붕대로 6-8주 고정'}],
      recovery:[{i:'⏱️',t:'완전 회복: 3-6개월; 외상 후 관절염 위험 높음'},{i:'🤸',t:'고정 수일 후 조기 보호적 가동 시작(강직 예방)'},{i:'🏋️',t:'고유 감각 및 관절 안정성 훈련이 장기 예후에 중요'},{i:'✅',t:'접촉 스포츠 복귀 시 기능적 보조기 착용 권고'}]
    }
  },
  greenstick:{
    en:{
      causes:[{i:'🧒',t:'Predominantly affects children aged 2–10 due to flexible, not fully mineralized bone'},{i:'🤸',t:'Falls onto an outstretched hand (FOOSH mechanism)'},{i:'🔨',t:'Bending or angular force causing the bone to partially crack'},{i:'⚽',t:'Low-to-moderate energy sports injuries in young athletes'}],
      treatment:[{i:'🔄',t:'Closed reduction (gentle manipulation) under sedation if angulation significant'},{i:'🩼',t:'Plaster cast or fiberglass cast immobilization for 4–8 weeks'},{i:'✂️',t:'Surgical intervention rarely required; reserved for severe deformity'},{i:'📷',t:'Serial X-rays every 2–3 weeks to monitor for re-angulation'}],
      recovery:[{i:'✅',t:'Excellent prognosis; children\'s bone has remarkable remodeling capacity'},{i:'⏱️',t:'Full recovery typically 6–10 weeks'},{i:'🦴',t:'Minor residual angulation usually corrects naturally during growth'},{i:'🏃',t:'Return to full activity after cast removal with no special rehab required'}]
    },
    zh:{
      causes:[{i:'🧒',t:'主要影响2–10岁儿童，因骨骼柔韧未完全矿化'},{i:'🤸',t:'手伸出撑地摔倒（FOOSH机制）'},{i:'🔨',t:'弯曲或斜向力导致骨骼不完全折断'},{i:'⚽',t:'青少年运动员低至中等能量的运动损伤'}],
      treatment:[{i:'🔄',t:'成角明显时在镇静下行闭合复位（轻柔手法）'},{i:'🩼',t:'石膏或玻璃纤维管型固定4–8周'},{i:'✂️',t:'极少需要手术，仅用于严重畸形'},{i:'📷',t:'每2–3周摄片复查，监测是否再度成角'}],
      recovery:[{i:'✅',t:'预后极佳；儿童骨骼重塑能力强'},{i:'⏱️',t:'通常6–10周完全恢复'},{i:'🦴',t:'轻微残余成角在生长过程中通常会自然矫正'},{i:'🏃',t:'去除石膏后即可恢复完全活动，无需特别康复'}]
    },
    ko:{
      causes:[{i:'🧒',t:'2-10세 소아에서 주로 발생, 뼈가 유연하고 완전히 석회화되지 않았기 때문'},{i:'🤸',t:'손을 뻗어 넘어지는 낙상(FOOSH 기전)'},{i:'🔨',t:'구부림 또는 각도 힘으로 뼈가 부분적으로 갈라짐'},{i:'⚽',t:'어린 운동선수의 저~중등도 에너지 스포츠 부상'}],
      treatment:[{i:'🔄',t:'각도 변형이 심하면 진정 하 도수 정복(폐쇄적 정복)'},{i:'🩼',t:'석고붕대 또는 유리섬유 석고로 4-8주 고정'},{i:'✂️',t:'수술은 드묾; 심한 변형에만 시행'},{i:'📷',t:'2-3주마다 추적 X선 촬영으로 재각형성 모니터링'}],
      recovery:[{i:'✅',t:'예후 우수; 소아 뼈는 재형성 능력이 탁월'},{i:'⏱️',t:'보통 6-10주 완전 회복'},{i:'🦴',t:'경미한 잔여 각도 변형은 성장 중 자연 교정됨'},{i:'🏃',t:'석고 제거 후 별도 재활 없이 완전 활동 복귀 가능'}]
    }
  },
  hairline:{
    en:{
      causes:[{i:'🏃',t:'Repetitive mechanical stress exceeding bone\'s capacity to remodel (overuse)'},{i:'📈',t:'Sudden increase in training volume or intensity without adequate rest'},{i:'🦴',t:'Reduced bone density: osteoporosis, female athlete triad, vitamin D deficiency'},{i:'👟',t:'Biomechanical issues: flat feet, improper footwear, hard running surfaces'}],
      treatment:[{i:'🛑',t:'Activity restriction: cessation of impact loading for minimum 6–8 weeks'},{i:'👢',t:'Protective walking boot or crutches for weight-bearing stress fractures'},{i:'🚴',t:'Cross-training with low-impact activities: swimming, cycling, elliptical'},{i:'💊',t:'Address underlying bone density with calcium, vitamin D, bisphosphonates if needed'}],
      recovery:[{i:'⏱️',t:'Full recovery: 6–12 weeks with strict adherence to activity restriction'},{i:'📉',t:'Gradual return: walk → jog → run over 4–6 weeks after confirmed healing'},{i:'🥗',t:'Nutritional optimization: 1200–1500 mg calcium/day, 800–1000 IU vitamin D'},{i:'🔁',t:'Address biomechanical risk factors to prevent recurrence'}]
    },
    zh:{
      causes:[{i:'🏃',t:'反复机械应力超过骨骼重塑能力（过度使用损伤）'},{i:'📈',t:'训练量或强度突然增加，休息不足'},{i:'🦴',t:'骨密度降低：骨质疏松、女性运动员三联征、维生素D缺乏'},{i:'👟',t:'生物力学问题：扁平足、鞋具不当、坚硬的跑步地面'}],
      treatment:[{i:'🛑',t:'限制活动：至少6–8周停止冲击性负荷'},{i:'👢',t:'承重应力骨折使用保护性行走靴或拐杖'},{i:'🚴',t:'低冲击性交叉训练：游泳、骑车、椭圆机'},{i:'💊',t:'通过补充钙、维生素D，必要时使用二膦酸盐改善骨密度'}],
      recovery:[{i:'⏱️',t:'严格遵守活动限制下，6–12周完全恢复'},{i:'📉',t:'愈合确认后逐步恢复：步行→慢跑→跑步，历时4–6周'},{i:'🥗',t:'营养优化：每日钙1200–1500mg，维生素D 800–1000IU'},{i:'🔁',t:'处理生物力学危险因素，预防复发'}]
    },
    ko:{
      causes:[{i:'🏃',t:'뼈의 재형성 능력을 초과하는 반복적인 기계적 스트레스(과사용)'},{i:'📈',t:'충분한 휴식 없이 훈련량이나 강도를 급격히 증가'},{i:'🦴',t:'골밀도 감소: 골다공증, 여성 운동선수 삼징후, 비타민 D 결핍'},{i:'👟',t:'생체역학적 문제: 평발, 부적절한 신발, 딱딱한 달리기 표면'}],
      treatment:[{i:'🛑',t:'활동 제한: 최소 6-8주 충격성 부하 중단'},{i:'👢',t:'체중부하 피로 골절에 보호 워킹 부츠 또는 목발 사용'},{i:'🚴',t:'저충격 교차 훈련: 수영, 자전거, 일립티컬'},{i:'💊',t:'칼슘, 비타민 D, 필요 시 비스포스포네이트로 골밀도 개선'}],
      recovery:[{i:'⏱️',t:'활동 제한 철저히 준수 시 6-12주 완전 회복'},{i:'📉',t:'유합 확인 후 점진적 복귀: 보행→조깅→달리기, 4-6주에 걸쳐'},{i:'🥗',t:'영양 최적화: 칼슘 1200-1500mg/일, 비타민 D 800-1000IU'},{i:'🔁',t:'재발 방지를 위한 생체역학적 위험 요소 교정'}]
    }
  },
  impacted:{
    en:{
      causes:[{i:'⬇️',t:'Axial loading force that compresses and drives one bone fragment into another'},{i:'🤲',t:'Falls on an outstretched hand (FOOSH) — common mechanism for wrist fractures'},{i:'🧓',t:'High incidence in elderly patients with osteoporosis: vertebral compression'},{i:'🦴',t:'Joint impact during high-energy activities: running, jumping on hard surfaces'}],
      treatment:[{i:'🩼',t:'Conservative immobilization (cast or brace) if alignment is acceptable'},{i:'💉',t:'Vertebroplasty or kyphoplasty for spinal compression fractures'},{i:'🔧',t:'Surgical realignment if significant deformity affects function'},{i:'💊',t:'Pain management: analgesics, nerve blocks for severe spinal pain'}],
      recovery:[{i:'⏱️',t:'Recovery: 6–12 weeks depending on location and severity'},{i:'💪',t:'Core and back strengthening exercises critical for spinal impaction fractures'},{i:'🥛',t:'Bone density optimization: calcium supplementation, weight-bearing exercises'},{i:'🚶',t:'Fall prevention program essential for elderly patients to prevent recurrence'}]
    },
    zh:{
      causes:[{i:'⬇️',t:'轴向压缩力将一个骨片嵌入另一个骨片'},{i:'🤲',t:'手伸出撑地摔倒（FOOSH）——腕部骨折的常见机制'},{i:'🧓',t:'骨质疏松老年患者高发，常见椎体压缩'},{i:'🦴',t:'高强度运动时的关节冲击：在坚硬地面跑跳'}],
      treatment:[{i:'🩼',t:'对线可接受时保守固定（石膏或支具）'},{i:'💉',t:'脊柱压缩骨折行椎体成形术或椎体后凸成形术'},{i:'🔧',t:'严重畸形影响功能时手术矫正'},{i:'💊',t:'镇痛治疗：止痛药、神经阻滞（严重脊柱疼痛）'}],
      recovery:[{i:'⏱️',t:'恢复期：根据部位和严重程度，6–12周'},{i:'💪',t:'核心和背部肌力训练对脊柱嵌插骨折的康复至关重要'},{i:'🥛',t:'骨密度优化：补钙、负重运动'},{i:'🚶',t:'老年患者须进行防跌倒训练以预防复发'}]
    },
    ko:{
      causes:[{i:'⬇️',t:'축성 압박력으로 한 뼈 조각이 다른 뼈 조각에 박힘'},{i:'🤲',t:'손 뻗어 넘어지기(FOOSH) - 손목 골절의 흔한 기전'},{i:'🧓',t:'골다공증 노인 환자에서 고빈도 발생, 척추 압박이 흔함'},{i:'🦴',t:'고강도 활동 중 관절 충격: 딱딱한 바닥에서 달리기·점프'}],
      treatment:[{i:'🩼',t:'정렬이 적절하면 보존적 고정(석고 또는 보조기)'},{i:'💉',t:'척추 압박 골절에 척추 성형술 또는 후굴 성형술'},{i:'🔧',t:'기능에 영향을 주는 심한 변형 시 수술적 교정'},{i:'💊',t:'통증 관리: 진통제, 심한 척추 통증에 신경 차단'}],
      recovery:[{i:'⏱️',t:'회복: 부위와 중증도에 따라 6-12주'},{i:'💪',t:'척추 감입 골절 재활에 코어·등 근력 운동이 중요'},{i:'🥛',t:'골밀도 최적화: 칼슘 보충, 체중부하 운동'},{i:'🚶',t:'노인 환자는 재발 방지를 위한 낙상 예방 프로그램 필수'}]
    }
  },
  longitudinal:{
    en:{
      causes:[{i:'⬆️',t:'Stress directed along the long axis of the bone, parallel to its length'},{i:'🎯',t:'Direct longitudinal impact or compressive load along bone shaft'},{i:'🦵',t:'Associated with tibia, fibula, and forearm bone injuries'},{i:'📊',t:'Less common than transverse or oblique types; often in cortical bones'}],
      treatment:[{i:'🩼',t:'Cast immobilization for stable, non-displaced fractures (6–8 weeks)'},{i:'🔩',t:'Intramedullary nailing or plate fixation for unstable or displaced fractures'},{i:'⚖️',t:'Non-weight-bearing period as prescribed based on bone location'},{i:'📷',t:'Regular radiographic monitoring every 4–6 weeks during healing'}],
      recovery:[{i:'⏱️',t:'Typical recovery: 6–12 weeks for most longitudinal fractures'},{i:'🦯',t:'Progressive weight-bearing allowed after 4–6 weeks when early healing seen'},{i:'🏋️',t:'Strengthening exercises initiated once clinical and radiographic healing confirmed'},{i:'🏃',t:'Return to sport after full strength and functional restoration testing'}]
    },
    zh:{
      causes:[{i:'⬆️',t:'沿骨长轴方向施加的应力，平行于骨骼长度'},{i:'🎯',t:'沿骨干方向的直接纵向冲击或压缩载荷'},{i:'🦵',t:'常见于胫骨、腓骨和前臂骨损伤'},{i:'📊',t:'比横向或斜向骨折少见；多发于皮质骨'}],
      treatment:[{i:'🩼',t:'稳定、无移位骨折行石膏固定（6–8周）'},{i:'🔩',t:'不稳定或移位骨折行髓内钉或钢板固定'},{i:'⚖️',t:'根据骨骼部位遵医嘱不负重'},{i:'📷',t:'愈合期间每4–6周定期影像学复查'}],
      recovery:[{i:'⏱️',t:'大多数纵向骨折典型恢复期：6–12周'},{i:'🦯',t:'早期愈合显现后（4–6周），逐步允许负重'},{i:'🏋️',t:'临床和影像学愈合确认后开始力量训练'},{i:'🏃',t:'肌力和功能完全恢复并通过测试后方可恢复运动'}]
    },
    ko:{
      causes:[{i:'⬆️',t:'뼈의 긴 축을 따라 작용하는 스트레스, 뼈 길이에 평행'},{i:'🎯',t:'뼈간부를 따른 직접 종적 충격 또는 압박 부하'},{i:'🦵',t:'경골, 비골, 전완골 손상과 연관'},{i:'📊',t:'횡적·사선 골절보다 드묾; 피질골에서 주로 발생'}],
      treatment:[{i:'🩼',t:'안정적·비전위 골절에 석고붕대 고정(6-8주)'},{i:'🔩',t:'불안정 또는 전위 골절에 수질정 또는 금속판 고정'},{i:'⚖️',t:'뼈 부위에 따라 처방된 비체중부하 기간 준수'},{i:'📷',t:'치유 중 4-6주마다 정기 방사선 검사'}],
      recovery:[{i:'⏱️',t:'대부분의 종적 골절 전형적 회복: 6-12주'},{i:'🦯',t:'4-6주 후 초기 유합 확인 시 점진적 체중부하 허용'},{i:'🏋️',t:'임상적·방사선학적 유합 확인 후 근력 운동 시작'},{i:'🏃',t:'완전한 근력 및 기능 회복 확인 후 스포츠 복귀'}]
    }
  },
  oblique:{
    en:{
      causes:[{i:'↗️',t:'Angular or combined bending and axial force applied to the bone shaft'},{i:'🏂',t:'Sports falls with a twisting component (skiing, snowboarding, football)'},{i:'🔨',t:'Oblique blow to the bone at a 30–60° angle to its long axis'},{i:'🦵',t:'Common in femur, tibia, and humerus due to their length'}],
      treatment:[{i:'🩼',t:'Closed reduction and long cast for minimally displaced, stable fractures'},{i:'🔧',t:'Surgical plating or intramedullary nailing for displaced or unstable fractures'},{i:'📐',t:'Careful attention to rotational alignment during reduction and fixation'},{i:'🦯',t:'Traction pre-operatively for length and alignment restoration in long bones'}],
      recovery:[{i:'⏱️',t:'Recovery: 6–12 weeks depending on bone location and displacement'},{i:'🏋️',t:'Physiotherapy for range of motion, then progressive resistance training'},{i:'📷',t:'Progressive weight-bearing after radiographic evidence of callus formation'},{i:'🏃',t:'Return to sport after full strength recovery and symmetry testing'}]
    },
    zh:{
      causes:[{i:'↗️',t:'施加于骨干的斜向或弯曲与轴向复合力'},{i:'🏂',t:'带有扭转成分的运动摔倒（滑雪、单板滑雪、足球）'},{i:'🔨',t:'与骨长轴成30–60°角的斜向撞击'},{i:'🦵',t:'因长度原因，常见于股骨、胫骨和肱骨'}],
      treatment:[{i:'🩼',t:'轻度移位、稳定骨折行闭合复位和长管型石膏'},{i:'🔧',t:'移位或不稳定骨折行切开钢板固定或髓内钉固定'},{i:'📐',t:'复位和固定过程中注意旋转对线'},{i:'🦯',t:'长管骨术前牵引以恢复长度和对线'}],
      recovery:[{i:'⏱️',t:'恢复期：根据骨骼部位和移位程度，6–12周'},{i:'🏋️',t:'物理治疗恢复活动度，后进行渐进性阻力训练'},{i:'📷',t:'影像学见骨痂形成后逐步负重'},{i:'🏃',t:'肌力完全恢复并通过对称性测试后恢复运动'}]
    },
    ko:{
      causes:[{i:'↗️',t:'뼈간부에 가해지는 각도 또는 굽힘·축성 복합력'},{i:'🏂',t:'비틀림 요소가 있는 스포츠 낙상(스키, 스노보드, 축구)'},{i:'🔨',t:'뼈 긴 축에 30-60° 각도로 가해지는 사선 충격'},{i:'🦵',t:'길이로 인해 대퇴골, 경골, 상완골에서 흔함'}],
      treatment:[{i:'🩼',t:'최소 전위·안정 골절에 폐쇄 정복 및 장상지 석고붕대'},{i:'🔧',t:'전위 또는 불안정 골절에 수술적 금속판 또는 수질정 고정'},{i:'📐',t:'정복과 고정 시 회전 정렬에 세심한 주의'},{i:'🦯',t:'장관골에서 수술 전 견인으로 길이 및 정렬 회복'}],
      recovery:[{i:'⏱️',t:'회복: 뼈 위치와 전위 정도에 따라 6-12주'},{i:'🏋️',t:'물리치료로 관절 가동 회복, 이후 점진적 저항 운동'},{i:'📷',t:'방사선학적 가골 형성 확인 후 점진적 체중부하'},{i:'🏃',t:'완전 근력 회복 및 대칭성 검사 통과 후 스포츠 복귀'}]
    }
  },
  pathological:{
    en:{
      causes:[{i:'🦴',t:'Osteoporosis: reduced bone mineral density allows fracture with minimal trauma'},{i:'🎗️',t:'Primary bone tumors (osteosarcoma, chondrosarcoma) or metastatic disease'},{i:'🦠',t:'Bone infections: osteomyelitis weakening cortical and cancellous bone'},{i:'🔬',t:'Metabolic disorders: Paget\'s disease, bone cysts, fibrous dysplasia'}],
      treatment:[{i:'🏥',t:'Treat the underlying disease first — fracture fixation alone is insufficient'},{i:'🔧',t:'Surgical stabilization: prophylactic or therapeutic intramedullary nailing/plating'},{i:'☢️',t:'Radiation therapy for malignant metastatic lesions causing fracture'},{i:'💊',t:'Bisphosphonates for osteoporosis; chemotherapy/targeted therapy for malignancy'}],
      recovery:[{i:'⏱️',t:'Benign causes (cyst, Paget\'s): 8–16 weeks after fixation'},{i:'🎗️',t:'Malignant causes: prognosis depends on primary disease stage and treatment response'},{i:'👨‍⚕️',t:'Multidisciplinary team essential: orthopedics, oncology, radiology, rehabilitation'},{i:'🏠',t:'Long-term bone health monitoring and fall prevention measures important'}]
    },
    zh:{
      causes:[{i:'🦴',t:'骨质疏松：骨矿物质密度降低，轻微创伤即可发生骨折'},{i:'🎗️',t:'原发性骨肿瘤（骨肉瘤、软骨肉瘤）或转移性病变'},{i:'🦠',t:'骨感染：骨髓炎使皮质骨和松质骨受损变弱'},{i:'🔬',t:'代谢性疾病：Paget病、骨囊肿、纤维性骨发育不良'}],
      treatment:[{i:'🏥',t:'首先治疗基础疾病——单纯固定骨折不够'},{i:'🔧',t:'手术稳定：预防性或治疗性髓内钉或钢板固定'},{i:'☢️',t:'导致骨折的恶性转移灶行放射治疗'},{i:'💊',t:'骨质疏松用二膦酸盐；恶性肿瘤用化疗/靶向治疗'}],
      recovery:[{i:'⏱️',t:'良性原因（囊肿、Paget病）：固定后8–16周'},{i:'🎗️',t:'恶性原因：预后取决于原发病分期和治疗反应'},{i:'👨‍⚕️',t:'多学科团队协作至关重要：骨科、肿瘤科、影像科、康复科'},{i:'🏠',t:'长期骨骼健康监测和防跌倒措施不可或缺'}]
    },
    ko:{
      causes:[{i:'🦴',t:'골다공증: 골밀도 감소로 최소 외상에도 골절 발생'},{i:'🎗️',t:'원발성 골종양(골육종, 연골육종) 또는 전이성 병변'},{i:'🦠',t:'골 감염: 골수염으로 피질골·해면골 약화'},{i:'🔬',t:'대사 장애: 파제트병, 골낭종, 섬유성 이형성증'}],
      treatment:[{i:'🏥',t:'기저 질환 먼저 치료 — 골절 고정만으로는 불충분'},{i:'🔧',t:'수술적 안정화: 예방적 또는 치료적 수질정·금속판 고정'},{i:'☢️',t:'골절을 유발하는 악성 전이 병변에 방사선 치료'},{i:'💊',t:'골다공증에 비스포스포네이트; 악성 종양에 항암·표적 치료'}],
      recovery:[{i:'⏱️',t:'양성 원인(낭종, 파제트병): 고정 후 8-16주'},{i:'🎗️',t:'악성 원인: 예후는 원발 질환 병기 및 치료 반응에 따라 다름'},{i:'👨‍⚕️',t:'다학제 팀 필수: 정형외과, 종양내과, 영상의학과, 재활의학과'},{i:'🏠',t:'장기 골 건강 모니터링 및 낙상 예방 조치 중요'}]
    }
  },
  spiral:{
    en:{
      causes:[{i:'🔄',t:'Rotational or torsional force applied along the bone\'s long axis'},{i:'⛷️',t:'Skiing, football, wrestling, dancing — sports with rotational mechanics'},{i:'👣',t:'Tripping or stumbling with foot fixed while body rotates (e.g., stepping off a curb)'},{i:'⚠️',t:'In children: unexplained spiral fractures warrant safeguarding assessment'}],
      treatment:[{i:'🩼',t:'Closed reduction and long arm/leg cast for stable, minimally displaced fractures'},{i:'🔧',t:'Surgical fixation (intramedullary nail or plate) for displaced or unstable fractures'},{i:'👁️',t:'Close monitoring for displacement during conservative cast management'},{i:'🦯',t:'Non-weight-bearing for 4–6 weeks to protect rotational alignment'}],
      recovery:[{i:'⏱️',t:'Recovery: 6–12 weeks; rotational alignment critical for functional outcome'},{i:'🤸',t:'Proprioception and balance training essential for preventing re-injury'},{i:'🔄',t:'Sport-specific rotational strength and stability program before return to play'},{i:'🏃',t:'Full strength symmetry testing prior to return to rotational sports activities'}]
    },
    zh:{
      causes:[{i:'🔄',t:'沿骨长轴施加的旋转或扭转力'},{i:'⛷️',t:'滑雪、足球、摔跤、舞蹈——含旋转动作的运动'},{i:'👣',t:'足固定而身体旋转时绊倒（如走下路缘石）'},{i:'⚠️',t:'儿童：不明原因的螺旋骨折需评估是否存在虐待'}],
      treatment:[{i:'🩼',t:'稳定、轻度移位骨折行闭合复位和长管型石膏'},{i:'🔧',t:'移位或不稳定骨折行手术固定（髓内钉或钢板）'},{i:'👁️',t:'保守石膏治疗期间密切监测是否移位'},{i:'🦯',t:'不负重4–6周以保护旋转对线'}],
      recovery:[{i:'⏱️',t:'恢复期：6–12周；旋转对线对功能预后至关重要'},{i:'🤸',t:'本体感觉和平衡训练对预防再损伤不可或缺'},{i:'🔄',t:'复出前进行专项旋转力量和稳定性训练'},{i:'🏃',t:'恢复旋转运动项目前需完成双侧肌力对称性测试'}]
    },
    ko:{
      causes:[{i:'🔄',t:'뼈 긴 축을 따라 가해지는 회전 또는 비틀힘'},{i:'⛷️',t:'스키, 풋볼, 레슬링, 댄스 — 회전 역학이 포함된 스포츠'},{i:'👣',t:'발이 고정된 상태에서 몸이 회전하며 넘어짐(보도블록에서 내려오기 등)'},{i:'⚠️',t:'소아: 원인 불명의 나선형 골절은 아동 보호 평가 필요'}],
      treatment:[{i:'🩼',t:'안정적·최소 전위 골절에 폐쇄 정복 및 장상·하지 석고붕대'},{i:'🔧',t:'전위 또는 불안정 골절에 수술적 고정(수질정 또는 금속판)'},{i:'👁️',t:'보존적 석고 치료 중 전위에 대한 면밀한 모니터링'},{i:'🦯',t:'회전 정렬 보호를 위해 4-6주 비체중부하'}],
      recovery:[{i:'⏱️',t:'회복: 6-12주; 회전 정렬이 기능적 예후에 결정적'},{i:'🤸',t:'재손상 방지를 위한 고유 감각·균형 훈련 필수'},{i:'🔄',t:'복귀 전 스포츠별 회전 근력·안정성 프로그램 이수'},{i:'🏃',t:'회전 스포츠 복귀 전 양측 근력 대칭성 검사 완료'}]
    }
  }
};

// ── i18n translations ──────────────────────────────────
const T = {
  en:{
    'nav.brand':'BoneScan AI','nav.overview':'Overview','nav.atlas':'Atlas','nav.analytics':'Analytics','nav.pipeline':'Pipeline','nav.versions':'Versions',
    'hero.badge':'Medical AI Dataset','hero.line1':'Bone Fracture','hero.line2':'Intelligence','hero.desc':'A high-resolution X-ray imaging dataset spanning 10 fracture classifications, engineered for deep-learning model training, validation, and comparative benchmarking.','hero.s1':'Total Images','hero.s2':'Fracture Types','hero.s3':'Dataset Versions','hero.scroll':'Scroll',
    'ov.title':'Dataset at a Glance','ov.sub':'Comprehensive statistics across both dataset versions.','ov.c1l':'Clean Split Images','ov.c1s':'After deduplication & augmentation','ov.c2l':'Fixed Dataset Images','ov.c2s':'Refined train/test partitioning','ov.c3l':'Training Samples','ov.c3s':'Clean split train set','ov.c4l':'Fracture Categories','ov.c4s':'Clinically validated types',
    'atlas.eyebrow':'Fracture Atlas','atlas.title':'10 Fracture Classifications','atlas.sub':'Click any card to view details, annotate the X-ray, and explore causes, treatment & recovery.','atlas.train':'Train','atlas.test':'Test','atlas.hint':'Click to explore',
    'an.eyebrow':'Data Analytics','an.title':'Visual Intelligence','an.sub':'Explore distribution patterns and split ratios across both dataset versions.','an.chart1':'Image Distribution by Fracture Type','an.chart2':'Train / Test Split','an.chart3':'Dataset Version Comparison','an.l_train':'Train','an.l_test':'Test','an.l_v1':'Clean Split','an.l_v2':'Fixed Dataset',
    'pipe.eyebrow':'Data Pipeline','pipe.title':'From Raw to Ready','pipe.sub':'A rigorous multi-stage pipeline ensures dataset quality and reproducibility.','pipe.s1n':'Step 01','pipe.s1t':'Raw Collection','pipe.s1d':'Original X-ray images sourced from peer-reviewed clinical papers, medical databases, and open-access repositories. Initial pool: 1,200+ images across 10 fracture types.','pipe.s2n':'Step 02','pipe.s2t':'Deduplication','pipe.s2d':'MD5 hash matching eliminated exact duplicates. Perceptual hashing (pHash) removed visually similar augmented pairs, reducing noise in training data.','pipe.s3n':'Step 03','pipe.s3t':'Augmentation','pipe.s3d':'Controlled augmentation including rotations, flips, brightness and contrast variations applied to balance class distributions across training samples.','pipe.s4n':'Step 04','pipe.s4t':'Train / Test Split','pipe.s4d':'Stratified random splitting into 80% training and 20% testing sets. The fixed dataset further refined split boundaries to reduce class imbalance.','pipe.s1tag':'Raw Data','pipe.s2tag':'MD5 + pHash','pipe.s3tag':'Augmentation','pipe.s4tag':'Stratified Split',
    'ver.eyebrow':'Dataset Versions','ver.title':'Two Refined Versions','ver.sub':'Iterative improvements across pipeline stages produced two distinct, deployable datasets.','ver.v1tag':'Version 1','ver.v1name':'Clean Split','ver.v1desc':'Deduplicated and augmented dataset with MD5 and perceptual hash filtering. Balanced class distribution with stratified train/test split.','ver.v2tag':'Version 2','ver.v2name':'Fixed Dataset','ver.v2desc':'Refined version with improved train/test partitioning. Stricter split boundaries reduce class imbalance for more reliable model evaluation.','ver.total':'Total','ver.train':'Train','ver.test':'Test','ver.types':'Types',
    'ft.logo':'BoneScan AI','ft.desc':'A research-grade bone fracture X-ray dataset for advancing medical artificial intelligence and diagnostic automation.','ft.col2':'Dataset Info','ft.col3':'Technical','ft.source':'Source','ft.src_v':'Clinical X-ray archives','ft.types':'Classes','ft.types_v':'10 fracture types','ft.format':'Format','ft.format_v':'JPEG (augmented)','ft.split':'Split','ft.split_v':'80% train / 20% test','ft.hash':'Dedup','ft.hash_v':'MD5 + pHash','ft.copy':'© 2025 BoneScan AI Dataset','ft.rights':'For research & educational use',
    'dm.tab_causes':'Causes','dm.tab_treatment':'Treatment','dm.tab_recovery':'Recovery',
    'dm.draw_hint':'Drag to circle the fracture area · Tap color to change','dm.undo':'↩ Undo','dm.clear':'Clear All','dm.train':'Train','dm.test':'Test','dm.total':'Total'
  },
  zh:{
    'nav.brand':'骨扫AI','nav.overview':'概览','nav.atlas':'骨折图谱','nav.analytics':'数据分析','nav.pipeline':'数据管道','nav.versions':'版本',
    'hero.badge':'医疗AI数据集','hero.line1':'骨折','hero.line2':'智能数据集','hero.desc':'涵盖10种临床骨折类型的高分辨率X射线影像数据集，专为深度学习模型训练、验证与基准测试而精心设计。','hero.s1':'影像总数','hero.s2':'骨折类型','hero.s3':'数据集版本','hero.scroll':'滚动',
    'ov.title':'数据集概览','ov.sub':'两个数据集版本的综合统计信息。','ov.c1l':'清洁分割影像','ov.c1s':'去重与增强后','ov.c2l':'修正数据集影像','ov.c2s':'优化训练/测试划分','ov.c3l':'训练样本','ov.c3s':'清洁分割训练集','ov.c4l':'骨折分类','ov.c4s':'临床验证类型',
    'atlas.eyebrow':'骨折图谱','atlas.title':'十种骨折分类','atlas.sub':'点击任意卡片可查看详情、标注X射线片，并了解病因、治疗与康复方案。','atlas.train':'训练','atlas.test':'测试','atlas.hint':'点击探索',
    'an.eyebrow':'数据分析','an.title':'可视化智能','an.sub':'探索两个数据集版本的分布规律与分割比例。','an.chart1':'各骨折类型影像分布','an.chart2':'训练/测试分割','an.chart3':'数据集版本对比','an.l_train':'训练集','an.l_test':'测试集','an.l_v1':'清洁分割','an.l_v2':'修正数据集',
    'pipe.eyebrow':'数据管道','pipe.title':'从原始到就绪','pipe.sub':'严格的多阶段管道确保数据集质量与可重现性。','pipe.s1n':'步骤 01','pipe.s1t':'原始采集','pipe.s1d':'原始X射线影像来源于同行评审临床论文、医学数据库及开放获取存储库。初始池：超1200张影像，涵盖10种骨折类型。','pipe.s2n':'步骤 02','pipe.s2t':'去重处理','pipe.s2d':'MD5哈希匹配消除完全重复项。感知哈希（pHash）去除视觉相似的增强图像对，降低训练数据噪声。','pipe.s3n':'步骤 03','pipe.s3t':'数据增强','pipe.s3d':'施以旋转、翻转、亮度与对比度变化等受控增强，平衡训练样本中的类别分布。','pipe.s4n':'步骤 04','pipe.s4t':'训练/测试分割','pipe.s4d':'按80%训练、20%测试进行分层随机分割。修正数据集进一步优化分割边界，降低类别不平衡。','pipe.s1tag':'原始数据','pipe.s2tag':'MD5 + pHash','pipe.s3tag':'数据增强','pipe.s4tag':'分层分割',
    'ver.eyebrow':'数据集版本','ver.title':'两个精炼版本','ver.sub':'经过迭代优化，产出两个可直接部署的高质量数据集。','ver.v1tag':'版本一','ver.v1name':'清洁分割','ver.v1desc':'经MD5与感知哈希过滤的去重增强数据集。均衡类别分布，分层训练/测试分割。','ver.v2tag':'版本二','ver.v2name':'修正数据集','ver.v2desc':'改进训练/测试划分的精炼版本。更严格的分割边界降低类别不平衡，提升模型评估可靠性。','ver.total':'总计','ver.train':'训练','ver.test':'测试','ver.types':'类型',
    'ft.logo':'骨扫AI','ft.desc':'面向医疗人工智能与诊断自动化进步的研究级骨折X射线数据集。','ft.col2':'数据集信息','ft.col3':'技术规格','ft.source':'来源','ft.src_v':'临床X射线档案','ft.types':'类别','ft.types_v':'10种骨折类型','ft.format':'格式','ft.format_v':'JPEG（增强）','ft.split':'分割','ft.split_v':'80% 训练 / 20% 测试','ft.hash':'去重','ft.hash_v':'MD5 + pHash','ft.copy':'© 2025 骨扫AI数据集','ft.rights':'仅供研究与教育使用',
    'dm.tab_causes':'病因','dm.tab_treatment':'治疗','dm.tab_recovery':'康复',
    'dm.draw_hint':'拖拽以圈出骨折区域 · 点击颜色切换','dm.undo':'↩ 撤销','dm.clear':'清除全部','dm.train':'训练','dm.test':'测试','dm.total':'总计'
  },
  ko:{
    'nav.brand':'본스캔 AI','nav.overview':'개요','nav.atlas':'골절 도감','nav.analytics':'데이터 분석','nav.pipeline':'파이프라인','nav.versions':'버전',
    'hero.badge':'의료 AI 데이터셋','hero.line1':'골절','hero.line2':'인공지능 데이터셋','hero.desc':'딥러닝 모델 훈련, 검증 및 벤치마크를 위해 설계된 10가지 임상 골절 유형의 고해상도 X선 영상 데이터셋입니다.','hero.s1':'총 이미지','hero.s2':'골절 유형','hero.s3':'데이터셋 버전','hero.scroll':'스크롤',
    'ov.title':'데이터셋 한눈에 보기','ov.sub':'두 데이터셋 버전의 종합 통계입니다.','ov.c1l':'클린 스플릿 이미지','ov.c1s':'중복 제거 및 증강 후','ov.c2l':'수정 데이터셋 이미지','ov.c2s':'개선된 훈련/테스트 분할','ov.c3l':'훈련 샘플','ov.c3s':'클린 스플릿 훈련 세트','ov.c4l':'골절 분류','ov.c4s':'임상 검증 유형',
    'atlas.eyebrow':'골절 도감','atlas.title':'10가지 골절 분류','atlas.sub':'카드를 클릭하면 상세 정보를 보고, X선을 표시하며, 병인·치료·재활을 탐색할 수 있습니다.','atlas.train':'훈련','atlas.test':'테스트','atlas.hint':'클릭하여 탐색',
    'an.eyebrow':'데이터 분석','an.title':'시각적 인텔리전스','an.sub':'두 데이터셋 버전의 분포 패턴과 분할 비율을 탐색하세요.','an.chart1':'골절 유형별 이미지 분포','an.chart2':'훈련 / 테스트 분할','an.chart3':'데이터셋 버전 비교','an.l_train':'훈련','an.l_test':'테스트','an.l_v1':'클린 스플릿','an.l_v2':'수정 데이터셋',
    'pipe.eyebrow':'데이터 파이프라인','pipe.title':'원시 데이터에서 준비 완료까지','pipe.sub':'엄격한 다단계 파이프라인이 데이터셋 품질과 재현성을 보장합니다.','pipe.s1n':'단계 01','pipe.s1t':'원시 수집','pipe.s1d':'동료 검토 임상 논문, 의학 데이터베이스 및 오픈 액세스 저장소에서 원본 X선 이미지 수집. 초기 풀: 10가지 골절 유형에 걸쳐 1,200장 이상.','pipe.s2n':'단계 02','pipe.s2t':'중복 제거','pipe.s2d':'MD5 해시 매칭으로 정확한 중복 제거. 인지 해싱(pHash)으로 시각적으로 유사한 증강 쌍 제거, 훈련 데이터 노이즈 감소.','pipe.s3n':'단계 03','pipe.s3t':'데이터 증강','pipe.s3d':'훈련 샘플의 클래스 분포 균형을 위해 회전, 뒤집기, 밝기 및 대비 변화를 포함한 제어된 증강 적용.','pipe.s4n':'단계 04','pipe.s4t':'훈련/테스트 분할','pipe.s4d':'80% 훈련, 20% 테스트로 층화 무작위 분할. 수정 데이터셋은 클래스 불균형 감소를 위해 분할 경계 추가 개선.','pipe.s1tag':'원시 데이터','pipe.s2tag':'MD5 + pHash','pipe.s3tag':'데이터 증강','pipe.s4tag':'층화 분할',
    'ver.eyebrow':'데이터셋 버전','ver.title':'두 가지 정제된 버전','ver.sub':'반복적인 파이프라인 개선을 통해 두 가지 배포 가능한 데이터셋이 생성되었습니다.','ver.v1tag':'버전 1','ver.v1name':'클린 스플릿','ver.v1desc':'MD5 및 인지 해시 필터링을 통한 중복 제거 및 증강 데이터셋. 균형 잡힌 클래스 분포와 층화 훈련/테스트 분할.','ver.v2tag':'버전 2','ver.v2name':'수정 데이터셋','ver.v2desc':'개선된 훈련/테스트 분할의 정제된 버전. 더 엄격한 분할 경계로 클래스 불균형 감소.','ver.total':'합계','ver.train':'훈련','ver.test':'테스트','ver.types':'유형',
    'ft.logo':'본스캔 AI','ft.desc':'의료 인공지능 발전과 진단 자동화를 위한 연구 등급 골절 X선 데이터셋.','ft.col2':'데이터셋 정보','ft.col3':'기술 사양','ft.source':'출처','ft.src_v':'임상 X선 아카이브','ft.types':'클래스','ft.types_v':'10가지 골절 유형','ft.format':'형식','ft.format_v':'JPEG (증강)','ft.split':'분할','ft.split_v':'80% 훈련 / 20% 테스트','ft.hash':'중복 제거','ft.hash_v':'MD5 + pHash','ft.copy':'© 2025 본스캔 AI 데이터셋','ft.rights':'연구 및 교육 목적으로만 사용',
    'dm.tab_causes':'원인','dm.tab_treatment':'치료','dm.tab_recovery':'재활',
    'dm.draw_hint':'드래그하여 골절 부위를 표시 · 색상을 탭하여 변경','dm.undo':'↩ 실행취소','dm.clear':'전체 지우기','dm.train':'훈련','dm.test':'테스트','dm.total':'합계'
  }
};

// ── Fracture type definitions ──────────────────────────
const FRACTURES=[
  {id:'avulsion',    color:'#00B4FF',glow:'rgba(0,180,255,.13)', en:{name:'Avulsion Fracture',    sub:'撕脱性骨折 / 견열 골절',    desc:'A bone fragment pulled away at a tendon or ligament attachment by sudden forceful contraction.'},zh:{name:'撕脱性骨折',sub:'Avulsion Fracture',desc:'肌腱或韧带附着处因突然猛力收缩而导致骨片撕脱分离。'},ko:{name:'견열 골절',sub:'Avulsion Fracture',desc:'힘줄이나 인대 부착 부위에서 갑작스러운 강한 수축으로 뼈 조각이 분리됩니다.'}, train:97,test:24},
  {id:'comminuted',  color:'#FF5252',glow:'rgba(255,82,82,.13)',  en:{name:'Comminuted Fracture',   sub:'粉碎性骨折 / 분쇄 골절',    desc:'The bone shatters into three or more fragments, typically from high-energy trauma.'},zh:{name:'粉碎性骨折',sub:'Comminuted Fracture',desc:'骨骼破碎成三块或更多碎片，通常由高能量创伤引起。'},ko:{name:'분쇄 골절',sub:'Comminuted Fracture',desc:'뼈가 세 개 이상의 조각으로 부서지며, 주로 고에너지 외상으로 발생합니다.'}, train:114,test:29},
  {id:'dislocation', color:'#FF8C42',glow:'rgba(255,140,66,.13)', en:{name:'Fracture Dislocation',  sub:'骨折脱位 / 골절 탈구',       desc:'A fracture at or near a joint with simultaneous displacement of joint surfaces.'},zh:{name:'骨折脱位',sub:'Fracture Dislocation',desc:'发生在关节处或附近的骨折，同时伴有关节面移位。'},ko:{name:'골절 탈구',sub:'Fracture Dislocation',desc:'관절부 또는 인근에서 관절면의 동시 전위를 동반한 골절입니다.'}, train:123,test:31},
  {id:'greenstick',  color:'#00E676',glow:'rgba(0,230,118,.13)',  en:{name:'Greenstick Fracture',   sub:'青枝骨折 / 청지 골절',       desc:'Incomplete fracture where the bone bends and only partially breaks, common in children.'},zh:{name:'青枝骨折',sub:'Greenstick Fracture',desc:'不完全骨折，骨骼弯曲并仅部分断裂，多见于儿童。'},ko:{name:'청지 골절',sub:'Greenstick Fracture',desc:'뼈가 구부러지고 부분적으로만 부러지는 불완전 골절, 소아에서 흔합니다.'}, train:96,test:24},
  {id:'hairline',    color:'#00E5FF',glow:'rgba(0,229,255,.13)',  en:{name:'Hairline Fracture',     sub:'发际线骨折 / 미세 골절',     desc:'A narrow stress crack in the bone from repetitive loading, also called a stress fracture.'},zh:{name:'发际线骨折',sub:'Hairline Fracture',desc:'因重复性压力导致的骨骼细裂纹，也称为应力性骨折。'},ko:{name:'미세 골절',sub:'Hairline Fracture',desc:'반복적 부하로 인한 뼈의 가는 균열로, 피로 골절이라고도 합니다.'}, train:89,test:22},
  {id:'impacted',    color:'#FFD600',glow:'rgba(255,214,0,.13)',  en:{name:'Impacted Fracture',     sub:'嵌插骨折 / 감입 골절',       desc:'One bone fragment driven into another, compressing the cancellous bone.'},zh:{name:'嵌插骨折',sub:'Impacted Fracture',desc:'一块骨碎片嵌入另一块，压缩松质骨，常见于脊柱和腕部。'},ko:{name:'감입 골절',sub:'Impacted Fracture',desc:'한 뼈 조각이 다른 조각으로 밀려 들어가 해면골을 압박합니다.'}, train:65,test:16},
  {id:'longitudinal',color:'#818CF8',glow:'rgba(129,140,248,.13)',en:{name:'Longitudinal Fracture', sub:'纵向骨折 / 종적 골절',        desc:'The fracture line runs parallel to the long axis of the bone.'},zh:{name:'纵向骨折',sub:'Longitudinal Fracture',desc:'骨折线平行于骨骼长轴延伸，比横向或斜向骨折少见。'},ko:{name:'종적 골절',sub:'Longitudinal Fracture',desc:'골절선이 뼈의 긴 축에 평행하게 주행합니다.'}, train:62,test:16},
  {id:'oblique',     color:'#00E5C8',glow:'rgba(0,229,200,.13)',  en:{name:'Oblique Fracture',      sub:'斜形骨折 / 사형 골절',        desc:'The fracture line runs diagonally across the bone shaft from angular loading.'},zh:{name:'斜形骨折',sub:'Oblique Fracture',desc:'骨折线沿骨干斜向延伸，由斜向载荷力引起。'},ko:{name:'사형 골절',sub:'Oblique Fracture',desc:'각도 부하력에 의해 골절선이 뼈간부를 대각선으로 주행합니다.'}, train:66,test:17},
  {id:'pathological',color:'#9B5FFF',glow:'rgba(155,95,255,.13)', en:{name:'Pathological Fracture', sub:'病理性骨折 / 병리성 골절',     desc:'A fracture in diseased or weakened bone with minimal trauma due to osteoporosis, tumors, or infections.'},zh:{name:'病理性骨折',sub:'Pathological Fracture',desc:'在病变或骨质脆弱部位发生的骨折，原因包括骨质疏松、肿瘤、感染等。'},ko:{name:'병리성 골절',sub:'Pathological Fracture',desc:'골다공증, 종양, 감염 등으로 약화된 뼈에서 최소 외상으로 발생하는 골절.'}, train:106,test:26},
  {id:'spiral',      color:'#FF6B9D',glow:'rgba(255,107,157,.13)', en:{name:'Spiral Fracture',       sub:'螺旋形骨折 / 나선형 골절',    desc:'The fracture spirals around the bone shaft from a torsional (twisting) force.'},zh:{name:'螺旋形骨折',sub:'Spiral Fracture',desc:'由扭转力导致骨折沿骨干螺旋延伸，X射线上可见螺旋形态。'},ko:{name:'나선형 골절',sub:'Spiral Fracture',desc:'비틀힘으로 골절이 뼈간부를 나선형으로 감쌉니다.'}, train:67,test:17}
];

// ── State ───────────────────────────────────────────────
let lang = 'en';
let charts = {};
let annotations = [];
let currentColor = '#FF3333';
let isDrawing = false;
let startX = 0, startY = 0;
let activeTab = 'causes';
let annotCanvas, annotCtx;

// ── i18n ───────────────────────────────────────────────
function applyLang(l) {
  lang = l;
  document.documentElement.lang = l === 'ko' ? 'ko' : l === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = T[l][el.dataset.i18n];
    if (v !== undefined) el.textContent = v;
  });
  document.querySelectorAll('.atlas-card').forEach(card => {
    const f = FRACTURES.find(x => x.id === card.dataset.fid);
    if (!f) return;
    const ld = f[l];
    card.querySelector('.atlas-name').textContent = ld.name;
    card.querySelector('.atlas-name-sub').textContent = ld.sub;
    card.querySelector('.atlas-desc').textContent = ld.desc;
    card.querySelector('.as-train-l').textContent = T[l]['atlas.train'];
    card.querySelector('.as-test-l').textContent = T[l]['atlas.test'];
    card.querySelector('.atlas-hint-text').textContent = T[l]['atlas.hint'];
  });
  updateCharts();
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
}

// ── Build Atlas ────────────────────────────────────────
function buildAtlas() {
  const grid = document.getElementById('atlas-grid');
  FRACTURES.forEach((f, i) => {
    const ld = f[lang];
    const card = document.createElement('div');
    card.className = 'atlas-card reveal';
    card.dataset.fid = f.id;
    card.style.setProperty('--ac-glow', f.glow);
    card.innerHTML = `
      <div class="atlas-img">
        <img src="images/${f.id}.jpg" alt="${ld.name}" loading="lazy">
        <div class="atlas-img-fade"></div>
        <span class="atlas-badge" style="background:${f.color}1A;color:${f.color};border:1px solid ${f.color}40">${f.id.toUpperCase()}</span>
        <span class="atlas-idx">${String(i+1).padStart(2,'0')}</span>
        <div class="atlas-hint"><span>🔍</span><span class="atlas-hint-text">${T[lang]['atlas.hint']}</span></div>
      </div>
      <div class="atlas-body">
        <div class="atlas-name">${ld.name}</div>
        <div class="atlas-name-sub">${ld.sub}</div>
        <div class="atlas-desc">${ld.desc}</div>
        <div class="atlas-stats">
          <div class="atlas-stat"><span class="atlas-stat-n" style="color:${f.color}">${f.train}</span><span class="atlas-stat-l as-train-l">${T[lang]['atlas.train']}</span></div>
          <div class="atlas-stat"><span class="atlas-stat-n" style="color:${f.color}">${f.test}</span><span class="atlas-stat-l as-test-l">${T[lang]['atlas.test']}</span></div>
          <div class="atlas-stat"><span class="atlas-stat-n" style="color:${f.color}">${f.train+f.test}</span><span class="atlas-stat-l">Total</span></div>
        </div>
      </div>`;
    card.addEventListener('click', () => openModal(f));
    grid.appendChild(card);
  });
}

// ── Detail Modal ───────────────────────────────────────
function openModal(f) {
  const modal = document.getElementById('detail-modal');
  const ld = f[lang];
  // Set image
  document.getElementById('dm-xray').src = `images/${f.id}.jpg`;
  document.getElementById('dm-xray').alt = ld.name;
  // Set header
  const badge = document.getElementById('dm-badge');
  badge.textContent = f.id.toUpperCase();
  badge.style.background = f.color + '1A';
  badge.style.color = f.color;
  badge.style.borderColor = f.color + '44';
  document.getElementById('dm-name').textContent = ld.name;
  document.getElementById('dm-sub').textContent = ld.sub;
  // Set tabs
  document.querySelectorAll('.dm-tab').forEach(t => {
    t.textContent = T[lang][`dm.tab_${t.dataset.tab}`] || t.dataset.tab;
    t.classList.toggle('active', t.dataset.tab === 'causes');
  });
  // Render panels
  renderMedPanel('causes', f);
  renderMedPanel('treatment', f);
  renderMedPanel('recovery', f);
  showPanel('causes');
  // Stats
  document.getElementById('dm-sn-train').textContent = f.train;
  document.getElementById('dm-sn-test').textContent = f.test;
  document.getElementById('dm-sn-total').textContent = f.train + f.test;
  document.getElementById('dm-sl-train').textContent = T[lang]['dm.train'];
  document.getElementById('dm-sl-test').textContent = T[lang]['dm.test'];
  document.getElementById('dm-sl-total').textContent = T[lang]['dm.total'];
  document.getElementById('dm-stat-train').style.borderTopColor = f.color;
  document.getElementById('dm-stat-test').style.borderTopColor = f.color;
  document.getElementById('dm-stat-total').style.borderTopColor = f.color;
  // Toolbar i18n
  document.getElementById('dm-undo-btn').textContent = T[lang]['dm.undo'];
  document.getElementById('dm-clear-btn').textContent = T[lang]['dm.clear'];
  document.getElementById('dm-draw-hint').textContent = T[lang]['dm.draw_hint'];
  // Reset canvas
  annotations = [];
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Init canvas after image loads
  const xray = document.getElementById('dm-xray');
  if (xray.complete) initAnnotCanvas();
  else xray.onload = initAnnotCanvas;
}

function renderMedPanel(tab, f) {
  const panel = document.getElementById(`panel-${tab}`);
  const med = MED[f.id];
  if (!med) { panel.innerHTML = ''; return; }
  const items = med[lang][tab] || med.en[tab];
  panel.innerHTML = `<div class="med-items">${items.map(item => `
    <div class="med-item">
      <div class="med-item-icon">${item.i}</div>
      <div class="med-item-text">${item.t}</div>
    </div>`).join('')}
  </div>`;
}

function showPanel(tab) {
  activeTab = tab;
  document.querySelectorAll('.dm-panel').forEach(p => p.classList.toggle('active', p.id === `panel-${tab}`));
  document.querySelectorAll('.dm-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
}

function closeModal() {
  document.getElementById('detail-modal').classList.remove('open');
  document.body.style.overflow = '';
}

// ── Annotation Canvas ──────────────────────────────────
function initAnnotCanvas() {
  annotCanvas = document.getElementById('annot-canvas');
  annotCtx = annotCanvas.getContext('2d');
  resizeAnnotCanvas();
}

function resizeAnnotCanvas() {
  if (!annotCanvas) return;
  const wrap = annotCanvas.parentElement;
  const rect = wrap.getBoundingClientRect();
  annotCanvas.width = rect.width;
  annotCanvas.height = rect.height;
  drawAllAnnotations();
}

function getCoords(e) {
  const rect = annotCanvas.getBoundingClientRect();
  const scaleX = annotCanvas.width / rect.width;
  const scaleY = annotCanvas.height / rect.height;
  if (e.touches && e.touches.length > 0) {
    return {
      x: (e.touches[0].clientX - rect.left) * scaleX,
      y: (e.touches[0].clientY - rect.top) * scaleY
    };
  }
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}

function drawCircle(x, y, r, color, temp) {
  if (r < 4) return;
  annotCtx.save();
  annotCtx.beginPath();
  annotCtx.arc(x, y, r, 0, Math.PI * 2);
  annotCtx.strokeStyle = color;
  annotCtx.lineWidth = temp ? 2 : 2.5;
  annotCtx.shadowColor = color;
  annotCtx.shadowBlur = temp ? 6 : 10;
  if (!temp) { annotCtx.globalAlpha = 0.9; }
  else { annotCtx.setLineDash([6, 4]); annotCtx.globalAlpha = 0.7; }
  annotCtx.stroke();
  annotCtx.restore();
}

function drawAllAnnotations() {
  if (!annotCtx) return;
  annotCtx.clearRect(0, 0, annotCanvas.width, annotCanvas.height);
  annotations.forEach(a => drawCircle(a.x, a.y, a.r, a.color, false));
}

function startDraw(e) {
  e.preventDefault();
  const c = getCoords(e);
  startX = c.x; startY = c.y;
  isDrawing = true;
}
function moveDraw(e) {
  if (!isDrawing) return;
  e.preventDefault();
  const c = getCoords(e);
  const dx = c.x - startX, dy = c.y - startY;
  const r = Math.sqrt(dx*dx + dy*dy);
  drawAllAnnotations();
  drawCircle(startX, startY, r, currentColor, true);
}
function endDraw(e) {
  if (!isDrawing) return;
  e.preventDefault();
  isDrawing = false;
  let ex, ey;
  if (e.changedTouches && e.changedTouches.length > 0) {
    const rect = annotCanvas.getBoundingClientRect();
    const scaleX = annotCanvas.width / rect.width;
    const scaleY = annotCanvas.height / rect.height;
    ex = (e.changedTouches[0].clientX - rect.left) * scaleX;
    ey = (e.changedTouches[0].clientY - rect.top) * scaleY;
  } else {
    const c = getCoords(e);
    ex = c.x; ey = c.y;
  }
  const dx = ex - startX, dy = ey - startY;
  const r = Math.sqrt(dx*dx + dy*dy);
  if (r > 4) {
    annotations.push({ x: startX, y: startY, r, color: currentColor });
    drawAllAnnotations();
  }
}

function bindAnnotCanvas() {
  // Mouse
  annotCanvas.addEventListener('mousedown', startDraw);
  annotCanvas.addEventListener('mousemove', moveDraw);
  annotCanvas.addEventListener('mouseup', endDraw);
  annotCanvas.addEventListener('mouseleave', () => { if (isDrawing) { isDrawing = false; drawAllAnnotations(); }});
  // Touch
  annotCanvas.addEventListener('touchstart', startDraw, { passive: false });
  annotCanvas.addEventListener('touchmove', moveDraw, { passive: false });
  annotCanvas.addEventListener('touchend', endDraw, { passive: false });
}

// ── Particle canvas ────────────────────────────────────
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts = [];
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  class P {
    constructor() { this.reset(); }
    reset() { this.x=Math.random()*W; this.y=Math.random()*H; this.vx=(Math.random()-.5)*.45; this.vy=(Math.random()-.5)*.45; this.r=Math.random()*1.5+.5; this.a=Math.random()*.4+.1; }
    update() { this.x+=this.vx; this.y+=this.vy; if(this.x<0)this.x=W; if(this.x>W)this.x=0; if(this.y<0)this.y=H; if(this.y>H)this.y=0; }
    draw() { ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fillStyle=`rgba(0,180,255,${this.a})`; ctx.fill(); }
  }
  function drawLines() {
    for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++) {
      const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
      if(d<130){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.strokeStyle=`rgba(0,180,255,${0.07*(1-d/130)})`; ctx.lineWidth=.6; ctx.stroke(); }
    }
  }
  function loop() { ctx.clearRect(0,0,W,H); pts.forEach(p=>{p.update();p.draw();}); drawLines(); requestAnimationFrame(loop); }
  window.addEventListener('resize', resize, {passive:true});
  resize();
  for(let i=0;i<70;i++) pts.push(new P());
  loop();
}

// ── Scroll Reveal ──────────────────────────────────────
function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }});
  }, {threshold:.1});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// ── Counters ───────────────────────────────────────────
function animCount(el, target, dur) {
  const start = performance.now();
  const step = now => {
    const p = Math.min((now-start)/dur,1);
    const e = 1-Math.pow(1-p,3);
    el.textContent = Math.round(e*target).toLocaleString();
    if(p<1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(step);
}
function initCounters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){ animCount(e.target, parseInt(e.target.dataset.count,10), 1800); io.unobserve(e.target); }
    });
  },{threshold:.3});
  document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
}

// ── Charts ─────────────────────────────────────────────
const LABELS_EN=['Avulsion','Comminuted','Dislocation','Greenstick','Hairline','Impacted','Longitudinal','Oblique','Pathological','Spiral'];
const LABELS_ZH=['撕脱性','粉碎性','骨折脱位','青枝','发际线','嵌插','纵向','斜形','病理性','螺旋形'];
const LABELS_KO=['견열','분쇄','골절탈구','청지','미세','감입','종적','사형','병리성','나선형'];
const V1_TRAIN=[97,114,123,96,89,65,62,66,106,67], V1_TEST=[24,29,31,24,22,16,16,17,26,17];
const V2_TRAIN=[109,134,137,106,101,75,68,69,116,74], V2_TEST=[14,14,19,16,10,9,12,16,18,12];
const COLORS=['#00B4FF','#FF5252','#FF8C42','#00E676','#00E5FF','#FFD600','#818CF8','#00E5C8','#9B5FFF','#FF6B9D'];
function getLabels(){ return lang==='zh'?LABELS_ZH:lang==='ko'?LABELS_KO:LABELS_EN; }
const CD={responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'rgba(11,15,30,.95)',borderColor:'rgba(255,255,255,.08)',borderWidth:1,titleColor:'#fff',bodyColor:'rgba(255,255,255,.7)',padding:12,cornerRadius:8}},scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'rgba(255,255,255,.4)',font:{size:10}}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'rgba(255,255,255,.4)',font:{size:10}}}}};
function initCharts(){
  Chart.defaults.color='rgba(255,255,255,.5)';
  const ctx1=document.getElementById('chart1');
  if(ctx1) charts.c1=new Chart(ctx1,{type:'bar',data:{labels:getLabels(),datasets:[{label:T[lang]['an.l_train'],data:V1_TRAIN,backgroundColor:'rgba(0,180,255,.75)',borderRadius:4,borderSkipped:false},{label:T[lang]['an.l_test'],data:V1_TEST,backgroundColor:'rgba(155,95,255,.75)',borderRadius:4,borderSkipped:false}]},options:{...CD,plugins:{...CD.plugins,legend:{display:true,position:'top',labels:{color:'rgba(255,255,255,.6)',boxWidth:10,usePointStyle:true,pointStyle:'circle',padding:14,font:{size:11}}}}}});
  const ctx2=document.getElementById('chart2');
  if(ctx2) charts.c2=new Chart(ctx2,{type:'doughnut',data:{labels:[T[lang]['an.l_train'],T[lang]['an.l_test']],datasets:[{data:[885,222],backgroundColor:['#00B4FF','#9B5FFF'],borderWidth:0,hoverOffset:6}]},options:{responsive:true,maintainAspectRatio:false,cutout:'72%',plugins:{legend:{display:true,position:'bottom',labels:{color:'rgba(255,255,255,.6)',boxWidth:10,usePointStyle:true,pointStyle:'circle',padding:14,font:{size:11}}},tooltip:CD.plugins.tooltip}}});
  const ctx3=document.getElementById('chart3');
  if(ctx3){const v1=V1_TRAIN.map((v,i)=>v+V1_TEST[i]),v2=V2_TRAIN.map((v,i)=>v+V2_TEST[i]);charts.c3=new Chart(ctx3,{type:'line',data:{labels:getLabels(),datasets:[{label:T[lang]['an.l_v1'],data:v1,borderColor:'#00B4FF',backgroundColor:'rgba(0,180,255,.08)',fill:true,tension:.4,pointRadius:4,pointBackgroundColor:'#00B4FF'},{label:T[lang]['an.l_v2'],data:v2,borderColor:'#9B5FFF',backgroundColor:'rgba(155,95,255,.08)',fill:true,tension:.4,pointRadius:4,pointBackgroundColor:'#9B5FFF'}]},options:{...CD,plugins:{...CD.plugins,legend:{display:true,position:'top',labels:{color:'rgba(255,255,255,.6)',boxWidth:10,usePointStyle:true,pointStyle:'circle',padding:14,font:{size:11}}}}}});}
}
function updateCharts(){
  const labels=getLabels();
  if(charts.c1){charts.c1.data.labels=labels;charts.c1.data.datasets[0].label=T[lang]['an.l_train'];charts.c1.data.datasets[1].label=T[lang]['an.l_test'];charts.c1.update();}
  if(charts.c2){charts.c2.data.labels=[T[lang]['an.l_train'],T[lang]['an.l_test']];charts.c2.update();}
  if(charts.c3){charts.c3.data.labels=labels;charts.c3.data.datasets[0].label=T[lang]['an.l_v1'];charts.c3.data.datasets[1].label=T[lang]['an.l_v2'];charts.c3.update();}
}

// ── Nav scroll ─────────────────────────────────────────
function initNav(){
  const nav=document.getElementById('nav');
  window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>40),{passive:true});
}

// ── Init ───────────────────────────────────────────────
window.addEventListener('DOMContentLoaded',()=>{
  setTimeout(()=>document.getElementById('loader').classList.add('hidden'),1900);
  buildAtlas();
  initParticles();
  initNav();
  setTimeout(()=>{initReveal();initCounters();},100);
  setTimeout(initCharts,400);

  // Language
  document.querySelectorAll('.lang-btn').forEach(btn=>btn.addEventListener('click',()=>applyLang(btn.dataset.lang)));

  // Modal tabs
  document.querySelectorAll('.dm-tab').forEach(t=>t.addEventListener('click',()=>showPanel(t.dataset.tab)));

  // Modal close
  document.getElementById('detail-modal').addEventListener('click',e=>{
    if(e.target===document.getElementById('detail-modal')||e.target.classList.contains('dm-overlay')||e.target.classList.contains('dm-close')) closeModal();
  });
  document.getElementById('dm-close-btn').addEventListener('click',closeModal);

  // Annotation tool
  document.querySelectorAll('.color-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      currentColor=btn.dataset.color;
      document.querySelectorAll('.color-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  document.getElementById('dm-undo-btn').addEventListener('click',()=>{annotations.pop();drawAllAnnotations();});
  document.getElementById('dm-clear-btn').addEventListener('click',()=>{annotations=[];drawAllAnnotations();});
  window.addEventListener('resize',()=>{if(document.getElementById('detail-modal').classList.contains('open'))resizeAnnotCanvas();},{passive:true});

  // Bind canvas events once (canvas is created from HTML)
  const ac=document.getElementById('annot-canvas');
  if(ac){ annotCanvas=ac; annotCtx=ac.getContext('2d'); bindAnnotCanvas(); }

  // ESC to close
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeModal(); });
});
