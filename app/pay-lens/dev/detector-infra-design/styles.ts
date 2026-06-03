export const infraStyles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
:root {
  --bg: #f5f5f7;
  --surface: #ffffff;
  --surface2: #f5f5f7;
  --surface3: #e8e8ed;
  --border: rgba(0,0,0,.08);
  --border-strong: rgba(0,0,0,.14);
  --text: #1d1d1f;
  --text-secondary: #3a3a3c;
  --text-muted: #86868b;
  --accent: #0071e3;
  --green: #1d7d45;
  --green-bg: #f0faf4;
  --green-border: rgba(29,125,69,.18);
  --yellow: #8e6000;
  --yellow-bg: #fffbeb;
  --yellow-border: rgba(142,96,0,.18);
  --orange: #b84000;
  --orange-bg: #fff5f0;
  --orange-border: rgba(184,64,0,.18);
  --red: #b52a1c;
  --red-bg: #fff5f5;
  --red-border: rgba(181,42,28,.18);
  --purple: #5e2ca5;
  --purple-bg: #f5f0ff;
  --purple-border: rgba(94,44,165,.18);
  --radius: 14px;
  --radius-sm: 8px;
  --shadow-sm: 0 1px 4px rgba(0,0,0,.06);
  --shadow: 0 4px 18px rgba(0,0,0,.09), 0 1px 4px rgba(0,0,0,.05);
  --shadow-lg: 0 20px 60px rgba(0,0,0,.13), 0 4px 18px rgba(0,0,0,.07);
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;
  line-height: 1.55;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}
.infra-page { background: var(--bg); min-height: 100vh; color: var(--text); font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", Arial, sans-serif; font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased; }
.header {
  background: rgba(255,255,255,.85);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid var(--border);
  padding: 36px 48px 26px;
  position: sticky;
  top: 0;
  z-index: 50;
}
.header h1 { font-size: 26px; font-weight: 700; letter-spacing: -.5px; }
.header p { color: var(--text-muted); margin-top: 4px; font-size: 14px; }
.header .badges { display: flex; gap: 6px; margin-top: 14px; flex-wrap: wrap; }
.badge { padding: 4px 11px; border-radius: 99px; font-size: 11px; font-weight: 500; letter-spacing: -.1px; }
.badge-blue { background: rgba(0,113,227,.08); color: var(--accent); }
.badge-green { background: rgba(29,125,69,.09); color: var(--green); }
.badge-orange { background: rgba(184,64,0,.09); color: var(--orange); }
.badge-purple { background: rgba(94,44,165,.08); color: var(--purple); }
.tabs-nav {
  display: flex;
  overflow-x: auto;
  background: rgba(255,255,255,.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  padding: 0 32px;
  scrollbar-width: none;
}
.tabs-nav::-webkit-scrollbar { display: none; }
.tab-btn {
  padding: 13px 18px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: color .16s, border-color .16s;
}
.tab-btn:hover { color: var(--text); }
.tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); font-weight: 600; }
.tab-pane { display: none; padding: 40px 48px 56px; animation: fadeIn .22s ease; }
.tab-pane.active { display: block; }
@keyframes fadeIn { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }
.section-title { font-size: 19px; font-weight: 700; margin-bottom: 6px; letter-spacing: -.3px; }
.section-sub { color: var(--text-muted); font-size: 13px; margin-bottom: 28px; }
.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 22px 26px; margin-bottom: 16px; box-shadow: var(--shadow-sm); }
.card-grid { display: grid; gap: 16px; }
.card-grid-2 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
.card-grid-3 { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.divider { border: none; border-top: 1px solid var(--border); margin: 32px 0; }
.info-box { background: rgba(0,113,227,.05); border: 1px solid rgba(0,113,227,.14); border-left: 3px solid var(--accent); border-radius: var(--radius-sm); padding: 13px 16px; font-size: 13px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 16px; }
.warn-box { background: var(--yellow-bg); border: 1px solid var(--yellow-border); border-left: 3px solid var(--yellow); border-radius: var(--radius-sm); padding: 13px 16px; font-size: 13px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 16px; }
.arch-box {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 14px 20px; text-align: center; flex: 1;
  box-shadow: var(--shadow-sm); cursor: pointer;
  transition: box-shadow .2s, transform .18s, border-color .18s;
}
.arch-box:hover { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,113,227,.1), var(--shadow); transform: translateY(-1px); }
.arch-box .box-title { font-size: 13px; font-weight: 600; color: var(--text); }
.arch-box .box-sub { font-size: 11px; color: var(--text-muted); margin-top: 3px; }
.arch-box.apigw { border-top: 3px solid var(--accent); }
.arch-box.lmb { border-top: 3px solid var(--orange); }
.arch-box.btch { border-top: 3px solid var(--purple); }
.arch-box.stor { border-top: 3px solid var(--green); }
.arch-box.evtb { border-top: 3px solid var(--yellow); }
.mode-card {
  border-radius: var(--radius); padding: 22px 24px; border: 1px solid var(--border);
  background: var(--surface); box-shadow: var(--shadow-sm); cursor: pointer;
  transition: box-shadow .2s, transform .18s;
}
.mode-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
.mode-lmb { border-top: 3px solid var(--orange); }
.mode-btch { border-top: 3px solid var(--purple); }
.mode-local { border-top: 3px solid var(--accent); }
.mode-docker { border-top: 3px solid var(--green); }
.mode-name { font-size: 14px; font-weight: 600; margin-bottom: 6px; }
.mode-badge { font-size: 11px; font-weight: 500; padding: 3px 9px; border-radius: 99px; display: inline-block; margin-bottom: 10px; }
.mbadge-lmb { background: var(--orange-bg); color: var(--orange); border: 1px solid var(--orange-border); }
.mbadge-btch { background: var(--purple-bg); color: var(--purple); border: 1px solid var(--purple-border); }
.mbadge-local { background: rgba(0,113,227,.07); color: var(--accent); border: 1px solid rgba(0,113,227,.15); }
.mode-desc { font-size: 12.5px; color: var(--text-muted); line-height: 1.65; }
.mode-tags { margin-top: 12px; display: flex; flex-wrap: wrap; gap: 6px; }
.tag { font-size: 11px; padding: 3px 9px; border-radius: 8px; font-weight: 500; }
.tag-blue { background: rgba(0,113,227,.08); color: var(--accent); }
.tag-green { background: var(--green-bg); color: var(--green); border: 1px solid var(--green-border); }
.tag-orange { background: var(--orange-bg); color: var(--orange); }
.tag-purple { background: var(--purple-bg); color: var(--purple); }
.tag-gray { background: var(--surface2); color: var(--text-muted); border: 1px solid var(--border); }
.stack-title { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
.stack-sub { font-size: 12px; color: var(--text-muted); margin-bottom: 14px; }
.resource-list { list-style: none; }
.resource-list li { display: flex; align-items: flex-start; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 12.5px; }
.resource-list li:last-child { border-bottom: none; }
.res-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
.res-name { font-weight: 600; color: var(--text); }
.res-desc { color: var(--text-muted); font-size: 11.5px; margin-top: 2px; }
pre {
  background: #1d1d1f; color: #e8e8ed;
  border-radius: var(--radius-sm); padding: 16px 18px;
  font-size: 12px; font-family: ui-monospace, "SF Mono", "Menlo", monospace;
  line-height: 1.7; overflow-x: auto; margin: 10px 0;
}
.code-wrap { position: relative; }
.copy-btn {
  position: absolute; top: 10px; right: 10px;
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.15);
  color: rgba(255,255,255,.7); font-size: 11px; padding: 4px 10px;
  border-radius: 6px; cursor: pointer; transition: background .15s;
}
.copy-btn:hover { background: rgba(255,255,255,.18); color: #fff; }
.copy-btn.copied { background: rgba(29,125,69,.3); color: #a8edbd; }
.data-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
.data-table thead tr { background: var(--surface2); }
.data-table th { padding: 10px 16px; text-align: left; color: var(--text-muted); font-size: 11px; text-transform: uppercase; letter-spacing: .5px; font-weight: 600; border-bottom: 1px solid var(--border); }
.data-table td { padding: 11px 16px; border-bottom: 1px solid var(--border); vertical-align: top; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: rgba(0,113,227,.03); }
.mono { font-family: ui-monospace, "SF Mono", monospace; font-size: 11.5px; }
.type-tag { font-size: 11px; font-family: ui-monospace, "SF Mono", monospace; padding: 2px 8px; border-radius: 5px; font-weight: 500; }
.type-s { background: rgba(0,113,227,.08); color: var(--accent); }
.type-n { background: var(--orange-bg); color: var(--orange); }
.type-l { background: var(--purple-bg); color: var(--purple); }
.type-m { background: var(--green-bg); color: var(--green); }
.pk-tag { background: var(--yellow-bg); color: var(--yellow); border: 1px solid var(--yellow-border); font-size: 10px; padding: 1px 6px; border-radius: 4px; font-weight: 600; margin-left: 5px; }
.timeline { display: flex; flex-direction: column; gap: 0; }
.tl-item { display: flex; gap: 16px; }
.tl-line { display: flex; flex-direction: column; align-items: center; }
.tl-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--accent); flex-shrink: 0; margin-top: 4px; }
.tl-dot.green { background: var(--green); }
.tl-connector { width: 2px; flex: 1; background: var(--border-strong); margin: 4px 0; min-height: 24px; }
.tl-content { padding-bottom: 20px; flex: 1; }
.tl-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .6px; color: var(--text-muted); margin-bottom: 3px; }
.tl-title { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
.tl-desc { font-size: 12px; color: var(--text-muted); line-height: 1.6; }
.lc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.lc-col { border-radius: var(--radius); padding: 18px 20px; border: 1px solid var(--border); background: var(--surface); }
.lc-header { font-size: 13px; font-weight: 700; margin-bottom: 14px; }
.lc-lambda .lc-header { color: var(--orange); }
.lc-batch .lc-header { color: var(--purple); }
.lc-step { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 10px; font-size: 12px; }
.lc-num { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: #fff; flex-shrink: 0; }
.lc-lambda .lc-num { background: var(--orange); }
.lc-batch .lc-num { background: var(--purple); }
.lc-step-text { color: var(--text-secondary); line-height: 1.55; }
.lc-step-code { font-family: ui-monospace, "SF Mono", monospace; font-size: 11px; color: var(--accent); }
.dir-tree { font-family: ui-monospace, "SF Mono", monospace; font-size: 12.5px; line-height: 1.9; padding: 18px 22px; background: var(--surface2); border-radius: var(--radius); border: 1px solid var(--border); }
.dir-tree .folder { color: var(--accent); font-weight: 600; }
.dir-tree .file { color: var(--text-secondary); }
.dir-tree .comment { color: var(--text-muted); }
.stages-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
.stage-card { border-radius: var(--radius); padding: 16px 18px; border: 1px solid var(--border); background: var(--surface); box-shadow: var(--shadow-sm); }
.stage-name { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .6px; margin-bottom: 8px; }
.stage-builder .stage-name { color: var(--purple); }
.stage-batch .stage-name { color: var(--green); }
.stage-lambda .stage-name { color: var(--orange); }
.stage-base { font-size: 11.5px; font-family: ui-monospace, "SF Mono", monospace; background: var(--surface2); border-radius: 6px; padding: 4px 8px; margin-bottom: 10px; color: var(--text-secondary); }
.stage-steps { list-style: none; }
.stage-steps li { font-size: 11.5px; color: var(--text-muted); padding: 4px 0; border-bottom: 1px solid var(--border); line-height: 1.5; }
.stage-steps li:last-child { border-bottom: none; }
.stage-cmd { font-size: 11px; font-family: ui-monospace, "SF Mono", monospace; margin-top: 8px; padding: 5px 9px; background: #1d1d1f; color: #a0e0c0; border-radius: 5px; }
.ic { font-family: ui-monospace, "SF Mono", monospace; font-size: 12px; background: var(--surface2); padding: 2px 7px; border-radius: 5px; color: var(--accent); }
`
