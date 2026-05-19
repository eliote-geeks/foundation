import{r as b,j as e,L as v,H as T}from"./app-DrojpPNN.js";import{M as S,a as B}from"./modern-footer-B7GOrSnf.js";import{C as f}from"./Container-QQjlbKNY.js";import{R as c}from"./Row-BD4VsLeG.js";import{C as l}from"./Col-vlnbpWVg.js";import{B as p}from"./Button-BYKh7cfL.js";import{C as j}from"./Card-C5qH_cia.js";import{B as F}from"./Badge-CItXtSeV.js";/* empty css            */import"./useTranslation-K1v3EBe0.js";import"./Dropdown-QX1QJRyT.js";import"./useIsomorphicEffect-CP1mp2n7.js";import"./SSRProvider-BJS4KkUl.js";import"./NavContext-Dps9AIc5.js";import"./NavbarContext-BjZyJSC5.js";import"./Button-BpQpzNeh.js";import"./hook-ClzXxOZq.js";import"./Anchor-vJYwVScT.js";import"./InputGroupContext-Dw-eGtfK.js";import"./divWithClassName-BdAcPaYi.js";function y(t,r=1600,s=!1){const[a,d]=b.useState(0);return b.useEffect(()=>{if(!s||t===0)return;const x=performance.now(),o=i=>{const n=Math.min((i-x)/r,1),h=1-Math.pow(1-n,3);d(Math.round(h*t)),n<1&&requestAnimationFrame(o)};requestAnimationFrame(o)},[t,r,s]),a}function M({user:t,stats:r,heroSlide:s}){const[a,d]=b.useState(!1),x=b.useRef(null);b.useEffect(()=>{const u=setTimeout(()=>d(!0),100);return()=>clearTimeout(u)},[]);const o=y(r.totalEvents,1400,a),i=y(r.totalMembers,1600,a),n=y(r.ticketsSold,1500,a),h=(s==null?void 0:s.headline)??"Engagez, contribuez,",m=(s==null?void 0:s.headline_accent)??"transformez.",N=(s==null?void 0:s.tagline)??"La plateforme d'événements et d'impact social de la TITI EVENTS. Réservez vos billets, soutenez des initiatives, rejoignez une communauté engagée au Cameroun.";s==null||s.badge_text;const E=(s==null?void 0:s.cta_primary_label)??"Rejoindre gratuitement",w=(s==null?void 0:s.cta_primary_url)??"/register",A=(s==null?void 0:s.cta_secondary_label)??"Voir les événements",k=(s==null?void 0:s.cta_secondary_url)??"/events",g=u=>({opacity:a?1:0,transform:a?"translateY(0)":"translateY(26px)",transition:`opacity 0.65s ease ${u}s, transform 0.65s ease ${u}s`});return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
                .hero-root {
                    min-height: 100vh;
                    background: #FFFFFF;
                    display: flex;
                    align-items: center;
                    padding-top: 66px;
                    position: relative;
                    overflow: hidden;
                }
                .hero-bg-dots {
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(circle, #D1FAE5 1.5px, transparent 1.5px);
                    background-size: 32px 32px;
                    opacity: 0.5;
                    pointer-events: none;
                }
                .hero-bg-glow {
                    position: absolute;
                    top: -140px;
                    right: -100px;
                    width: 640px;
                    height: 640px;
                    background: radial-gradient(circle, #DCFCE7 0%, transparent 68%);
                    pointer-events: none;
                }
                .hero-inner {
                    max-width: 1180px;
                    margin: 0 auto;
                    padding: 72px 24px 80px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 64px;
                    align-items: center;
                    position: relative;
                    z-index: 1;
                    width: 100%;
                }
                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #DCFCE7;
                    color: #15803D;
                    border: 1px solid #BBF7D0;
                    border-radius: 999px;
                    padding: 6px 16px;
                    font-size: 0.8125rem;
                    font-weight: 600;
                    margin-bottom: 24px;
                }
                .hero-h1 {
                    font-size: clamp(2.5rem, 4.2vw, 3.75rem);
                    font-weight: 800;
                    line-height: 1.08;
                    color: #111827;
                    letter-spacing: -0.03em;
                    margin: 0 0 6px;
                }
                .hero-h1-accent {
                    font-size: clamp(2.5rem, 4.2vw, 3.75rem);
                    font-weight: 800;
                    line-height: 1.08;
                    letter-spacing: -0.03em;
                    margin: 0 0 28px;
                    color: #16A34A;
                    position: relative;
                    display: inline-block;
                }
                .hero-h1-accent::after {
                    content: '';
                    position: absolute;
                    bottom: -5px;
                    left: 0;
                    width: 100%;
                    height: 4px;
                    background: linear-gradient(90deg, #16A34A 0%, #D97706 100%);
                    border-radius: 4px;
                }
                .hero-tagline {
                    font-size: 1.0625rem;
                    color: #6B7280;
                    line-height: 1.75;
                    margin-bottom: 36px;
                    max-width: 480px;
                }
                .hero-ctas {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                    margin-bottom: 44px;
                }
                .hero-btn-primary {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #16A34A;
                    color: #fff !important;
                    border: none;
                    border-radius: 8px;
                    padding: 13px 26px;
                    font-size: 0.9375rem;
                    font-weight: 600;
                    text-decoration: none !important;
                    transition: background 0.18s, transform 0.15s, box-shadow 0.18s;
                    box-shadow: 0 4px 14px rgba(22,163,74,0.35);
                    cursor: pointer;
                }
                .hero-btn-primary:hover {
                    background: #15803D;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 22px rgba(22,163,74,0.45);
                }
                .hero-btn-secondary {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: transparent;
                    color: #111827 !important;
                    border: 1.5px solid #D1D5DB;
                    border-radius: 8px;
                    padding: 13px 26px;
                    font-size: 0.9375rem;
                    font-weight: 600;
                    text-decoration: none !important;
                    transition: border-color 0.18s, background 0.18s, transform 0.15s;
                    cursor: pointer;
                }
                .hero-btn-secondary:hover {
                    border-color: #16A34A;
                    background: #F0FDF4;
                    color: #15803D !important;
                    transform: translateY(-2px);
                }
                .hero-stats {
                    display: flex;
                    border: 1px solid #E5E7EB;
                    border-radius: 14px;
                    overflow: hidden;
                    background: #F9FAFB;
                }
                .hero-stat-item {
                    flex: 1;
                    padding: 18px 10px;
                    text-align: center;
                    border-right: 1px solid #E5E7EB;
                }
                .hero-stat-item:last-child { border-right: none; }
                .hero-stat-num {
                    font-size: 1.625rem;
                    font-weight: 800;
                    color: #111827;
                    letter-spacing: -0.03em;
                    line-height: 1;
                }
                .hero-stat-label {
                    font-size: 0.7rem;
                    color: #9CA3AF;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.07em;
                    margin-top: 5px;
                }

                /* Right panel */
                .hero-right {
                    position: relative;
                    height: 460px;
                }
                .hero-panel-bg {
                    position: absolute;
                    inset: 8px 0 0 8px;
                    background: linear-gradient(145deg, #F0FDF4 0%, #DCFCE7 100%);
                    border: 1px solid #BBF7D0;
                    border-radius: 24px;
                }
                .hero-card {
                    position: absolute;
                    background: #FFFFFF;
                    border: 1px solid #E5E7EB;
                    border-radius: 16px;
                    padding: 16px 18px;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.09);
                }
                .hero-card-1 {
                    top: 28px;
                    left: -20px;
                    right: 48px;
                    transform: rotate(-1deg);
                    animation: heroFloat1 5.5s ease-in-out infinite;
                }
                .hero-card-2 {
                    top: 165px;
                    right: -20px;
                    left: 36px;
                    transform: rotate(1deg);
                    animation: heroFloat2 6.5s ease-in-out infinite;
                }
                .hero-card-3 {
                    bottom: 24px;
                    left: 12px;
                    right: 64px;
                    transform: rotate(-0.5deg);
                    animation: heroFloat3 4.8s ease-in-out infinite;
                }
                @keyframes heroFloat1 {
                    0%,100% { transform: translateY(0) rotate(-1deg); }
                    50%     { transform: translateY(-8px) rotate(-1deg); }
                }
                @keyframes heroFloat2 {
                    0%,100% { transform: translateY(0) rotate(1deg); }
                    50%     { transform: translateY(-10px) rotate(1deg); }
                }
                @keyframes heroFloat3 {
                    0%,100% { transform: translateY(0) rotate(-0.5deg); }
                    50%     { transform: translateY(-6px) rotate(-0.5deg); }
                }
                .hero-card-lbl {
                    font-size: 0.675rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: #9CA3AF;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                .hero-progress-bg {
                    background: #E5E7EB;
                    border-radius: 999px;
                    height: 7px;
                    margin: 8px 0 5px;
                }
                .hero-progress-fill {
                    background: linear-gradient(90deg, #16A34A, #22C55E);
                    border-radius: 999px;
                    height: 7px;
                    width: 0%;
                    animation: heroBarGrow 2s ease 0.9s forwards;
                }
                @keyframes heroBarGrow { to { width: 73%; } }
                .hero-avatar-row {
                    display: flex;
                    align-items: center;
                }
                .hero-av {
                    width: 26px;
                    height: 26px;
                    border-radius: 50%;
                    border: 2px solid #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.575rem;
                    font-weight: 800;
                    margin-left: -6px;
                }
                .hero-av:first-child { margin-left: 0; }
                .hero-live-dot {
                    width: 8px;
                    height: 8px;
                    background: #22C55E;
                    border-radius: 50%;
                    display: inline-block;
                    animation: livePulse 1.6s ease-in-out infinite;
                }
                @keyframes livePulse {
                    0%,100% { opacity: 1; transform: scale(1); }
                    50%     { opacity: 0.35; transform: scale(1.4); }
                }
                .hero-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    background: #F0FDF4;
                    color: #15803D;
                    border: 1px solid #BBF7D0;
                    border-radius: 6px;
                    padding: 3px 9px;
                    font-size: 0.72rem;
                    font-weight: 600;
                }
                @media (max-width: 920px) {
                    .hero-inner { grid-template-columns: 1fr; gap: 48px; }
                    .hero-right { height: 340px; }
                    .hero-card-1 { left: 0; }
                    .hero-card-2 { right: 0; left: 24px; }
                }
                @media (max-width: 540px) {
                    .hero-right { height: 280px; }
                    .hero-h1, .hero-h1-accent { font-size: 2.1rem; }
                    .hero-tagline { font-size: 0.9375rem; }
                }
            `}),e.jsxs("section",{className:"hero-root",ref:x,children:[e.jsx("div",{className:"hero-bg-dots"}),e.jsx("div",{className:"hero-bg-glow"}),e.jsxs("div",{className:"hero-inner",children:[e.jsxs("div",{children:[e.jsxs("div",{style:g(.1),children:[e.jsx("h1",{className:"hero-h1",children:h}),e.jsx("div",{className:"hero-h1-accent",children:m})]}),e.jsx("p",{className:"hero-tagline",style:g(.27),children:N}),e.jsxs("div",{className:"hero-ctas",style:g(.38),children:[e.jsxs(v,{href:w,className:"hero-btn-primary",children:[e.jsx("i",{className:"bi bi-arrow-right-circle-fill"}),E]}),e.jsxs(v,{href:k,className:"hero-btn-secondary",children:[e.jsx("i",{className:"bi bi-calendar3"}),A]})]}),e.jsxs("div",{className:"hero-stats",style:g(.5),children:[e.jsxs("div",{className:"hero-stat-item",children:[e.jsx("div",{className:"hero-stat-num",children:r.totalEvents>0?o:"—"}),e.jsx("div",{className:"hero-stat-label",children:"Événements"})]}),e.jsxs("div",{className:"hero-stat-item",children:[e.jsx("div",{className:"hero-stat-num",children:r.totalMembers>0?i.toLocaleString("fr-FR"):"—"}),e.jsx("div",{className:"hero-stat-label",children:"Membres"})]}),e.jsxs("div",{className:"hero-stat-item",children:[e.jsx("div",{className:"hero-stat-num",children:r.ticketsSold>0?n.toLocaleString("fr-FR"):"—"}),e.jsx("div",{className:"hero-stat-label",children:"Billets vendus"})]}),e.jsxs("div",{className:"hero-stat-item",children:[e.jsx("div",{className:"hero-stat-num",style:{color:"#D97706",fontSize:"1.3rem"},children:r.totalRaised!=="0K"&&r.totalRaised!=="0.0M"?r.totalRaised:"—"}),e.jsx("div",{className:"hero-stat-label",children:"Collectés XAF"})]})]})]}),e.jsxs("div",{className:"hero-right",style:g(.2),children:[e.jsx("div",{className:"hero-panel-bg"}),e.jsxs("div",{className:"hero-card hero-card-1",children:[e.jsxs("div",{className:"hero-card-lbl",children:[e.jsx("i",{className:"bi bi-calendar-event",style:{color:"#16A34A"}}),"Prochain événement"]}),e.jsx("div",{style:{fontSize:"0.9375rem",fontWeight:700,color:"#111827",marginBottom:4},children:"Forum Innovation Sociale"}),e.jsxs("div",{style:{fontSize:"0.8125rem",color:"#6B7280",marginBottom:12,display:"flex",alignItems:"center",gap:5},children:[e.jsx("i",{className:"bi bi-geo-alt"}),"Yaoundé · 28 Mai 2026"]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsxs("span",{className:"hero-chip",children:[e.jsx("i",{className:"bi bi-ticket-perforated"}),"32 places restantes"]}),e.jsx(v,{href:"/events",style:{fontSize:"0.8125rem",color:"#16A34A",fontWeight:700,textDecoration:"none"},children:"Réserver →"})]})]}),e.jsxs("div",{className:"hero-card hero-card-2",children:[e.jsxs("div",{className:"hero-card-lbl",children:[e.jsx("i",{className:"bi bi-graph-up-arrow",style:{color:"#D97706"}}),"Impact du mois"]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("span",{style:{fontSize:"0.875rem",fontWeight:700,color:"#111827"},children:"Collecte de fonds"}),e.jsx("span",{style:{fontSize:"0.875rem",fontWeight:800,color:"#16A34A"},children:"73%"})]}),e.jsx("div",{className:"hero-progress-bg",children:e.jsx("div",{className:"hero-progress-fill"})}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.75rem",color:"#9CA3AF"},children:[e.jsx("span",{children:"450 000 XAF"}),e.jsx("span",{children:"Objectif : 620 000"})]})]}),e.jsxs("div",{className:"hero-card hero-card-3",children:[e.jsxs("div",{className:"hero-card-lbl",children:[e.jsx("i",{className:"bi bi-people-fill",style:{color:"#16A34A"}}),"Communauté active"]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsxs("div",{className:"hero-avatar-row",children:[[["MN","#D1FAE5","#15803D"],["JB","#FEF3C7","#92400E"],["SA","#D1FAE5","#15803D"],["KD","#FEF3C7","#92400E"]].map(([u,z,C],D)=>e.jsx("div",{className:"hero-av",style:{background:z,color:C},children:u},D)),e.jsx("div",{className:"hero-av",style:{background:"#F3F4F6",color:"#6B7280"},children:"+8"})]}),e.jsxs("span",{style:{fontSize:"0.8rem",color:"#6B7280"},children:[e.jsx("b",{style:{color:"#111827"},children:"12"})," nouveaux cette semaine"]})]})]})]})]})]})]})}function R({events:t}){return e.jsx("section",{className:"py-5",style:{background:"#FFFFFF"},children:e.jsxs(f,{children:[e.jsxs(c,{className:"align-items-end mb-4",children:[e.jsxs(l,{md:8,children:[e.jsxs("p",{style:{fontSize:"0.75rem",fontWeight:600,color:"#16A34A",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6},children:[e.jsx("i",{className:"bi bi-calendar-event me-2"}),"Agenda"]}),e.jsx("h2",{className:"fw-bold mb-2",style:{color:"#111827"},children:"Réservez en quelques clics"}),e.jsx("p",{className:"text-muted mb-0",style:{maxWidth:720},children:"Une promesse simple : des événements bien organisés, des informations claires, et un tunnel de réservation fluide."})]}),e.jsx(l,{md:4,className:"text-md-end mt-3 mt-md-0",children:e.jsx(p,{href:"/events",style:{background:"#16A34A",border:"none",fontWeight:500,borderRadius:6,fontSize:"0.875rem"},children:"Voir tous les événements"})})]}),t.length===0?e.jsx(j,{className:"border-0 shadow-sm",children:e.jsxs(j.Body,{className:"p-4 text-center",children:[e.jsx("div",{className:"mb-3",children:e.jsx("i",{className:"bi bi-calendar-x",style:{fontSize:"2.5rem",color:"#9CA3AF"}})}),e.jsx("h5",{className:"fw-bold mb-2",children:"Aucun événement publié"}),e.jsx("p",{className:"mb-0 text-muted",children:"Revenez bientôt, ou contactez-nous pour proposer un événement."}),e.jsx("div",{className:"mt-3",children:e.jsx(p,{href:"/partners",variant:"outline-success",className:"fw-semibold",children:"Proposer / Sponsoriser"})})]})}):e.jsx(c,{className:"g-4",children:t.map(r=>e.jsx(l,{md:6,lg:4,children:e.jsxs(j,{className:"h-100 border-0 shadow-sm overflow-hidden",children:[r.image?e.jsx("div",{style:{height:170,backgroundImage:`url(${r.image})`,backgroundSize:"cover",backgroundPosition:"center"}}):e.jsx("div",{style:{height:170,background:"#F3F4F6",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx("i",{className:"bi bi-calendar-event",style:{fontSize:"2rem",color:"#D1D5DB"}})}),e.jsxs(j.Body,{className:"p-4",children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-start mb-2",children:[e.jsx(F,{bg:"light",text:"dark",style:{border:"1px solid #E5E7EB"},children:r.category_display}),r.requires_approval&&e.jsx(F,{bg:"warning",children:"Invitation"})]}),e.jsx("h5",{className:"fw-bold mb-2",style:{color:"#111827"},children:r.title}),e.jsxs("div",{className:"text-muted small mb-2",children:[e.jsx("i",{className:"bi bi-calendar-event me-2 text-success"}),r.start_date_display]}),e.jsxs("div",{className:"text-muted small mb-3",children:[e.jsx("i",{className:"bi bi-geo-alt me-2 text-success"}),r.location]}),e.jsx("div",{className:"d-flex align-items-center justify-content-between mb-3",children:e.jsx("div",{className:"fw-semibold",style:{color:"#334E15"},children:r.formatted_price})}),e.jsxs("div",{className:"d-flex gap-2",children:[e.jsx(p,{href:`/events/${r.id}`,className:"w-100",style:{background:"#16A34A",border:"none",fontWeight:500,fontSize:"0.875rem"},children:"Réserver"}),e.jsx(p,{href:`/events/${r.id}`,variant:"outline-secondary",children:"Détails"})]})]})]})},r.id))})]})})}const I=[{icon:"bi-calendar-check",color:"#5FA145",bg:"#EAF5E5",title:"Événements authentiques",text:"Des galas, conférences et programmes soigneusement organisés par la TITI EVENTS, avec programme, intervenants et informations claires."},{icon:"bi-phone-fill",color:"#C69438",bg:"#FDF4E3",title:"Paiement simplifié",text:"Réglez en ligne par MTN Mobile Money, Orange Money ou carte bancaire. Reçevez votre billet QR immédiatement par email ou WhatsApp."},{icon:"bi-people-fill",color:"#C69438",bg:"#FDF4E3",title:"Communauté engagée",text:"Rejoignez des milliers de membres — adhérents, ambassadeurs, bénévoles — unis autour de projets à impact social mesurable."},{icon:"bi-graph-up-arrow",color:"#4D8A3C",bg:"#E8F4E5",title:"Impact mesurable",text:"Chaque participation soutient des initiatives concrètes. Suivez les résultats en transparence via les rapports d'impact de la fondation."}];function _(){return e.jsx("section",{className:"py-5",style:{background:"#F9FAFB"},children:e.jsxs(f,{children:[e.jsxs("div",{className:"text-center mb-5",children:[e.jsx("span",{className:"d-inline-block px-3 py-1 rounded-pill mb-3 small fw-semibold",style:{background:"#E8F5E8",color:"#3D7020"},children:"Pourquoi nous choisir"}),e.jsx("h2",{className:"fw-bold mb-3",style:{color:"#1A3209",fontSize:"clamp(1.7rem, 3vw, 2.4rem)"},children:"Tout ce qu'il faut pour une réservation réussie"}),e.jsx("p",{className:"text-muted mx-auto",style:{maxWidth:600,lineHeight:1.7},children:"De la découverte d'un événement à la participation sur place, nous avons pensé chaque étape pour vous."})]}),e.jsx(c,{className:"g-4 mb-5",children:I.map((t,r)=>e.jsx(l,{md:6,lg:3,children:e.jsxs("div",{className:"h-100 p-4 rounded-4",style:{background:"#FFFFFF",border:"1px solid #E8EDEA",boxShadow:"0 2px 12px rgba(0,0,0,0.05)",transition:"transform 0.25s ease, box-shadow 0.25s ease"},onMouseEnter:s=>{s.currentTarget.style.transform="translateY(-6px)",s.currentTarget.style.boxShadow="0 12px 32px rgba(0,0,0,0.10)"},onMouseLeave:s=>{s.currentTarget.style.transform="translateY(0)",s.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.05)"},children:[e.jsx("div",{className:"d-inline-flex align-items-center justify-content-center rounded-3 mb-3",style:{width:52,height:52,background:t.bg},children:e.jsx("i",{className:t.icon,style:{color:t.color,fontSize:"1.4rem"}})}),e.jsx("h5",{className:"fw-bold mb-2",style:{color:"#1A3209"},children:t.title}),e.jsx("p",{className:"text-muted small mb-0",style:{lineHeight:1.65},children:t.text})]})},r))}),e.jsx("div",{className:"rounded-4 p-4 p-md-5",style:{background:"#111827",border:"1px solid #1F2937"},children:e.jsx(c,{className:"g-4 text-center",children:[{value:"100%",label:"Billets envoyés instantanément"},{value:"3 min",label:"Pour finaliser une réservation"},{value:"3 modes",label:"De paiement acceptés"},{value:"24 h/24",label:"Disponibilité de la plateforme"}].map((t,r)=>e.jsxs(l,{xs:6,md:3,children:[e.jsx("div",{style:{color:"#D97706",fontSize:"1.75rem",fontWeight:700},children:t.value}),e.jsx("div",{style:{color:"#9CA3AF",fontSize:"0.8125rem",marginTop:4},children:t.label})]},r))})})]})})}const P=[{num:"01",icon:"bi-search",color:"#5FA145",bg:"#EAF5E5",title:"Parcourez les événements",text:"Filtrez par catégorie, date ou lieu. Consultez le programme, les intervenants, les tarifs et les informations pratiques."},{num:"02",icon:"bi-ticket-perforated",color:"#C69438",bg:"#FDF4E3",title:"Choisissez votre place",text:"Sélectionnez le type de billet (standard, VIP, table…) et le nombre de places souhaité."},{num:"03",icon:"bi-phone",color:"#C69438",bg:"#FDF4E3",title:"Payez en 1 minute",text:"MTN Mobile Money, Orange Money ou carte bancaire. Le paiement est sécurisé et confirmé en temps réel."},{num:"04",icon:"bi-qr-code-scan",color:"#4D8A3C",bg:"#E8F4E5",title:"Recevez votre billet",text:"Votre billet QR vous est envoyé par email et WhatsApp. Présentez-le au contrôle d'accès le jour J."}],q=[{name:"MTN Mobile Money",icon:"bi-phone-fill",color:"#FFCC00",bg:"#FFF8D6"},{name:"Orange Money",icon:"bi-phone-fill",color:"#FF6600",bg:"#FFF0E6"},{name:"Carte bancaire",icon:"bi-credit-card-2-front",color:"#1A56DB",bg:"#E8EFFE"},{name:"Virement",icon:"bi-bank",color:"#4D8A3C",bg:"#E8F4E5"}];function V(){return e.jsx("section",{className:"py-5",style:{background:"#FFFFFF"},children:e.jsxs(f,{children:[e.jsxs("div",{className:"text-center mb-5",children:[e.jsx("span",{className:"d-inline-block px-3 py-1 rounded-pill mb-3 small fw-semibold",style:{background:"#FDF4E3",color:"#C69438"},children:"Billetterie en ligne"}),e.jsx("h2",{className:"fw-bold mb-3",style:{color:"#1A3209",fontSize:"clamp(1.7rem, 3vw, 2.4rem)"},children:"Réservez en 4 étapes simples"}),e.jsx("p",{className:"text-muted mx-auto",style:{maxWidth:560,lineHeight:1.7},children:"Pas de file d'attente, pas de déplacement. Votre billet arrive directement sur votre téléphone."})]}),e.jsxs(c,{className:"g-4 mb-5 position-relative",children:[e.jsx("div",{className:"d-none d-lg-block position-absolute",style:{top:40,left:"12.5%",right:"12.5%",height:1,background:"#E5E7EB",zIndex:0}}),P.map((t,r)=>e.jsx(l,{md:6,lg:3,style:{position:"relative",zIndex:1},children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"d-inline-flex align-items-center justify-content-center rounded-circle mb-3",style:{width:72,height:72,background:t.bg,border:`3px solid ${t.color}40`,fontSize:"1.6rem",color:t.color},children:e.jsx("i",{className:t.icon})}),e.jsxs("div",{className:"fw-bold mb-1",style:{color:t.color,fontSize:"0.75rem",letterSpacing:"0.1em"},children:["ÉTAPE ",t.num]}),e.jsx("h5",{className:"fw-bold mb-2",style:{color:"#1A3209"},children:t.title}),e.jsx("p",{className:"text-muted small",style:{lineHeight:1.6},children:t.text})]})},r))]}),e.jsx("div",{className:"rounded-4 p-4 p-md-5",style:{background:"#F9FAFB",border:"1px solid #E5E7EB"},children:e.jsxs(c,{className:"align-items-center g-4",children:[e.jsxs(l,{md:5,children:[e.jsxs("h4",{className:"fw-bold mb-2",style:{color:"#1A3209"},children:[e.jsx("i",{className:"bi bi-shield-check me-2",style:{color:"#5FA145"}}),"Paiements sécurisés"]}),e.jsx("p",{className:"text-muted mb-3",style:{lineHeight:1.65},children:"Tous les paiements sont traités via des passerelles sécurisées. Vos données bancaires ne sont jamais stockées sur notre plateforme."}),e.jsxs(p,{href:"/events",style:{background:"#16A34A",border:"none",borderRadius:6,fontWeight:500,padding:"8px 20px",fontSize:"0.875rem"},children:[e.jsx("i",{className:"bi bi-ticket-perforated me-2"}),"Réserver maintenant"]})]}),e.jsx(l,{md:7,children:e.jsx(c,{className:"g-3",children:q.map((t,r)=>e.jsx(l,{xs:6,children:e.jsxs("div",{className:"d-flex align-items-center gap-2 p-2 p-md-3 rounded-3",style:{background:t.bg,border:`1px solid ${t.color}30`},children:[e.jsx("div",{className:"d-flex align-items-center justify-content-center rounded-2 flex-shrink-0",style:{width:34,height:34,background:"#FFFFFF",boxShadow:"0 1px 4px rgba(0,0,0,0.08)"},children:e.jsx("i",{className:t.icon,style:{color:t.color,fontSize:"1rem"}})}),e.jsx("span",{className:"fw-semibold",style:{color:"#1A3209",fontSize:"clamp(0.72rem, 1.8vw, 0.875rem)",lineHeight:1.2},children:t.name})]})},r))})})]})})]})})}const W=[{id:0,name:"MTN Cameroun",initials:"MTN",color:"#FFCC00",bg:"#FFF8D6"},{id:1,name:"Orange Cameroun",initials:"ORA",color:"#FF6600",bg:"#FFF0E6"},{id:2,name:"Gouvernement",initials:"GOV",color:"#1A56DB",bg:"#E8EFFE"},{id:3,name:"Partenaire 4",initials:"P4",color:"#5FA145",bg:"#EAF5E5"},{id:4,name:"Partenaire 5",initials:"P5",color:"#C69438",bg:"#FDF4E3"},{id:5,name:"Partenaire 6",initials:"P6",color:"#C69438",bg:"#FDF4E3"}];function H({partners:t}){const r=t.length>0;return e.jsx("section",{className:"py-5",style:{background:"var(--titi-surface)"},children:e.jsxs(f,{children:[e.jsxs("div",{className:"text-center mb-5",children:[e.jsx("span",{className:"d-inline-block px-3 py-1 rounded-pill mb-3 small fw-semibold",style:{background:"#E8F5E8",color:"#3D7020"},children:"Partenaires & Sponsors"}),e.jsx("h2",{className:"fw-bold mb-3",style:{color:"#1A3209",fontSize:"clamp(1.7rem, 3vw, 2.4rem)"},children:"Ils nous font confiance"}),e.jsx("p",{className:"text-muted mx-auto",style:{maxWidth:560,lineHeight:1.7},children:"TITI EVENTS porte ses projets avec le soutien d'organisations engagées pour un développement durable au Cameroun."})]}),r?e.jsx(c,{className:"g-3 justify-content-center mb-5",children:t.map(s=>e.jsx(l,{xs:6,sm:4,md:3,lg:2,children:s.website_url?e.jsx("a",{href:s.website_url,target:"_blank",rel:"noreferrer",className:"text-decoration-none",children:e.jsx("div",{className:"d-flex align-items-center justify-content-center p-3 rounded-3",style:{background:"#FFFFFF",border:"1px solid #E0EAE0",height:80,transition:"box-shadow 0.2s ease"},onMouseEnter:a=>{a.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.10)"},onMouseLeave:a=>{a.currentTarget.style.boxShadow="none"},children:e.jsx("img",{src:s.logo,alt:s.name,style:{maxWidth:"100%",maxHeight:48,objectFit:"contain"}})})}):e.jsx("div",{className:"d-flex align-items-center justify-content-center p-3 rounded-3",style:{background:"#FFFFFF",border:"1px solid #E0EAE0",height:80},children:e.jsx("img",{src:s.logo,alt:s.name,style:{maxWidth:"100%",maxHeight:48,objectFit:"contain"}})})},s.id))}):e.jsx(c,{className:"g-3 justify-content-center mb-5",children:W.map(s=>e.jsx(l,{xs:6,sm:4,md:3,lg:2,children:e.jsx("div",{className:"d-flex align-items-center justify-content-center rounded-3",style:{background:s.bg,border:`1px solid ${s.color}30`,height:80,transition:"transform 0.2s ease"},onMouseEnter:a=>{a.currentTarget.style.transform="scale(1.04)"},onMouseLeave:a=>{a.currentTarget.style.transform="scale(1)"},children:e.jsx("span",{style:{color:s.color,fontWeight:800,fontSize:"1.1rem",letterSpacing:"0.05em"},children:s.initials})})},s.id))}),e.jsx("div",{className:"rounded-4 p-4 p-md-5 text-center",style:{background:"#111827",border:"1px solid #1F2937"},children:e.jsx(c,{className:"justify-content-center",children:e.jsxs(l,{md:8,lg:6,children:[e.jsx("i",{className:"bi bi-handshake mb-3 d-block",style:{color:"#F9D27A",fontSize:"2.5rem"}}),e.jsx("h4",{className:"fw-bold mb-3",style:{color:"#FFFFFF"},children:"Devenez partenaire ou sponsor"}),e.jsx("p",{style:{color:"#A8D5A2",marginBottom:"1.5rem",lineHeight:1.65},children:"Associez votre organisation aux événements de TITI EVENTS. Visibilité, impact mesurable, réseau professionnel — rejoignez nos partenaires."}),e.jsxs("div",{className:"d-flex flex-wrap gap-3 justify-content-center",children:[e.jsxs(p,{href:"/partners",style:{background:"#D97706",border:"none",color:"#fff",fontWeight:500,borderRadius:6,padding:"8px 20px",fontSize:"0.875rem"},children:[e.jsx("i",{className:"bi bi-handshake me-2"}),"Proposer un partenariat"]}),e.jsxs(p,{href:"/partners",style:{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",color:"#fff",fontWeight:500,borderRadius:6,padding:"8px 20px",fontSize:"0.875rem"},children:[e.jsx("i",{className:"bi bi-eye me-2"}),"Voir les partenaires"]})]})]})})})]})})}const L=[{q:"Comment réserver un billet ?",a:"Rendez-vous sur la page Événements, choisissez l'événement qui vous intéresse, sélectionnez votre type de billet et payez en ligne. Votre billet QR vous est envoyé automatiquement."},{q:"Quels moyens de paiement acceptez-vous ?",a:"Nous acceptons MTN Mobile Money, Orange Money et les cartes bancaires (Visa, Mastercard). Le paiement est sécurisé et validé en temps réel."},{q:"Puis-je obtenir un remboursement ?",a:"Les demandes de remboursement sont acceptées jusqu'à 48 h avant la date de l'événement. Contactez-nous à info@fondation-titi.org avec votre numéro de billet."},{q:"Comment rejoindre la communauté ?",a:"Créez un compte gratuit sur la plateforme. Vous accéderez à votre espace membre, votre historique, vos billets, et aux actualités de la fondation."},{q:"Comment devenir partenaire ou sponsor ?",a:"Visitez notre page Partenaires et soumettez une demande. Notre équipe vous répondra dans les 48 h avec une proposition adaptée à vos objectifs."}],Y=[{id:1,name:"Marie Nkomo",role:"Adhérente",city:"Yaoundé",content:"La réservation était ultra simple — j'ai payé par MTN Money en moins de 2 minutes et reçu mon billet QR sur WhatsApp. Événement parfaitement organisé !",rating:5,icon:"bi-person-fill",icon_color:"#5FA145",icon_bg:"#EAF5E5"},{id:2,name:"Jean-Baptiste Mbarga",role:"Partenaire",city:"Douala",content:"Nos collaborations avec la TITI EVENTS ont généré un impact réel. La plateforme est fiable, transparente et l'équipe est très professionnelle.",rating:5,icon:"bi-briefcase-fill",icon_color:"#C69438",icon_bg:"#FDF4E3"},{id:3,name:"Sylvie Atangana",role:"Bénévole",city:"Bafoussam",content:"En tant que bénévole, j'accède à mon espace facilement. Je vois les événements auxquels j'ai participé et les points d'engagement accumulés. Très motivant !",rating:5,icon:"bi-heart-fill",icon_color:"#C69438",icon_bg:"#FDF4E3"}];function O({testimonials:t}){const r=t&&t.length>0?t:Y,[s,a]=b.useState(0),[d,x]=b.useState(0),o=r[s]??r[0];return e.jsx("section",{className:"py-5",style:{background:"#FFFFFF"},children:e.jsxs(f,{children:[e.jsxs("div",{className:"text-center mb-5",children:[e.jsx("span",{className:"d-inline-block px-3 py-1 rounded-pill mb-3 small fw-semibold",style:{background:"#FDF4E3",color:"#C69438"},children:"Témoignages"}),e.jsx("h2",{className:"fw-bold mb-3",style:{color:"#1A3209",fontSize:"clamp(1.8rem, 3vw, 2.5rem)"},children:"Ils ont participé, ils témoignent"})]}),e.jsx(c,{className:"justify-content-center mb-5",children:e.jsxs(l,{lg:8,children:[e.jsxs("div",{className:"p-4 p-md-5 rounded-4 text-center mb-4",style:{background:"#F9FAFB",border:"1px solid #E5E7EB",minHeight:280},children:[e.jsx("div",{className:"d-inline-flex align-items-center justify-content-center rounded-circle mb-3",style:{width:80,height:80,background:o.icon_bg,border:`2px solid ${o.icon_color}30`},children:e.jsx("i",{className:o.icon,style:{color:o.icon_color,fontSize:"2rem"}})}),e.jsx("div",{className:"mb-3",children:Array.from({length:o.rating}).map((i,n)=>e.jsx("i",{className:"bi bi-star-fill me-1",style:{color:"#C69438",fontSize:"1rem"}},n))}),e.jsxs("blockquote",{className:"mb-4 fst-italic",style:{color:"#2D4A1A",fontSize:"1.125rem",lineHeight:1.8},children:['"',o.content,'"']}),e.jsx("div",{className:"fw-bold",style:{color:"#5FA145",fontSize:"1rem"},children:o.name}),e.jsxs("div",{style:{color:"#6B7280",fontSize:"0.9rem",marginTop:2},children:[o.role,o.city?` — ${o.city}`:""]})]}),e.jsx("div",{className:"d-flex justify-content-center gap-2",children:r.map((i,n)=>e.jsx("button",{onClick:()=>a(n),style:{width:n===s?32:10,height:10,borderRadius:5,background:n===s?"#5FA145":"#D0E6D0",border:"none",transition:"all 0.3s ease",cursor:"pointer",padding:0}},n))})]})}),e.jsxs(c,{className:"g-4 g-lg-5 align-items-start",children:[e.jsxs(l,{lg:6,children:[e.jsx("span",{className:"d-inline-block px-3 py-1 rounded-pill mb-3 small fw-semibold",style:{background:"#E8F5E8",color:"#3D7020"},children:"FAQ"}),e.jsx("h3",{className:"fw-bold mb-4",style:{color:"#1A3209",fontSize:"1.5rem"},children:"Questions fréquentes"}),L.map((i,n)=>e.jsxs("div",{className:"mb-3 rounded-3 overflow-hidden",style:{border:"1px solid #D8EDD8"},children:[e.jsxs("button",{className:"w-100 text-start d-flex justify-content-between align-items-center p-3 fw-semibold",onClick:()=>x(d===n?null:n),style:{background:d===n?"#EAF5E5":"#FFFFFF",border:"none",color:"#1A3209",fontSize:"0.95rem",cursor:"pointer"},children:[i.q,e.jsx("i",{className:`bi bi-chevron-${d===n?"up":"down"} ms-3 flex-shrink-0`,style:{color:"#5FA145",fontSize:"0.85rem"}})]}),d===n&&e.jsx("div",{className:"px-3 pb-3",style:{color:"#4B6B3A",fontSize:"0.9rem",lineHeight:1.65,background:"#FAFFFE"},children:i.a})]},n))]}),e.jsxs(l,{lg:6,children:[e.jsx("span",{className:"d-inline-block px-3 py-1 rounded-pill mb-3 small fw-semibold",style:{background:"#FDF4E3",color:"#C69438"},children:"Contact"}),e.jsx("h3",{className:"fw-bold mb-4",style:{color:"#1A3209",fontSize:"1.5rem"},children:"Une question ? Écrivez-nous"}),e.jsx("div",{className:"d-flex flex-column gap-3 mb-4",children:[{icon:"bi-envelope",label:"Email",value:"info@fondation-titi.org",href:"mailto:info@fondation-titi.org"},{icon:"bi-whatsapp",label:"WhatsApp",value:"+237 6XX XXX XXX",href:"#"},{icon:"bi-geo-alt",label:"Adresse",value:"Yaoundé, Cameroun",href:"#"}].map((i,n)=>e.jsxs("a",{href:i.href,className:"d-flex align-items-center gap-3 text-decoration-none p-3 rounded-3",style:{background:"#F9FAFB",border:"1px solid #E5E7EB",color:"#111827"},children:[e.jsx("div",{className:"d-flex align-items-center justify-content-center rounded-2 flex-shrink-0",style:{width:40,height:40,background:"#EAF5E5"},children:e.jsx("i",{className:i.icon,style:{color:"#5FA145",fontSize:"1.1rem"}})}),e.jsxs("div",{children:[e.jsx("div",{className:"small text-muted",children:i.label}),e.jsx("div",{className:"fw-semibold",children:i.value})]})]},n))}),e.jsx("div",{className:"d-flex gap-2 mb-4",children:[{icon:"bi-facebook",color:"#1877F2",href:"#"},{icon:"bi-instagram",color:"#E1306C",href:"#"},{icon:"bi-twitter-x",color:"#000000",href:"#"},{icon:"bi-linkedin",color:"#0A66C2",href:"#"},{icon:"bi-youtube",color:"#FF0000",href:"#"}].map((i,n)=>e.jsx("a",{href:i.href,className:"d-flex align-items-center justify-content-center rounded-circle text-decoration-none",style:{width:40,height:40,background:"#F0F0F0",color:i.color,fontSize:"1.05rem",transition:"background 0.2s, transform 0.2s"},onMouseEnter:h=>{const m=h.currentTarget;m.style.background=i.color,m.style.color="#fff",m.style.transform="scale(1.1)"},onMouseLeave:h=>{const m=h.currentTarget;m.style.background="#F0F0F0",m.style.color=i.color,m.style.transform="scale(1)"},children:e.jsx("i",{className:i.icon})},n))}),e.jsxs(p,{href:"/register",className:"w-100",style:{background:"#16A34A",border:"none",borderRadius:6,fontWeight:500,padding:"10px",fontSize:"0.9375rem"},children:[e.jsx("i",{className:"bi bi-person-plus me-2"}),"Rejoindre la communauté gratuitement"]})]})]})]})})}function pe({user:t,stats:r,partners:s,upcomingEvents:a,heroSlide:d,testimonials:x}){return e.jsxs(e.Fragment,{children:[e.jsxs(T,{children:[e.jsx("title",{children:"TITI EVENTS - Événements & Impact Social"}),e.jsx("meta",{name:"description",content:"Réservez vos places aux événements de la TITI EVENTS, soutenez des initiatives à impact, et rejoignez une communauté engagée au Cameroun."}),e.jsx("meta",{name:"keywords",content:"fondation, événements, billetterie, réservation, gala, impact social, campagnes caritatives, Cameroun"}),e.jsx("meta",{property:"og:title",content:"TITI EVENTS - Événements & Impact Social"}),e.jsx("meta",{property:"og:description",content:"Réservez vos places en ligne, paiement Mobile Money ou carte. Événements culturels, galas et programmes d'impact."}),e.jsx("meta",{property:"og:type",content:"website"}),e.jsx("meta",{name:"twitter:card",content:"summary_large_image"}),e.jsx("link",{rel:"canonical",href:"/"})]}),e.jsxs("div",{className:"home-page",children:[e.jsx(S,{user:t}),e.jsx(M,{user:t,stats:r,heroSlide:d}),e.jsx(R,{events:a??[]}),e.jsx(_,{}),e.jsx(V,{}),e.jsx(H,{partners:s??[]}),e.jsx(O,{testimonials:x??[]}),e.jsx(B,{})]})]})}export{pe as default};
