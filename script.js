const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
const out=$("#output");
const preview=$("#preview");
const STORAGE_KEY="markdown-editor-content";
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);

function log(msg, type="info"){

    const color=type==="error"?"#var(--err)":type==="warn"?"var(--warn)":"var(--brand)";
    const time=new Date().toLocaleTimeString();
    const line=document.createElement("div");
    line.innerHTML=`<span style="color: ${color}">[${time}]</span> ${escapeHtml(msg)}`;
    out.appendChild(line);
    out.scrollTop=out.scrollHeight;
}

function clearOut(){
    out.innerHTML="";
}

$("#clearOutput")?.addEventListener("click", clearOut);
function makeEditor(id,mode){
    const ed=ace.edit(id,{
        theme:"ace/theme/dracula",
        mode, tabSize:2, useSoftTabs:true,
        wrap:true, showPrintMargin:false,
       })

       ed.session.setUseWrapMode(true);
       ed.commands.addCommand({
        name: "run",
        bindKey: { win: "Ctrl-Enter", mac: "Command-Enter" },
        exec(){runWeb(false);}
            
       });

       ed.commands.addCommand({
        name: "save",
        bindKey: { win: "Ctrl-S", mac: "Command-S" },
        exec(){saveProject();}})
         return ed;
       }

       const ed_html=makeEditor("ed_html","ace/mode/html");
       const ed_css=makeEditor("ed_css","ace/mode/css");
       const ed_js=makeEditor("ed_js","ace/mode/javascript");

    // Theme helper - switches Ace editor themes and updates UI surfaces
    function applyTheme(isDark){
        // update root class (styles also set vars via :root.light-theme)
        document.documentElement.classList.toggle('light-theme', !isDark);
        // set Ace editor theme
        try{
            const aceTheme = isDark ? 'ace/theme/dracula' : 'ace/theme/chrome';
            [ed_html, ed_css, ed_js].forEach(ed=>{ if(ed && ed.setTheme) ed.setTheme(aceTheme); });
        }catch(e){
            console.warn('Failed to apply Ace theme', e);
        }
        // adjust editor container backgrounds to surface var (some browsers pick vars automatically)
        $$(".editor-wrap").forEach(w=>{ w.style.background = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim(); });
        $(".out") && ($(".out").style.background = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim());
        // persist choice
        try{
            localStorage.setItem('live-code-editor:dark', isDark ? '1' : '0');
        }catch(e){/* ignore */}
    }

       const TAB_ORDER=["html","css","js"];

       const wraps=Object.fromEntries($$("#webEditors .editor-wrap").map(w=>[w.dataset.pane, w]));

       const editors={html:ed_html, css:ed_css, js:ed_js};
function activePane(){
    const t=$("#webTabs .tab.active");
    return t? t.dataset.pane : "html";
}
function showPane(name){
    TAB_ORDER.forEach(k=>{if(wraps[k]){wraps[k].hidden = k !== name;}});
    $$("#webTabs .tab").forEach(t=>{
        const on= t.dataset.pane===name;
        t.classList.toggle("active", on);
        t.setAttribute("aria-selected", on);
        t.tabIndex=on?0:-1;
    });
requestAnimationFrame(()=>{
    const ed=editors[name]
    if(ed&&ed.resize)
        {ed.resize(true);
            ed.focus();
        }
});
}
$("#webTabs")?.addEventListener("click",e=>{
    const btn=e.target.closest(".tab");
    if(!btn){
        return;
    }
    showPane(btn.dataset.pane);
});
$("#webTabs")?.addEventListener("keydown",e=>{
    const idx=TAB_ORDER.indexOf(activePane());
    if(e.key==="ArrowLeft"||e.key==="ArrowRight"){
        const delta=e.key==="ArrowLeft"?-1:1;
        let newIdx=(idx+delta+TAB_ORDER.length)%TAB_ORDER.length;
        const newPane=TAB_ORDER[newIdx];
        showPane(newPane);
        e.preventDefault();
    }
})
showPane("html");
function buildwebSrcdoc(withTests=false){
    const html=ed_html.getValue();
    const css=ed_css.getValue();
    const js=ed_js.getValue();
    const tests=($("#testArea")?.value)||"".trim();
    return `
    <!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Document</title>
    <style>
        ${css}\n
    </style>
</head>
<body>
    ${html}
    <script>
       try {
           ${js}
       ${withTests && tests ? `\n // --- test code below --- \n ${tests}` : ""}
       } catch(e){
        console.error(e);
       }
    <\/script>
</body>
</html>`;
}
function runWeb(withTests=false){
    const srcdoc=buildwebSrcdoc(withTests);
    preview.srcdoc=srcdoc;
    log(withTests?"Run with tests":"Web preview updated.");
}
$("#runWeb")?.addEventListener("click",()=>runWeb(false));
$("#runTests")?.addEventListener("click",()=>runWeb(true));
$("#openPreview")?.addEventListener("click",()=>{
    const src=buildwebSrcdoc(false);
    const w=window.open("about:blank");
    w.document.open();
    w.document.write(src);
    w.document.close();
});
function projectJSON(){
    return {
        version:1,
        kind:"web-only",
        assignment:$("#assignment")?.value||"",
        test:$("#testArea")?.value||"",
        html:ed_html.getValue(),
        css:ed_css.getValue(),
        js:ed_js.getValue(),
    };
}
function loadProject(Obj){
    try{
        if($("#assignment")) $("#assignment").value=Obj.assignment||"";
        if($("#testArea")) $("#testArea").value=Obj.test||"";
        ed_html.setValue(Obj.html||"", -1);
        ed_css.setValue(Obj.css||"", -1);
        ed_js.setValue(Obj.js||"", -1);
        log("Web Project loaded.");
    }catch(e){
        log("Error loading project: "+e, "error");
    }
}
function setDefaultContent(){
    ed_html.setValue(`<!-- Write your HTML here -->`, -1);
    ed_css.setValue(`/* Write your CSS here */`, -1);
    ed_js.setValue(`// Write your JavaScript here`, -1);
}
function saveProject(){
    try{
        const data=JSON.stringify(projectJSON(),null,2);
        localStorage.setItem(STORAGE_KEY, data);
        const blob=new Blob([data], {type:"application/json"});
        const url=URL.createObjectURL(blob);
        const a=document.createElement("a");
        a.href=url;
        a.download="web-editor.json";
        a.click();
        log("Project saved and downloaded.");
    }catch(e){
        log("Error saving project: "+e, "error");
    }
}
$("#saveBtn")?.addEventListener("click", saveProject);
$("#loadBtn")?.addEventListener("click", ()=> $("#openFile").click());
$("#openFile")?.addEventListener("change", async e=>{
    const file=e.target.files?.[0];
    if(!file) {return;}
    try{
        const text=await file.text();
        const obj=JSON.parse(text);
        loadProject(obj);
    }catch(err){
        log("Invalid project file: ", "error");
    }
});
try{
    const cache=localStorage.getItem(STORAGE_KEY);
    if(cache){
        const obj=JSON.parse(cache);
        loadProject(obj);
        log("Restored project from local storage.");
    }
    else{
        setDefaultContent();
        log("New project. Default content loaded.");
    }}catch{
        setDefaultContent();

    }
    log("New project. Default content loaded.");
