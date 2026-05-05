export const dvStyles = `
  .dv-wrap {
    --bg: #f5f5f7; --surface: #ffffff; --surface2: #f5f5f7; --surface3: #e8e8ed;
    --border: rgba(0,0,0,.08); --border-strong: rgba(0,0,0,.14);
    --accent: #0071e3; --green: #1d7d45; --purple: #5e2ca5;
    --yellow: #8e6000; --orange: #b84000; --red: #b52a1c;
    --text: #1d1d1f; --text-secondary: #3a3a3c; --text-muted: #86868b;
    --high: #1d7d45; --medium: #8e6000; --low: #86868b;
    --shadow-sm: 0 1px 4px rgba(0,0,0,.06);
    --shadow: 0 4px 18px rgba(0,0,0,.09),0 1px 4px rgba(0,0,0,.05);
    --shadow-lg: 0 20px 60px rgba(0,0,0,.13),0 4px 18px rgba(0,0,0,.07);
    --radius: 14px; --radius-sm: 8px;
    display:flex; background:var(--bg); color:var(--text); min-height:calc(100vh - var(--dev-nav-h,45px));
    font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',Arial,sans-serif;
    font-size:14px; -webkit-font-smoothing:antialiased;
  }
  .dv-wrap.lang-en .t-zh { display:none; }
  .dv-wrap.lang-zh .t-en { display:none; }
  /* Sidebar */
  .dv-sidebar { position:fixed; top:var(--dev-nav-h,45px); left:0; bottom:0; width:240px; background:rgba(255,255,255,.9); backdrop-filter:blur(12px); border-right:1px solid var(--border); display:flex; flex-direction:column; z-index:95; transition:transform .25s; overflow-y:auto; }
  .dv-sidebar-overlay { display:none; }
  .dv-sidebar-logo { padding:20px 18px 14px; border-bottom:1px solid var(--border); }
  .dv-sidebar-logo h2 { font-size:14px; font-weight:700; color:var(--accent); margin:0 0 2px; letter-spacing:-.2px; }
  .dv-sidebar-logo p { font-size:11px; color:var(--text-muted); margin:0; }
  .dv-lang-toggle { display:flex; gap:6px; padding:10px 16px; border-bottom:1px solid var(--border); }
  .dv-lang-btn { flex:1; padding:5px 0; border:1px solid var(--border); border-radius:8px; background:transparent; color:var(--text-muted); font-size:12px; cursor:pointer; transition:all .15s; font-weight:500; }
  .dv-lang-btn.active { background:var(--accent); border-color:var(--accent); color:#fff; }
  .dv-nav { flex:1; padding:10px 0; }
  .dv-nav-item { display:flex; align-items:center; gap:10px; padding:10px 18px; font-size:13px; color:var(--text-muted); cursor:pointer; transition:background .15s,color .15s; border-left:3px solid transparent; }
  .dv-nav-item:hover { background:rgba(0,113,227,.05); color:var(--text); }
  .dv-nav-item.active { background:rgba(0,113,227,.07); color:var(--accent); border-left-color:var(--accent); font-weight:600; }
  .dv-sidebar-footer { padding:14px 18px; border-top:1px solid var(--border); font-size:11px; color:var(--text-muted); line-height:1.6; }
  /* Main */
  .dv-main { margin-left:240px; flex:1; display:flex; flex-direction:column; min-width:0; }
  .dv-topbar { position:sticky; top:var(--dev-nav-h,45px); z-index:89; background:rgba(255,255,255,.85); backdrop-filter:saturate(180%) blur(20px); border-bottom:1px solid var(--border); padding:14px 28px; display:flex; align-items:center; justify-content:space-between; }
  .dv-topbar-title { font-size:16px; font-weight:700; letter-spacing:-.3px; }
  .dv-badge { padding:3px 10px; border-radius:99px; font-size:11px; font-weight:500; letter-spacing:-.1px; }
  .dv-badge-blue { background:rgba(0,113,227,.08); color:var(--accent); }
  .dv-badge-green { background:rgba(29,125,69,.09); color:var(--green); }
  .dv-content { padding:28px 32px; max-width:1100px; width:100%; }
  /* Mobile */
  .dv-menu-btn { display:none; }
  @media(max-width:768px){
    .dv-sidebar { transform:translateX(-100%); }
    .dv-sidebar.open { transform:none; }
    .dv-sidebar-overlay { display:block; position:fixed; inset:0; background:rgba(0,0,0,.4); z-index:199; opacity:0; pointer-events:none; transition:opacity .25s; }
    .dv-sidebar-overlay.open { opacity:1; pointer-events:all; }
    .dv-main { margin-left:0; }
    .dv-menu-btn { display:block; position:fixed; bottom:20px; right:20px; z-index:300; background:var(--accent); color:#fff; border:none; width:44px; height:44px; border-radius:50%; font-size:20px; cursor:pointer; }
    .dv-content { padding:20px 16px; }
  }
  /* Section */
  .dv-section-title { font-size:19px; font-weight:700; margin-bottom:6px; letter-spacing:-.3px; }
  .dv-section-sub { font-size:13px; color:var(--text-muted); margin-bottom:24px; }
  .dv-divider { border:none; border-top:1px solid var(--border); margin:32px 0; }
  /* Cards */
  .dv-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:20px 24px; margin-bottom:16px; box-shadow:var(--shadow-sm); }
  .dv-card-grid { display:grid; gap:16px; }
  .dv-card-grid-2 { grid-template-columns:repeat(2,1fr); }
  /* Info / Warn boxes */
  .dv-info-box { background:rgba(0,113,227,.05); border:1px solid rgba(0,113,227,.14); border-left:3px solid var(--accent); border-radius:var(--radius-sm); padding:12px 16px; font-size:13px; margin-bottom:12px; color:var(--text-secondary); line-height:1.7; }
  .dv-warn-box { background:#fffbeb; border:1px solid rgba(142,96,0,.18); border-left:3px solid var(--yellow); border-radius:var(--radius-sm); padding:12px 16px; font-size:13px; color:var(--text-secondary); line-height:1.7; }
  /* Flow */
  .dv-flow-wrap { display:flex; justify-content:center; padding-bottom:16px; }
  .dv-flow { display:flex; flex-direction:column; align-items:center; gap:0; max-width:640px; width:100%; }
  .dv-flow-node { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:14px 18px; width:100%; cursor:pointer; transition:border-color .15s,box-shadow .15s,transform .15s; box-shadow:var(--shadow-sm); }
  .dv-flow-node:hover { border-color:var(--accent); box-shadow:0 0 0 3px rgba(0,113,227,.1),var(--shadow); transform:translateY(-1px); }
  .dv-flow-node.init { border-color:rgba(0,113,227,.3); background:rgba(0,113,227,.03); border-top:3px solid var(--accent); }
  .dv-flow-node.warning { border-color:rgba(142,96,0,.25); background:#fffbeb; border-top:3px solid var(--yellow); }
  .dv-flow-node.success { border-color:rgba(29,125,69,.25); background:#f0faf4; border-top:3px solid var(--green); }
  .dv-flow-node.output { border-color:rgba(94,44,165,.25); background:#f5f0ff; border-top:3px solid var(--purple); }
  .dv-flow-node.cleanup { border-color:rgba(181,42,28,.25); background:#fff5f5; border-top:3px solid var(--red); }
  .dv-flow-row { display:flex; align-items:flex-start; gap:14px; }
  .dv-step-num { background:rgba(0,113,227,.1); color:var(--accent); border-radius:50%; width:24px; height:24px; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0; margin-top:2px; }
  .dv-step-label { font-size:11px; color:var(--text-muted); font-weight:600; text-transform:uppercase; letter-spacing:.5px; margin-bottom:4px; }
  .dv-step-title { font-size:14px; font-weight:600; margin-bottom:3px; color:var(--text); }
  .dv-step-desc { font-size:12px; color:var(--text-muted); }
  .dv-flow-arrow { color:var(--border-strong); font-size:20px; line-height:1; padding:4px 0; }
  /* Path cards */
  .dv-path-card { background:var(--surface); border-radius:var(--radius); padding:18px 22px; cursor:pointer; transition:transform .15s,box-shadow .15s; border:1px solid var(--border); box-shadow:var(--shadow-sm); }
  .dv-path-card:hover { transform:translateY(-3px); box-shadow:var(--shadow-lg); }
  .dv-path-icon { font-size:32px; margin-bottom:10px; }
  .dv-path-name { font-size:15px; font-weight:700; margin-bottom:8px; letter-spacing:-.2px; }
  .dv-path-timing { font-size:11px; padding:3px 9px; border-radius:99px; font-weight:500; display:inline-block; margin-bottom:10px; }
  .dv-timing-realtime { background:rgba(29,125,69,.09); color:var(--green); border:1px solid rgba(29,125,69,.18); }
  .dv-timing-sweep { background:rgba(0,113,227,.07); color:var(--accent); border:1px solid rgba(0,113,227,.15); }
  .dv-path-desc { font-size:12px; color:var(--text-muted); margin-bottom:10px; line-height:1.65; }
  .dv-path-signals { display:flex; flex-wrap:wrap; gap:6px; }
  .dv-sig-tag { font-size:11px; padding:2px 8px; border-radius:8px; font-weight:500; }
  /* Signal table */
  .dv-signal-table { width:100%; border-collapse:collapse; font-size:13px; }
  .dv-signal-table th { background:var(--surface2); padding:10px 12px; text-align:left; color:var(--text-muted); font-weight:600; font-size:12px; white-space:nowrap; }
  .dv-signal-table td { padding:10px 12px; border-bottom:1px solid var(--border); vertical-align:middle; color:var(--text-secondary); }
  .dv-signal-table tr:hover td { background:rgba(0,0,0,.015); }
  .dv-via-tag { font-size:11px; padding:2px 8px; border-radius:8px; font-weight:500; }
  .dv-via-net { background:rgba(0,113,227,.08); color:var(--accent); }
  .dv-via-html { background:rgba(94,44,165,.08); color:var(--purple); }
  .dv-vis-dot { display:inline-block; width:8px; height:8px; border-radius:50%; margin-right:4px; vertical-align:middle; }
  .dv-vis-yes { background:var(--green); }
  .dv-vis-no { background:var(--border-strong); }
  /* Confidence bars */
  .dv-conf-row { display:flex; align-items:center; gap:12px; margin-bottom:14px; flex-wrap:wrap; }
  .dv-conf-label { font-size:12px; font-weight:700; min-width:40px; }
  .dv-conf-bar { flex:0 0 80px; height:8px; background:var(--surface3); border-radius:4px; overflow:hidden; }
  .dv-conf-fill { height:100%; border-radius:4px; }
  .dv-conf-high { color:var(--green); }
  .dv-conf-medium { color:var(--yellow); }
  .dv-conf-low { color:var(--low); }
  .dv-conf-via-list { display:flex; flex-wrap:wrap; gap:5px; flex:1; }
  .dv-conf-via-item { font-size:11px; padding:2px 8px; border-radius:8px; position:relative; cursor:default; font-weight:500; }
  /* Matrix */
  .dv-matrix-grid { display:grid; grid-template-columns:100px 1fr 1fr; gap:8px; margin-bottom:24px; }
  .dv-matrix-header { background:var(--surface2); padding:10px 12px; font-size:12px; font-weight:600; text-align:center; border-radius:8px; color:var(--text-secondary); }
  .dv-matrix-row-label { background:var(--surface2); padding:10px 12px; font-size:12px; font-weight:600; display:flex; align-items:center; border-radius:8px; color:var(--text-secondary); }
  .dv-matrix-cell { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px 14px; cursor:pointer; transition:transform .12s,box-shadow .12s; box-shadow:var(--shadow-sm); }
  .dv-matrix-cell:hover { transform:translateY(-2px); box-shadow:var(--shadow); }
  .dv-cell-emoji { font-size:22px; margin-bottom:6px; }
  .dv-cell-title { font-size:13px; font-weight:600; margin-bottom:4px; color:var(--text); }
  .dv-cell-desc { font-size:11px; color:var(--text-muted); line-height:1.5; }
  .dv-cell-confirmed { border-color:rgba(29,125,69,.2); background:#f0faf4; }
  .dv-cell-hidden { border-color:rgba(142,96,0,.2); background:#fffbeb; }
  .dv-cell-likely { border-color:rgba(0,113,227,.2); background:rgba(0,113,227,.03); }
  .dv-cell-unclear { border-color:rgba(94,44,165,.2); background:#f5f0ff; }
  .dv-cell-weak { border-color:rgba(134,134,139,.2); background:rgba(134,134,139,.04); }
  .dv-cell-ignorable { border-color:rgba(181,42,28,.2); background:#fff5f5; }
  /* States grid */
  .dv-states-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:12px; margin-bottom:24px; }
  .dv-state-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-sm); padding:14px; box-shadow:var(--shadow-sm); }
  .dv-state-code { font-size:12px; font-weight:700; color:var(--accent); margin-bottom:6px; font-family:monospace; }
  .dv-state-desc { font-size:12px; color:var(--text-muted); line-height:1.5; }
  .dv-state-terminal { font-size:12px; font-weight:600; margin-top:8px; }
  .dv-st-success { border-color:rgba(29,125,69,.25); border-top:3px solid var(--green); }
  .dv-st-fail { border-color:rgba(181,42,28,.25); border-top:3px solid var(--red); }
  .dv-st-warn { border-color:rgba(142,96,0,.25); border-top:3px solid var(--yellow); }
  /* Round-robin */
  .dv-rr-viz { display:flex; align-items:center; gap:8px; flex-wrap:wrap; padding:16px; background:var(--surface2); border-radius:var(--radius-sm); margin-bottom:12px; }
  .dv-rr-action { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-sm); padding:10px 14px; font-size:12px; font-weight:600; text-align:center; min-width:100px; transition:all .2s; box-shadow:var(--shadow-sm); color:var(--text-secondary); }
  .dv-rr-action.active { border-color:var(--accent); background:rgba(0,113,227,.07); color:var(--accent); }
  .dv-rr-action.used { opacity:.4; border-color:var(--green); }
  .dv-rr-arrow { color:var(--border-strong); font-size:18px; }
  /* Transition table */
  .dv-transition-table { width:100%; border-collapse:collapse; font-size:13px; }
  .dv-transition-table th { background:var(--surface2); padding:10px 12px; text-align:left; color:var(--text-muted); font-weight:600; font-size:12px; }
  .dv-transition-table td { padding:10px 12px; border-bottom:1px solid var(--border); vertical-align:middle; color:var(--text-secondary); }
  .dv-action-tag { font-size:11px; padding:2px 8px; border-radius:6px; margin:1px; display:inline-block; font-weight:500; }
  .dv-tier1 { background:rgba(0,113,227,.08); color:var(--accent); }
  .dv-tier2 { background:rgba(184,64,0,.09); color:var(--orange); }
  /* Output grid */
  .dv-output-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:14px; margin-bottom:24px; }
  .dv-output-file { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:16px 14px; text-align:center; cursor:pointer; transition:transform .15s,box-shadow .15s; box-shadow:var(--shadow-sm); }
  .dv-output-file:hover { transform:translateY(-2px); box-shadow:var(--shadow-lg); }
  .dv-file-icon { font-size:28px; margin-bottom:8px; }
  .dv-file-name { font-size:12px; font-weight:700; margin-bottom:4px; word-break:break-all; color:var(--text); }
  .dv-file-desc { font-size:11px; color:var(--text-muted); }
  /* Heuristic flow */
  .dv-heuristic { display:flex; flex-direction:column; gap:10px; }
  .dv-h-row { display:flex; align-items:center; gap:10px; }
  .dv-h-input { flex:1; background:var(--surface2); border-radius:var(--radius-sm); padding:10px 12px; font-size:12px; color:var(--text-muted); line-height:1.5; border:1px solid var(--border); }
  .dv-h-arrow { color:var(--text-muted); font-size:16px; }
  .dv-h-result { padding:10px 14px; border-radius:var(--radius-sm); font-size:12px; font-weight:700; text-align:center; min-width:70px; }
  .dv-h-cdn { background:#fffbeb; color:var(--yellow); border:1px solid rgba(142,96,0,.18); }
  .dv-h-api { background:#f0faf4; color:var(--green); border:1px solid rgba(29,125,69,.18); }
  .dv-h-unk { background:var(--surface2); color:var(--text-muted); border:1px solid var(--border); }
  /* Perf compare */
  .dv-perf-compare { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .dv-perf-side { background:var(--surface2); border-radius:var(--radius-sm); padding:14px; border:1px solid var(--border); }
  .dv-perf-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; margin-bottom:10px; padding:3px 8px; border-radius:4px; display:inline-block; }
  .dv-perf-before .dv-perf-label { background:#fff5f5; color:var(--red); border:1px solid rgba(181,42,28,.18); }
  .dv-perf-after .dv-perf-label { background:#f0faf4; color:var(--green); border:1px solid rgba(29,125,69,.18); }
  .dv-perf-item { font-size:12px; color:var(--text-muted); margin-bottom:10px; line-height:1.6; }
  .dv-time-badge { font-size:10px; padding:1px 6px; border-radius:4px; font-weight:700; }
  .dv-time-slow { background:#fff5f5; color:var(--red); border:1px solid rgba(181,42,28,.18); }
  .dv-time-fast { background:#f0faf4; color:var(--green); border:1px solid rgba(29,125,69,.18); }
  /* Legend */
  .dv-sm-legend { display:flex; gap:16px; flex-wrap:wrap; margin-bottom:16px; }
  .dv-sm-legend-item { display:flex; align-items:center; gap:6px; font-size:12px; color:var(--text-secondary); }
  .dv-sm-dot { width:10px; height:10px; border-radius:50%; }
  /* Modal */
  .dv-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); z-index:500; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(4px); }
  .dv-modal { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); max-width:560px; width:100%; max-height:80vh; overflow-y:auto; box-shadow:var(--shadow-lg); }
  .dv-modal-header { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; padding:18px 22px 14px; border-bottom:1px solid var(--border); position:sticky; top:0; background:var(--surface); }
  .dv-modal-title { font-size:15px; font-weight:700; letter-spacing:-.2px; }
  .dv-modal-close { background:none; border:none; color:var(--text-muted); font-size:18px; cursor:pointer; padding:0; line-height:1; }
  .dv-modal-body { padding:18px 22px; font-size:13px; line-height:1.7; color:var(--text-secondary); }
  .dv-modal-body h4 { font-size:13px; font-weight:700; margin:14px 0 6px; color:var(--accent); }
  .dv-modal-body h4:first-child { margin-top:0; }
  .dv-modal-body p { margin:0 0 10px; }
  .dv-modal-body ul,.dv-modal-body ol { padding-left:18px; margin:0 0 10px; }
  .dv-modal-body li { margin-bottom:4px; }
  .dv-modal-body code { background:var(--surface2); padding:1px 5px; border-radius:4px; font-size:12px; color:var(--text); border:1px solid var(--border); }
  /* Simulate button */
  .dv-sim-btn { display:block; margin:8px auto; padding:8px 20px; background:var(--accent); color:#fff; border:none; border-radius:8px; cursor:pointer; font-size:13px; font-weight:600; letter-spacing:-.1px; }
  .dv-sim-btn:hover { background:#0077ed; }
`
