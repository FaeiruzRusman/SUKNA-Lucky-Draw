const DB_URL='https://wafxbgltfohxbupjzfsr.supabase.co';
const DB_KEY='sb_publishable_o_7nBoBlcZZo6eDNdOVOYg_UCb1PfQC';
const $=id=>document.getElementById(id);
let settings={registration_open:true,cutoff_at:null};
function safePhone(v){return v.replace(/[^0-9+]/g,'')}
function isOpen(){return settings.registration_open!==false&&(!settings.cutoff_at||new Date(settings.cutoff_at)>new Date())}
function syncState(){const open=isOpen();$('formView').classList.toggle('hidden',!open);$('closedView').classList.toggle('hidden',open)}
async function request(path,options={}){const r=await fetch(DB_URL+'/rest/v1/'+path,{...options,headers:{apikey:DB_KEY,Authorization:'Bearer '+DB_KEY,'Content-Type':'application/json',Prefer:options.prefer||''}});const t=await r.text();let d;try{d=t?JSON.parse(t):null}catch{d=t}if(!r.ok)throw {status:r.status,data:d};return d}
async function loadSettings(){try{const rows=await request('settings?id=eq.1&select=registration_open,cutoff_at');if(rows&&rows[0])settings=rows[0]}catch(e){console.error(e)}syncState()}
$('regSubmit').onclick=async()=>{const name=$('regName').value.trim(),contingent=$('regContingent').value.trim(),phone=safePhone($('regPhone').value.trim());$('regMsg').textContent='';await loadSettings();if(!isOpen()){syncState();return}if(!name||!contingent||!phone){$('regMsg').textContent='Sila lengkapkan semua maklumat.';return}const b=$('regSubmit');b.disabled=true;b.textContent='Mendaftarkan...';try{await request('participants',{method:'POST',prefer:'return=minimal',body:JSON.stringify({full_name:name,contingent,phone})});$('formView').classList.add('hidden');$('successView').classList.remove('hidden')}catch(e){$('regMsg').textContent=e.status===409?'Nombor telefon ini telah didaftarkan.':'Pendaftaran tidak berjaya. Sila cuba lagi.'}finally{b.disabled=false;b.textContent='Daftar Sekarang'}};
$('newReg').onclick=()=>{$('regName').value='';$('regContingent').value='';$('regPhone').value='';$('regMsg').textContent='';$('successView').classList.add('hidden');syncState()};
loadSettings();setInterval(loadSettings,10000);setInterval(syncState,1000);