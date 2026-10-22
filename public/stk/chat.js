(function(){
var css=`.fx-btn{position:fixed;right:20px;bottom:20px;width:60px;height:60px;border-radius:50%;border:0;cursor:pointer;z-index:60;background:linear-gradient(180deg,#5df777,#0bbd2a);box-shadow:0 8px 24px #0004;display:grid;place-items:center;transition:transform .2s}
.fx-btn:hover{transform:scale(1.06)}.fx-btn svg{width:32px;height:32px}
.messengers{bottom:92px!important}
.fx-win[hidden]{display:none}.fx-win{position:fixed;right:20px;bottom:92px;width:360px;max-width:calc(100vw - 24px);height:500px;max-height:calc(100vh - 120px);z-index:61;display:flex;flex-direction:column;background:var(--surface,#fff);color:var(--text,#111);border:1px solid var(--line,#ddd);border-radius:22px;box-shadow:0 20px 60px #0004;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif}
.fx-head{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid var(--line,#ddd)}
.fx-ava{width:36px;height:36px;border-radius:50%;background:linear-gradient(180deg,#5df777,#0bbd2a);color:#fff;display:grid;place-items:center;font-weight:700}
.fx-head b{display:block;font-size:15px}.fx-head small{color:var(--muted,#888);font-size:12px}
.fx-close{margin-left:auto;background:none;border:0;font-size:22px;cursor:pointer;color:var(--muted,#888)}
.fx-log{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px}
.fx-msg{max-width:78%;padding:9px 13px;border-radius:18px;font-size:14px;line-height:1.4;white-space:pre-wrap;word-wrap:break-word}
.fx-bot{align-self:flex-start;background:#e9e9eb;color:#111;border-bottom-left-radius:5px}
.fx-me{align-self:flex-end;background:#0a84ff;color:#fff;border-bottom-right-radius:5px}
.fx-form{display:flex;align-items:center;gap:8px;padding:10px;border-top:1px solid var(--line,#ddd)}
.fx-form input{flex:1;margin:0;border:1px solid var(--line,#ccc);border-radius:20px;padding:9px 14px;font-size:14px;background:transparent;color:inherit;outline:none}
.fx-form button{flex:0 0 auto;width:42px;height:42px;border-radius:50%;border:0;background:linear-gradient(180deg,#5df777,#0bbd2a);color:#fff;font-size:20px;font-weight:700;line-height:1;display:grid;place-items:center;cursor:pointer;box-shadow:0 4px 12px #0bbd2a55}
@media(max-width:760px){.fx-btn{right:12px;bottom:12px}.messengers{bottom:84px!important}.fx-win{right:12px;bottom:84px}}`;
var s=document.createElement('style');s.textContent=css;document.head.appendChild(s);
var bubble='<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 3C6.5 3 2 6.6 2 11c0 2.5 1.4 4.7 3.6 6.1-.2 1.3-.9 2.6-1.9 3.6 2 0 3.8-.7 5.1-1.8 1 .2 2.1.3 3.2.3 5.5 0 10-3.6 10-8.1S17.5 3 12 3z"/></svg>';
var btn=document.createElement('button');btn.className='fx-btn';btn.setAttribute('aria-label','Открыть чат с ассистентом Фиксиком');btn.innerHTML=bubble;
var win=document.createElement('div');win.className='fx-win';win.hidden=true;win.setAttribute('role','dialog');win.setAttribute('aria-label','Чат с ассистентом Фиксиком');
win.innerHTML='<div class="fx-head"><div class="fx-ava">Ф</div><div><b>Фиксик</b><small>ИИ-ассистент СТК</small></div><button class="fx-close" aria-label="Закрыть чат">×</button></div><div class="fx-log" aria-live="polite"></div><form class="fx-form"><input type="text" placeholder="Сообщение" aria-label="Сообщение" autocomplete="off"><button type="submit" aria-label="Отправить"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" d="M12 2.4 21.2 12.6h-5.6v9h-7.2v-9H2.8Z"/></svg></button></form>';
document.body.appendChild(win);document.body.appendChild(btn);
var log=win.querySelector('.fx-log'),input=win.querySelector('input');
function add(t,who){var d=document.createElement('div');d.className='fx-msg '+(who==='me'?'fx-me':'fx-bot');d.textContent=t;log.appendChild(d);log.scrollTop=log.scrollHeight}
add('Здравствуйте, я ассистент Фиксик. Чем могу помочь?','bot');
function toggle(open){win.hidden=!open;if(open)input.focus()}
btn.onclick=function(){toggle(win.hidden)};win.querySelector('.fx-close').onclick=function(){toggle(false)};
win.querySelector('form').onsubmit=function(e){e.preventDefault();var t=input.value.trim();if(!t)return;add(t,'me');input.value='';input.focus()};
})();
